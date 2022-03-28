import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { IServiceActions, IServicesPayload } from './serviceActions'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { SERVICES } from './serviceTypes'

export const initState = {
	services: {
		originalData: null,
		tableData: undefined,
		isLoading: false,
		isFailure: false
	} as IServicesPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IServiceActions) => {
	switch (action.type) {
		// Services
		case SERVICES.SERVICES_LOAD_START:
			return {
				...state,
				services: {
					...state.services,
					isLoading: true
				}
			}
		case SERVICES.SERVICES_LOAD_FAIL:
			return {
				...state,
				services: {
					...initState.services,
					isFailure: true
				}
			}
		case SERVICES.SERVICES_LOAD_DONE:
			return {
				...state,
				services: {
					...initState.services,
					originalData: action.payload.originalData,
					tableData: action.payload.tableData
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
