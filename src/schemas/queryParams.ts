import { z } from 'zod'
import dayjs from 'dayjs'
import {
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	RESERVATION_STATE,
	SALONS_TAB_KEYS,
	SALON_CREATE_TYPE,
	SALON_FILTER_OPENING_HOURS,
	SALON_FILTER_RS,
	SALON_FILTER_RS_AVAILABLE_ONLINE,
	SALON_FILTER_STATES,
	SALON_SOURCE_TYPE,
	CALENDAR_VIEW,
	CALENDAR_DATE_FORMAT,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_SOURCE_TYPE,
	RESERVATIONS_STATE,
	ACCOUNT_STATE,
	EMPLOYEES_TAB_KEYS
} from '../utils/enums'
import { dateConstraint, twoCharsConstraint, uuidConstraint } from './baseSchema'

const paginationSchema = z.object({
	page: z.number().nullish(),
	limit: z.number().nullish(),
	order: z.string().nullish()
})

const searchableSchema = paginationSchema.extend({
	search: z.string().nullish()
})

export type ISearchableParams = z.infer<typeof searchableSchema>

/**
 * Salons
 */
// actions query params
const salonsQueryParamsSchema = searchableSchema.extend({
	categoryFirstLevelIDs: z.string().array().nullish(),
	statuses_all: z.boolean().nullish(),
	statuses_published: z.enum([SALON_FILTER_STATES.PUBLISHED, SALON_FILTER_STATES.NOT_PUBLISHED]).nullish(),
	statuses_changes: z.enum([SALON_FILTER_STATES.PENDING_PUBLICATION, SALON_FILTER_STATES.DECLINED]).nullish(),
	countryCode: z.string().nullish(),
	createType: z.nativeEnum(SALON_CREATE_TYPE).nullish(),
	lastUpdatedAtFrom: z.string().nullish(),
	lastUpdatedAtTo: z.string().nullish(),
	hasSetOpeningHours: z.nativeEnum(SALON_FILTER_OPENING_HOURS).nullish(),
	sourceType: z.nativeEnum(SALON_SOURCE_TYPE).nullish(),
	assignedUserID: z.string().nullish(),
	premiumSourceUserType: z.nativeEnum(SALON_SOURCE_TYPE).nullish(),
	hasAvailableReservationSystem: z.nativeEnum(SALON_FILTER_RS_AVAILABLE_ONLINE).nullish(),
	enabledReservationsSetting: z.nativeEnum(SALON_FILTER_RS).nullish(),
	walletAvailableBalanceFrom: z.number().nullish(),
	walletAvailableBalanceTo: z.number().nullish(),
	salonState: z.nativeEnum(SALONS_TAB_KEYS).nullish()
})

export type IGetSalonsQueryParams = z.infer<typeof salonsQueryParamsSchema>

// url query params
export const salonsPageURLQueryParamsSchema = salonsQueryParamsSchema.pick({
	page: true,
	limit: true,
	order: true,
	search: true,
	categoryFirstLevelIDs: true,
	statuses_all: true,
	statuses_published: true,
	statuses_changes: true,
	countryCode: true,
	createType: true,
	lastUpdatedAtFrom: true,
	lastUpdatedAtTo: true,
	hasSetOpeningHours: true,
	sourceType: true,
	assignedUserID: true,
	premiumSourceUserType: true,
	hasAvailableReservationSystem: true,
	enabledReservationsSetting: true,
	salonState: true
})

export type ISalonsPageURLQueryParams = z.infer<typeof salonsPageURLQueryParamsSchema>

export const rechargeSmsCreditAdminPageSchema = salonsQueryParamsSchema
	.pick({
		page: true,
		limit: true,
		order: true,
		search: true,
		countryCode: true,
		sourceType: true,
		walletAvailableBalanceFrom: true,
		walletAvailableBalanceTo: true
	})
	.extend({
		showForm: z.boolean().nullish()
	})

export type IRechargeSmsCreditAdminPageURLQueryParams = z.infer<typeof rechargeSmsCreditAdminPageSchema>

/**
 * Calendar
 */
// actions query params
const calendarEventsQueryParamsSchema = z.object({
	salonID: uuidConstraint,
	start: dateConstraint,
	end: dateConstraint,
	employeeIDs: z.string().array().nullish(),
	categoryIDs: z.string().array().nullish(),
	eventTypes: z.nativeEnum(CALENDAR_EVENT_TYPE).array().nullish(),
	reservationStates: z.nativeEnum(RESERVATION_STATE).array().nullish()
})

export type ICalendarEventsQueryParams = z.infer<typeof calendarEventsQueryParamsSchema>

export const calendarReservationsQueryParamsSchema = calendarEventsQueryParamsSchema.omit({ reservationStates: true })

export type ICalendarReservationsQueryParams = z.infer<typeof calendarReservationsQueryParamsSchema>

export const calendarShiftsTimeOffQueryParamsSchema = calendarEventsQueryParamsSchema.pick({ salonID: true, start: true, end: true, employeeIDs: true })

export type ICalendarShiftsTimeOffQueryParams = z.infer<typeof calendarShiftsTimeOffQueryParamsSchema>

// url query params
export const calendarPageURLQueryParams = z.object({
	view: z.nativeEnum(CALENDAR_VIEW).catch(CALENDAR_VIEW.DAY),
	date: dateConstraint.catch(dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
	eventsViewType: z.nativeEnum(CALENDAR_EVENTS_VIEW_TYPE).catch(CALENDAR_EVENTS_VIEW_TYPE.RESERVATION),
	employeeIDs: uuidConstraint.array().nullish(),
	categoryIDs: z.string().array().nullish(),
	sidebarView: z.nativeEnum(CALENDAR_EVENT_TYPE).optional(),
	eventId: uuidConstraint.optional()
})

export type ICalendarPageURLQueryParams = z.infer<typeof calendarPageURLQueryParams>

/**
 * List of reservations salon
 */
// actions query params
const salonReservationsQueryParamsSchema = paginationSchema.extend({
	dateFrom: dateConstraint.nullish(),
	dateTo: dateConstraint.nullish(),
	createdAtFrom: dateConstraint.nullish(),
	createdAtTo: dateConstraint.nullish(),
	employeeIDs: uuidConstraint.array().nullish(),
	categoryIDs: uuidConstraint.array().nullish(),
	reservationStates: z.nativeEnum(RESERVATION_STATE).array().nullish(),
	reservationCreateSourceType: z.nativeEnum(RESERVATION_SOURCE_TYPE).nullish(),
	reservationPaymentMethods: z.nativeEnum(RESERVATION_PAYMENT_METHOD).array().nullish(),
	salonID: uuidConstraint
})

export type IGetSalonReservationsQueryParams = z.infer<typeof salonReservationsQueryParamsSchema>

// url query params
export const salonReservationsPageURLQueryParams = salonReservationsQueryParamsSchema.omit({ salonID: true }).extend({
	state: z.nativeEnum(RESERVATIONS_STATE).catch(RESERVATIONS_STATE.ALL)
})

export type ISalonReservationsPageURLQueryParams = z.infer<typeof salonReservationsPageURLQueryParams>

/**
 * List of reservations notino
 */
// actions query params
export const notinoReservationsQueryParamsSchema = searchableSchema.extend({
	dateFrom: dateConstraint.nullish(),
	dateTo: dateConstraint.nullish(),
	createdAtFrom: dateConstraint.nullish(),
	createdAtTo: dateConstraint.nullish(),
	reservationStates: z.nativeEnum(RESERVATION_STATE).array().nullish(),
	reservationCreateSourceType: z.nativeEnum(RESERVATION_SOURCE_TYPE).nullish(),
	reservationPaymentMethods: z.nativeEnum(RESERVATION_PAYMENT_METHOD).array().nullish(),
	categoryFirstLevelIDs: uuidConstraint.array().nullish(),
	countryCode: twoCharsConstraint.nullish()
})

export type IGetNotinoReservationsQueryParams = z.infer<typeof notinoReservationsQueryParamsSchema>

// url query params
export const notinoReservationsPageURLQueryParams = notinoReservationsQueryParamsSchema.omit({ order: true })

export type INotinoReservationsPageURLQueryParams = z.infer<typeof notinoReservationsPageURLQueryParams>

/**
 * Employees
 */
// actions query params
const employeesQueryParamsSchema = searchableSchema.extend({
	salonID: uuidConstraint.nullish(),
	serviceID: uuidConstraint.nullish(),
	accountState: z.nativeEnum(ACCOUNT_STATE).nullish()
})

export type IGetEmployeesQueryParams = z.infer<typeof employeesQueryParamsSchema>

// url query params
export const employeesPagePageURLQueryParams = employeesQueryParamsSchema.omit({ salonID: true }).extend({
	employeeState: z.nativeEnum(EMPLOYEES_TAB_KEYS).catch(EMPLOYEES_TAB_KEYS.ACTIVE)
})

export type IEmployeesPageURLQueryParam = z.infer<typeof employeesPagePageURLQueryParams>

/**
 * Customers
 */
// actions query params
const customersQueryParamsSchema = searchableSchema.extend({
	salonID: uuidConstraint.nullish()
})

export type IGetCustomersQueryParams = z.infer<typeof customersQueryParamsSchema>

// url query params
export const customersPagePageURLQueryParams = customersQueryParamsSchema.omit({ salonID: true })

export type ICustomersPageURLQueryParam = z.infer<typeof customersPagePageURLQueryParams>
