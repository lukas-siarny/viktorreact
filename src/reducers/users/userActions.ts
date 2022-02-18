/* eslint-disable import/no-cycle */
import { find, flatten, get, join, map, uniq } from 'lodash'
import i18next from 'i18next'
import decode from 'jwt-decode'

// types
import { IJwtPayload, IResponsePagination, ISelectOptionItem } from '../../types/interfaces'

import { ThunkResult } from '../index'
import { AUTH_USER, AUTH_USER_SETTINGS, USER, USERS } from './userTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'

// utils
import { clearAccessToken, clearCompanyBranchID, getAccessToken, getCompanyBranchID, setAccessToken, setCompanyBranchID } from '../../utils/auth'
import { history } from '../../utils/history'
import { formatDateWithTime, normalizeQueryParams } from '../../utils/helper'

import { getReq, patchReq, postReq } from '../../utils/request'
import { PAGINATION, PERMISSION, PRODUCT_SEARCH_FILTER } from '../../utils/enums'

export type IUserActions = IResetStore | IGetAuthUserProfileActions | IGetUsersActions | IGetUserActions | IGetAuthUserSettings

// user
interface IGetUserActions {
	type: USER
	payload: IUserPayload
}

interface IGetAuthUserSettings {
	type: AUTH_USER_SETTINGS
	payload: IAuthUserSettingsPayload
}

export interface IUserPayload {
	data: AuthUser | null
	isLoading: boolean
	isFailure: boolean
}

export interface IUserPermissions {
	id: number
	key: number
	userID: number
	name: string
	permissions: UserPermission[]
}

// users
interface IGetUsersActions {
	type: USERS
	payload: IUsersPayload
}

type RoleItem = {
	id: number
	name: string
}

type UsersOriginalItem = {
	id: number
	fullName: string
	email: string
	confirmedAt: string | null
	deletedAt: string | null
	roles: RoleItem[]
}

export type UsersTableItem = {
	key: number
	id: number
	fullName: string
	email: string
	deletedAt: string
	confirmedAt: string
	roles: string
}

export interface IUsersPayload {
	tableData: UsersTableItem[]
	originalData: UsersOriginalItem[]
	usersOptions: ISelectOptionItem[]
	userPermissions: IUserPermissions[]
	pagination: IResponsePagination | null
}
export type UserPermission = {
	displayName: string
	id: number
	key: PERMISSION
	roles: any[]
}
// auth user
export interface IGetAuthUserProfileActions {
	type: AUTH_USER
	payload: IAuthUserPayload
}

export type RolesType = {
	id: number
	name: string
	permissions: UserPermission[]
}

export type User = {
	id: number
	name: string | null
	surname: string | null
	email: string
	confirmedAt: string | null
	lastLoginAt: string | null
	roles: RolesType[]
	permissions: UserPermission[]
	creator: {
		id: number
		initials: string
		fullName: string | null
	}
	createdAt: string
	destructor: {
		id: number
		fullName: string
	} | null
	deletedAt: string | null
	ipAddresses: {
		id: number
		ip: string
	}[]
}

export type AuthUser = User & {
	avatarURL: string
	uniqPermissions: PERMISSION[]
}

export interface IAuthUserPayload {
	data: AuthUser | null
}

export type AuthUserSettings = {
	pagination?: number
	productSearchFilters?: PRODUCT_SEARCH_FILTER[] | null
}

export interface IAuthUserSettingsPayload {
	data: AuthUserSettings | null
}

export const logInUser =
	(email: string, password: string): ThunkResult<void> =>
	async () => {
		try {
			const { data } = await postReq('/api/v1/authorization/login', null, {
				email,
				password
			})

			setAccessToken(data.accessToken)

			history.push(i18next.t('paths:index'))
			return null
		} catch (e) {
			history.push(i18next.t('paths:prihlasenie'))
			// eslint-disable-next-line no-console
			console.log(e)
			return e
		}
	}

export const getAuthUserProfile = (): ThunkResult<Promise<IAuthUserPayload>> => async (dispatch) => {
	const payload = {} as IAuthUserPayload
	try {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_START })

		const accessToken = getAccessToken()
		const jwtPayload: IJwtPayload = decode(accessToken as string)
		// TODO:

		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_DONE, payload })
	} catch (e) {
		dispatch({ type: AUTH_USER.AUTH_USER_LOAD_FAIL })
	}
	return payload
}

export const selectAuthUser = (): ThunkResult<Promise<IAuthUserPayload>> => async (dispatch, getState) => {
	const state = getState()
	return state.user.authUser
}

export const logOutUser = (): ThunkResult<void> => (dispatch) => {
	clearAccessToken()

	dispatch({
		type: RESET_STORE
	})

	history.push(i18next.t('paths:prihlasenie'))
}

export const ping = (): ThunkResult<Promise<void>> => async (dispatch, getState, extraArgument) => {
	try {
		const { data } = await postReq('/api/v1/authorization/ping', undefined)
		if (data?.accessToken) {
			setAccessToken(data.accessToken)
		} else {
			logOutUser()(dispatch, getState, extraArgument)
		}
	} catch (err) {
		// eslint-disable-next-line
		console.log(err)
	}
}
