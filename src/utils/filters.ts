import { Action, Dispatch } from 'redux'
import { ThunkResult } from '../reducers'
import { IQueryParams, ISearchable, ISearchableWithoutPagination, ISelectOptionItem } from '../types/interfaces'
import { FILTER_ENTITY } from './enums'

// reducers
import { getSalons, getBasicSalons } from '../reducers/salons/salonsActions'
import { getNotinoUsers, getUsers } from '../reducers/users/userActions'
import { getEmployees } from '../reducers/employees/employeesActions'
import { getCosmetics } from '../reducers/cosmetics/cosmeticsActions'

const getSearchFn = (type: FILTER_ENTITY): ((params: IQueryParams, disabled?: boolean) => ThunkResult<Promise<ISearchable<any> | ISearchableWithoutPagination<any>>>) => {
	switch (type) {
		case FILTER_ENTITY.EMPLOYEE:
			return getEmployees

		case FILTER_ENTITY.SALON:
			return getSalons

		case FILTER_ENTITY.BASIC_SALON:
			return getBasicSalons

		case FILTER_ENTITY.USER:
			return getUsers

		case FILTER_ENTITY.NOTINO_USER:
			return getNotinoUsers

		case FILTER_ENTITY.COSMETICS:
			return getCosmetics
		default:
			throw new Error(`Unsupported entity type for filtering:${type}`)
	}
}

const searchWrapper = async (
	dispatch: Dispatch<Action>,
	queryParams: IQueryParams,
	entity: FILTER_ENTITY,
	modifyOptions?: (originalOptions?: ISelectOptionItem[]) => ISelectOptionItem[],
	disabled?: boolean // NOTE: toto ide az do akcie a ked je to true tak sa spravi porovnanie podla nami zvoleneho kriteria na disabled (v getEmployees to bude ze kazdy option bude disabled ak je deletedAt)
) => {
	try {
		const searchFn = getSearchFn(entity)
		const { data, options } = await dispatch(searchFn(queryParams, disabled))
		return { pagination: data?.pagination, page: data?.pagination?.page, data: modifyOptions ? modifyOptions(options) : options }
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error(error)
		return null
	}
}

export default searchWrapper
