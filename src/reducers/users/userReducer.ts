import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { IUserActions, IUsersPayload, IAuthUserPayload, IUserPayload, IAuthUserSettingsPayload } from './userActions'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { USERS, AUTH_USER, USER, AUTH_USER_SETTINGS } from './userTypes'

export const initState = {
	authUser: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IAuthUserPayload & ILoadingAndFailure,
	users: {
		originalData: [],
		tableData: [],
		pagination: null,
		usersOptions: [],
		userPermissions: [],
		isLoading: false,
		isFailure: false
	} as IUsersPayload & ILoadingAndFailure,
	user: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IUserPayload & ILoadingAndFailure,
	settings: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IAuthUserSettingsPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IUserActions) => {
	switch (action.type) {
		// Auth User
		case AUTH_USER.AUTH_USER_LOAD_START:
			return {
				...state,
				authUser: {
					...state.authUser,
					isLoading: true
				}
			}
		case AUTH_USER.AUTH_USER_LOAD_FAIL:
			return {
				...state,
				authUser: {
					...initState.authUser,
					isFailure: true
				}
			}
		case AUTH_USER.AUTH_USER_LOAD_DONE:
			return {
				...state,
				authUser: {
					...initState.authUser,
					data: action.payload.data
				}
			}
		// Users
		case USERS.USERS_LOAD_START:
			return {
				...state,
				users: {
					...state.users,
					isFailure: false,
					isLoading: true
				}
			}
		case USERS.USERS_LOAD_FAIL:
			return {
				...state,
				users: {
					...initState.users,
					isFailure: true
				}
			}
		case USERS.USERS_LOAD_DONE:
			return {
				...state,
				users: {
					...initState.users,
					originalData: action.payload.originalData,
					tableData: action.payload.tableData,
					usersOptions: action.payload.usersOptions,
					userPermissions: action.payload.userPermissions,
					pagination: action.payload.pagination
				}
			}
		// User profil
		case USER.USER_LOAD_START:
			return {
				...state,
				user: {
					...state.user,
					isFailure: false,
					isLoading: true
				}
			}
		case USER.USER_LOAD_FAIL:
			return {
				...state,
				user: {
					...initState.user,
					isFailure: true
				}
			}
		case USER.USER_LOAD_DONE:
			return {
				...state,
				user: {
					...initState.user,
					data: action.payload.data
				}
			}
		// Settings
		case AUTH_USER_SETTINGS.AUTH_USER_SETTINGS_LOAD_DONE:
			return {
				...state,
				settings: {
					...initState.settings,
					data: action.payload.data
				}
			}
		case AUTH_USER_SETTINGS.AUTH_USER_SETTINGS_LOAD_FAIL:
			return {
				...state,
				settings: {
					...initState.settings,
					isFailure: true
				}
			}
		case AUTH_USER_SETTINGS.AUTH_USER_SETTINGS_LOAD_START:
			return {
				...state,
				settings: {
					...state.settings,
					isFailure: false,
					isLoading: true
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
