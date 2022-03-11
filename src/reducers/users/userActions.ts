/* eslint-disable import/no-cycle */
import i18next from 'i18next'

// types
import { ThunkResult } from '../index'
import { ILoginForm } from '../../types/interfaces'
import { AUTH_USER } from './userTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { setAccessToken, clearAccessToken, clearRefreshToken, isLoggedIn, hasRefreshToken, getRefreshToken, setRefreshToken } from '../../utils/auth'
import { history, getPath } from '../../utils/history'
import { postReq } from '../../utils/request'

export type IUserActions = IResetStore | IGetAuthUser

interface IGetAuthUser {
	type: AUTH_USER
	payload: IAuthUserPayload
}

export interface IAuthUserPayload {
	data: Paths.PostApiB2BAdminAuthLogin.Responses.$200 | null
}

// eslint-disable-next-line import/prefer-default-export
export const logInUser =
	(input: ILoginForm): ThunkResult<void> =>
	async () => {
		try {
			const { data } = await postReq('/api/b2b/admin/auth/login', null, input)

			setAccessToken(data.accessToken)
			setRefreshToken(data.refreshToken)

			history.push(getPath(i18next.t('paths:index')))
			return null
		} catch (e) {
			history.push(getPath(i18next.t('paths:login')))
			// eslint-disable-next-line no-console
			console.log(e)
			return e
		}
	}

export const logOutUser = (): ThunkResult<void> => async (dispatch) => {
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

	return null
}

export const refreshToken = (): ThunkResult<Promise<void>> => async () => {
	if (isLoggedIn() && hasRefreshToken()) {
		try {
			const { data } = await postReq('/api/b2b/admin/auth/refresh-token', null, { refreshToken: getRefreshToken() as string })
			setAccessToken(data.accessToken)
			setRefreshToken(data.refreshToken)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error)
		}
	}
}
