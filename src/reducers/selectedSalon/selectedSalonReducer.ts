/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import SELECTED_SALON from './selectedSalonTypes'
import { ISelectedSalonActions, ISelectedSalonPayload } from './selectedSalonActions'

export const initState = {
	selectedSalon: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISelectedSalonPayload & ILoadingAndFailure
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
