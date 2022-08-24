/* eslint-disable import/no-cycle */
import { map } from 'lodash'
import { IResetStore } from '../generalTypes'

// types
import { SALON, SALONS, SUGGESTED_SALONS, BASIC_SALON, BASIC_SALONS, SALON_HISTORY } from './salonsTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'
import { IQueryParams, ISearchable } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { SALON_FILTER_STATES } from '../../utils/enums'
import { normalizeQueryParams } from '../../utils/helper'

export type ISalonsActions = IResetStore | IGetSalons | IGetSalon | IGetSuggestedSalons | IGeBasictSalon | IGetBasicSalons | IGetSalonHistory

interface IGetSalons {
	type: SALONS
	payload: ISalonsPayload
}

interface IGetSalonHistory {
	type: SALON_HISTORY
	payload: ISalonHistoryPayload
}

export interface IGetSalonsQueryParams extends IQueryParams {
	categoryFirstLevelIDs?: (string | null)[] | null
	statuses_all?: boolean | null
	statuses_published?: (string | null)[] | SALON_FILTER_STATES[] | null
	statuses_deleted?: (string | null)[] | SALON_FILTER_STATES[] | null
	statuses_changes?: (string | null)[] | SALON_FILTER_STATES[] | null
	countryCode?: string | null
	createType?: string | null
}

export interface IGetSalonsHistoryQueryParams extends IQueryParams {
	dateFrom: string
	dateTo: string
	salonID: string
}

export interface IGetSalon {
	type: SALON
	payload: ISalonPayload
}

export interface IGeBasictSalon {
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

export const getSalons =
	(queryParams: IGetSalonsQueryParams): ThunkResult<Promise<ISalonsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonsPayload
		try {
			const editedQueryParams = {
				...queryParams,
				statuses: [
					...(queryParams.statuses_all ? [SALON_FILTER_STATES.ALL] : []),
					...(queryParams.statuses_published || []),
					...(queryParams.statuses_changes || []),
					...(queryParams.statuses_deleted || [])
				]
			}
			delete editedQueryParams.statuses_all
			delete editedQueryParams.statuses_published
			delete editedQueryParams.statuses_deleted
			delete editedQueryParams.statuses_changes

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
