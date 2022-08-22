/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SALON, SALONS, SALON_HISTORY } from './salonsTypes'
import { ISalonHistoryPayload, ISalonPayload, ISalonsActions, ISalonsPayload } from './salonsActions'

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
	salonHistory: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISalonHistoryPayload & ILoadingAndFailure
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
