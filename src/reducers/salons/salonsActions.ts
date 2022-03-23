/* eslint-disable import/no-cycle */
import { NumberParam } from 'use-query-params'
import { IResetStore } from '../generalTypes'

// types
import { SALONS } from './salonsTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { SALON_STATUSES } from '../../utils/enums'

export type ISalonsActions = IResetStore | IGetSalons

interface IGetSalons {
	type: SALONS
	payload: ISalonsPayload
}

export interface ISalonsPayload {
	data: [Paths.GetApiB2BAdminSalons.Responses.$200['salons']] | null
}

export const getSalons =
	(
		page: number,
		limit?: any | undefined,
		order?: string | undefined,
		search?: string | undefined | null,
		categoryFirstLevelID?: number | undefined | null,
		statuses?: string | undefined | null
	): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: SALONS.SALONS_LOAD_START })
			const pageLimit = limit
			// const data = await getReq('/api/b2b/admin/salons/', { page: page || 1, limit: pageLimit, order, search, statuses })
			dispatch({ type: SALONS.SALONS_LOAD_DONE, payload: {} })
		} catch (err) {
			dispatch({ type: SALONS.SALONS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}
