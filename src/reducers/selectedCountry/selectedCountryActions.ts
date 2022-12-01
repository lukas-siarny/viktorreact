/* eslint-disable import/no-cycle */
import { ThunkResult } from '..'
import { IResetStore } from '../generalTypes'
import SELECTED_COUNTRY from './selectedCountryTypes'

export type ISelectedCountryActions = IResetStore | ISelectedCountry

export interface ISelectedCountry {
	type: SELECTED_COUNTRY
	selectedCountry: string | undefined
}

export const setSelectedCountry =
	(countryCode?: string): ThunkResult<void> =>
	(dispatch) => {
		dispatch({ type: SELECTED_COUNTRY.SELECTED_COUNTRY_UPDATE, selectedCountry: countryCode })
	}
