/* eslint-disable import/no-cycle */
import { get, map, isEmpty } from 'lodash'

import { IResetStore } from '../generalTypes'

import { ThunkResult } from '../index'

// types
import { ENUMERATIONS } from './enumerationTypes'
import { IResponsePagination, ISelectOptionItem } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { ENUMERATIONS_KEYS, getTranslatedCountriesLabels } from '../../utils/enums'
import { Paths } from '../../types/api'

export type IEnumerationActions = IGetEnumerationsActions | IResetStore

interface IGetEnumerationsActions {
	type: ENUMERATIONS
	enumType: ENUMERATIONS_KEYS
	payload: IEnumerationsPayload
}

export interface IEnumerationOptions {
	key: string | number
	label: string
	value: string | number
	flag?: string
}

export interface IEnumerationsPayload {
	data: EnumerationData | null
	pagination: IResponsePagination | null
	enumerationsOptions: IEnumerationOptions[]
}

export interface ICountriesPayload {
	countriesPayload: IEnumerationsPayload
	countriesPhonePrefixPayload: IEnumerationsPayload
}

export type EnumerationData = Paths.GetApiB2BAdminEnumsCountries.Responses.$200['countries']

export const getCountries = (): ThunkResult<Promise<ICountriesPayload>> => async (dispatch) => {
	let countriesPhonePrefixPayload: IEnumerationsPayload = {} as IEnumerationsPayload
	let countriesPayload: IEnumerationsPayload = {} as IEnumerationsPayload
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
			flag: item.flag
		}))

		const countriesLabels = getTranslatedCountriesLabels()
		// prepare countries list with translated label
		const enumerationsCountriesOptions: ISelectOptionItem[] = map(data, (item) => {
			const countryLabel: string | null = countriesLabels?.[item.code]
			if (isEmpty(countryLabel)) {
				// eslint-disable-next-line no-console
				console.error(`Missing translation for country with code ${item.code}!`)
			}
			const countryCode = item.code?.toLowerCase()
			return {
				key: countryCode,
				label: countryLabel || countryCode,
				value: countryCode,
				flag: item.flag
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
