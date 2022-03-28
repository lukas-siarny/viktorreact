/* eslint-disable import/no-cycle */
import i18next from 'i18next'
import decode from 'jwt-decode'
import { get, map, flatten, uniq, join } from 'lodash'

// types
import { ThunkResult } from '../index'
import { ILoginForm, IJwtPayload, ICreatePasswordForm } from '../../types/interfaces'
import { SERVICES } from './serviceTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { history } from '../../utils/history'
import { getReq } from '../../utils/request'
// import { PERMISSION } from '../../utils/enums'
import { getServiceRange } from '../../utils/helper'

export type IServiceActions = IResetStore | IGetServices

interface IGetServices {
	type: SERVICES
	payload: IServicesPayload
}

interface ServicesTableData {
	key: number
	name: string
	employees: string
	price: string
	duration: string
	category: string
}

export interface IServicesPayload {
	originalData: Paths.GetApiB2BAdminServices.Responses.$200 | null
	tableData: ServicesTableData[] | undefined
}

export const getServices =
	(page: number, limit?: any | undefined, order?: string | undefined, search?: string | undefined | null): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: SERVICES.SERVICES_LOAD_START })
			const pageLimit = limit

			const { data } = await getReq(
				'/api/b2b/admin/services/',
				{}
				// { page: page || 1, limit: pageLimit, order, search }
			)
			const tableData = map(data.services, (item) => {
				const tableItem = {
					key: item.id,
					name: item.name || '-',
					employees: join(
						map(item.employees, (employee) => employee.name),
						'\n'
					),
					price: getServiceRange(item.priceFrom, item.priceTo),
					duration: getServiceRange(item.durationFrom, item.durationTo),
					category: item.category.name || '-'
				}
				return tableItem
			})
			const payload = {
				originalData: data,
				tableData
			}

			dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}
