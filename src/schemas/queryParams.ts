import { z } from 'zod'
import dayjs, { type Dayjs } from 'dayjs'
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
	EMPLOYEES_TAB_KEYS,
	REVIEW_VERIFICATION_STATUS,
	REVIEWS_TAB_KEYS,
	DEFAULT_DATE_INIT_FORMAT,
	CALENDAR_EVENT_TYPE_REQUEST,
	ASSET_TYPE
} from '../utils/enums'
import { dateConstraint, twoCharsConstraint, uuidConstraint } from './baseSchema'

const paginationSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
	order: z.string().optional()
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
	categoryFirstLevelIDs: uuidConstraint.array().nullish(),
	categoryThirdLevelIDs: uuidConstraint.array().nullish(),
	statuses_all: z.boolean().nullish(),
	statuses_published: z.enum([SALON_FILTER_STATES.PUBLISHED, SALON_FILTER_STATES.NOT_PUBLISHED]).nullish(),
	statuses_changes: z.enum([SALON_FILTER_STATES.PENDING_PUBLICATION, SALON_FILTER_STATES.DECLINED]).nullish(),
	countryCode: twoCharsConstraint.nullish(),
	createType: z.nativeEnum(SALON_CREATE_TYPE).nullish(),
	lastUpdatedAtFrom: z.string().nullish(),
	lastUpdatedAtTo: z.string().nullish(),
	hasSetOpeningHours: z.nativeEnum(SALON_FILTER_OPENING_HOURS).nullish(),
	sourceType: z.nativeEnum(SALON_SOURCE_TYPE).nullish(),
	assignedUserID: uuidConstraint.nullish(),
	premiumSourceUserType: z.nativeEnum(SALON_SOURCE_TYPE).nullish(),
	hasAvailableReservationSystem: z.nativeEnum(SALON_FILTER_RS_AVAILABLE_ONLINE).nullish(),
	enabledReservationsSetting: z.nativeEnum(SALON_FILTER_RS).nullish(),
	walletAvailableBalanceFrom: z.number().nullish(),
	walletAvailableBalanceTo: z.number().nullish(),
	salonState: z.nativeEnum(SALONS_TAB_KEYS).nullish()
})

const salonsToCheckQueryParamsSchema = searchableSchema.omit({ order: true }).extend({
	statuses_all: z.boolean().nullish(),
	statuses_published: z.enum([SALON_FILTER_STATES.PUBLISHED, SALON_FILTER_STATES.NOT_PUBLISHED]).nullish(),
	statuses_changes: z.enum([SALON_FILTER_STATES.PENDING_PUBLICATION, SALON_FILTER_STATES.DECLINED]).nullish(),
	countryCode: twoCharsConstraint.nullish(),
	createType: z.nativeEnum(SALON_CREATE_TYPE).nullish(),
	assignedUserID: uuidConstraint.nullish()
})

const salonHistoryQueryParamsSchema = paginationSchema.omit({ order: true }).extend({
	dateFrom: dateConstraint.catch(dayjs().subtract(1, 'week').format(DEFAULT_DATE_INIT_FORMAT)),
	dateTo: dateConstraint.catch(dayjs().format(DEFAULT_DATE_INIT_FORMAT)),
	salonID: uuidConstraint
})

export type IGetSalonsHistoryQueryParams = z.infer<typeof salonHistoryQueryParamsSchema>
export type IGetSalonsToCheckQueryParams = z.infer<typeof salonsToCheckQueryParamsSchema>
export type IGetSalonsQueryParams = z.infer<typeof salonsQueryParamsSchema>

// url query params
export const salonsActivePageURLQueryParamsSchema = salonsQueryParamsSchema.pick({
	page: true,
	limit: true,
	order: true,
	search: true,
	categoryFirstLevelIDs: true,
	categoryThirdLevelIDs: true,
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
	enabledReservationsSetting: true
})

export const salonsDeletedPageURLQueryParamsSchema = salonsQueryParamsSchema.pick({
	page: true,
	limit: true,
	order: true,
	search: true,
	categoryFirstLevelIDs: true,
	categoryThirdLevelIDs: true,
	countryCode: true
})

export const salonsToCheckPageURLQueryParamsSchema = salonsToCheckQueryParamsSchema

export const salonsRejectedSuggestionsPageURLQueryParamsSchema = searchableSchema

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

export const salonHistoryPageURLQueryParamsSchema = salonHistoryQueryParamsSchema.omit({ salonID: true })

export type ISalonsActivePageURLQueryParams = z.infer<typeof salonsActivePageURLQueryParamsSchema>
export type ISalonsDeletedPageURLQueryParams = z.infer<typeof salonsDeletedPageURLQueryParamsSchema>
export type ISalonsRejectedSuggestionsPageURLQueryParams = z.infer<typeof salonsRejectedSuggestionsPageURLQueryParamsSchema>
export type IRechargeSmsCreditAdminPageURLQueryParams = z.infer<typeof rechargeSmsCreditAdminPageSchema>
export type ISalonHistoryPageURLQueryParams = z.infer<typeof salonHistoryPageURLQueryParamsSchema>
export type ISalonToCheckPageURLQueryParams = z.infer<typeof salonsToCheckPageURLQueryParamsSchema>

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
	eventTypes: z.enum(CALENDAR_EVENT_TYPE_REQUEST).array().nullish(),
	reservationStates: z.nativeEnum(RESERVATION_STATE).array().nullish()
})

export const calendarReservationsQueryParamsSchema = calendarEventsQueryParamsSchema.omit({ reservationStates: true })

export const calendarShiftsTimeOffQueryParamsSchema = calendarEventsQueryParamsSchema.pick({ salonID: true, start: true, end: true, employeeIDs: true })

export type ICalendarEventsQueryParams = z.infer<typeof calendarEventsQueryParamsSchema>
export type ICalendarReservationsQueryParams = z.infer<typeof calendarReservationsQueryParamsSchema>
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
export const employeesPageURLQueryParams = employeesQueryParamsSchema.omit({ salonID: true }).extend({
	employeeState: z.nativeEnum(EMPLOYEES_TAB_KEYS).catch(EMPLOYEES_TAB_KEYS.ACTIVE)
})

export type IEmployeesPageURLQueryParams = z.infer<typeof employeesPageURLQueryParams>

/**
 * Customers
 */
// actions query params
const customersQueryParamsSchema = searchableSchema.extend({
	salonID: uuidConstraint.nullish()
})

export type IGetCustomersQueryParams = z.infer<typeof customersQueryParamsSchema>

// url query params
export const customersPageURLQueryParams = customersQueryParamsSchema.omit({ salonID: true })

export type ICustomersPageURLQueryParams = z.infer<typeof customersPageURLQueryParams>

/**
 * Salon services
 */
// actions query params
const servicesQueryParamsSchema = z.object({
	salonID: uuidConstraint,
	rootCategoryID: uuidConstraint.nullish()
})

export type IGetServicesQueryParams = z.infer<typeof servicesQueryParamsSchema>

// url query params
export const servicesPageURLQueryParams = servicesQueryParamsSchema.omit({ salonID: true })

export type IServicesPageURLQueryParams = z.infer<typeof servicesPageURLQueryParams>

/**
 * Support contacts
 */
// actions query params
const supportContactsQueryParamsSchema = z.object({
	countryCode: twoCharsConstraint.nullish()
})

export type IGetSupportContactsQueryParams = z.infer<typeof supportContactsQueryParamsSchema>

// url query params
export const supportContactsPageURLQueryParams = z.object({
	search: z.string().nullish(),
	order: z.string().nullish()
})

export type ISupportContactsPageURLQueryParams = z.infer<typeof supportContactsPageURLQueryParams>

/**
 * Languages
 */
// url query params
export const languagesPageURLQueryParams = z.object({
	search: z.string().nullish(),
	order: z.string().nullish()
})

export type ILanguagesPageURLQueryParams = z.infer<typeof languagesPageURLQueryParams>

/**
 * Cosmetics
 */
// actions query params
const cosmeticsQueryParamsSchema = searchableSchema.omit({ order: true })

export type IGetCosmeticsQueryParams = z.infer<typeof cosmeticsQueryParamsSchema>

// url query params
export const cosmeticsPageURLQueryParams = cosmeticsQueryParamsSchema

export type ICosmeticsPageURLQueryParams = z.infer<typeof cosmeticsPageURLQueryParams>

/**
 * Category params
 */
// url query params
export const categoryParamsPageURLQueryParams = z.object({
	search: z.string().nullish(),
	order: z.string().nullish()
})

export type ICategoryParamsPageURLQueryParams = z.infer<typeof categoryParamsPageURLQueryParams>

/**
 * Users
 */
// actions query params
const usersQueryParamsSchema = searchableSchema.extend({
	roleID: uuidConstraint.nullish()
})

export type IGetUsersQueryParams = z.infer<typeof usersQueryParamsSchema>

// url query params
export const usersPageURLQueryParams = usersQueryParamsSchema

export type IUsersPageURLQueryParams = z.infer<typeof usersPageURLQueryParams>

/**
 * Create password route
 */
// url query params
export const createPasswordPageURLQueryParamsSchema = z.object({
	t: z.string().nullish()
})

export type ICreatePasswordPageURLQueryParams = z.infer<typeof createPasswordPageURLQueryParamsSchema>

/**
 * Sms credits
 */
// actions query params
const smsHistoryQueryParamsSchema = searchableSchema.extend({
	salonID: uuidConstraint,
	dateFrom: dateConstraint.nullish(),
	dateTo: dateConstraint.nullish()
})

const smsUnitPricesParamsSchema = searchableSchema.omit({ search: true }).extend({
	countryCode: twoCharsConstraint
})

export type IGetSmsHistoryQueryParams = z.infer<typeof smsHistoryQueryParamsSchema>
export type IGetSmsUnitPricesQueryParams = z.infer<typeof smsUnitPricesParamsSchema>

// page query params
export const smsCreditPartnerPageQueryParams = smsHistoryQueryParamsSchema.omit({ salonID: true, dateFrom: true, dateTo: true }).extend({
	date: z.instanceof(dayjs as unknown as typeof Dayjs)
})

export const smsUnitPricesDetailPageQueryParams = searchableSchema.omit({ search: true })

export type ISmsCreditPartnerPageQueryParams = z.infer<typeof smsCreditPartnerPageQueryParams>
export type ISmsUnitPricesDetailPageQueryParams = z.infer<typeof smsUnitPricesDetailPageQueryParams>

/**
 * Reviews
 */
// actions query params
const reviewsQueryParamsSchema = searchableSchema.extend({
	verificationStatus: z.nativeEnum(REVIEW_VERIFICATION_STATUS).optional(),
	deleted: z.boolean().optional(),
	salonCountryCode: twoCharsConstraint.nullish(),
	toxicityScoreFrom: z.number().optional(),
	toxicityScoreTo: z.number().optional()
})

export type IGetReviewsQueryParams = z.infer<typeof reviewsQueryParamsSchema>

// url query params
export const reviewsPageURLQueryParams = reviewsQueryParamsSchema.omit({ deleted: true }).extend({
	reviewState: z.nativeEnum(REVIEWS_TAB_KEYS).catch(REVIEWS_TAB_KEYS.PUBLISHED)
})

export type IReviewsPageURLQueryParams = z.infer<typeof reviewsPageURLQueryParams>

/**
 * Specalist contacts
 */
export const specialistContactsPageURLQueryParams = z.object({
	search: z.string().nullish(),
	order: z.string().nullish()
})

export type ISpecialistContactsPageURLQueryParams = z.infer<typeof specialistContactsPageURLQueryParams>

/**
 * Documents
 */

export const documentsPageQueryParams = paginationSchema
export const documentsPageURLQueryParamsSchema = documentsPageQueryParams.extend({
	languageCode: twoCharsConstraint.optional(),
	assetType: z.nativeEnum(ASSET_TYPE).optional()
})

export type IDocumentsPageQueryParams = z.infer<typeof documentsPageQueryParams>

export type IDocumentsPageURLQueryParams = z.infer<typeof documentsPageURLQueryParamsSchema>

/**
 * Documents by asset types
 */

export const documentsAssetTypesRequestQueryParams = paginationSchema.extend({
	languageCode: twoCharsConstraint,
	assetType: z.nativeEnum(ASSET_TYPE)
})

export type IDocumentsAssetTypesRequestQueryParams = z.infer<typeof documentsAssetTypesRequestQueryParams>
export const documentsAssetTypesPageURLQueryParamsSchema = documentsAssetTypesRequestQueryParams.omit({ assetType: true })

export type IDocumentsAssetTypesPageURLQueryParams = z.infer<typeof documentsAssetTypesPageURLQueryParamsSchema>

/**
 * MSredirect
 */
export const msRedircetPageURLQueryParams = z.object({
	code: z.string().nullish(),
	state: z.string().default('').catch('')
})

export type IMsRedircetPageURLQueryParams = z.infer<typeof msRedircetPageURLQueryParams>
