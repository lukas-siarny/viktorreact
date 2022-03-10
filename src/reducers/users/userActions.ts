/* eslint-disable import/no-cycle */
import i18next from 'i18next'

// types
import { ThunkResult } from '../index'
import { ILoginForm } from '../../types/interfaces'
import { AUTH_USER } from './userTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { setAccessToken, clearAccessToken } from '../../utils/auth'
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

			history.push(getPath(i18next.t('paths:index')))
			return null
		} catch (e) {
			history.push(getPath(i18next.t('paths:login')))
			// eslint-disable-next-line no-console
			console.log(e)
			return e
		}
	}

export const logOutUser = (): ThunkResult<void> => (dispatch) => {
	clearAccessToken()

	dispatch({
		type: RESET_STORE
	})

	history.push(i18next.t('paths:prihlasenie'))
}
