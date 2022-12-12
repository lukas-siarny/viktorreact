import { EventResizeDoneArg } from '@fullcalendar/interaction'
import { ColumnsType } from 'antd/lib/table'
import { PaginationProps } from 'antd'
import { EventDropArg, EventInput } from '@fullcalendar/react'

// utils
import {
	GENDER, MSG_TYPE, LANGUAGE, PERMISSION, SALON_PERMISSION, CALENDAR_EVENTS_VIEW_TYPE, SALON_STATES, EVERY_REPEAT,
	ENDS_EVENT, CALENDAR_EVENT_TYPE, CALENDAR_VIEW, CONFIRM_BULK, RS_NOTIFICATION, RS_NOTIFICATION_TYPE, DAY,
	SERVICE_TYPE,
	RESERVATION_STATE,
	RESERVATION_PAYMENT_METHOD
} from '../utils/enums'

// types
import { Paths } from './api'
import { TooltipPlacement } from 'antd/es/tooltip'

export interface IErrorMessage {
	type: MSG_TYPE
	message: string
}

export interface IResponsePagination {
	limit: number
	page: number
	totalPages: number
	totalCount: number
}

export interface ISelectOptionItem {
	key: number | string
	label: string
	value: number | string
	disabled?: boolean
	hardSelected?: boolean
	extra?: any
	className?: string
	level?: number
}

export type Columns = ColumnsType<any>

export interface ILoginForm {
	email: string
	password: string
}

export interface IInviteEmployeeForm {
	email: string
	roleID: string
}

export interface IEditEmployeeRoleForm {
	roleID: string
}

export interface ICreateUserForm {
	email: string
	phonePrefixCountryCode: string
	phone: string
	roleID: string
	assignedCountryCode: string
}

export interface IEditUserRoleForm {
	roleID: string
}

export interface IUserAccountForm {
	firstName: string
	lastName: string
	phonePrefixCountryCode: string
	phone: string
	avatar: any
	assignedCountryCode: string
}

// type of BE opening hours data
export type RawOpeningHours = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours']

type OpeningHoursDay = NonNullable<RawOpeningHours>[0]['day']

// type for OpeningHours component
export type OpeningHoursTimeRanges = {
	timeFrom: string
	timeTo: string
}[]

export type OpeningHours = {
	day: OpeningHoursDay
	timeRanges: OpeningHoursTimeRanges
	onDemand?: boolean
}[]

export interface ISalonForm {
	salonNameFromSelect: boolean
	id: string | null
	name: string | null
	nameSelect: { key: string; label: string | null; value: string | null } | null
	aboutUsFirst: string | null
	state?: SALON_STATES
	sourceOfPremium?: string,
	openingHours: OpeningHours
	sameOpenHoursOverWeek: boolean
	openOverWeekend: boolean
	country: string | null
	zipCode: string | null
	city: string | null
	street: string | null
	streetNumber: string | null
	latitude: number | null
	longitude: number | null
	parkingNote: string | null
	phones: { phonePrefixCountryCode: string | null; phone: string | null }[]
	email: string | null
	categoryIDs: [string, ...string[]] | null
	socialLinkFB: string | null
	socialLinkInstagram: string | null
	socialLinkWebPage: string | null
	socialLinkYoutube: string | null
	socialLinkTikTok: string | null
	socialLinkPinterest: string | null
	payByCard: boolean
	payByCash: boolean
	otherPaymentMethods: string | null
	logo: any | null
	gallery: any | null
	pricelistIDs?: string[]
	pricelists?: any
	locationNote: string | null
	cosmeticIDs: string[]
	languageIDs: string[]
	address: boolean | null
	deletedAt?: boolean
}

export interface IServiceForm {
	id: number
	durationFrom: number
	durationTo: number
	variableDuration: boolean
	priceFrom: number
	priceTo: number
	variablePrice: boolean
	useCategoryParameter: boolean
	serviceCategoryParameter: any
	employees: any
	settings: {
		enabledB2cReservations: boolean
		autoApproveReservatons: boolean
	}
}

export interface ICalendarReservationForm {
	customer: ISelectOptionItem
	service: ISelectOptionItem
	employee: ISelectOptionItem
	date: string
	timeFrom: string
	timeTo: string
	note?: string
	eventId?: string
	revertEvent?: () => void
}

export interface ICalendarEventForm {
	employee: ISelectOptionItem
	date: string
	timeFrom: string
	timeTo: string
	eventType: CALENDAR_EVENT_TYPE
	// pri drag and drope sa dotahuju z detailu eventu a nie z formu
	customRepeatOptions?: {
		untilDate: string,
		days: {
			[DAY.MONDAY]: boolean,
			[DAY.TUESDAY]: boolean,
			[DAY.WEDNESDAY]: boolean,
			[DAY.THURSDAY]: boolean,
			[DAY.FRIDAY]: boolean,
			[DAY.SATURDAY]: boolean,
			[DAY.SUNDAY]: boolean
		},
		week: 2 | 1
	} | undefined
	recurring?: boolean
	repeatOn?: DAY[]
	every?: EVERY_REPEAT
	end?: ENDS_EVENT
	note?: string
	allDay?: boolean
	// NOTE: pre akcie resize a drag and drop
	eventId?: string | null
	calendarBulkEventID?: string
	revertEvent?: () => void
}

export type INewCalendarEvent = Omit<ICalendarEventForm, 'eventType'> | null

export interface IEventTypeFilterForm {
	eventType: CALENDAR_EVENT_TYPE
}

export interface ISupportContactForm {
	id: string | null
	note: string
	openingHours: OpeningHours
	sameOpenHoursOverWeek: boolean
	openOverWeekend: boolean
	countryCode: string
	zipCode: string
	city: string
	street: string
	streetNumber: string
	phones: { phonePrefixCountryCode: string; phone: string }[]
	emails: { email: string }[]
}

export interface IRegistrationForm {
	email: string
	password: string
	confirmPassword: string
	phonePrefixCountryCode: string
	phone: string
	gdpr: boolean
	gtc: boolean
	marketing: boolean
}

export interface IForgotPasswordForm {
	email: string
}

export interface IActivationForm {
	code: string
}

export interface IBillingForm {
	countryCode?: string
	zipCode?: string
	city?: string
	street?: string
	streetNumber?: string
	email?: string
	firstName?: string
	lastName?: string
	phonePrefixCountryCode?: string
	phone?: string
	businessID?: string
	taxID?: string
	vatID?: string
	companyName?: string
}

export interface IJwtPayload {
	aud: string
	exp: number
	iat: number
	uid: string
}
export interface ICreatePasswordForm {
	password: string
	confirmPassword: string
}
export interface IForgotPasswordForm {
	email: string
}

export interface ILoadingAndFailure {
	isLoading: boolean
	isFailure: boolean
}

export interface IConfirmUserForm extends ICreatePasswordForm {
	name: string
	surname: string
}

export interface IComputedMatch<Params> {
	isExact: boolean
	params: Params
	path: string
	url: string
}

export interface IBreadcrumbItem {
	name: string
	link?: string
	queryParams?: string
	action?: any
	titleName?: string | null | undefined
}

export interface IBreadcrumbs {
	items: IBreadcrumbItem[]
}

export interface IStructuredAddress {
	zip: string | null
	street: string | null
	streetNumber: string | null
	city: string | null
	country: string | null
	houseNumber: string | null
}

export interface INoteForm {
	note: string
}

export interface INotinoUserForm {
	assignedUser: ISelectOptionItem
}

export interface IOpenHoursNoteForm {
	openingHoursNote: string
}

export interface ISearchFilter {
	search: string
}

export interface ICustomerForm {
	firstName: string
	lastName: string
	email?: string
	phonePrefixCountryCode: string
	phone: string
	gender?: GENDER
	note?: string
	zipCode?: string
	city?: string
	street?: string
	streetNumber?: string
	countryCode?: string
	salonID?: string
	gallery?: any
	avatar?: any
}

export interface IEmployeeForm {
	firstName: string
	lastName: string
	salonID: string
	email?: string
	phonePrefixCountryCode?: string
	phone?: string
	services?: any
	service?: string[]
	avatar?: any
	role: number
}

export interface ICosmeticForm {
	name: string
	image: any
}

export interface ISpecialistContactForm {
	email?: string
	phone: string
	phonePrefixCountryCode: string
	countryCode: string
}

export interface ISpecialistContactFilter {
	search: string
}

export interface ILanguageForm {
	image?: string
	nameLocalizations: NameLocalizationsItem[]
}

export interface ILanguagePickerForm {
	language: LANGUAGE
}

export interface IPrice {
	currency?: string
	exponent: number
	significand: number
}

export interface IUserAvatar {
	src?: string
	alt?: string
	text?: string
	key?: string | number
}

export interface IQueryParams {
	page: number
	limit?: any | undefined
	order?: string | undefined
	search?: string | undefined | null
}

interface IDataPagination {
	pagination: IResponsePagination
}

/**
 * enumerationsOptions are used for Select component
 */
export interface ISelectable<T> {
	enumerationsOptions: ISelectOptionItem[] | undefined
	data: T | undefined
}

/**
 * options are used for Select component
 * contains pagination
 * support async (on BE) searching
 */
export interface ISearchable<T extends IDataPagination> {
	options: ISelectOptionItem[] | undefined
	data: T | null
}

/**
 * options are used for Select component
 * contains pagination
 * support async (on BE) searching
 */
export interface ISearchableWithoutPagination<T> {
	options: ISelectOptionItem[] | undefined
	data: T | null
}

// type ITableItem  = { key: string | number }

// export interface ITableItems {
// 	tableData: (any & ITableItem)[] | undefined
// }

export interface SalonSubPageProps {
	salonID: string
	parentPath?: string
}

export type _Permissions = (PERMISSION | SALON_PERMISSION)[]

export interface IPermissions {
	uniqPermissions?: _Permissions
}

export interface ICurrency {
	code: Paths.GetApiB2BAdminEnumsCurrencies.Responses.$200['currencies'][0]['code']
	symbol: Paths.GetApiB2BAdminEnumsCurrencies.Responses.$200['currencies'][0]['symbol']
}

export interface INoteModal {
	title: string
	fieldPlaceholderText: string
	visible: boolean
	onSubmit?: (formData: any) => void
}

export interface IDataUploadForm {
	file: string | Blob
}

export type ICosmetic = Paths.GetApiB2BAdminEnumsCosmetics.Responses.$200['cosmetics'][0]

export type ILanguage = Paths.GetApiB2BAdminEnumsLanguages.Responses.$200['languages'][0]

export type ISpecialistContact = Paths.GetApiB2BAdminEnumsContactsContactId.Responses.$200['contact']

export interface IPagination extends PaginationProps {
	pageSizeOptions?: number[]
}

export type ICategoryParameters = Paths.GetApiB2BAdminEnumsCategoryParameters.Responses.$200['categoryParameters']

export type ICategoryParameter = Paths.GetApiB2BAdminEnumsCategoryParametersCategoryParameterId.Responses.$200['categoryParameter']

interface ILocalizedValue {
	valueLocalizations: ICategoryParameter['values']['0']['valueLocalizations']
}

export interface ICategoryParamForm {
	nameLocalizations: ICategoryParameter['nameLocalizations']
	valueType: ICategoryParameter['valueType']
	localizedValues: ILocalizedValue[]
	values: Pick<ICategoryParameter['values']['0'], 'value'>[]
}

export interface IIndustriesForm {
	categoryIDs: string[]
}

export interface IIndustryForm {
	categoryIDs: string[]
}

export interface IReservationsSettingsNotification {
	b2bChannels: {
		[key in RS_NOTIFICATION_TYPE]?: boolean
	}[]
	b2cChannels: {
		[key in RS_NOTIFICATION_TYPE]?: boolean
	}[]
}

export interface IReservationSystemSettingsForm {
	enabledReservations?: boolean | null
	maxDaysB2cCreateReservation?: number | null
	maxHoursB2cCreateReservationBeforeStart?: number | null
	maxHoursB2cCancelReservationBeforeStart?: number | null
	minutesIntervalB2CReservations?: number | null
	// Pomocne checky pre chekcnutie all hodnot pre BOOKING / AUTO CONFIRM
	autoConfirmAll: boolean
	onlineBookingAll: boolean
	disabledNotifications: {
		[key in RS_NOTIFICATION]: IReservationsSettingsNotification
	}
	servicesSettings: {
		[key in SERVICE_TYPE]: {
			[key: string]: boolean
		}
	}
}

export type NameLocalizationsItem = {
	language: string
	value: string
}

export type CategoriesPatch = Paths.PatchApiB2BAdminSalonsSalonIdCategories.RequestBody

export interface IDateTimeFilterOption {
	value: number
	unit: 'day' | 'week'
	name: string
}

export interface ISalonRolePermission {
	description: string
	checked: boolean
}

export interface IRoleDescription {
	key: string
	name: string
	permissions: ISalonRolePermission[]
}

export type CountriesData = Paths.GetApiB2BAdminEnumsCountries.Responses.$200['countries']

export interface IEnumerationOptions {
	key: string | number
	label: string
	value: string | number
	flag?: string
}

export interface IEnumerationsPayload {
	pagination: IResponsePagination | null
	enumerationsOptions: IEnumerationOptions[]
}

export interface IEnumerationsCountriesPayload extends IEnumerationsPayload {
	data: CountriesData | null
}

export interface IAuthUserPayload {
	data: ((Paths.PostApiB2BAdminAuthLogin.Responses.$200['user'] | null) & IPermissions) | null
}

export interface IEmployeePayload {
	data: Paths.GetApiB2BAdminEmployeesEmployeeId.Responses.$200 | null
}

export interface SalonPageProps {
	isAdmin: boolean
	backUrl?: string
	phonePrefixCountryCode: string
	authUser: IAuthUserPayload & ILoadingAndFailure
	phonePrefixes: IEnumerationsCountriesPayload & ILoadingAndFailure
}

export interface AlertData {
	label: React.ReactElement
	count: number
	onClick: (...args: any) => any
}

export interface DashboardData {
	alertData: AlertData[]
	graphData: {
		premiumVsBasic: any[]
		salonStates: any[]
		noSalons?: boolean
	}
}

interface LineDataset {
	data: number[]
	backgroundColor: string
	borderColor: string
	pointRadius: number
}

export interface TimeStatsData {
	labels: string[]
	datasets: LineDataset[]
	columns: any[]
	breakIndex?: number
}

export interface TimeStats extends ILoadingAndFailure {
	data: TimeStatsData | null
}

export interface ICalendarFilter {
	employeeIDs?: string[]
	categoryIDs?: string[]
}

export interface IEmployeesPayload extends ISearchable<Paths.GetApiB2BAdminEmployees.Responses.$200> {}
export type Employees = NonNullable<IEmployeesPayload['data']>['employees']

export type Employee = Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0]
type CalendarEmployee = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['employees'][0]
export type CalendarEvents = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['calendarEvents']
export type CalendarEvent = CalendarEvents[0] & {
	startDateTime: string
	endDateTime: string
	isMultiDayEvent?: boolean
	isFirstMultiDayEventInCurrentRange?: boolean
	isLastMultiDaylEventInCurrentRange?: boolean
	originalEvent?: CalendarEvent
	employee: CalendarEmployee
	isPlaceholder?: boolean
}

export interface ICalendarEventsPayload {
	data: CalendarEvent[] | null
}

export interface ICalendarView {
	selectedDate: string
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	reservations: ICalendarEventsPayload['data']
	shiftsTimeOffs: ICalendarEventsPayload['data']
	employees: Employees
	salonID: string
	onAddEvent: (event: INewCalendarEvent) => void
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	onReservationClick: (data: ReservationPopoverData, position: ReservationPopoverPosition) => void
	onEventChange?: (calendarView: CALENDAR_VIEW, arg: EventDropArg | EventResizeDoneArg, changeType?: 'drop' | 'resize') => void
	loading?: boolean
	virtualEvent?: EventInput
	clearRestartInterval: () => void
}

export interface IEventCardProps {
	calendarView: CALENDAR_VIEW
	resourceId: string
	start: Date | null
	end: Date | null
	diff: number
	timeText: string
	isMultiDayEvent?: boolean
	isLastMultiDaylEventInCurrentRange?: boolean
	isFirstMultiDayEventInCurrentRange?: boolean
	employee?: CalendarEvent['employee']
	backgroundColor?: string
	isPlaceholder?: boolean
	isEdit?: boolean
	originalEventData: {
		id?: CalendarEvent['id']
		start?: CalendarEvent['start']
		end?: CalendarEvent['end']
		startDateTime?: CalendarEvent['startDateTime']
		endDateTime?: CalendarEvent['endDateTime']
	}
}

export interface ICalendarReservationPopover {
	data: ReservationPopoverData | null
	position: ReservationPopoverPosition | null
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handleUpdateReservationState: (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) => void
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	placement: TooltipPlacement
}

export type ReservationPopoverPosition = {
	top: number
	left: number
	width: number
	height: number
}

export type ReservationPopoverData = {
	start: Date | null
	end: Date | null
	color?: string
	service?: CalendarEvent['service']
	customer?: CalendarEvent['customer']
	employee?: CalendarEvent['employee']
	reservationData?: CalendarEvent['reservationData']
	originalEventData: IEventCardProps['originalEventData']
	note?: CalendarEvent['note']
	noteFromB2CCustomer?: CalendarEvent['noteFromB2CCustomer']
}

export interface IBulkConfirmForm {
	actionType: CONFIRM_BULK
}

export interface IEventExtenedProps {
	eventData?: CalendarEvent
}

export interface IResourceEmployee {
	id: string
	image: string,
	name: string
	isTimeOff: boolean
	color?: string
	description?: string
}

export interface IDayViewResourceExtenedProps {
	employee?: IResourceEmployee
}

export interface IWeekViewResourceExtenedProps {
	day?: string
	employee?: IResourceEmployee
}

export interface ICalendarEventCardData {
	id: string
	resourceId: string
	start: string
	end: string
	editable: boolean
	resourceEditable: boolean
	allDay: boolean
	isPlaceholder?: boolean
	eventData: CalendarEvent
}

export type ConfirmModalReservationData = { values: ICalendarReservationForm }
export type ConfirmModalEventnData = { values: ICalendarEventForm }
export type ConfirmModalDeleteEventData = {
	eventId: string
	calendarBulkEventID?: string
	eventType?: CALENDAR_EVENT_TYPE }
export type ConfirmModalUpdateReservationData = {
	calendarEventID: string
	state: RESERVATION_STATE
	reason?: string
	paymentMethod?: RESERVATION_PAYMENT_METHOD }

export type ConfirmModalDataValues = ConfirmModalReservationData | ConfirmModalEventnData | ConfirmModalDeleteEventData | ConfirmModalUpdateReservationData
