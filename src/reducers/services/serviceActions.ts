/* eslint-disable import/no-cycle */
import { map } from 'lodash'

// types
import { ThunkResult } from '../index'
import { SERVICES, SERVICE } from './serviceTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { IUserAvatar, IQueryParams, ISearchablePayload } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { decodePrice, getServiceRange, normalizeQueryParams } from '../../utils/helper'

export type IServiceActions = IResetStore | IGetServices | IGetService

interface IGetServices {
	type: SERVICES
	payload: IServicesPayload
}

interface ServicesTableData {
	key: number
	serviceID: number
	name: string
	employees: IUserAvatar[]
	price: string
	duration: string
	category: string
	salon: string | undefined
}

export interface IGetServicesQueryParams extends IQueryParams {
	categoryID?: number | undefined | null
	employeeID?: number | undefined | null
	salonID?: number | undefined | null
}

export interface IServicesPayload extends ISearchablePayload<Paths.GetApiB2BAdminServices.Responses.$200> {
	tableData: ServicesTableData[] | undefined
}

export const getServices =
	(queryParams: IGetServicesQueryParams): ThunkResult<Promise<IServicesPayload>> =>
	async (dispatch) => {
		let payload = {} as IServicesPayload
		try {
			dispatch({ type: SERVICES.SERVICES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/services/', { ...normalizeQueryParams(queryParams) })
			const tableData: ServicesTableData[] = map(data.services, (item) => {
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
					price: getServiceRange(decodePrice(item.priceFrom), decodePrice(item.priceTo)),
					duration: getServiceRange(item.durationFrom, item.durationTo),
					category: item.category.name || '-',
					salon: item.salon.name
				}
				return tableItem
			})
			const servicesOptions = map(data.services, (service) => {
				return { label: service.name || `${service.id}`, value: service.id, key: `${service.id}-key` }
			})
			payload = {
				data,
				tableData,
				options: servicesOptions
			}

			dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
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
