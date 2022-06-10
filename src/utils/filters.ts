import { Action, Dispatch } from 'redux'

// reducers
import { getSalons, IGetSalonsQueryParams } from '../reducers/salons/salonsActions'
import { getServices, IGetServicesQueryParams } from '../reducers/services/serviceActions'
import { getUsers, IGetUsersQueryParams } from '../reducers/users/userActions'

export const searchSalonWrapper = async (dispatch: Dispatch<Action>, queryParams: IGetSalonsQueryParams) => {
	const { data, salonsOptions } = await dispatch(getSalons(queryParams))
	return { pagination: data?.pagination, page: data?.pagination?.page, data: salonsOptions }
}

export const searchServiceWrapper = async (dispatch: Dispatch<Action>, queryParams: IGetServicesQueryParams) => {
	const { data, servicesOptions } = await dispatch(getServices(queryParams))
	return { pagination: data?.pagination, page: data?.pagination?.page, data: servicesOptions }
}

export const searchUsersWrapper = async (dispatch: Dispatch<Action>, queryParams: IGetUsersQueryParams) => {
	const { data, usersOptions } = await dispatch(getUsers(queryParams))
	return { pagination: data?.pagination, page: data?.pagination?.page, data: usersOptions }
}
