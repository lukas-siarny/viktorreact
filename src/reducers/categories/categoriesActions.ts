/* eslint-disable import/no-cycle */
import { map, get } from 'lodash'
import { IResetStore } from '../generalTypes'

// types
import { CATEGORIES } from './categoriesTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { IEnumerationOptions } from '../enumerations/enumerationActions'
import { ISelectOptionItem } from '../../types/interfaces'

export type ICategoriesActions = IResetStore | IGetCategories

interface IGetCategories {
	type: CATEGORIES
	payload: ICategoriesPayload
}

export interface ICategoriesPayload {
	data: Paths.GetApiB2BAdminEnumsCategories.Responses.$200['categories'] | null
	enumerationsOptions: IEnumerationOptions[]
}

export const getCategories = (): ThunkResult<Promise<void>> => async (dispatch) => {
	try {
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/enums/categories/', null)
		const enumerationsOptions: ISelectOptionItem[] = map(data?.categories, (item) => ({
			key: `Cat_${get(item, 'id')}`,
			label: get(item, 'name'),
			value: `${get(item, 'id')}`
		}))
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_DONE, payload: { data: data?.categories, enumerationsOptions } })
	} catch (err) {
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}
}
