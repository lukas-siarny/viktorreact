/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { CATEGORY_PARAMETER, CATEGORY_PARAMETERS } from './categoryParamsTypes'
import { ICategoryParametersActions, IParametersPayload, IParameterPayload } from './categoryParamsActions'

export const initState = {
	parameters: {
		data: undefined,
		enumerationsOptions: [],
		isLoading: false,
		isFailure: false
	} as IParametersPayload & ILoadingAndFailure,
	parameter: {
		data: undefined,
		isLoading: false,
		isFailure: false
	} as IParameterPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICategoryParametersActions) => {
	switch (action.type) {
		// Parameters
		case CATEGORY_PARAMETERS.CATEGORY_PARAMETERS_LOAD_START:
			return {
				...state,
				parameters: {
					...state.parameters,
					isLoading: true
				}
			}
		case CATEGORY_PARAMETERS.CATEGORY_PARAMETERS_LOAD_FAIL:
			return {
				...state,
				parameters: {
					...initState.parameters,
					isFailure: true
				}
			}
		case CATEGORY_PARAMETERS.CATEGORY_PARAMETERS_LOAD_DONE:
			return {
				...state,
				parameters: {
					...initState.parameters,
					enumerationsOptions: action.payload.enumerationsOptions,
					data: action.payload.data
				}
			}
		// Parameter detail
		case CATEGORY_PARAMETER.CATEGORY_PARAMETER_LOAD_START:
			return {
				...state,
				parameter: {
					...state.parameter,
					isLoading: true
				}
			}
		case CATEGORY_PARAMETER.CATEGORY_PARAMETER_LOAD_FAIL:
			return {
				...state,
				parameter: {
					...initState.parameter,
					isFailure: true
				}
			}
		case CATEGORY_PARAMETER.CATEGORY_PARAMETER_LOAD_DONE:
			return {
				...state,
				parameter: {
					...initState.parameter,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
