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

export const getCategories = (): ThunkResult<Promise<ICategoriesPayload>> => async (dispatch) => {
	let payload = {} as ICategoriesPayload

	try {
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_START })
		const { data } = await getReq('/api/b2b/admin/enums/categories/', null)
		const enumerationsOptions: ISelectOptionItem[] = map(data?.categories, (item) => ({
			key: `Cat_${get(item, 'id')}`,
			label: get(item, 'name') as string,
			value: `${get(item, 'id')}`
		}))
		payload = { data: data?.categories, enumerationsOptions }
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: CATEGORIES.CATEGORIES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}

	return payload
}
