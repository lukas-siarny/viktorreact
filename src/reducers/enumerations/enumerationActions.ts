/* eslint-disable import/no-cycle */
import { get, map } from 'lodash'
import i18next from 'i18next'

import { IResetStore } from '../generalTypes'

import { ThunkResult } from '../index'

// types
import { ENUMERATIONS } from './enumerationTypes'
import { IResponsePagination, ISelectOptionItem } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { ENUMERATIONS_KEYS, getTranslatedCountryLabel } from '../../utils/enums'
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

		const enumerationsPhonePrefixOptions: ISelectOptionItem[] = map(data, (item) => ({
			key: item.code,
			label: item.phonePrefix,
			value: item.code,
			flag: item.flag
		}))

		// prepare countries list with translated label
		const enumerationsCountriesOptions: ISelectOptionItem[] = map(data, (item) => {
			return {
				key: item.code,
				label: getTranslatedCountryLabel()?.[item.code],
				value: item.code,
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
