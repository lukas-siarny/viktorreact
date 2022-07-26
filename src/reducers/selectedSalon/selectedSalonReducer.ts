/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SELECTED_SALON, SALON_OPTIONS } from './selectedSalonTypes'
import { ISelectedSalonActions, ISelectedSalonPayload, ISalonSelectionOptionsPayload } from './selectedSalonActions'

export const initState = {
	selectedSalon: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISelectedSalonPayload & ILoadingAndFailure,
	selectionOptions: {
		data: null
	} as ISalonSelectionOptionsPayload
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISelectedSalonActions) => {
	switch (action.type) {
		case SELECTED_SALON.SELECTED_SALON_LOAD_START:
			return {
				...state,
				selectedSalon: {
					...state.selectedSalon,
					isLoading: true
				}
			}
		case SELECTED_SALON.SELECTED_SALON_LOAD_FAIL:
			return {
				...state,
				selectedSalon: {
					...initState.selectedSalon,
					isFailure: true
				}
			}
		case SELECTED_SALON.SELECTED_SALON_LOAD_DONE:
			return {
				...state,
				selectedSalon: {
					...initState.selectedSalon,
					data: action.payload.data
				}
			}
		case SELECTED_SALON.SELECTED_SALON_CLEAR:
			return {
				...state,
				selectedSalon: {
					...initState.selectedSalon
				}
			}
		// Selection options
		case SALON_OPTIONS.SALON_OPTIONS_UPDATE:
			return {
				...state,
				selectionOptions: {
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
