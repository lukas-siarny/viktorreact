/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { CUSTOMER, CUSTOMERS } from './customerTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { IQueryParams } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

export type ICustomerActions = IResetStore | IGetCustomers | IGetCustomer

interface IGetCustomersQueryParams extends IQueryParams {
	salonID?: string | undefined | null
}

interface IGetCustomers {
	type: CUSTOMERS
	payload: ICustomersPayload
}

interface IGetCustomer {
	type: CUSTOMER
	payload: ICustomerPayload
}

export interface ICustomerPayload {
	data: Paths.GetApiB2BAdminCustomersCustomerId.Responses.$200 | null
}

export interface ICustomersPayload {
	data: Paths.GetApiB2BAdminCustomers.Responses.$200 | null
}

export const getCustomers =
	(queryParams: IGetCustomersQueryParams): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: CUSTOMERS.CUSTOMERS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/customers/', { ...normalizeQueryParams(queryParams) })

			const payload = {
				data
			}

			dispatch({ type: CUSTOMERS.CUSTOMERS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: CUSTOMERS.CUSTOMERS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const getCustomer =
	(customerID: string): ThunkResult<Promise<ICustomerPayload>> =>
	async (dispatch) => {
		let payload = {} as ICustomerPayload
		try {
			dispatch({ type: CUSTOMER.CUSTOMER_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/customers/{customerID}', { customerID })

			payload = {
				data
			}

			dispatch({ type: CUSTOMER.CUSTOMER_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: CUSTOMER.CUSTOMER_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
