/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { SALONS } from './salonsTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'

export type ISalonsActions = IResetStore | IGetSalons

interface IGetSalons {
	type: SALONS
	payload: ISalonsPayload
}

export interface ISalonsPayload {
	data: [Paths.GetApiB2BAdminSalons.Responses.$200['salons']] | null
}

export const getSalons = (): ThunkResult<Promise<void>> => async (dispatch) => {
	try {
		dispatch({ type: SALONS.SALONS_LOAD_START })
		const data = await getReq('/api/b2b/admin/salons/', null)
		dispatch({ type: SALONS.SALONS_LOAD_DONE, payload: data })
	} catch (err) {
		dispatch({ type: SALONS.SALONS_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}
}
