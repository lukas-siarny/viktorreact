/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { BASIC_SALON, BASIC_SALONS, SALON, SALONS, SUGGESTED_SALONS, SALON_HISTORY, REJECTED_SUGGESTIONS, RESERVATIONS } from './salonsTypes'
import {
	IBasicSalonPayload,
	IBasicSalonsPayload,
	ISalonPayload,
	ISalonsActions,
	ISalonsPayload,
	ISuggestedSalonsPayload,
	ISalonHistoryPayload,
	IRejectedSuggestionsPayload,
	ISalonReservationsPayload
} from './salonsActions'

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
	basicSalons: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IBasicSalonsPayload & ILoadingAndFailure,
	basicSalon: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IBasicSalonPayload & ILoadingAndFailure,
	salonHistory: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISalonHistoryPayload & ILoadingAndFailure,
	rejectedSuggestions: {
		data: null,
		tableData: undefined,
		isLoading: false,
		isFailure: false
	} as IRejectedSuggestionsPayload & ILoadingAndFailure,
	reservations: {
		data: null,
		tableData: undefined,
		isLoading: false,
		isFailure: false
	} as ISalonReservationsPayload & ILoadingAndFailure
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
		// Basic salons
		case BASIC_SALONS.BASIC_SALONS_LOAD_START:
			return {
				...state,
				basicSalons: {
					...state.basicSalons,
					isLoading: true
				}
			}
		case BASIC_SALONS.BASIC_SALONS_LOAD_FAIL:
			return {
				...state,
				basicSalons: {
					...initState.basicSalons,
					isFailure: true
				}
			}
		case BASIC_SALONS.BASIC_SALONS_LOAD_DONE:
			return {
				...state,
				basicSalons: {
					...initState.basicSalons,
					data: action.payload.data
				}
			}
		// Basic salon
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
		// Salon history
		case SALON_HISTORY.SALON_HISTORY_LOAD_START:
			return {
				...state,
				salonHistory: {
					...state.salonHistory,
					isLoading: true
				}
			}
		case SALON_HISTORY.SALON_HISTORY_LOAD_FAIL:
			return {
				...state,
				salonHistory: {
					...initState.salonHistory,
					isFailure: true
				}
			}
		case SALON_HISTORY.SALON_HISTORY_LOAD_DONE:
			return {
				...state,
				salonHistory: {
					...initState.salonHistory,
					data: action.payload.data
				}
			}
		// Rejected suggestions
		case REJECTED_SUGGESTIONS.REJECTED_SUGGESTIONS_LOAD_START:
			return {
				...state,
				rejectedSuggestions: {
					...state.rejectedSuggestions,
					isLoading: true
				}
			}
		case REJECTED_SUGGESTIONS.REJECTED_SUGGESTIONS_LOAD_FAIL:
			return {
				...state,
				rejectedSuggestions: {
					...initState.rejectedSuggestions,
					isFailure: true
				}
			}
		case REJECTED_SUGGESTIONS.REJECTED_SUGGESTIONS_LOAD_DONE:
			return {
				...state,
				rejectedSuggestions: {
					...initState.rejectedSuggestions,
					data: action.payload.data,
					tableData: action.payload.tableData
				}
			}
		// Reservations
		case RESERVATIONS.RESERVATIONS_LOAD_START:
			return {
				...state,
				reservations: {
					...state.reservations,
					isLoading: true
				}
			}
		case RESERVATIONS.RESERVATIONS_LOAD_FAIL:
			return {
				...state,
				reservations: {
					...initState.reservations,
					isFailure: true
				}
			}
		case RESERVATIONS.RESERVATIONS_LOAD_DONE:
			return {
				...state,
				reservations: {
					...initState.reservations,
					data: action.payload.data,
					tableData: action.payload.tableData
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
