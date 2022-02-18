/* eslint-disable import/no-cycle */
import axios, { AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios'
import { message as antMessage } from 'antd'
import { get, has, isEmpty, split } from 'lodash'
import i18next from 'i18next'
import qs from 'qs'
import rootReducer from '../reducers'
import { getAccessToken, getCompanyBranchID, isLoggedIn } from './auth'
import { MSG_TYPE, NOTIFICATION_TYPE } from './enums'
import configureStore from './configureStore'
import { history } from './history'

// types
import { IErrorMessage } from '../types/interfaces'

import { logOutUser } from '../reducers/users/userActions'
import showNotifications from './tsxHelpers'
import { PathsDictionary } from '../types/api'

type FilteredKeys<T, U> = { [P in keyof T]: T[P] extends U ? P : never }[keyof T]

type GetUrls = {
	[Q in FilteredKeys<PathsDictionary, { get: any }>]: PathsDictionary[Q]
}

type PostUrls = {
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
		history.push(i18next.t('paths:prihlasenie'))
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

interface ICustomConfig extends AxiosRequestConfig {
	messages?: IErrorMessage[]
}

const buildHeaders = () => {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'Access-Control-Allow-Credentials': 'true',
		'Cache-Control': 'no-cache, no-store',
		Pragma: 'no-cache',
		'X-Version': process.env.REACT_APP_VERSION as string
	}
	if (isLoggedIn()) {
		headers.Authorization = `Bearer ${getAccessToken()}`
		const companyBranchID = getCompanyBranchID()
		if (companyBranchID) {
			headers['X-companyBranchID'] = companyBranchID
		}
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

/**
 * @param url url endpoint
 * @param params Object object
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 * @return Promise response
 *
 */
const cancelGetTokens = {} as { [key: string]: CancelTokenSource }
export const getReq = async (
	url: string,
	params?: any,
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false
) => {
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelGetTokens[url] !== typeof undefined) {
			cancelGetTokens[url].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelGetTokens[url] = axios.CancelToken.source()
		token = {
			cancelToken: cancelGetTokens[url].token
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

	if (params) {
		config.params = params
	}

	try {
		const res = await axios.get(url, config)
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

export const getReq2 = async <T extends keyof GetUrls>(
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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return getReq(fullfilURL, queryParams, customConfig, typeNotification, showLoading, allowCancelToken) as Promise<ReturnType<GetUrls[T]['get']>>
}

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
const cancelPostTokens = {} as { [key: string]: CancelTokenSource }
export const postReq = async (
	url: string,
	params: any,
	data: any = {},
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false
) => {
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelPostTokens[url] !== typeof undefined) {
			cancelPostTokens[url].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelPostTokens[url] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPostTokens[url].token
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

	if (params) {
		config.params = params
	}

	try {
		const res = await axios.post(url, data, config)
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

export const postReq2 = async <T extends keyof PostUrls>(
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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return postReq(fullfilURL, queryParams, data, customConfig, typeNotification, showLoading, allowCancelToken) as Promise<ReturnType<PostUrls[T]['post']>>
}

/**
 * @param url url endpoint
 * @param params Object params object
 * @param data Object data object
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 *
 * Performs put request to url and returns callback with result
 */
const cancelPatchTokens = {} as { [key: string]: CancelTokenSource }
export const patchReq = async (
	url: string,
	params: any,
	data: any = {},
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false
) => {
	let token = {}
	if (allowCancelToken) {
		if (typeof cancelPatchTokens[url] !== typeof undefined) {
			cancelPatchTokens[url].cancel('Operation canceled due to new request.')
		}
		// Save the cancel token for the current request
		cancelPatchTokens[url] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPatchTokens[url].token
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

	if (params) {
		config.params = params
	}
	try {
		const res = await axios.patch(url, data, config)
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

export const patchReq2 = async <T extends keyof PatchUrls>(
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
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return patchReq(fullfilURL, queryParams, data, customConfig, typeNotification, showLoading, allowCancelToken) as Promise<ReturnType<PatchUrls[T]['patch']>>
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
export const deleteReq = async (
	url: string,
	params: any,
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false
) => {
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

	if (params) {
		config.params = params
	}

	try {
		const res = await axios.delete(url, config)

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

export const deleteReq2 = async <T extends keyof DeleteUrls>(
	url: T,
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	params: Parameters<DeleteUrls[T]['delete']>[0],
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	reqBody: Parameters<DeleteUrls[T]['delete']>[1],
	customConfig: ICustomConfig = {},
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false
): Promise<ReturnType<DeleteUrls[T]['delete']>> => {
	const { fullfilURL, queryParams } = fullFillURL(url, params)
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return deleteReq(fullfilURL, queryParams, data, customConfig, typeNotification, showLoading, allowCancelToken) as Promise<ReturnType<DeleteUrls[T]['delete']>>
}
