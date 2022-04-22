/* eslint-disable import/no-cycle */
import { map } from 'lodash'
import { IResetStore } from '../generalTypes'

// types
import { SALON, SALONS } from './salonsTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { PAGINATION, SALON_STATUSES } from '../../utils/enums'

export type ISalonsActions = IResetStore | IGetSalons | IGetSalon

interface IGetSalons {
	type: SALONS
	payload: ISalonsPayload
}

export interface IGetSalon {
	type: SALON
	payload: ISalonPayload
}

export interface ISalonPayload {
	data: Paths.GetApiB2BAdminSalonsSalonId.Responses.$200 | null
}

export interface SalonOptionItem {
	label: string | undefined | number
	value: number
	key: number
}

export interface ISalonsPayload {
	data: Paths.GetApiB2BAdminSalons.Responses.$200 | null
	salonsOptions: SalonOptionItem[]
}

export const getSalons =
	(
		page: number,
		limit?: any | undefined,
		order?: string | undefined,
		search?: string | undefined | null,
		categoryFirstLevelIDs?: (string | null)[] | null | undefined,
		statuses?: (string | null)[] | SALON_STATUSES[]
	): ThunkResult<Promise<ISalonsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonsPayload
		try {
			dispatch({ type: SALONS.SALONS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/salons/', { page: page || 1, limit: limit || PAGINATION.limit, order, search, categoryFirstLevelIDs, statuses } as any)
			const salonsOptions = map(data.salons, (salon) => {
				return { label: salon.name || salon.id, value: salon.id, key: salon.id }
			})

			payload = {
				data,
				salonsOptions
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
	(salonID: number): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: SALON.SALON_LOAD_START })
			const data = await getReq('/api/b2b/admin/salons/{salonID}', { salonID } as any)
			dispatch({ type: SALON.SALON_LOAD_DONE, payload: data })
		} catch (err) {
			dispatch({ type: SALON.SALON_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const emptySalon = (): ThunkResult<Promise<void>> => async (dispatch) => {
	dispatch({ type: SALON.SALON_LOAD_DONE, payload: { data: null } })
}