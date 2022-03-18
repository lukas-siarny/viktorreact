/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { CATEGORIES } from './categoriesTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'

export type ICategoriesActions = IResetStore | IGetCategories

interface IGetCategories {
	type: CATEGORIES
	payload: ICategoriesPayload
}

export interface ICategoriesPayload {
	data: Paths.GetApiB2BAdminEnumsCategories.Responses.$200 | null
}

export const getCategories = (): ThunkResult<Promise<void>> => async (dispatch) => {
	try {
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_START })
		const { data } = await getReq('/api/b2b/v1/enums/categories/', null)
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_DONE, payload: data })
	} catch (err) {
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}
}
