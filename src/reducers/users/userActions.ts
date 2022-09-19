/* eslint-disable import/no-cycle */
import i18next from 'i18next'
import decode from 'jwt-decode'
import { get, map, flatten, uniq } from 'lodash'

// types
import { ThunkResult } from '../index'
import { IJwtPayload, ISelectOptionItem, IQueryParams, ISearchable, IPermissions } from '../../types/interfaces'
import { AUTH_USER, USER, USERS, PENDING_INVITES, SET_PREVIOUS_ROUTE, SET_REGULAR_LOGOUT } from './userTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { setAccessToken, clearAccessToken, clearRefreshToken, isLoggedIn, hasRefreshToken, getRefreshToken, setRefreshToken, getAccessToken } from '../../utils/auth'
import { history } from '../../utils/history'
import { getReq, postReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

// actions
import { setSelectionOptions } from '../selectedSalon/selectedSalonActions'

export type IUserActions = IResetStore | IGetAuthUser | IGetUser | IGetUsers | IGetPendingInvites | ISetPreviousRoute | ISetRegularLogout

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

interface IGetPendingInvites {
	type: PENDING_INVITES
	payload: IPendingInvitesPayload
}

interface ISetPreviousRoute {
	type: typeof SET_PREVIOUS_ROUTE
	payload: string | undefined
}

interface ISetRegularLogout {
	type: typeof SET_REGULAR_LOGOUT
	payload: boolean
}

export interface IGetUsersQueryParams extends IQueryParams {
	roleID?: string | undefined | null
}

export interface IAuthUserPayload {
	data: ((Paths.PostApiB2BAdminAuthLogin.Responses.$200['user'] | null) & IPermissions) | null
}

export interface IUserPayload {
	data: Paths.GetApiB2BAdminUsersUserId.Responses.$200 | null
}

export interface IUsersPayload extends ISearchable<Paths.GetApiB2BAdminUsers.Responses.$200> {}

export interface IPendingInvitesPayload {
	data: Paths.GetApiB2BAdminUsersUserIdPendingEmployeeInvites.Responses.$200 | null
}

export const processAuthorizationResult =
	(result: Paths.PostApiB2BAdminAuthLogin.Responses.$200, redirectPath = i18next.t('paths:index')): ThunkResult<void> =>
	async (dispatch) => {
		let salons: Paths.GetApiB2BAdminUsersUserId.Responses.$200['user']['salons'] = []
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

			salons = result.user.salons

			dispatch({
				type: AUTH_USER.AUTH_USER_LOAD_DONE,
				payload
			})

			history.push(redirectPath)
		} catch (e) {
			dispatch({ type: AUTH_USER.AUTH_USER_LOAD_FAIL })
			// history.push(i18next.t('paths:login'))
			// eslint-disable-next-line no-console
			console.log(e)
		} finally {
			dispatch(setSelectionOptions(salons))
		}
	}

export const getCurrentUser = (): ThunkResult<Promise<IAuthUserPayload>> => async (dispatch) => {
	let payload = {} as IAuthUserPayload

	let salons: Paths.GetApiB2BAdminUsersUserId.Responses.$200['user']['salons'] = []

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

		salons = data.user.salons

		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	} finally {
		dispatch(setSelectionOptions(salons))
	}

	return payload
}

export const setPreviousRoute =
	(previousRoute?: string): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		dispatch({ type: SET_PREVIOUS_ROUTE, payload: previousRoute })
	}

export const setRegularLogout =
	(previousRoute?: boolean): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		dispatch({ type: SET_REGULAR_LOGOUT, payload: previousRoute })
	}

export const logOutUser =
	(skipRedirect?: boolean): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			await postReq('/api/b2b/admin/auth/logout', null, undefined, undefined, false)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error)
		} finally {
			clearAccessToken()
			clearRefreshToken()

			dispatch({
				type: RESET_STORE
			})

			if (!skipRedirect) {
				history.push({ pathname: i18next.t('paths:login') })
			}
		}
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
			dispatch(logOutUser())
		}
	}
}

export const getUserAccountDetails =
	(userID: string): ThunkResult<Promise<IUserPayload>> =>
	async (dispatch) => {
		let payload = {} as IUserPayload
		try {
			dispatch({ type: USER.USER_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/users/{userID}', { userID })

			payload = {
				data
			}

			dispatch({ type: USER.USER_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: USER.USER_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getUsers =
	(queryParams: IGetUsersQueryParams): ThunkResult<Promise<IUsersPayload>> =>
	// eslint-disable-next-line consistent-return
	async (dispatch) => {
		let payload = {} as IUsersPayload
		try {
			dispatch({ type: USERS.USERS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/users/', { ...normalizeQueryParams(queryParams) })

			const usersOptions: ISelectOptionItem[] = map(data?.users, (user) => ({
				key: user?.id,
				label: user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.email,
				value: user?.id
			}))

			payload = {
				data,
				options: usersOptions
			}

			dispatch({ type: USERS.USERS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: USERS.USERS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getPendingInvites =
	(userID: string): ThunkResult<Promise<IPendingInvitesPayload>> =>
	// eslint-disable-next-line consistent-return
	async (dispatch) => {
		let payload = {} as IPendingInvitesPayload
		try {
			dispatch({ type: PENDING_INVITES.PENDING_INVITES_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/users/{userID}/pending-employee-invites', { userID })

			payload = {
				data
			}

			dispatch({ type: PENDING_INVITES.PENDING_INVITES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: PENDING_INVITES.PENDING_INVITES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
