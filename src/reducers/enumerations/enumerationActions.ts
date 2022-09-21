/* eslint-disable import/no-cycle */
import { get, map } from 'lodash'
import { DEFAULT_LANGUAGE, ENUMERATIONS_KEYS } from '../../utils/enums'
/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'
import { ThunkResult } from '../index'

// types
import { ENUMERATIONS } from './enumerationTypes'
import { IResponsePagination, ISelectOptionItem } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { Paths } from '../../types/api'
import i18n from '../../utils/i18n'

export type IEnumerationActions = IGetEnumerationsActions | IResetStore

interface IGetEnumerationsActions {
	type: ENUMERATIONS
	enumType: ENUMERATIONS_KEYS
	payload: IEnumerationsCurrenciesPayload | IEnumerationsCountriesPayload
}

export interface IEnumerationOptions {
	key: string | number
	label: string
	value: string | number
	flag?: string
}

export interface IEnumerationsPayload {
	pagination: IResponsePagination | null
	enumerationsOptions: IEnumerationOptions[]
}

export interface IEnumerationsCountriesPayload extends IEnumerationsPayload {
	data: CountriesData | null
}

export interface ICountriesPayload {
	countriesPayload: IEnumerationsCountriesPayload
	countriesPhonePrefixPayload: IEnumerationsCountriesPayload
}

export interface IEnumerationsCurrenciesPayload extends IEnumerationsPayload {
	data: CurrenciesData | null
}

export type CountriesData = Paths.GetApiB2BAdminEnumsCountries.Responses.$200['countries']

export type CurrenciesData = Paths.GetApiB2BAdminEnumsCurrencies.Responses.$200['currencies']

export const getCountries = (): ThunkResult<Promise<ICountriesPayload>> => async (dispatch) => {
	let countriesPhonePrefixPayload: IEnumerationsCountriesPayload = {} as IEnumerationsCountriesPayload
	let countriesPayload: IEnumerationsCountriesPayload = {} as IEnumerationsCountriesPayload
	try {
		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_START, enumType: ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX })
		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_START, enumType: ENUMERATIONS_KEYS.COUNTRIES })

		const response = await getReq('/api/b2b/admin/enums/countries', undefined, undefined, undefined, undefined, true)
		const data: any[] = map(get(response, 'data.countries', []), (item, index) => ({
			key: index + 1,
			...item
		}))

		const enumerationsPhonePrefixOptions: IEnumerationOptions[] = map(data, (item) => ({
			key: item.code,
			label: item.phonePrefix,
			value: item.code,
			extra: {
				image: item.flag
			}
		}))

		const currentLng = i18n.language || DEFAULT_LANGUAGE

		const enumerationsCountriesOptions: ISelectOptionItem[] = map(data, (item) => {
			const countryTranslation = item.nameLocalizations.find((translation: any) => translation.language === currentLng)

			return {
				key: item.code,
				label: countryTranslation?.value || item.code,
				value: item.code,
				extra: {
					image: item.flag
				}
			}
		})

		countriesPhonePrefixPayload = {
			data,
			enumerationsOptions: enumerationsPhonePrefixOptions,
			pagination: get(response, 'data.pagination')
		}

		countriesPayload = {
			data,
			enumerationsOptions: enumerationsCountriesOptions,
			pagination: get(response, 'data.pagination')
		}

		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_DONE, enumType: ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX, payload: { ...countriesPhonePrefixPayload } })
		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_DONE, enumType: ENUMERATIONS_KEYS.COUNTRIES, payload: { ...countriesPayload } })
	} catch (e) {
		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_FAIL, enumType: ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX })
		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_FAIL, enumType: ENUMERATIONS_KEYS.COUNTRIES })
	}
	return { countriesPayload, countriesPhonePrefixPayload }
}

export const getCurrencies = (): ThunkResult<Promise<IEnumerationsCurrenciesPayload>> => async (dispatch) => {
	let payload: IEnumerationsCurrenciesPayload = {} as IEnumerationsCurrenciesPayload

	try {
		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_START, enumType: ENUMERATIONS_KEYS.CURRENCIES })
		const response = await getReq('/api/b2b/admin/enums/currencies', undefined, undefined, undefined, undefined, true)

		const data: any[] = map(get(response, 'data.currencies', []), (item, index) => ({
			key: index + 1,
			...item
		}))

		payload = {
			data,
			pagination: get(response, 'data.pagination'),
			enumerationsOptions: []
		}

		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_DONE, enumType: ENUMERATIONS_KEYS.CURRENCIES, payload: { ...payload } })
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
		dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_FAIL, enumType: ENUMERATIONS_KEYS.CURRENCIES })
	}
	return payload
}
