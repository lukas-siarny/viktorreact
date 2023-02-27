/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ISmsUnitPricesActualPayload, ISmsUnitPricesPayload, ISmsUnitPricesActions } from './smsUnitPricesActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SMS_UNIT_PRICES, SMS_UNIT_PRICES_ACTUAL } from './smsUnitPricesTypes'

export const initState = {
	smsUnitPricesActual: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISmsUnitPricesActualPayload & ILoadingAndFailure,
	smsUnitPrices: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISmsUnitPricesPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISmsUnitPricesActions) => {
	switch (action.type) {
		case SMS_UNIT_PRICES_ACTUAL.SMS_UNIT_PRICES_ACTUAL_START:
			return {
				...state,
				smsUnitPricesActual: {
					...state.smsUnitPricesActual,
					isLoading: true
				}
			}
		case SMS_UNIT_PRICES_ACTUAL.SMS_UNIT_PRICES_ACTUAL_FAIL:
			return {
				...state,
				smsUnitPricesActual: {
					...initState.smsUnitPricesActual,
					isFailure: true
				}
			}
		case SMS_UNIT_PRICES_ACTUAL.SMS_UNIT_PRICES_ACTUAL_DONE:
			return {
				...state,
				smsUnitPricesActual: {
					...initState.smsUnitPricesActual,
					data: action.payload.data
				}
			}
		case SMS_UNIT_PRICES.SMS_UNIT_PRICES_START:
			return {
				...state,
				smsUnitPrices: {
					...state.smsUnitPrices,
					isLoading: true
				}
			}
		case SMS_UNIT_PRICES.SMS_UNIT_PRICES_FAIL:
			return {
				...state,
				smsUnitPrices: {
					...initState.smsUnitPrices,
					isFailure: true
				}
			}
		case SMS_UNIT_PRICES.SMS_UNIT_PRICES_DONE:
			return {
				...state,
				smsUnitPrices: {
					...initState.smsUnitPrices,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
