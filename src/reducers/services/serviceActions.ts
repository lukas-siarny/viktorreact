/* eslint-disable import/no-cycle */
import i18next from 'i18next'

// types
import { ThunkResult } from '../index'
import { SERVICES, SERVICE, SERVICE_ROOT_CATEGORY } from './serviceTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { IUserAvatar, ISearchableWithoutPagination, ISelectOptionItem } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { decodePrice, getServiceRange } from '../../utils/helper'

export type IServiceActions = IResetStore | IGetServices | IGetService | IGetServiceRootCategory

interface IGetServices {
	type: SERVICES
	payload: IServicesPayload
}

interface IGetService {
	type: SERVICE
	payload: IServicePayload
}

interface IGetServiceRootCategory {
	type: SERVICE_ROOT_CATEGORY
	payload: IServiceRootCategoryPayload
}

interface ServicesTableData {
	key: string
	serviceID: string
	name: string
	employees: IUserAvatar[]
	price: string
	duration: string
	categoryFirst: string
	categorySecond: string
	isComplete: boolean
	createdAt: string
}

export interface IGetServicesQueryParams {
	rootCategoryID?: string
	salonID: string
}

export interface IGetServiceRootCategoryQueryParams {
	rootCategoryID: string
	salonID: string
}

export interface IServicesPayload extends ISearchableWithoutPagination<Paths.GetApiB2BAdminServices.Responses.$200> {
	tableData: ServicesTableData[] | undefined
	options: ISelectOptionItem[]
	categoriesOptions: ISelectOptionItem[]
}

export interface IServiceRootCategoryPayload {
	data: Paths.GetApiB2BAdminServices.Responses.$200['groupedServicesByCategory'][0] | null
}

export const getServices =
	(queryParams: IGetServicesQueryParams): ThunkResult<Promise<IServicesPayload>> =>
	async (dispatch, getState) => {
		let payload = {} as IServicesPayload
		const state = getState()
		try {
			dispatch({ type: SERVICES.SERVICES_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/services/', queryParams)
			const categories = data.groupedServicesByCategory
			const tableData: ServicesTableData[] = []
			categories?.forEach((parentCategory) => {
				parentCategory?.category?.children?.forEach((secondCategory) => {
					secondCategory?.category?.children?.forEach((thirdCategory) => {
						const rangePriceAndDurationData = thirdCategory?.service?.rangePriceAndDurationData
						const currencies = state.enumerationsStore.currencies.data
						const symbol =
							currencies?.find((currency) => currency.code === thirdCategory?.service?.rangePriceAndDurationData?.priceFrom?.currency)?.symbol ||
							thirdCategory?.service?.rangePriceAndDurationData?.priceFrom?.currency

						tableData.push({
							key: thirdCategory?.category?.id,
							serviceID: thirdCategory?.service?.id,
							name: thirdCategory?.category?.name || '-',
							categoryFirst: parentCategory?.category?.name || '-',
							categorySecond: secondCategory?.category?.name || '-',
							employees: thirdCategory?.service?.employees?.map((employee) => {
								// TODO: remove any when BE will be done
								const employeeName =
									`${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() ||
									(employee as any).email ||
									(employee as any).inviteEmail ||
									'-'

								return {
									src: employee.image?.resizedImages?.thumbnail,
									fallBackSrc: employee.image?.original,
									alt: employeeName,
									text: employeeName,
									key: employee.id
								}
							}),
							price: getServiceRange(decodePrice(rangePriceAndDurationData?.priceFrom), decodePrice(rangePriceAndDurationData?.priceTo), symbol) || '-',
							duration: getServiceRange(rangePriceAndDurationData?.durationFrom, rangePriceAndDurationData?.durationTo, i18next.t('loc:min')) || '-',
							isComplete: thirdCategory?.service?.isComplete,
							createdAt: thirdCategory?.service?.createdAt
						})
					})
				})
			})

			const servicesOptions: ISelectOptionItem[] = []
			const categoriesOptions: ISelectOptionItem[] = []

			data.groupedServicesByCategory.forEach((firstCategory) =>
				firstCategory?.category?.children.forEach((secondCategory) => {
					if (secondCategory?.category) {
						categoriesOptions.push({
							key: secondCategory.category.id,
							label: secondCategory.category.name || secondCategory.category.id,
							value: secondCategory.category.id
						})
					}
					secondCategory.category?.children.forEach((service) => {
						servicesOptions.push({
							key: service.service.id,
							label: service.category.name || service.category.id,
							value: service.service.id,
							extra: {
								firstCategory: firstCategory?.category?.name,
								secondCategory: secondCategory?.category?.name,
								rangePriceAndDurationData: service.service?.rangePriceAndDurationData,
								serviceCategoryParameter: service.service?.serviceCategoryParameter
							}
						})
					})
				})
			)
			payload = {
				data,
				tableData,
				options: servicesOptions,
				categoriesOptions
			}

			dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getServiceRootCategory =
	(queryParams: IGetServiceRootCategoryQueryParams): ThunkResult<Promise<IServiceRootCategoryPayload>> =>
	async (dispatch) => {
		let payload = {} as IServiceRootCategoryPayload
		try {
			dispatch({ type: SERVICES.SERVICES_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/services/', queryParams)

			payload = {
				data: data as IServiceRootCategoryPayload['data']
			}

			dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export interface IServicePayload {
	data: Paths.GetApiB2BAdminServicesServiceId.Responses.$200 | null
}

export const getService =
	(serviceID: string): ThunkResult<Promise<IServicePayload>> =>
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
