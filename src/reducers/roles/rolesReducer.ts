import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { IRolesActions, IRolesPayload } from './rolesActions'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { ROLES } from './rolesTypes'

export const initState = {
	roles: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IRolesPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IRolesActions) => {
	switch (action.type) {
		// Roles
		case ROLES.ROLES_LOAD_START:
			return {
				...state,
				roles: {
					...state.roles,
					isLoading: true
				}
			}
		case ROLES.ROLES_LOAD_FAIL:
			return {
				...state,
				roles: {
					...initState.roles,
					isFailure: true
				}
			}
		case ROLES.ROLES_LOAD_DONE:
			console.log(action.payload)
			return {
				...state,
				roles: {
					...initState.roles,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
