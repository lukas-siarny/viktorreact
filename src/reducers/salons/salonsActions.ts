/* eslint-disable import/no-cycle */
import { NumberParam } from 'use-query-params'
import { map } from 'lodash'
import { IResetStore } from '../generalTypes'

// types
import { SALONS } from './salonsTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { PAGINATION, SALON_STATUSES } from '../../utils/enums'

export type ISalonsActions = IResetStore | IGetSalons

interface IGetSalons {
	type: SALONS
	payload: ISalonsPayload
}

export interface SalonOptionItem {
	label: string | undefined
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
				return { label: salon.name, value: salon.id, key: salon.id }
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
