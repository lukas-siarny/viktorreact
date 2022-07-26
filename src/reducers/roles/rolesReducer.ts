import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { IRolesActions, IRolesPayload } from './rolesActions'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { SYSTEM_ROLES, SALON_ROLES } from './rolesTypes'

export const initState = {
	systemRoles: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IRolesPayload & ILoadingAndFailure,
	salonRoles: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IRolesPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IRolesActions) => {
	switch (action.type) {
		// System roles
		case SYSTEM_ROLES.SYSTEM_ROLES_LOAD_START:
			return {
				...state,
				systemRoles: {
					...state.systemRoles,
					isLoading: true
				}
			}
		case SYSTEM_ROLES.SYSTEM_ROLES_LOAD_FAIL:
			return {
				...state,
				systemRoles: {
					...initState.systemRoles,
					isFailure: true
				}
			}
		case SYSTEM_ROLES.SYSTEM_ROLES_LOAD_DONE:
			return {
				...state,
				systemRoles: {
					...initState.systemRoles,
					data: action.payload.data
				}
			}
		// Salon roles
		case SALON_ROLES.SALON_ROLES_LOAD_START:
			return {
				...state,
				salonRoles: {
					...state.salonRoles,
					isLoading: true
				}
			}
		case SALON_ROLES.SALON_ROLES_LOAD_FAIL:
			return {
				...state,
				salonRoles: {
					...initState.salonRoles,
					isFailure: true
				}
			}
		case SALON_ROLES.SALON_ROLES_LOAD_DONE:
			return {
				...state,
				salonRoles: {
					...initState.salonRoles,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
