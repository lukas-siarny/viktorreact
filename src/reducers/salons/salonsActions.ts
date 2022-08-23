/* eslint-disable import/no-cycle */
import { map } from 'lodash'
import { IResetStore } from '../generalTypes'

// types
import { SALON, SALON_HISTORY, SALONS } from './salonsTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'
import { IQueryParams, ISearchable } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { SALON_FILTER_STATES, SALON_FILTER_CREATE_TYPES, SALON_CREATE_TYPES } from '../../utils/enums'
import { normalizeQueryParams } from '../../utils/helper'

export type ISalonsActions = IResetStore | IGetSalons | IGetSalon | IGetSalonHistory

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
	salonState?: string | null
	statuses_changes?: (string | null)[] | SALON_FILTER_STATES[] | null
	countryCode?: string | null
	createType?: string | null
	lastUpdatedAtFrom?: string | null
	lastUpdatedAtTo?: string | null
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

export interface ISalonPayload {
	data: Paths.GetApiB2BAdminSalonsSalonId.Responses.$200 | null
}

export interface ISalonHistoryPayload {
	data: Paths.GetApiB2BAdminSalonsSalonIdHistory.Responses.$200 | null
}

export interface ISalonsPayload extends ISearchable<Paths.GetApiB2BAdminSalons.Responses.$200> {}

export const getSalons =
	(queryParams: IGetSalonsQueryParams): ThunkResult<Promise<ISalonsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonsPayload

		let statuses: any[] = []
		let createType

		if (queryParams.salonState === 'active') {
			statuses = [SALON_FILTER_STATES.NOT_DELETED]
		}

		if (queryParams.salonState === 'deleted') {
			statuses = [SALON_FILTER_STATES.DELETED]
		}

		if (!queryParams.statuses_all) {
			statuses = [...statuses, ...(queryParams.statuses_published || []), ...(queryParams.statuses_changes || [])]

			if (queryParams.createType === SALON_FILTER_CREATE_TYPES.BASIC) {
				createType = SALON_CREATE_TYPES.BASIC
			} else if (queryParams.createType === SALON_FILTER_CREATE_TYPES.PREMIUM) {
				createType = SALON_CREATE_TYPES.NON_BASIC
				statuses = [...statuses, SALON_FILTER_STATES.PUBLISHED]
			}
		}

		const editedQueryParams = {
			...queryParams,
			createType,
			statuses: [...new Set(statuses)]
		}

		delete editedQueryParams.statuses_all
		delete editedQueryParams.statuses_published
		delete editedQueryParams.statuses_changes
		delete editedQueryParams.salonState

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
