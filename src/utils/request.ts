/* eslint-disable import/no-cycle */
import axios, { AxiosError, AxiosRequestConfig, CancelTokenSource } from 'axios'
import { message as antMessage } from 'antd'
import { get, has, isEmpty, split } from 'lodash'
import i18next from 'i18next'
import qs from 'qs'
import { MSG_CODE, CANCEL_TOKEN_MESSAGES, MSG_TYPE, NOTIFICATION_TYPE, UPLOAD_IMG_CATEGORIES } from './enums'
import rootReducer from '../reducers'
import { logOutUser } from '../reducers/users/userActions'
import { getAccessToken, isLoggedIn } from './auth'
import configureStore from './configureStore'
import Navigator from './navigation'

// types
import { IErrorMessage } from '../types/interfaces'
import showNotifications, { showNotificationModal } from './tsxHelpers'
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

export const showErrorNotifications = (error: AxiosError | Error | unknown, typeNotification = NOTIFICATION_TYPE.NOTIFICATION, skipRedirect = false) => {
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
		const { store } = configureStore(rootReducer)
		logOutUser(skipRedirect)(store.dispatch, store.getState, undefined)
	} else if (get(error, 'response.status') === 504 || get(error, 'response') === undefined || get(error, 'message') === 'Network Error') {
		messages = [
			{
				type: MSG_TYPE.ERROR,
				message: i18next.t('loc:Chyba pripojenia k serveru')
			}
		]
		showNotifications(messages, typeNotification)
	} else if (messages.some((msg: any) => msg.code === MSG_CODE.MISSING_COUNTRY_CODE)) {
		const urlArray = split(get(error, 'config.url'), '/')
		const validSalonID = urlArray[5].split('-').length === 5 ? urlArray[5] : '' // must be valid GUI ID
		showNotificationModal({
			message: i18next.t('loc:Na vykonanie požadovanej akcie musí mať salón nastavenú adresu.'),
			actionButtonLabel: i18next.t('loc:Nastaviť adresu'),
			action: validSalonID ? () => Navigator.navigate(`${i18next.t('paths:salons')}/${validSalonID}`) : undefined
		})
	} else {
		// if BE do not send message set general error message
		messages = isEmpty(messages) ? [{ type: MSG_TYPE.ERROR, message: i18next.t('loc:Ups niečo sa pokazilo') }] : messages
		showNotifications(messages, typeNotification)
	}
}

export interface ICustomConfig extends AxiosRequestConfig {
	messages?: IErrorMessage[]
	skipLoginRedirect?: boolean
	skip404Handler?: boolean
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

export const cancelGetTokens = {} as { [key: string]: CancelTokenSource }

/**
 * @param url url endpoint
 * @param params Object object
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 * @param showLoading
 * @param allowCancelToken
 * @param cancelTokenKey
 * @return Promise response
 *
 */
export const getReq = async <T extends keyof GetUrls>(
	url: T,
	params: Parameters<GetUrls[T]['get']>[0],
	customConfig?: ICustomConfig,
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false,
	cancelTokenKey = ''
): Promise<ReturnType<GetUrls[T]['get']>> => {
	const { fullfilURL, queryParams } = fullFillURL(url, params)

	let token = {}
	if (allowCancelToken) {
		const cancelTokenStorageKey = cancelTokenKey || fullfilURL
		if (typeof cancelGetTokens[cancelTokenStorageKey] !== typeof undefined) {
			cancelGetTokens[cancelTokenStorageKey].cancel(CANCEL_TOKEN_MESSAGES.CANCELED_DUE_TO_NEW_REQUEST)
		}
		// Save the cancel token for the current request
		cancelGetTokens[cancelTokenStorageKey] = axios.CancelToken.source()
		token = {
			cancelToken: cancelGetTokens[cancelTokenStorageKey].token
		}
	}
	let hide
	if (showLoading) {
		hide = antMessage.loading('Načitavajú sa dáta...', 0)
	}

	const config: AxiosRequestConfig = {
		paramsSerializer: {
			serialize: (serializeParams: Record<string, any>) => qs.stringify(serializeParams), // mimic pre 1.x behavior and send entire params object to a custom serializer func. Allows consumer to control how params are serialized.
			indexes: false // array indexes format (null - no brackets, false (default) - empty brackets, true - brackets with indexes)
		},
		...customConfig,
		...token,
		headers: {
			...buildHeaders(),
			...get(customConfig, 'headers', {})
		} as any
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
			showErrorNotifications(e, typeNotification, customConfig?.skipLoginRedirect)
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
 * @param reqBody
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 * @param showLoading Boolean show loading
 * @param allowCancelToken
 * @param cancelTokenKey
 * @return Promise response
 * Performs post request to url and returns callback with result
 */
export const postReq = async <T extends keyof PostUrls>(
	url: T,
	params: Parameters<PostUrls[T]['post']>[0],
	reqBody: Parameters<PostUrls[T]['post']>[1],
	customConfig?: ICustomConfig,
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false,
	cancelTokenKey = ''
): Promise<ReturnType<PostUrls[T]['post']>> => {
	const { fullfilURL, queryParams } = fullFillURL(url, params)
	let token = {}
	if (allowCancelToken) {
		const cancelTokenStorageKey = cancelTokenKey || fullfilURL
		if (typeof cancelPostTokens[cancelTokenStorageKey] !== typeof undefined) {
			cancelPostTokens[cancelTokenStorageKey].cancel(CANCEL_TOKEN_MESSAGES.CANCELED_DUE_TO_NEW_REQUEST)
		}
		// Save the cancel token for the current request
		cancelPostTokens[cancelTokenStorageKey] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPostTokens[cancelTokenStorageKey].token
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
			showErrorNotifications(e, typeNotification, customConfig?.skipLoginRedirect)
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
 * @param reqBody
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 *
 * Performs put request to url and returns callback with result
 * @param showLoading
 * @param allowCancelToken
 * @param cancelTokenKey
 */

export const patchReq = async <T extends keyof PatchUrls>(
	url: T,
	params: Parameters<PatchUrls[T]['patch']>[0],
	reqBody: Parameters<PatchUrls[T]['patch']>[1],
	customConfig?: ICustomConfig,
	typeNotification: NOTIFICATION_TYPE | false = NOTIFICATION_TYPE.NOTIFICATION,
	showLoading = false,
	allowCancelToken = false,
	cancelTokenKey = ''
): Promise<ReturnType<PatchUrls[T]['patch']>> => {
	const { fullfilURL, queryParams } = fullFillURL(url, params)

	let token = {}
	if (allowCancelToken) {
		const cancelTokenStorageKey = cancelTokenKey || fullfilURL
		if (typeof cancelPatchTokens[cancelTokenStorageKey] !== typeof undefined) {
			cancelPatchTokens[cancelTokenStorageKey].cancel(CANCEL_TOKEN_MESSAGES.CANCELED_DUE_TO_NEW_REQUEST)
		}
		// Save the cancel token for the current request
		cancelPatchTokens[cancelTokenStorageKey] = axios.CancelToken.source()
		token = {
			cancelToken: cancelPatchTokens[cancelTokenStorageKey].token
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
			showErrorNotifications(e, typeNotification, customConfig?.skipLoginRedirect)
		}
		if (hide) {
			hide()
		}
		return Promise.reject(e)
	}
}

/**
 * @param _url
 * @param _params
 * @param customConfig overwrite defaultConfig with custom one
 * @param typeNotification Enum notification type
 * @param showLoading Boolean show loading
 *
 * Performs delete request to url and returns with result
 */
export const deleteReq = async <T extends keyof DeleteUrls>(
	_url: T,
	_params: Parameters<DeleteUrls[T]['delete']>[0],
	customConfig?: ICustomConfig,
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
			showErrorNotifications(e, typeNotification, customConfig?.skipLoginRedirect)
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

export const uploadImage = async (options: any, signUrl: string, category: UPLOAD_IMG_CATEGORIES, imagesUrls: any) => {
	const { file, onSuccess, onError } = options

	const { uid, name, size, type } = file
	const files = [{ name, size, mimeType: type }]

	try {
		// sign imageUrl
		const { data } = await postReq(signUrl as any, undefined, { files, category })
		const imgData = data?.files?.[0]
		// eslint-disable-next-line no-param-reassign
		imagesUrls.current[uid] = { uid, ...imgData }
		// upload file to signed URL
		const result = await axios.put(imgData.signedUrl, file, {
			headers: {
				'Content-Type': file.type
			}
		})

		onSuccess(result.status, result.request)
	} catch (error) {
		onError(error)
	}
}
