/* eslint-disable import/no-cycle */
import { IEnumerationActions, IEnumerationsPayload } from './enumerationActions'
import { ENUMERATIONS } from './enumerationTypes'
import { ENUMERATIONS_KEYS } from '../../utils/enums'

// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'

export const initState = {
	[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]: {
		data: null,
		enumerationsOptions: [],
		pagination: null,
		isLoading: false,
		isFailure: false
	} as IEnumerationsPayload & ILoadingAndFailure,
	[ENUMERATIONS_KEYS.COUNTRIES]: {
		data: null,
		enumerationsOptions: [],
		pagination: null,
		isLoading: false,
		isFailure: false
	} as IEnumerationsPayload & ILoadingAndFailure,
	[ENUMERATIONS_KEYS.COUNTRIES_FILTER_OPTIONS]: {
		data: null,
		enumerationsOptions: [],
		pagination: null,
		isLoading: false,
		isFailure: false
	} as IEnumerationsPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IEnumerationActions) => {
	switch (action.type) {
		case ENUMERATIONS.ENUMERATIONS_LOAD_START:
			return {
				...state,
				[action.enumType]: {
					...state[action.enumType],
					isFailure: false,
					isLoading: true
				}
			}
		case ENUMERATIONS.ENUMERATIONS_LOAD_FAIL:
			return {
				...state,
				[action.enumType]: {
					...initState[action.enumType],
					isFailure: true
				}
			}
		case ENUMERATIONS.ENUMERATIONS_LOAD_DONE:
			return {
				...state,
				[action.enumType]: {
					...initState[action.enumType],
					data: action.payload.data,
					enumerationsOptions: action.payload.enumerationsOptions,
					pagination: action.payload.pagination
				}
			}
		default:
			return state
	}
}
