/* eslint-disable import/no-cycle */
import i18next from 'i18next'
import decode from 'jwt-decode'
import { get, map, flatten, uniq } from 'lodash'

// types
import { ThunkResult } from '../index'
import { IJwtPayload, ISelectOptionItem } from '../../types/interfaces'
import { AUTH_USER, USER, USERS } from './userTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { setAccessToken, clearAccessToken, clearRefreshToken, isLoggedIn, hasRefreshToken, getRefreshToken, setRefreshToken, getAccessToken } from '../../utils/auth'
import { history } from '../../utils/history'
import { getReq, postReq } from '../../utils/request'
import { PERMISSION } from '../../utils/enums'

export type IUserActions = IResetStore | IGetAuthUser | IGetUser | IGetUsers

interface IGetAuthUser {
	type: AUTH_USER
	payload: IAuthUserPayload
}

interface IGetUser {
	type: USER
	payload: IUserPayload
}

interface IGetUsers {
	type: USERS
	payload: IUsersPayload
}

interface IPermissions {
	uniqPermissions?: PERMISSION[]
}

export interface IAuthUserPayload {
	data: ((Paths.PostApiB2BAdminAuthLogin.Responses.$200['user'] | null) & IPermissions) | null
}

export interface IUserPayload {
	data: Paths.GetApiB2BAdminUsersUserId.Responses.$200 | null
}

export interface IUsersPayload {
	data: Paths.GetApiB2BAdminUsers.Responses.$200 | null
	usersOptions: ISelectOptionItem[]
}

export const processAuthorizationResult =
	(result: Paths.PostApiB2BAdminAuthLogin.Responses.$200, redirectPath = i18next.t('paths:index')): ThunkResult<void> =>
	async (dispatch) => {
		try {
			dispatch({ type: AUTH_USER.AUTH_USER_LOAD_START })
			setAccessToken(result.accessToken)
			setRefreshToken(result.refreshToken)
			// parse permissions from role
			const rolePermissions = flatten(map(get(result, 'user.roles'), (role) => get(role, 'permissions')))
			const uniqPermissions = uniq(map([...rolePermissions], 'name'))

			const payload = {
				data: {
					...result.user,
					uniqPermissions
				}
			}

			dispatch({
				type: AUTH_USER.AUTH_USER_LOAD_DONE,
				payload
			})

			history.push(redirectPath)
		} catch (e) {
			dispatch({ type: AUTH_USER.AUTH_USER_LOAD_FAIL })
			history.push(i18next.t('paths:login'))
			// eslint-disable-next-line no-console
			console.log(e)
		}
	}

export const getCurrentUser = (): ThunkResult<Promise<IAuthUserPayload>> => async (dispatch) => {
	let payload = {} as IAuthUserPayload

	try {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_START })

		const accessToken = getAccessToken()
		const jwtPayload: IJwtPayload = decode(accessToken as string)

		const { data } = await getReq('/api/b2b/admin/users/{userID}', { userID: jwtPayload.uid })

		// parse permissions from role
		const rolePermissions = flatten(map(get(data, 'user.roles'), (role) => get(role, 'permissions')))
		const uniqPermissions = uniq(map([...rolePermissions], 'name'))

		payload = {
			data: {
				...data.user,
				uniqPermissions
			}
		}

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

	history.push(i18next.t('paths:login'))
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

export const getUserAccountDetails =
	(userID: number): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: USER.USER_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/users/{userID}', { userID })
			dispatch({ type: USER.USER_LOAD_DONE, payload: { data: data.user } })
		} catch (err) {
			dispatch({ type: USER.USER_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const getUsers =
	(page: number, limit?: any | undefined, order?: string | undefined, search?: string | undefined | null, roleID?: number | undefined): ThunkResult<Promise<IUsersPayload>> =>
	// eslint-disable-next-line consistent-return
	async (dispatch) => {
		let payload = {} as IUsersPayload
		try {
			dispatch({ type: USERS.USERS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/users/', { page: page || 1, limit, order, search, roleID })

			const usersOptions: ISelectOptionItem[] = map(data?.users, (user) => ({
				key: user?.id,
				label: user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.email,
				value: user?.id
			}))

			payload = {
				data,
				usersOptions
			}

			dispatch({ type: USERS.USERS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: USERS.USERS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
