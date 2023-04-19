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
	CALENDAR_DATE_FORMAT
} from '../utils/enums'
import { dateConstraint, uuidConstraint } from './baseSchema'

export const searchableSchema = z.object({
	page: z.number().nullish(),
	limit: z.number().nullish(),
	order: z.string().nullish(),
	search: z.string().nullish()
})

/**
 * Salons
 */
export const salonsQueryParamsSchema = searchableSchema.extend({
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
export const calendarEventsQueryParamsSchema = z.object({
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
