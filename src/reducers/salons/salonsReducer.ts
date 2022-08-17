/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SALON, SALONS, SUGGESTED_SALONS } from './salonsTypes'
import { ISalonPayload, ISalonsActions, ISalonsPayload, ISuggestedSalonsPayload } from './salonsActions'

export const initState = {
	salons: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISalonsPayload & ILoadingAndFailure,
	salon: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISalonPayload & ILoadingAndFailure,
	suggestedSalons: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISuggestedSalonsPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISalonsActions) => {
	switch (action.type) {
		// Salons
		case SALONS.SALONS_LOAD_START:
			return {
				...state,
				salons: {
					...state.salons,
					isLoading: true
				}
			}
		case SALONS.SALONS_LOAD_FAIL:
			return {
				...state,
				salons: {
					...initState.salons,
					isFailure: true
				}
			}
		case SALONS.SALONS_LOAD_DONE:
			return {
				...state,
				salons: {
					...initState.salons,
					data: action.payload.data
				}
			}
		// Salon
		case SALON.SALON_LOAD_START:
			return {
				...state,
				salon: {
					...state.salon,
					isLoading: true
				}
			}
		case SALON.SALON_LOAD_FAIL:
			return {
				...state,
				salon: {
					...initState.salon,
					isFailure: true
				}
			}
		case SALON.SALON_LOAD_DONE:
			return {
				...state,
				salon: {
					...initState.salon,
					data: action.payload.data
				}
			}
		// Suggested salons
		case SUGGESTED_SALONS.SUGGESTED_SALONS_LOAD_START:
			return {
				...state,
				suggestedSalons: {
					...state.suggestedSalons,
					isLoading: true
				}
			}
		case SUGGESTED_SALONS.SUGGESTED_SALONS_LOAD_FAIL:
			return {
				...state,
				suggestedSalons: {
					...initState.suggestedSalons,
					isFailure: true
				}
			}
		case SUGGESTED_SALONS.SUGGESTED_SALONS_LOAD_DONE:
			return {
				...state,
				suggestedSalons: {
					...initState.suggestedSalons,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
