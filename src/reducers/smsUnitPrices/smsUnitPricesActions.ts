/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { SMS_UNIT_PRICE, SMS_UNIT_PRICES, SMS_UNIT_PRICES_ACTUAL } from './smsUnitPricesTypes'
import { normalizeQueryParams } from '../../utils/helper'

// types
import { Paths } from '../../types/api'
import { IQueryParams, ISearchable } from '../../types/interfaces'

export type ISmsUnitPricesActions = IResetStore | IGetSmsUnitPricesActual | IGetSmsUnitPrices | IGetSmsUnitPrice

interface IGetSmsUnitPricesActual {
	type: SMS_UNIT_PRICES_ACTUAL
	payload: ISmsUnitPricesActualPayload
}

interface IGetSmsUnitPrices {
	type: SMS_UNIT_PRICES
	payload: ISmsUnitPricesPayload
}

interface IGetSmsUnitPrice {
	type: SMS_UNIT_PRICE
	payload: ISmsUnitPricePayload
}

export interface ISmsUnitPricesActualPayload {
	data: Paths.GetApiB2BAdminEnumsSmsUnitPricesActual.Responses.$200['actualSmsUnitPricesPerCounty'] | null
}

export interface ISmsUnitPricePayload {
	data: Paths.GetApiB2BAdminEnumsSmsUnitPricesSmsUnitPriceId.Responses.$200['smsUnitPrice'] | null
}

export interface ISmsUnitPricesPayload extends ISearchable<Paths.GetApiB2BAdminEnumsSmsUnitPrices.Responses.$200> {}

export interface IGetSmsUnitPricesQueryParams extends IQueryParams {
	countryCode: string
}

export const getSmsUnitPricesActual = (): ThunkResult<Promise<ISmsUnitPricesActualPayload>> => async (dispatch) => {
	let payload = {} as ISmsUnitPricesActualPayload
	try {
		dispatch({ type: SMS_UNIT_PRICES_ACTUAL.SMS_UNIT_PRICES_ACTUAL_START })
		const { data } = await getReq('/api/b2b/admin/enums/sms-unit-prices/actual', undefined)

		payload = {
			data: data.actualSmsUnitPricesPerCounty
		}

		dispatch({ type: SMS_UNIT_PRICES_ACTUAL.SMS_UNIT_PRICES_ACTUAL_DONE, payload })
	} catch (err) {
		dispatch({ type: SMS_UNIT_PRICES_ACTUAL.SMS_UNIT_PRICES_ACTUAL_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}

export const getSmsUnitPrices =
	(queryParams: IGetSmsUnitPricesQueryParams): ThunkResult<Promise<ISmsUnitPricesPayload>> =>
	async (dispatch) => {
		let payload = {} as ISmsUnitPricesPayload
		try {
			dispatch({ type: SMS_UNIT_PRICES.SMS_UNIT_PRICES_START })
			const { data } = await getReq('/api/b2b/admin/enums/sms-unit-prices/', {
				...normalizeQueryParams({ ...queryParams, countryCode: queryParams.countryCode })
			} as any)

			payload = {
				data
			}

			dispatch({ type: SMS_UNIT_PRICES.SMS_UNIT_PRICES_DONE, payload })
		} catch (err) {
			dispatch({ type: SMS_UNIT_PRICES.SMS_UNIT_PRICES_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getSmsUnitPrice =
	(smsUnitPriceID: string): ThunkResult<Promise<ISmsUnitPricePayload>> =>
	async (dispatch) => {
		let payload = {} as ISmsUnitPricePayload
		try {
			dispatch({ type: SMS_UNIT_PRICE.SMS_UNIT_PRICE_START })
			const { data } = await getReq('/api/b2b/admin/enums/sms-unit-prices/{smsUnitPriceID}', { smsUnitPriceID })

			payload = {
				data: data.smsUnitPrice
			}

			dispatch({ type: SMS_UNIT_PRICE.SMS_UNIT_PRICE_DONE, payload })
		} catch (err) {
			dispatch({ type: SMS_UNIT_PRICE.SMS_UNIT_PRICE_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
