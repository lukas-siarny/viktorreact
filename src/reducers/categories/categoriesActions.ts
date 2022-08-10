/* eslint-disable import/no-cycle */
import { map, get } from 'lodash'
import { IResetStore } from '../generalTypes'

// types
import { CATEGORIES, CATEGORY } from './categoriesTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { ISelectOptionItem } from '../../types/interfaces'
import { flattenTree } from '../../utils/helper'

export type ICategoriesActions = IResetStore | IGetCategories | IGetCategory

interface IGetCategories {
	type: CATEGORIES
	payload: ICategoriesPayload
}

interface IGetCategory {
	type: CATEGORY
	payload: ICategoryPayload
}

interface ICategoryParameterValue {
	id: string
	name: string | null
}

export interface ICategoriesPayload {
	data: Paths.GetApiB2BAdminEnumsCategories.Responses.$200['categories'] | null
	enumerationsOptions: ISelectOptionItem[]
}

export interface ICategoryPayload {
	data: Paths.GetApiB2BAdminEnumsCategoriesCategoryId.Responses.$200['category'] | null
	categoryParameterValues: ICategoryParameterValue[] | null
}

export const getCategories =
	(onlyFirstLevelCategories = true): ThunkResult<Promise<ICategoriesPayload>> =>
	async (dispatch) => {
		let payload = {} as ICategoriesPayload

		try {
			dispatch({ type: CATEGORIES.CATEGORIES_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/enums/categories/', null)

			let enumerationsOptions: ISelectOptionItem[]

			if (onlyFirstLevelCategories) {
				enumerationsOptions = map(data?.categories, (item) => ({
					key: `Cat_${get(item, 'id')}`,
					label: get(item, 'name') as string,
					value: get(item, 'id')
				}))
			} else {
				enumerationsOptions = flattenTree(data?.categories, (item, level) => ({
					key: `Cat_${get(item, 'id')}`,
					label: get(item, 'name') as string,
					value: get(item, 'id'),
					level
				}))
			}

			payload = { data: data?.categories, enumerationsOptions }
			dispatch({ type: CATEGORIES.CATEGORIES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: CATEGORIES.CATEGORIES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getCategory =
	(categoryID: number | undefined | null): ThunkResult<Promise<ICategoryPayload>> =>
	async (dispatch) => {
		let payload = {} as ICategoryPayload

		try {
			dispatch({ type: CATEGORY.CATEGORY_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/enums/categories/{categoryID}', { categoryID } as any)

			payload = {
				data: data?.category,
				categoryParameterValues: data?.category?.categoryParameter?.values?.map((value) => {
					return { id: value?.id, name: value?.valueLocalizations?.[1]?.value }
				}) as any
			}
			dispatch({ type: CATEGORY.CATEGORY_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: CATEGORY.CATEGORY_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
