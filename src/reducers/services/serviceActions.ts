/* eslint-disable import/no-cycle */
import i18next from 'i18next'

// types
import { ThunkResult } from '../index'
import { SERVICES, SERVICE, SET_SERVICES_ACTIVE_KEYS } from './serviceTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { IUserAvatar, ISearchableWithoutPagination, ISelectOptionItem, ServicesActiveKeys } from '../../types/interfaces'
import { IGetServicesQueryParams } from '../../schemas/queryParams'

// utils
import { getReq } from '../../utils/request'
import { getAssignedUserLabel, decodePrice, getServiceRange, normalizeQueryParams } from '../../utils/helper'
import { SERVICES_LIST_INIT, SERVICE_ROW_KEY } from '../../utils/enums'

export type IServiceActions = IResetStore | IGetServices | IGetService | ISetServicesActiveKeys

interface IGetServices {
	type: SERVICES
	payload: IServicesPayload
}

interface IGetService {
	type: SERVICE
	payload: IServicePayload
}
interface ISetServicesActiveKeys {
	type: typeof SET_SERVICES_ACTIVE_KEYS
	payload: ServicesActiveKeysPayload
}

export interface IServicesListService {
	key: string
	id: string
	categoryID: string
	name: string
	employees: IUserAvatar[]
	price: string
	duration: string
	isAvailableForOnlineReservations: boolean
	isVisibleInPricelist: boolean
	automaticApproval: boolean
}

export type IServicesListCategoryItem<T> = {
	servicesCount: number
	servicesAvailableForOnlineReservationsCount: number
	servicesVisibleInPricelistCount: number
	data: T[]
}

export interface IServicesListCategory {
	id: string
	name: string
	services: IServicesListCategoryItem<IServicesListService>
}

export interface IServicesListInudstry {
	id: string
	name: string
	categories: IServicesListCategoryItem<IServicesListCategory>
}

export interface IServicesListData {
	industries: IServicesListCategoryItem<IServicesListInudstry>
}

export type ServicesActiveKeysPayload = (ServicesActiveKeys & { salonID: string }) | null

export interface IServicesPayload extends ISearchableWithoutPagination<Paths.GetApiB2BAdminServices.Responses.$200> {
	listData: IServicesListData
	options: ISelectOptionItem[]
	categoriesOptions: ISelectOptionItem[]
	servicesActiveKeys: ServicesActiveKeysPayload
}

export const getServices =
	(queryParams: IGetServicesQueryParams): ThunkResult<Promise<IServicesPayload>> =>
	async (dispatch, getState) => {
		let payload = {} as IServicesPayload
		const state = getState()
		try {
			dispatch({ type: SERVICES.SERVICES_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/services/', { ...normalizeQueryParams(queryParams) } as any)
			const categories = data.groupedServicesByCategory

			const currencies = state.enumerationsStore.currencies.data

			const listData = categories?.reduce((result, firstLevelCategory) => {
				const { category: industry } = firstLevelCategory
				if (industry) {
					const industryData: IServicesListInudstry = {
						id: industry.id,
						name: industry.name || '-',
						categories: industry.children.reduce(
							(categoriesResult, secondLevelCategory) => {
								const { category } = secondLevelCategory
								if (category) {
									const categoryData: IServicesListCategory = {
										id: category.id,
										name: category.name || '-',
										services: category.children.reduce(
											(servicesResult, thirdLevelCategory) => {
												const { rangePriceAndDurationData } = thirdLevelCategory.service
												const symbol =
													currencies?.find((currency) => currency.code === rangePriceAndDurationData.priceFrom?.currency)?.symbol ||
													rangePriceAndDurationData.priceFrom?.currency

												const isAvailableForOnlineReservations = Math.random() < 0.5
												const isVisibleInPricelist = thirdLevelCategory.service.isComplete

												const serviceData: IServicesListService = {
													id: thirdLevelCategory.service.id,
													key: SERVICE_ROW_KEY(thirdLevelCategory.category.id, thirdLevelCategory.service.id), // NOTE: zachovat tvar, vyuziva sa ako selector pri testovani nastaveni sluzieb
													categoryID: thirdLevelCategory.category.id,
													name: thirdLevelCategory.category.name || '-',
													employees: thirdLevelCategory.service.employees.map((employee) => {
														const employeeName = getAssignedUserLabel({
															firstName: employee.firstName,
															lastName: employee.lastName,
															email: employee.email,
															id: employee.id
														})

														return {
															src: employee.image.resizedImages.thumbnail,
															fallBackSrc: employee.image.original,
															alt: employeeName,
															text: employeeName,
															key: employee.id
														}
													}),
													price:
														getServiceRange(decodePrice(rangePriceAndDurationData.priceFrom), decodePrice(rangePriceAndDurationData.priceTo), symbol) ||
														'-',
													duration:
														getServiceRange(rangePriceAndDurationData.durationFrom, rangePriceAndDurationData.durationTo, i18next.t('loc:min')) || '-',
													isAvailableForOnlineReservations,
													isVisibleInPricelist,
													automaticApproval: Math.random() < 0.5
												}
												return {
													data: [...servicesResult.data, serviceData],
													servicesCount: servicesResult.servicesCount + 1,
													servicesVisibleInPricelistCount: isVisibleInPricelist
														? servicesResult.servicesVisibleInPricelistCount + 1
														: servicesResult.servicesVisibleInPricelistCount,
													servicesAvailableForOnlineReservationsCount: isAvailableForOnlineReservations
														? servicesResult.servicesAvailableForOnlineReservationsCount + 1
														: servicesResult.servicesAvailableForOnlineReservationsCount
												}
											},
											{
												data: [],
												servicesCount: 0,
												servicesAvailableForOnlineReservationsCount: 0,
												servicesVisibleInPricelistCount: 0
											} as IServicesListCategoryItem<IServicesListService>
										)
									}
									return {
										data: [...categoriesResult.data, categoryData],
										servicesCount: categoriesResult.servicesCount + categoryData.services.servicesCount,
										servicesVisibleInPricelistCount: categoriesResult.servicesVisibleInPricelistCount + categoryData.services.servicesVisibleInPricelistCount,
										servicesAvailableForOnlineReservationsCount:
											categoriesResult.servicesAvailableForOnlineReservationsCount + categoryData.services.servicesAvailableForOnlineReservationsCount
									}
								}
								return categoriesResult
							},
							{
								data: [],
								servicesCount: 0,
								servicesAvailableForOnlineReservationsCount: 0,
								servicesVisibleInPricelistCount: 0
							} as IServicesListCategoryItem<IServicesListCategory>
						)
					}

					return {
						...result,
						industries: {
							data: [...result.industries.data, industryData],
							servicesCount: result.industries.servicesCount + industryData.categories.servicesCount,
							servicesVisibleInPricelistCount: result.industries.servicesVisibleInPricelistCount + industryData.categories.servicesVisibleInPricelistCount,
							servicesAvailableForOnlineReservationsCount:
								result.industries.servicesAvailableForOnlineReservationsCount + industryData.categories.servicesAvailableForOnlineReservationsCount
						}
					}
				}
				return result
			}, SERVICES_LIST_INIT as IServicesListData)

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
								categoryId: service.category.id,
								firstCategory: firstCategory?.category?.name,
								secondCategory: secondCategory?.category?.name,
								priceAndDurationData: service.service?.priceAndDurationData,
								serviceCategoryParameter: service.service?.serviceCategoryParameter,
								useCategoryParameter: service.service.useCategoryParameter
							}
						})
					})
				})
			)
			payload = {
				data,
				listData,
				options: servicesOptions,
				categoriesOptions,
				servicesActiveKeys: null
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

export const setServicesActiveKeys =
	(newActiveKeys?: ServicesActiveKeysPayload): ThunkResult<ServicesActiveKeysPayload> =>
	(dispatch) => {
		const payload = newActiveKeys || null
		dispatch({ type: SET_SERVICES_ACTIVE_KEYS, payload })
		return payload
	}
