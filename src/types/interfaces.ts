import { IUseQueryParams } from './../hooks/useQueryParams'
import { EventDragStartArg, EventResizeDoneArg, EventResizeStartArg, EventResizeStopArg } from '@fullcalendar/interaction'
import { ColumnsType } from 'antd/lib/table'
import { PaginationProps } from 'antd'
import { EventDropArg, EventInput } from '@fullcalendar/react'

// utils
import {
	GENDER,
	MSG_TYPE,
	LANGUAGE,
	PERMISSION,
	CALENDAR_EVENTS_VIEW_TYPE,
	SALON_STATES,
	EVERY_REPEAT,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	CONFIRM_BULK,
	RS_NOTIFICATION,
	RS_NOTIFICATION_TYPE,
	DAY,
	SERVICE_TYPE,
	RESERVATION_STATE,
	RESERVATION_PAYMENT_METHOD,
	CONFIRM_MODAL_DATA_TYPE,
	CALENDAR_EVENT_DISPLAY_TYPE,
	PARAMETER_TYPE,
	RESERVATION_SOURCE_TYPE
} from '../utils/enums'

// types
import { Paths } from './api'
import { TooltipPlacement } from 'antd/es/tooltip'

export interface IErrorMessage {
	type: MSG_TYPE
	message: string
}

export interface IPaginationQuery {
	limit?: number | null | string
	page?: number | null | string
	order?: string | null
}

export interface IResponsePagination {
	limit: number
	page: number
	totalPages: number
	totalCount: number
}

export interface ISelectOptionItem<ExtraType = any> {
	key: number | string
	label: string
	value: number | string
	disabled?: boolean
	hardSelected?: boolean
	extra?: ExtraType
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

export type ServiceRootCategory = Paths.GetApiB2BAdminEmployeesEmployeeId.Responses.$200['employee']['categories']

export type ServiceType = NonNullable<
	NonNullable<Paths.GetApiB2BV1Services.Responses.$200['groupedServicesByCategory'][0]['category']>['children'][0]['category']
>['children'][0]['service']

export type ServicePriceAndDurationData = ServiceType['priceAndDurationData']
export type ServiceCategoryParameter = ServiceType['serviceCategoryParameter']

export type ServiceDetail = Paths.GetApiB2BAdminServicesServiceId.Responses.$200['service']

export type FormPriceAndDurationData = {
	durationFrom?: number | null
	durationTo?: number | null
	priceFrom?: number | null
	priceTo?: number | null
	variableDuration?: boolean
	variablePrice?: boolean
}

export type EmployeeServiceData = {
	id: string
	employee: {
		id: string
		name?: string
		image?: string
		fallbackImage?: string
		email?: string
		inviteEmail?: string
		hasActiveAccount?: boolean
	}
	name?: string
	industry?: string
	category?: string
	image?: string
	useCategoryParameter: boolean
	employeePriceAndDurationData?: FormPriceAndDurationData
	salonPriceAndDurationData?: FormPriceAndDurationData
	hasOverriddenPricesAndDurationData?: boolean
	serviceCategoryParameter?: {
		id: string
		name?: string
		employeePriceAndDurationData?: FormPriceAndDurationData
		salonPriceAndDurationData: FormPriceAndDurationData
		hasOverriddenPricesAndDurationData?: boolean
	}[]
	serviceCategoryParameterType?: PARAMETER_TYPE
	serviceCategoryParameterName?: string
	serviceCategoryParameterId?: string
}

export type IEmployeeServiceEditForm = EmployeeServiceData & {}
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

export interface AutocompleteLabelInValue {
	key: string
	label: string | null
	value: string | null
}
export interface ISalonForm {
	salonNameFromSelect: boolean
	id: string | null
	name: AutocompleteLabelInValue | string | null
	aboutUsFirst: string | null
	state?: SALON_STATES
	sourceOfPremium?: string
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

export interface IParameterValue {
	id: string | undefined
	name: string | undefined
	durationFrom: number | null | undefined
	durationTo: number | null | undefined
	variableDuration: boolean
	priceFrom: number | null | undefined
	priceTo: number | null | undefined
	variablePrice: boolean
	useParameter: boolean
}
export interface IServiceForm {
	id: string
	durationFrom?: number
	durationTo?: number
	variableDuration: boolean
	priceFrom?: number | null
	priceTo?: number | null
	variablePrice: boolean
	useCategoryParameter: boolean
	serviceCategoryParameterType?: PARAMETER_TYPE
	serviceCategoryParameterName?: string
	serviceCategoryParameter: IParameterValue[]
	employee?: string[]
	employees: EmployeeServiceData[]
	settings: {
		enabledB2cReservations: boolean
		autoApproveReservations: boolean
	}
}

export type CalendarEventDetail = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCalendarEventId.Responses.$200['calendarEvent']
export interface ICalendarEventDetailPayload {
	data: CalendarEventDetail | null
}
export interface ICalendarReservationForm {
	customer: ISelectOptionItem<{
		customerData?: NonNullable<ICalendarEventDetailPayload['data']>['customer']
	}>
	service: ISelectOptionItem<{
		priceAndDurationData?: ServiceType['priceAndDurationData'],
		useCategoryParameter?: ServiceType['useCategoryParameter'],
		serviceCategoryParameter?: ServiceType['serviceCategoryParameter'],
		categoryId?: string
		serviceData?: NonNullable<ICalendarEventDetailPayload['data']>['service']
	}>
	employee: ICalendarEmployeeOptionItem
	date: string
	timeFrom: string
	timeTo: string
	note?: string
	eventId?: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	noteFromB2CCustomer?: string
	reservationData?: CalendarEvent['reservationData']
	isImported?: boolean
	eventType: CALENDAR_EVENT_TYPE
}
export interface ICalendarEventForm {
	employee: ICalendarEmployeeOptionItem
	date: string
	timeFrom: string
	timeTo: string
	eventType: CALENDAR_EVENT_TYPE
	recurring?: boolean
	repeatOn?: DAY[]
	every?: EVERY_REPEAT
	end?: string
	note?: string
	allDay?: boolean
	// NOTE: pre akcie resize a drag and drop
	eventId?: string | null
	calendarBulkEventID?: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	isImported?: boolean
}

export interface ICalendarImportedReservationForm {
	date: string
	timeFrom: string
	timeTo: string
	note?: string
	eventId: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	employee: ISelectOptionItem
	isImported?: boolean
	eventType: CALENDAR_EVENT_TYPE
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
	hasActiveAccount?: boolean
	orderIndex?: number
	deletedAt?: string
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

export interface ISmsUnitPricesForm {
	validFrom: string
	amount: number
	countryCode: string
}

export interface IRechargeSmsCreditForm {
	amount: number
	transactionNote?: string
}

export interface ISmsUnitPricesFilter {
	search: string
}

export interface ISmsHistoryFilter {
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
	page?: number | null | string
	limit?: any | undefined
	order?: string | undefined | null
	search?: string | undefined | null
}

export interface IDataPagination {
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
	options?: ISelectOptionItem[] | undefined
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

export interface IPermissions {
	uniqPermissions?: PERMISSION[]
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
	enabledCustomerReservationNotes?: boolean
	enabledB2cReservations?: boolean
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

export interface IUserPayload {
	data: Paths.GetApiB2BAdminUsersUserId.Responses.$200 | null
}

export interface IAuthUserPayload {
	data: ((Paths.PostApiB2BAdminAuthLogin.Responses.$200['user'] | null) & IPermissions) | null
}

export interface IEmployeePayload {
	data: Paths.GetApiB2BAdminEmployeesEmployeeId.Responses.$200 | null
}

export type EmployeeService = NonNullable<IEmployeePayload['data']>['employee']['categories'][0]['children'][0]['children'][0]

export interface SalonPageProps {
	isNotinoUser: boolean
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

export interface IEmployeesPayload extends ISearchable<Paths.GetApiB2BAdminEmployees.Responses.$200> {
	tableData: (Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0] & { key: number })[]
}

export interface IDeletedEmployeesPayload extends ISearchable<Paths.GetApiB2BAdminEmployees.Responses.$200> {
	tableData: (Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0] & { key: string })[]
}

export interface IActiveEmployeesPayload extends ISearchable<Paths.GetApiB2BAdminEmployees.Responses.$200> {
	tableData: (Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0] & { key: number })[]
}

export type Employees = NonNullable<IEmployeesPayload['data']>['employees']

export type Employee = Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0]
export type CalendarEmployee = Pick<Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['employees'][0], 'id' | 'color' | 'firstName' | 'lastName' | 'email' | 'image' | 'inviteEmail' | 'orderIndex'> & { orderIndex: number, inviteEmail?: string, isForImportedEvents: boolean; isDeleted?: boolean }
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
	isImported: boolean
}

export type ICalendarEmployeeOptionItem = ISelectOptionItem<{
	employeeData: CalendarEmployee
	thumbnail: string
	color: string
	isDeleted: boolean
}>

export interface ICalendarEventsPayload {
	data: CalendarEvent[] | null
}

export type ICalendarMonthlyViewEvent = Omit<Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCountsAndDurations.Responses.$200['calendarEvents'][0][0], 'employeeID'> & {
	id: string
	employee: CalendarEmployee
}
export type ICalendarMonthlyViewDay = { [key: string]: ICalendarMonthlyViewEvent[]  }

export interface ICalendarMonthlyReservationsPayload {
	data: ICalendarMonthlyViewDay | null
}

export interface ICalendarEmployeesPayload {
	data: CalendarEmployee[] | null
	options: ICalendarEmployeeOptionItem[]
}
export interface ICalendarView {
	selectedDate: string
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	reservations: ICalendarEventsPayload['data']
	shiftsTimeOffs: ICalendarEventsPayload['data']
	onAddEvent: (event: INewCalendarEvent) => void
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	onReservationClick: (data: ReservationPopoverData, position: PopoverTriggerPosition) => void
	onEventChange: (arg: EventDropArg | EventResizeDoneArg, changeType?: 'drop' | 'resize') => void
	onEventChangeStart: (arg: EventDropArg | EventResizeStartArg) => void
	onEventChangeStop: (arg: EventDropArg | EventResizeStopArg) => void
	loading?: boolean
	virtualEvent?: EventInput
	disableRender?: boolean
	view?: CALENDAR_VIEW
	enabledSalonReservations?: boolean
	employees: CalendarEmployee[]
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
	isEventsListPopover?: boolean
	isEdit?: boolean
	originalEventData: {
		id?: CalendarEvent['id']
		start?: CalendarEvent['start']
		end?: CalendarEvent['end']
		startDateTime?: CalendarEvent['startDateTime']
		endDateTime?: CalendarEvent['endDateTime']
	}
	timeLeftClassName?: string
}

export type PopoverTriggerPosition = {
	top: number
	left: number
	width: number
	height: number
}

export interface ICalendarReservationPopover {
	data: ReservationPopoverData | null
	position: PopoverTriggerPosition | null
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handleUpdateReservationState: (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) => void
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	placement: TooltipPlacement
}

export interface ICalendarEventsListPopover {
	date: string | null
	position: PopoverTriggerPosition | null
	isOpen: boolean
	isReservationsView?: boolean
	setIsOpen: (isOpen: boolean) => void
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	onReservationClick: (data: ReservationPopoverData, position: PopoverTriggerPosition) => void
	isHidden: boolean
	isLoading?: boolean
	isUpdatingEvent?: boolean
	query: IUseQueryParams
	parentPath: string
	employeeID?: string
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
	isEdit?: boolean
}

export interface IBulkConfirmForm {
	actionType: CONFIRM_BULK
}

export interface IEventExtenedProps {
	eventData?: CalendarEvent
}

export interface IResourceEmployee {
	id: string
	image: string
	name: string
	isTimeOff: boolean
	color?: string
	description?: string
	isForImportedEvents?: boolean
	isDeleted?: boolean
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
	editable?: boolean
	resourceEditable?: boolean
	allDay: boolean
	isPlaceholder?: boolean
	eventData: CalendarEvent
}

export interface ICalendarMonthlyReservationsCardData extends Omit<ICalendarEventCardData, 'resourceId' | 'eventData'> {
	eventData: ICalendarMonthlyViewEvent
}

export type ConfirmModalReservationData = {
	key: CONFIRM_MODAL_DATA_TYPE.RESERVATION
	values: ICalendarReservationForm
}

export type ConfirmModalEventnData = {
	key: CONFIRM_MODAL_DATA_TYPE.EVENT
	values: ICalendarEventForm
}

export type ConfirmModalDeleteEventData = {
	key: CONFIRM_MODAL_DATA_TYPE.DELETE_EVENT
	eventId: string
	calendarBulkEventID?: string
	eventType?: CALENDAR_EVENT_TYPE
}

export type ConfirmModalUpdateReservationData = {
	key: CONFIRM_MODAL_DATA_TYPE.UPDATE_RESERVATION_STATE
	calendarEventID: string
	state: RESERVATION_STATE
	reason?: string
	paymentMethod?: RESERVATION_PAYMENT_METHOD
}

export type ConfirmModalData = ConfirmModalReservationData | ConfirmModalEventnData | ConfirmModalDeleteEventData | ConfirmModalUpdateReservationData | null

export interface ICalendarEventContent {
	id: string
	// start - pre fullcalendar (moze sa lisit od realneho zaciatku eventu, napr. v tyzdennom view, pri multidnovych eventoch)
	start: Date | null
	// end - pre fullcalendar (moze sa lisit od realneho konca eventu, napr. v tyzdennom view, pri multidnovych eventoch)
	end: Date | null
	eventDisplayType: CALENDAR_EVENT_DISPLAY_TYPE
	backgroundColor?: string
	eventData?: CalendarEvent
	calendarView: CALENDAR_VIEW
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	onReservationClick: (data: ReservationPopoverData, position: PopoverTriggerPosition) => void
	isEventsListPopover?: boolean
}

export interface ICalendarDayEvents {
	[key: string]: CalendarEvent[]
}

export interface ICalendarDayEventsMap {
	[key: string]: number
}
export interface IReservationsFilter {
	dateFrom: string
	employeeIDs?: string[]
	categoryIDs?: string[]
	reservationStates?: RESERVATION_STATE[]
	reservationPaymentMethods?: RESERVATION_PAYMENT_METHOD[]
	reservationCreateSourceType?: RESERVATION_SOURCE_TYPE
}
export type ServicePatchBody = Paths.PatchApiB2BAdminEmployeesEmployeeIdServicesServiceId.RequestBody

export type DisabledNotificationsArray = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['settings']['disabledNotifications']

export type PathSettingsBody = Paths.PatchApiB2BAdminSalonsSalonIdSettings.RequestBody

export type ReservationsEmployees = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsPaginated.Responses.$200['employees']
