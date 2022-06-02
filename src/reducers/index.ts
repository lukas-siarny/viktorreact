/* eslint-disable import/no-cycle */
import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storageSession from 'redux-persist/es/storage/session'
import { reducer as formReducer } from 'redux-form'
import { ThunkAction } from 'redux-thunk'

// reducers
import userReducer from './users/userReducer'
import enumerationReducer from './enumerations/enumerationReducer'
import rolesReducer from './roles/rolesReducer'
import categoriesReducer from './categories/categoriesReducer'
import serviceReducer from './services/serviceReducer'
import salonsReducer from './salons/salonsReducer'
import customerReducer from './customers/customerReducer'
import employeesReducer from './employees/employeesReducer'

export const REDUCER_KEYS = {
	FORMS: 'FORMS',
	USER: 'USER',
	ENUMERATIONS: 'ENUMERATIONS',
	ROLES: 'ROLES',
	CATEGORIES: 'CATEGORIES',
	SERVICE: 'SERVICE',
	SALONS: 'SALONS',
	CUSTOMERS: 'CUSTOMERS',
	EMPLOYEES: 'EMPLOYEES'
}

const rootReducer = combineReducers({
	user: persistReducer(
		{
			key: REDUCER_KEYS.USER,
			storage: storageSession
		},
		userReducer
	),
	roles: persistReducer(
		{
			key: REDUCER_KEYS.ROLES,
			storage: storageSession
		},
		rolesReducer
	),
	categories: persistReducer(
		{
			key: REDUCER_KEYS.CATEGORIES,
			storage: storageSession
		},
		categoriesReducer
	),
	salons: persistReducer(
		{
			key: REDUCER_KEYS.SALONS,
			storage: storageSession
		},
		salonsReducer
	),
	form: persistReducer(
		{
			key: REDUCER_KEYS.FORMS,
			storage: storageSession
		},
		formReducer
	),
	enumerationsStore: persistReducer(
		{
			key: REDUCER_KEYS.ENUMERATIONS,
			storage: storageSession
		},
		enumerationReducer
	),
	service: persistReducer(
		{
			key: REDUCER_KEYS.SERVICE,
			storage: storageSession
		},
		serviceReducer
	),
	customers: persistReducer(
		{
			key: REDUCER_KEYS.CUSTOMERS,
			storage: storageSession
		},
		customerReducer
	),
	employees: persistReducer(
		{
			key: REDUCER_KEYS.EMPLOYEES,
			storage: storageSession
		},
		employeesReducer
	)
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>
