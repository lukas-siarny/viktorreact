import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { IServiceActions, IServicesPayload, IServicePayload, IServiceRootCategoryPayload } from './serviceActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SERVICES, SERVICE, SERVICE_ROOT_CATEGORY } from './serviceTypes'

export const initState = {
	services: {
		data: null,
		tableData: undefined,
		options: undefined,
		isLoading: false,
		isFailure: false
	} as IServicesPayload & ILoadingAndFailure,
	service: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IServicePayload & ILoadingAndFailure,
	serviceRootCategory: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IServiceRootCategoryPayload & ILoadingAndFailure
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
					data: action.payload.data,
					tableData: action.payload.tableData,
					options: action.payload.options
				}
			}
		// Service
		case SERVICE.SERVICE_LOAD_START:
			return {
				...state,
				service: {
					...state.service,
					isLoading: true
				}
			}
		case SERVICE.SERVICE_LOAD_FAIL:
			return {
				...state,
				service: {
					...initState.service,
					isFailure: true
				}
			}
		case SERVICE.SERVICE_LOAD_DONE:
			return {
				...state,
				service: {
					...initState.service,
					data: action.payload.data
				}
			}
		// Service root category
		case SERVICE_ROOT_CATEGORY.SERVICE_ROOT_CATEGORY_LOAD_START:
			return {
				...state,
				serviceRootCategory: {
					...state.service,
					isLoading: true
				}
			}
		case SERVICE_ROOT_CATEGORY.SERVICE_ROOT_CATEGORY_LOAD_FAIL:
			return {
				...state,
				serviceRootCategory: {
					...initState.service,
					isFailure: true
				}
			}
		case SERVICE_ROOT_CATEGORY.SERVICE_ROOT_CATEGORY_LOAD_DONE:
			return {
				...state,
				serviceRootCategory: {
					...initState.service,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
