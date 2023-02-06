/* eslint-disable import/no-cycle */
import { isEmpty, map } from 'lodash'
import { IResetStore } from '../generalTypes'

// types
import { BASIC_SALON, BASIC_SALONS, REJECTED_SUGGESTIONS, SALON, SALON_HISTORY, SALONS, SUGGESTED_SALONS } from './salonsTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'
import { IQueryParams, ISearchable } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { SALON_FILTER_OPENING_HOURS, SALON_FILTER_STATES, SALONS_TAB_KEYS } from '../../utils/enums'
import { normalizeQueryParams } from '../../utils/helper'

export type ISalonsActions = IResetStore | IGetSalons | IGetSalon | IGetSuggestedSalons | IGetBasictSalon | IGetBasicSalons | IGetSalonHistory | IGetRejectedSuggestions

interface IGetSalons {
	type: SALONS
	payload: ISalonsPayload
}

interface IGetSalonHistory {
	type: SALON_HISTORY
	payload: ISalonHistoryPayload
}

export interface IGetSalonsQueryParams extends IQueryParams {
	categoryFirstLevelIDs?: string | ''
	statuses_all?: string | ''
	statuses_published?: (string | null)[] | SALON_FILTER_STATES[] | null | ''
	salonState?: string | ''
	statuses_changes?: (string | null)[] | SALON_FILTER_STATES[] | ''
	countryCode?: string | ''
	createType?: string | ''
	lastUpdatedAtFrom?: string | ''
	lastUpdatedAtTo?: string | ''
	hasSetOpeningHours?: string | ''
	sourceType?: string | ''
	premiumSourceUserType?: string | ''
	assignedUserID?: string | ''
}

export interface IGetSalonsHistoryQueryParams extends IQueryParams {
	dateFrom: string | null
	dateTo: string | null
	salonID: string
}

export interface IGetSalon {
	type: SALON
	payload: ISalonPayload
}

export interface IGetBasictSalon {
	type: BASIC_SALON
	payload: IBasicSalonPayload
}

export interface ISalonPayload {
	data: Paths.GetApiB2BAdminSalonsSalonId.Responses.$200 | null
}

export interface ISalonHistoryPayload {
	data: Paths.GetApiB2BAdminSalonsSalonIdHistory.Responses.$200 | null
}

export interface IGetSuggestedSalons {
	type: SUGGESTED_SALONS
	payload: ISuggestedSalonsPayload
}

export interface ISuggestedSalonsPayload {
	data: Paths.GetApiB2BAdminSalonsBasicSuggestion.Responses.$200 | null
}

export type IBasicSalon = Paths.GetApiB2BV1SalonsSalonIdBasic.Responses.$200['salon']

interface IGetBasicSalons {
	type: BASIC_SALONS
	payload: IBasicSalonsPayload
}

export interface IBasicSalonPayload {
	data: Paths.GetApiB2BV1SalonsSalonIdBasic.Responses.$200 | null
}

export interface ISalonsPayload extends ISearchable<Paths.GetApiB2BAdminSalons.Responses.$200> {}

export interface IBasicSalonsPayload extends ISearchable<Paths.GetApiB2BAdminSalonsBasic.Responses.$200> {}

export interface IRejectedSuggestionsPayload {
	data: Paths.GetApiB2BAdminSalonsRejectedSuggestions.Responses.$200 | null
	tableData?: IRejectedSuggestionsTableData[]
}

interface IRejectedSuggestionsTableData {
	key: string
	salonID: string
	address: string
	salonMail: string
	salonName: string
	userID: string
	userLastName: string
	userPhone: string
	userEmail: string
}

interface IGetRejectedSuggestions {
	type: REJECTED_SUGGESTIONS
	payload: IRejectedSuggestionsPayload
}

export const getSalons =
	(queryParams: any): ThunkResult<Promise<ISalonsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonsPayload

		let statuses: any[] = []
		let hasSetOpeningHours

		if (queryParams.salonState === SALONS_TAB_KEYS.ACTIVE) {
			statuses = [SALON_FILTER_STATES.NOT_DELETED]
		}

		if (queryParams.salonState === SALONS_TAB_KEYS.DELETED) {
			statuses = [SALON_FILTER_STATES.DELETED]
		}

		if (!queryParams.statuses_all) {
			statuses = [...statuses, ...(queryParams.statuses_published || []), ...(queryParams.statuses_changes || [])]
		}

		if (queryParams.hasSetOpeningHours === SALON_FILTER_OPENING_HOURS.SET) {
			hasSetOpeningHours = true
		} else if (queryParams.hasSetOpeningHours === SALON_FILTER_OPENING_HOURS.NOT_SET) {
			hasSetOpeningHours = false
		}

		const editedQueryParams = {
			page: queryParams.page,
			limit: queryParams.limit,
			order: queryParams.order,
			search: queryParams.search,
			categoryFirstLevelIDs: queryParams.categoryFirstLevelIDs,
			countryCode: queryParams.countryCode,
			lastUpdatedAtFrom: queryParams.lastUpdatedAtFrom,
			lastUpdatedAtTo: queryParams.lastUpdatedAtTo,
			createType: queryParams.createType,
			statuses: [...new Set(statuses)],
			hasSetOpeningHours,
			sourceType: queryParams.sourceType,
			premiumSourceUserType: queryParams.premiumSourceUserType,
			assignedUserID: queryParams.assignedUserID
		}

		try {
			dispatch({ type: SALONS.SALONS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/', { ...normalizeQueryParams(editedQueryParams) } as any)
			const salonsOptions = map(data.salons, (salon) => {
				return { label: salon.name || `${salon.id}`, value: salon.id, key: `${salon.id}-key` }
			})

			payload = {
				data,
				options: salonsOptions
			}

			dispatch({ type: SALONS.SALONS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SALONS.SALONS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const emptySalons = (): ThunkResult<Promise<void>> => async (dispatch) => {
	dispatch({ type: SALONS.SALONS_LOAD_DONE, payload: { data: null, options: [] } })
}

export const getSalon =
	(salonID: string): ThunkResult<Promise<ISalonPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonPayload
		try {
			dispatch({ type: SALON.SALON_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/{salonID}', { salonID } as any)
			payload = {
				data
			}
			dispatch({ type: SALON.SALON_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SALON.SALON_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getSuggestedSalons = (): ThunkResult<Promise<ISuggestedSalonsPayload>> => async (dispatch) => {
	let payload = {} as ISuggestedSalonsPayload
	try {
		dispatch({ type: SUGGESTED_SALONS.SUGGESTED_SALONS_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/salons/basic-suggestion', undefined)

		payload = {
			data
		}

		dispatch({ type: SUGGESTED_SALONS.SUGGESTED_SALONS_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: SUGGESTED_SALONS.SUGGESTED_SALONS_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}

export const getBasicSalons =
	(queryParams: IQueryParams): ThunkResult<Promise<IBasicSalonsPayload>> =>
	async (dispatch) => {
		let payload = {} as IBasicSalonsPayload
		try {
			dispatch({ type: BASIC_SALONS.BASIC_SALONS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/basic', { ...normalizeQueryParams(queryParams) } as any)

			const options = data.salons.map((item) => ({
				key: item.id,
				value: item.id,
				label: item.name || '-',
				className: 'noti-salon-search-option',
				extra: {
					salon: item
				}
			}))

			payload = {
				data,
				options
			}

			dispatch({ type: BASIC_SALONS.BASIC_SALONS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: BASIC_SALONS.BASIC_SALONS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getBasicSalon =
	(salonID: string): ThunkResult<Promise<IBasicSalonPayload>> =>
	async (dispatch) => {
		let payload = {} as IBasicSalonPayload
		try {
			dispatch({ type: BASIC_SALON.BASIC_SALON_LOAD_START })
			const { data } = await getReq('/api/b2b/v1/salons/{salonID}/basic', { salonID })
			payload = {
				data
			}
			dispatch({ type: BASIC_SALON.BASIC_SALON_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: BASIC_SALON.BASIC_SALON_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const emptySalon = (): ThunkResult<Promise<void>> => async (dispatch) => {
	dispatch({ type: SALON.SALON_LOAD_DONE, payload: { data: null } })
}

export const getSalonHistory =
	(queryParams: IGetSalonsHistoryQueryParams): ThunkResult<Promise<ISalonHistoryPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonHistoryPayload
		try {
			dispatch({ type: SALON_HISTORY.SALON_HISTORY_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/history', { ...normalizeQueryParams(queryParams) } as any)
			payload = {
				data
			}
			dispatch({ type: SALON_HISTORY.SALON_HISTORY_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SALON_HISTORY.SALON_HISTORY_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getRejectedSuggestions =
	(queryParams: IQueryParams): ThunkResult<Promise<IRejectedSuggestionsPayload>> =>
	async (dispatch) => {
		let payload = {} as IRejectedSuggestionsPayload

		try {
			dispatch({ type: REJECTED_SUGGESTIONS.REJECTED_SUGGESTIONS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/rejected-suggestions', { ...normalizeQueryParams(queryParams) } as any)
			const tableData: IRejectedSuggestionsTableData[] = data.salons.map((suggestion: any) => {
				const { address } = suggestion.salon
				const formattedAddress = `${address?.city}${address?.street ? `, ${address.street}` : ''}`
				return {
					id: suggestion.salon.id,
					key: suggestion.salon.id,
					salonID: suggestion.salon.id,
					salonName: suggestion.salon.name ?? '-',
					salonMail: suggestion.salon.email ?? '-',
					address: isEmpty(formattedAddress) ? '-' : formattedAddress,
					userID: suggestion.user.id,
					userLastName: suggestion.user.fullName ?? '-',
					userPhone: suggestion.user.phone ?? '-',
					userEmail: suggestion.user.email ?? '-'
				}
			})
			payload = {
				data,
				tableData
			}
			dispatch({ type: REJECTED_SUGGESTIONS.REJECTED_SUGGESTIONS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: REJECTED_SUGGESTIONS.REJECTED_SUGGESTIONS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
