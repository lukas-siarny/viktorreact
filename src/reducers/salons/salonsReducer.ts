/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { BASIC_SALON, SALON, SALONS, SUGGESTED_SALONS } from './salonsTypes'
import { IBasicSalonPayload, ISalonPayload, ISalonsActions, ISalonsPayload, ISuggestedSalonsPayload } from './salonsActions'

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
	} as ISuggestedSalonsPayload & ILoadingAndFailure,
	basicSalon: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IBasicSalonPayload & ILoadingAndFailure
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
		// Basic Salon
		case BASIC_SALON.BASIC_SALON_LOAD_START:
			return {
				...state,
				basicSalon: {
					...state.basicSalon,
					isLoading: true
				}
			}
		case BASIC_SALON.BASIC_SALON_LOAD_FAIL:
			return {
				...state,
				basicSalon: {
					...initState.basicSalon,
					isFailure: true
				}
			}
		case BASIC_SALON.BASIC_SALON_LOAD_DONE:
			return {
				...state,
				basicSalon: {
					...initState.basicSalon,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
