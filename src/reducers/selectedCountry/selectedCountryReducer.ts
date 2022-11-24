import { RESET_STORE } from '../generalTypes'
import { ISelectedCountryActions } from './selectedCountryActions'

// types
import { SELECTED_COUNTRY } from './selectedCountryTypes'

export const initState = {
	selectedCountry: undefined as string | undefined
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISelectedCountryActions) => {
	switch (action.type) {
		case SELECTED_COUNTRY.SELECTED_COUNTRY_UPDATE:
			return {
				...state,
				selectedCountry: action.selectedCountry
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
