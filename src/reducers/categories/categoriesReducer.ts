/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { CATEGORIES, CATEGORY } from './categoriesTypes'
import { ICategoriesActions, ICategoriesPayload, ICategoryPayload } from './categoriesActions'

export const initState = {
	categories: {
		data: null,
		enumerationsOptions: [],
		isLoading: false,
		isFailure: false
	} as ICategoriesPayload & ILoadingAndFailure,
	category: {
		data: null,
		categoryParameterValues: null,
		isLoading: false,
		isFailure: false
	} as ICategoryPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICategoriesActions) => {
	switch (action.type) {
		// Categories
		case CATEGORIES.CATEGORIES_LOAD_START:
			return {
				...state,
				categories: {
					...state.categories,
					isLoading: true
				}
			}
		case CATEGORIES.CATEGORIES_LOAD_FAIL:
			return {
				...state,
				categories: {
					...initState.categories,
					isFailure: true
				}
			}
		case CATEGORIES.CATEGORIES_LOAD_DONE:
			return {
				...state,
				categories: {
					...initState.categories,
					enumerationsOptions: action.payload.enumerationsOptions,
					data: action.payload.data
				}
			}
		// Category
		case CATEGORY.CATEGORY_LOAD_START:
			return {
				...state,
				category: {
					...state.category,
					isLoading: true
				}
			}
		case CATEGORY.CATEGORY_LOAD_FAIL:
			return {
				...state,
				category: {
					...initState.category,
					isFailure: true
				}
			}
		case CATEGORY.CATEGORY_LOAD_DONE:
			return {
				...state,
				category: {
					...initState.category,
					categoryParameterValues: action.payload.categoryParameterValues,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
