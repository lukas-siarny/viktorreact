/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { IUserActions, IUsersPayload, IPendingInvitesPayload, INotinoUsersPayload, IUserDocumentsPayload } from './userActions'
import { ILoadingAndFailure, IAuthUserPayload, IUserPayload } from '../../types/interfaces'
import { AUTH_USER, USERS, USER, PENDING_INVITES, NOTINO_USERS, USER_DOCUMENTS } from './userTypes'

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
	users: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IUsersPayload & ILoadingAndFailure,
	pendingInvites: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IPendingInvitesPayload & ILoadingAndFailure,
	notinoUsers: {
		data: null,
		isLoading: false,
		isFailure: false
	} as INotinoUsersPayload & ILoadingAndFailure,
	userDocuments: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IUserDocumentsPayload & ILoadingAndFailure
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
		// User detail
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
		// Users
		case USERS.USERS_LOAD_START:
			return {
				...state,
				users: {
					...state.users,
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
					data: action.payload.data
				}
			}
		// Notino users
		case NOTINO_USERS.NOTINO_USERS_LOAD_START:
			return {
				...state,
				notinoUsers: {
					...state.notinoUsers,
					isLoading: true
				}
			}
		case NOTINO_USERS.NOTINO_USERS_LOAD_FAIL:
			return {
				...state,
				notinoUsers: {
					...initState.notinoUsers,
					isFailure: true
				}
			}
		case NOTINO_USERS.NOTINO_USERS_LOAD_DONE:
			return {
				...state,
				notinoUsers: {
					...initState.notinoUsers,
					data: action.payload.data
				}
			}
		// pending invites
		case PENDING_INVITES.PENDING_INVITES_LOAD_START:
			return {
				...state,
				pendingInvites: {
					...state.pendingInvites,
					isLoading: true
				}
			}
		case PENDING_INVITES.PENDING_INVITES_LOAD_FAIL:
			return {
				...state,
				pendingInvites: {
					...initState.pendingInvites,
					isFailure: true
				}
			}
		case PENDING_INVITES.PENDING_INVITES_LOAD_DONE:
			return {
				...state,
				pendingInvites: {
					...initState.pendingInvites,
					data: action.payload.data
				}
			}
		// user documents
		case USER_DOCUMENTS.USER_DOCUMENTS_LOAD_START:
			return {
				...state,
				userDocuments: {
					...state.userDocuments,
					isLoading: true
				}
			}
		case USER_DOCUMENTS.USER_DOCUMENTS_LOAD_FAIL:
			return {
				...state,
				userDocuments: {
					...initState.userDocuments,
					isFailure: true
				}
			}
		case USER_DOCUMENTS.USER_DOCUMENTS_LOAD_DONE:
			return {
				...state,
				userDocuments: {
					...initState.userDocuments,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
