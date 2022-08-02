import { Action, Dispatch } from 'redux'
import { ThunkResult } from '../reducers'
import { IQueryParams, ISearchable, ISelectOptionItem } from '../types/interfaces'
import { FILTER_ENTITY } from './enums'

// reducers
import { getSalons } from '../reducers/salons/salonsActions'
import { getServices } from '../reducers/services/serviceActions'
import { getUsers } from '../reducers/users/userActions'
import { getEmployees } from '../reducers/employees/employeesActions'

const getSearchFn = (type: FILTER_ENTITY): ((params: IQueryParams) => ThunkResult<Promise<ISearchable<any>>>) => {
	switch (type) {
		case FILTER_ENTITY.EMPLOYEE:
			return getEmployees

		case FILTER_ENTITY.SALON:
			return getSalons

		case FILTER_ENTITY.SERVICE:
			return getServices

		case FILTER_ENTITY.USER:
			return getUsers

		default:
			throw new Error(`Unsupported entity type for filtering:${type}`)
	}
}

const searchWrapper = async (
	dispatch: Dispatch<Action>,
	queryParams: IQueryParams,
	entity: FILTER_ENTITY,
	modifyOptions?: (originalOptions?: ISelectOptionItem[]) => ISelectOptionItem[]
) => {
	try {
		const searchFn = getSearchFn(entity)
		const { data, options } = await dispatch(searchFn(queryParams))
		return { pagination: data.pagination, page: data.pagination.page, data: modifyOptions ? modifyOptions(options) : options }
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
		return null
	}
}

export default searchWrapper
