// types
import { ThunkResult } from '../index'
import { CUSTOMERS } from './customerTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { getReq } from '../../utils/request'
// import { PERMISSION } from '../../utils/enums'
import { normalizeQueryParams } from '../../utils/helper'

export type ICustomerActions = IResetStore | IGetCustomers

interface IGetCustomers {
	type: CUSTOMERS
	payload: ICustomersPayload
}

export interface ICustomersPayload {
	data: Paths.GetApiB2BAdminCustomers.Responses.$200 | null
}

export const getCustomers =
	(page: number, limit?: any | undefined, order?: string | undefined, queryParams = {}): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: CUSTOMERS.CUSTOMERS_LOAD_START })
			const pageLimit = limit

			const { data } = await getReq('/api/b2b/admin/customers/', { page: page || 1, limit: pageLimit, order, ...normalizeQueryParams(queryParams) })

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
