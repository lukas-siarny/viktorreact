/* eslint-disable import/no-cycle */
import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storageSession from 'redux-persist/es/storage/session'
import storageLocal from 'redux-persist/lib/storage'
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
import selectedCountryReducer from './selectedCountry/selectedCountryReducer'
import selectedSalonReducer from './selectedSalon/selectedSalonReducer'
import supportContactsReducer from './supportContacts/supportContactsReducer'
import cosmeticsReducer from './cosmetics/cosmeticsReducer'
import categoryParamsReducer from './categoryParams/categoryParamsReducer'
import languagesReducer from './languages/languagesReducer'
import dashboardReducer from './dashboard/dashboardReducer'
import specialistContactsReducer from './specialistContacts/specialistContactsReducer'
import calendarReducer from './calendar/calendarReducer'
import helperSettingsReducer from './helperSettings/helperSettingsReducer'
import virtualEventReducer from './virtualEvent/virtualEventReducer'
import reviewsReducer from './reviews/reviewsReducer'
import calendarEmployeesReducer from './calendarEmployees/calendarEmployeesReducer'
import smsUnitPricesReducer from './smsUnitPrices/smsUnitPricesReducer'
import walletReducer from './wallet/walletReducer'
import smsReducer from './sms/smsReducer'

export const REDUCER_KEYS = {
	FORMS: 'FORMS',
	USER: 'USER',
	ENUMERATIONS: 'ENUMERATIONS',
	ROLES: 'ROLES',
	CATEGORIES: 'CATEGORIES',
	SERVICE: 'SERVICE',
	SALONS: 'SALONS',
	CUSTOMERS: 'CUSTOMERS',
	EMPLOYEES: 'EMPLOYEES',
	SELECTED_COUNTRY: 'SELECTED_COUNTRY',
	SELECTED_SALON: 'SELECTED_SALON',
	SUPPORT_CONTACTS: 'SUPPORT_CONTACTS',
	SPECIALIST_CONTACTS: 'SPECIALIST_CONTACTS',
	COSMETICS: 'COSMETICS',
	CATEGORY_PARAMETERS: 'CATEGORY_PARAMETERS',
	LANGUAGES: 'LANGUAGES',
	DASHBOARD: 'DASHBOARD',
	CALENDAR: 'CALENDAR',
	HELPER_SETTINGS: 'HELPER_SETTINGS',
	VIRTUAL_EVENT: 'VIRTUAL_EVENT',
	REVIEWS: 'REVIEWS',
	SMS_UNIT_PRICES: 'SMS_UNIT_PRICES',
	WALLET: 'WALLET',
	SMS: 'SMS',
	CALENDAR_EMPLOYEES: 'CALENDAR_EMPLOYEES'
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
	cosmetics: persistReducer(
		{
			key: REDUCER_KEYS.COSMETICS,
			storage: storageSession
		},
		cosmeticsReducer
	),
	categoryParams: persistReducer(
		{
			key: REDUCER_KEYS.CATEGORY_PARAMETERS,
			storage: storageSession
		},
		categoryParamsReducer
	),
	languages: persistReducer(
		{
			key: REDUCER_KEYS.LANGUAGES,
			storage: storageSession
		},
		languagesReducer
	),
	salons: persistReducer(
		{
			key: REDUCER_KEYS.SALONS,
			storage: storageSession
		},
		salonsReducer
	),
	supportContacts: persistReducer(
		{
			key: REDUCER_KEYS.SUPPORT_CONTACTS,
			storage: storageSession
		},
		supportContactsReducer
	),
	specialistContacts: persistReducer(
		{
			key: REDUCER_KEYS.SPECIALIST_CONTACTS,
			storage: storageSession
		},
		specialistContactsReducer
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
	),
	selectedCountry: persistReducer(
		{
			key: REDUCER_KEYS.SELECTED_COUNTRY,
			storage: storageLocal
		},
		selectedCountryReducer
	),
	selectedSalon: persistReducer(
		{
			key: REDUCER_KEYS.SELECTED_SALON,
			storage: storageLocal
		},
		selectedSalonReducer
	),
	dashboard: persistReducer(
		{
			key: REDUCER_KEYS.DASHBOARD,
			storage: storageSession
		},
		dashboardReducer
	),
	calendar: persistReducer(
		{
			key: REDUCER_KEYS.CALENDAR,
			storage: storageSession,
			blacklist: ['isRefreshingEvents', 'dayEvents']
		},
		calendarReducer
	),
	helperSettings: persistReducer(
		{
			key: REDUCER_KEYS.HELPER_SETTINGS,
			storage: storageSession
		},
		helperSettingsReducer
	),
	virtualEvent: persistReducer(
		{
			key: REDUCER_KEYS.VIRTUAL_EVENT,
			storage: storageSession
		},
		virtualEventReducer
	),
	reviews: persistReducer(
		{
			key: REDUCER_KEYS.REVIEWS,
			storage: storageSession
		},
		reviewsReducer
	),
	calendarEmployees: persistReducer(
		{
			key: REDUCER_KEYS.CALENDAR_EMPLOYEES,
			storage: storageSession
		},
		calendarEmployeesReducer
	),
	smsUnitPrices: persistReducer(
		{
			key: REDUCER_KEYS.SMS_UNIT_PRICES,
			storage: storageSession
		},
		smsUnitPricesReducer
	),
	wallet: persistReducer(
		{
			key: REDUCER_KEYS.WALLET,
			storage: storageSession
		},
		walletReducer
	),
	sms: persistReducer(
		{
			key: REDUCER_KEYS.SMS,
			storage: storageSession
		},
		smsReducer
	)
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>
