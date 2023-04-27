/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { IServiceActions, IServicesPayload, IServicePayload } from './serviceActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SERVICES, SERVICE, SET_SERVICES_ACTIVE_KEYS } from './serviceTypes'
import { SERVICES_LIST_INIT } from '../../utils/enums'

export const initState = {
	services: {
		data: null,
		listData: SERVICES_LIST_INIT,
		servicesActiveKeys: null,
		options: [],
		categoriesOptions: [],
		isLoading: false,
		isFailure: false
	} as IServicesPayload & ILoadingAndFailure,
	service: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IServicePayload & ILoadingAndFailure
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
					listData: action.payload.listData,
					options: action.payload.options,
					categoriesOptions: action.payload.categoriesOptions
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
		// set active keys
		case SET_SERVICES_ACTIVE_KEYS:
			return {
				...state,
				services: {
					...state.services,
					servicesActiveKeys: action.payload
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
