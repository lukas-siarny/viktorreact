/* eslint-disable import/no-cycle */
import { get, map } from 'lodash'

import { IResetStore } from '../generalTypes'

import { ThunkResult } from '../index'

// types
import { ENUMERATIONS } from './enumerationTypes'
import { IResponsePagination, ISelectOptionItem } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import {
	ENUMERATIONS_KEYS
	// ENUMERATIONS_OPTIONS,
	// EXPIRATION_TYPE,
	// LINE_TYPE,
	// PAGINATION,
	// PRICELIST_ITEM_CATEGORY,
	// PRICELIST_ITEM_TIME_RELATION,
	// PRICELIST_ITEM_UNIT_RELATION,
	// PRICELIST_ITEM_USAGE,
	// PROPERTY_TYPE,
	// PROPERTY_USAGE,
	// TEXT_TEMPLATE_TYPE,
	// UNIT_TEMPLATE_FACILITY_TYPE,
	// UNIT_TEMPLATE_TYPE,
	// WEB_PROJECT_CODE
} from '../../utils/enums'
// import { timezones } from '../../utils/timezones'
// import { formatUTCOffset } from '../../utils/helper'
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

export type EnumerationData = Paths.GetApiB2BAdminEnumsCountries.Responses.$200['countries']

export const getCountries =
	(enumType: ENUMERATIONS_KEYS): ThunkResult<Promise<IEnumerationsPayload>> =>
	async (dispatch) => {
		let payload = {} as IEnumerationsPayload
		try {
			dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_START, enumType })
			let enumerationsOptions: ISelectOptionItem[] = []

			const response = await getReq('/api/b2b/admin/enums/countries', undefined, undefined, undefined, undefined, true)
			const data: any[] = map(get(response, `data.${enumType}`, []), (item, index) => ({
				key: index + 1,
				...item
			}))

			enumerationsOptions = map(data, (item) => ({
				key: item.code,
				label: item.phonePrefix,
				value: item.code,
				flag: item.flag
			}))

			payload = {
				data,
				enumerationsOptions,
				pagination: get(response, 'data.pagination')
			}
			dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_DONE, enumType, payload })
		} catch (e) {
			dispatch({ type: ENUMERATIONS.ENUMERATIONS_LOAD_FAIL, enumType })
		}
		return payload
	}
