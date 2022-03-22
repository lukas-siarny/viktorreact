/* eslint-disable import/no-cycle */
import axios, { AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios'
import { message as antMessage } from 'antd'
import { get, has, isEmpty, split } from 'lodash'
import i18next from 'i18next'
import qs from 'qs'
import rootReducer from '../reducers'
import { getAccessToken, isLoggedIn } from './auth'
import { MSG_TYPE, NOTIFICATION_TYPE } from './enums'
import configureStore from './configureStore'
import { history, getPath } from './history'

// types
import { IErrorMessage } from '../types/interfaces'

import { logOutUser } from '../reducers/users/userActions'
import showNotifications from './tsxHelpers'
import { PathsDictionary } from '../types/api'

type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T]

type GetUrls = {
	[Q in FilteredKeys<PathsDictionary, { get: any }>]: PathsDictionary[Q]
}

export type PostUrls = {
	[Q in FilteredKeys<PathsDictionary, { post: any }>]: PathsDictionary[Q]
}

type PatchUrls = {
	[Q in FilteredKeys<PathsDictionary, { patch: any }>]: PathsDictionary[Q]
}

type DeleteUrls = {
	[Q in FilteredKeys<PathsDictionary, { delete: any }>]: PathsDictionary[Q]
}

const { store } = configureStore(rootReducer)

export const showErrorNotifications = (error: AxiosError | Error | unknown, typeNotification = NOTIFICATION_TYPE.NOTIFICATION) => {
	let messages = get(error, 'response.data.messages')

	if (get(error, 'response.status') === 401) {
		if (isLoggedIn()) {
			messages = [
				{
					type: MSG_TYPE.INFO,
					message: i18next.t('loc:Boli ste automaticky odhlásený')
				}
			]
		}
		showNotifications(messages, typeNotification)
		logOutUser()(store.dispatch, store.getState, undefined)
		history.push(getPath(i18next.t('paths:login')))
	} else if (get(error, 'response.status') === 504 || get(error, 'response') === undefined || get(error, 'message') === 'Network Error') {
		messages = [
			{
				type: MSG_TYPE.ERROR,
				message: i18next.t('loc:Chyba pripojenia k serveru')
			}
		]
		showNotifications(messages, typeNotification)
	} else {
		// if BE do not send message set general error message
		messages = isEmpty(messages) ? [{ type: MSG_TYPE.ERROR, message: i18next.t('loc:Ups niečo sa pokazilo') }] : messages
		showNotifications(messages, typeNotification)
	}
}

export interface ICustomConfig extends AxiosRequestConfig {
	messages?: IErrorMessage[]
}

const buildHeaders = () => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'Access-Control-Allow-Credentials': 'true',
		'Cache-Control': 'no-cache, no-store',
		Pragma: 'no-cache',
		'X-Version': process.env.REACT_APP_VERSION as string,
		'accept-language': i18next.language
	}
	if (isLoggedIn()) {
		headers.Authorization = `Bearer ${getAccessToken()}`
	}

	return headers
}

const fullFillURL = (urlTemplate: string, params: any) => {
	const pathParams = []
	const queryParams = { ...(params || {}) }
	const fullfilURL = split(urlTemplate, '/')
		.map((blok) => {
			if (/{[^}]*\}/.test(blok)) {
				const param = blok.replace('{', '').replace('}', '')
				pathParams.push(param)
				delete queryParams[param]
				return get(params, param)
			}
			return blok
		})
		.join('/')
	return {
		fullfilURL,
		queryParams
	}
}

const cancelGetTokens = {} as { [key: string]: CancelTokenSource }

/**
 * @param url url endpoint
 * @param params Object object
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 * @return Promise response
 *
 */
export const getReq = async <T extends keyof GetUrls>(
	url: T,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	params: Parameters<GetUrls[T]['get']>[0],
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false
): Promise<ReturnType<GetUrls[T]['get']>> => {
	const { fullfilURL, queryParams } = fullFillURL(url, params)

	let token = {}
	if (allowCancelToken) {
		if (typeof cancelGetTokens[fullfilURL] !== typeof undefined) {
			cancelGetTokens[fullfilURL].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelGetTokens[fullfilURL] = axios.CancelToken.source()
		token = {
			cancelToken: cancelGetTokens[fullfilURL].token
		}
	}
	let hide
	if (showLoading) {
		hide = antMessage.loading('Načitavajú sa dáta...', 0)
	}
	const config: AxiosRequestConfig = {
		paramsSerializer: qs.stringify,
		...customConfig,
		...token,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (queryParams) {
		config.params = queryParams
	}

	try {
		const res = await (axios.get(fullfilURL, config) as Promise<ReturnType<GetUrls[T]['get']>>)
		if (typeNotification) {
			if (customConfig && customConfig.messages) {
				showNotifications(customConfig.messages, typeNotification)
			} else if (has(res, 'data.messages')) {
				showNotifications(get(res, 'data.messages'), typeNotification)
			}
		}
		if (hide) {
			hide()
		}

		return res
	} catch (e) {
		if (!axios.isCancel(e) && typeNotification) {
			showErrorNotifications(e, typeNotification)
		}
		if (hide) {
			hide()
		}
		return Promise.reject(e)
	}
}

const cancelPostTokens = {} as { [key: string]: CancelTokenSource }

/**
 * @param url url endpoint
 * @param params Object params object
 * @param data Object data object
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 * @param showLoading Boolean show loading
 * @return Promise response
 * Performs post request to url and returns callback with result
 */
export const postReq = async <T extends keyof PostUrls>(
	url: T,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	params: Parameters<PostUrls[T]['post']>[0],
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	reqBody: Parameters<PostUrls[T]['post']>[1],
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false
): Promise<ReturnType<PostUrls[T]['post']>> => {
	const { fullfilURL, queryParams } = fullFillURL(url, params)
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelPostTokens[fullfilURL] !== typeof undefined) {
			cancelPostTokens[fullfilURL].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelPostTokens[fullfilURL] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPostTokens[fullfilURL].token
		}
	}

	let hide
	if (showLoading) {
		hide = antMessage.loading('Operácia sa vykonáva...', 0)
	}
	const config = {
		...customConfig,
		...token,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (queryParams) {
		config.params = queryParams
	}

	try {
		const res = await axios.post(fullfilURL, reqBody, config)
		if (typeNotification) {
			if (customConfig && customConfig.messages) {
				showNotifications(customConfig.messages, typeNotification)
			} else if (has(res, 'data.messages')) {
				showNotifications(get(res, 'data.messages'), typeNotification)
			}
		}

		if (hide) {
			hide()
		}
		return res
	} catch (e) {
		if (!axios.isCancel(e) && typeNotification) {
			showErrorNotifications(e, typeNotification)
		}
		if (hide) {
			hide()
		}
		return Promise.reject(e)
	}
}

const cancelPatchTokens = {} as { [key: string]: CancelTokenSource }

/**
 * @param url url endpoint
 * @param params Object params object
 * @param data Object data object
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 *
 * Performs put request to url and returns callback with result
 */

export const patchReq = async <T extends keyof PatchUrls>(
	url: T,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	params: Parameters<PatchUrls[T]['patch']>[0],
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	reqBody: Parameters<PatchUrls[T]['patch']>[1],
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false
): Promise<ReturnType<PatchUrls[T]['patch']>> => {
	const { fullfilURL, queryParams } = fullFillURL(url, params)
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelPatchTokens[fullfilURL] !== typeof undefined) {
			cancelPatchTokens[fullfilURL].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelPatchTokens[fullfilURL] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPatchTokens[fullfilURL].token
		}
	}

	let hide
	if (showLoading) {
		hide = antMessage.loading('Operácia sa vykonáva...', 0)
	}
	const config = {
		...customConfig,
		...token,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (queryParams) {
		config.params = queryParams
	}
	try {
		const res = await (axios.patch(fullfilURL, reqBody, config) as Promise<ReturnType<PatchUrls[T]['patch']>>)
		if (typeNotification && customConfig && customConfig.messages) {
			showNotifications(customConfig.messages, typeNotification)
		} else if (typeNotification && has(res, 'data.messages')) {
			showNotifications(get(res, 'data.messages'), typeNotification)
		}
		if (hide) {
			hide()
		}
		return res
	} catch (e) {
		if (!axios.isCancel(e) && typeNotification) {
			showErrorNotifications(e, typeNotification)
		}
		if (hide) {
			hide()
		}
		return Promise.reject(e)
	}
}

/**
 * @param url url endpoint
 * @param params Object params object
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 * @param showLoading Boolean show loading
 *
 * Performs delete request to url and returns with result
 */
export const deleteReq = async <T extends keyof DeleteUrls>(
	_url: T,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	_params: Parameters<DeleteUrls[T]['delete']>[0],
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false
): Promise<ReturnType<DeleteUrls[T]['delete']>> => {
	const { fullfilURL, queryParams } = fullFillURL(_url, _params)
	let hide
	if (showLoading) {
		hide = antMessage.loading('Operácia sa vykonáva...', 0)
	}

	const config = {
		...customConfig,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		}
	}

	if (queryParams) {
		config.params = queryParams
	}

	try {
		const res = await (axios.delete(fullfilURL, config) as Promise<ReturnType<DeleteUrls[T]['delete']>>)

		if (typeNotification && customConfig && customConfig.messages) {
			showNotifications(customConfig.messages, typeNotification)
		} else if (typeNotification && has(res, 'data.messages')) {
			showNotifications(get(res, 'data.messages'), typeNotification)
		}

		if (hide) {
			hide()
		}

		return res
	} catch (e) {
		if (hide) {
			hide()
		}

		if (!axios.isCancel(e) && typeNotification) {
			showErrorNotifications(e, typeNotification)
		}
		return Promise.reject(e)
	}
}
export const uploadFile = async (options: any) => {
	const { action, file, onSuccess, onError } = options

	try {
		const data = await axios.put(action, file, {
			headers: {
				'Content-Type': file.type
			}
		})
		onSuccess(data.status, data.request)
	} catch (error) {
		onError(error)
	}
}
