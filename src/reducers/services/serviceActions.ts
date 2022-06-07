/* eslint-disable import/no-cycle */

// types
import { ThunkResult } from '../index'
import { SERVICES, SERVICE } from './serviceTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { IUserAvatar } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
// import { PERMISSION } from '../../utils/enums'
import { getServiceRange, normalizeQueryParams } from '../../utils/helper'

export type IServiceActions = IResetStore | IGetServices | IGetService

interface IGetServices {
	type: SERVICES
	payload: IServicesPayload
}

interface ServicesTableData {
	key: number
	name: string
	employees: IUserAvatar[]
	price: string
	duration: string
	category: string
	salon: string
}

export interface IServicesPayload {
	data: Paths.GetApiB2BAdminServices.Responses.$200 | null
	tableData: ServicesTableData[] | undefined
}

export const getServices =
	(page: number, limit?: any | undefined, order?: string | undefined, queryParams = {}): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: SERVICES.SERVICES_LOAD_START })
			const pageLimit = limit

			const { data } = await getReq('/api/b2b/admin/services/', { page: page || 1, limit: pageLimit, order, ...normalizeQueryParams(queryParams) })
			const tableData = data.services.map((item) => {
				const tableItem = {
					key: item.id,
					serviceID: item.id,
					name: item.name || '-',
					employees: item.employees.map((employee) => ({
						src: employee.image?.resizedImages?.thumbnail,
						alt: `${employee.firstName} ${employee.lastName}`,
						text: `${employee.firstName} ${employee.lastName}`,
						key: employee.id
					})),
					price: getServiceRange(item.priceFrom, item.priceTo),
					duration: getServiceRange(item.durationFrom, item.durationTo),
					category: item.category.name || '-',
					salon: item.salon.name
				}
				return tableItem
			})

			const payload = {
				data,
				tableData
			}

			dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

interface IGetService {
	type: SERVICE
	payload: IServicePayload
}

export interface IServicePayload {
	data: Paths.GetApiB2BAdminServicesServiceId.Responses.$200 | null
}

export const getService =
	(serviceID: number): ThunkResult<Promise<IServicePayload>> =>
	async (dispatch) => {
		let payload = {} as IServicePayload
		try {
			dispatch({
				type: SERVICE.SERVICE_LOAD_START
			})
			const { data } = await getReq('/api/b2b/admin/services/{serviceID}', { serviceID })
			payload = { data }

			dispatch({
				type: SERVICE.SERVICE_LOAD_DONE,
				payload
			})
		} catch (e) {
			dispatch({
				type: SERVICE.SERVICE_LOAD_FAIL
			})
		}
		return payload
	}
