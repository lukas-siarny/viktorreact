import { RESET_STORE } from '../generalTypes'
// eslint-disable-next-line import/no-cycle
import { ILoadingAndFailure } from '../../types/interfaces'
import { CATEGORIES } from './categoriesTypes'
import { ICategoriesActions, ICategoriesPayload } from './categoriesActions'

export const initState = {
	categories: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICategoriesPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICategoriesActions) => {
	switch (action.type) {
		// Roles
		case CATEGORIES.CATEGORIES_LOAD_START:
			return {
				...state,
				roles: {
					...state.categories,
					isLoading: true
				}
			}
		case CATEGORIES.CATEGORIES_LOAD_FAIL:
			return {
				...state,
				roles: {
					...initState.categories,
					isFailure: true
				}
			}
		case CATEGORIES.CATEGORIES_LOAD_DONE:
			return {
				...state,
				roles: {
					...initState.categories,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
