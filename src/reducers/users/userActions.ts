/* eslint-disable import/no-cycle */
import i18next from 'i18next'
import decode from 'jwt-decode'

// types
import { ThunkResult } from '../index'
import { ILoginForm, IJwtPayload, ICreatePasswordForm } from '../../types/interfaces'
import { AUTH_USER, USER } from './userTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { setAccessToken, clearAccessToken, clearRefreshToken, isLoggedIn, hasRefreshToken, getRefreshToken, setRefreshToken, getAccessToken } from '../../utils/auth'
import { history, getPath } from '../../utils/history'
import { getReq, postReq, PostUrls, ICustomConfig } from '../../utils/request'

export type IUserActions = IResetStore | IGetAuthUser | IGetUser

interface IGetAuthUser {
	type: AUTH_USER
	payload: IAuthUserPayload
}

interface IGetUser {
	type: USER
	payload: IUserPayload
}

export interface IAuthUserPayload {
	data: Paths.PostApiB2BAdminAuthLogin.Responses.$200['user'] | null
}
export interface IUserPayload {
	data: Paths.GetApiB2BAdminUsersUserId.Responses.$200 | null
}

const authorize = async <T extends keyof Pick<PostUrls, '/api/b2b/admin/auth/login' | '/api/b2b/admin/users/registration' | '/api/b2b/admin/auth/reset-password'>>(
	dispatch: any,
	url: T,
	input: any,
	config?: ICustomConfig
): Promise<void> => {
	try {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_START })

		const { data } = await postReq(url, null, input, config)

		// temp fix
		if ('accessToken' in data) {
			setAccessToken(data.accessToken)
		}
		// temp fix
		if ('refreshToken' in data) {
			setRefreshToken(data.refreshToken)
		}

		dispatch({
			type: AUTH_USER.AUTH_USER_LOAD_DONE,
			payload: { data: data.user }
		})

		history.push(getPath(i18next.t('paths:index')))
	} catch (e) {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.log(e)
	}
}

export const logInUser =
	(input: ILoginForm): ThunkResult<void> =>
	async (dispatch) => {
		await authorize(dispatch, '/api/b2b/admin/auth/login', input)
	}

export const resetPassword =
	(input: Pick<ICreatePasswordForm, 'password'>, token: string): ThunkResult<void> =>
	async (dispatch) => {
		const headers = {
			Authorization: `Bearer ${token}`
		}

		await authorize(dispatch, '/api/b2b/admin/auth/reset-password', input, headers as ICustomConfig)
	}

export const getCurrentUser = (): ThunkResult<Promise<IAuthUserPayload>> => async (dispatch) => {
	let payload = {} as IAuthUserPayload

	try {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_START })

		const accessToken = getAccessToken()
		const jwtPayload: IJwtPayload = decode(accessToken as string)

		const { data } = await getReq('/api/b2b/admin/users/{userID}', { userID: jwtPayload.uid })

		payload = { data: data.user }

		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}

export const logOutUser = (): ThunkResult<Promise<void>> => async (dispatch) => {
	try {
		await postReq('/api/b2b/admin/auth/logout', null, undefined, undefined, false)
	} catch (error) {
		// eslint-disable-next-line no-console
		console.log(error)
	}

	clearAccessToken()
	clearRefreshToken()

	dispatch({
		type: RESET_STORE
	})

	history.push(getPath(i18next.t('paths:login')))
}

export const refreshToken = (): ThunkResult<Promise<void>> => async (dispatch) => {
	if (isLoggedIn() && hasRefreshToken()) {
		try {
			const { data } = await postReq('/api/b2b/admin/auth/refresh-token', null, { refreshToken: getRefreshToken() as string })
			setAccessToken(data.accessToken)
			setRefreshToken(data.refreshToken)
			dispatch(getCurrentUser())
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error)
		}
	}
}
