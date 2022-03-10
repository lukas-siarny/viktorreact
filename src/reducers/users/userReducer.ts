import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { IUserActions, IAuthUserPayload, IUserPayload } from './userActions'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { AUTH_USER, USER } from './userTypes'

export const initState = {
	authUser: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IAuthUserPayload & ILoadingAndFailure,
	user: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IUserPayload & ILoadingAndFailure,
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
		case USER.USER_LOAD_START:
			return {
				...state,
				user: {
					...state.user,
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
