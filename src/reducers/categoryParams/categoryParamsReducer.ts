/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { CATEGORY_PARAMETERS } from './categoryParamsTypes'
import { ICategoryParametersActions, IParametersPayload } from './categoryParamsActions'

export const initState = {
	parameters: {
		data: undefined,
		enumerationsOptions: [],
		isLoading: false,
		isFailure: false
	} as IParametersPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICategoryParametersActions) => {
	switch (action.type) {
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
