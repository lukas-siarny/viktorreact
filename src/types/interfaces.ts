import { EventResizeDoneArg, EventResizeStartArg, EventResizeStopArg } from '@fullcalendar/interaction'
import { ColumnsType } from 'antd/lib/table'
import { CheckboxOptionType, PaginationProps } from 'antd'
import { EventDropArg, EventInput } from '@fullcalendar/react'

// utils
import {
	MSG_TYPE,
	LANGUAGE,
	PERMISSION,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	CONFIRM_BULK,
	RS_NOTIFICATION,
	RS_NOTIFICATION_TYPE,
	RESERVATION_STATE,
	RESERVATION_PAYMENT_METHOD,
	CONFIRM_MODAL_DATA_TYPE,
	SALON_TABS_KEYS,
	CALENDAR_EVENT_DISPLAY_TYPE,
	MS_REDIRECT_MESSAGE_KEY
} from '../utils/enums'

// types
import { Paths } from './api'
import { TooltipPlacement } from 'antd/es/tooltip'

// schema
import { ICalendarEventForm } from '../schemas/event'
import { ICalendarReservationForm } from '../schemas/reservation'
import {
	ICalendarPageURLQueryParams, IDocumentsPageURLQueryParams,
	INotinoReservationsPageURLQueryParams,
	IRechargeSmsCreditAdminPageURLQueryParams,
	IReviewsPageURLQueryParams,
	ISalonReservationsPageURLQueryParams,
	IServicesPageURLQueryParams
} from '../schemas/queryParams'
import { AxiosError } from 'axios'

export interface IErrorMessage {
	type: MSG_TYPE
	message: string
	path?: string
}

export interface IPaginationQuery {
	limit?: number | null | string
	page?: number | null | string
	order?: string | null
}

export interface ILabelInValue<T = any, ExtraType = any> {
	label?: string
	value: T
	key: string
	extra?: ExtraType
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

// BE opening hours type
export type RawOpeningHours = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours']

type OpeningHoursDay = NonNullable<RawOpeningHours>[0]['day']

// type for OpeningHours component
export type OpeningHoursTimeRanges = {
	timeFrom?: string | null
	timeTo?: string | null
}[]

export type OpeningHours = {
	day: OpeningHoursDay
	timeRanges: OpeningHoursTimeRanges
	onDemand?: boolean | null
}[]

export interface AutocompleteLabelInValue {
	key: string
	label: string | null
	value: string | null
}

export type CalendarEventDetail = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCalendarEventId.Responses.$200['calendarEvent'] & { isImported: boolean }
export interface ICalendarEventDetailPayload {
	data: CalendarEventDetail | null
}

export type INewCalendarEvent = Omit<ICalendarEventForm, 'eventType'> | null

export interface IEventTypeFilterForm {
	eventType: CALENDAR_EVENT_TYPE
}

export interface IJwtPayload {
	aud: string
	exp: number
	iat: number
	uid: string
}

export interface ILoadingAndFailure {
	isLoading: boolean
	isFailure: boolean
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
export interface INotinoUserForm {
	assignedUser: ISelectOptionItem
}

export interface ISearchFilter {
	search: string
}

export interface ICosmeticForm {
	name: string
	image: any
}

export interface ISpecialistContactFilter {
	search: string
}

export interface ISmsUnitPricesFilter {
	search: string
}

export type IServicesFilter = IServicesPageURLQueryParams

export interface ISmsHistoryFilter {
	search: string
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
	page?: number | null
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
	tabKey?: SALON_TABS_KEYS
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
	file: File[]
}

export interface ISalonsReportForm {
	countryCode: string
}

export type ICosmetic = Paths.GetApiB2BAdminEnumsCosmetics.Responses.$200['cosmetics'][0]

export type ILanguage = Paths.GetApiB2BAdminEnumsLanguages.Responses.$200['languages'][0]

export type ISpecialistContact = Paths.GetApiB2BAdminEnumsContactsContactId.Responses.$200['contact']

export interface IPagination extends PaginationProps {
	pageSizeOptions?: number[]
}

export type ICategoryParameters = Paths.GetApiB2BAdminEnumsCategoryParameters.Responses.$200['categoryParameters']

export type ICategoryParameter = Paths.GetApiB2BAdminEnumsCategoryParametersCategoryParameterId.Responses.$200['categoryParameter']

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
	enabledCustomerReservationNotes?: boolean
	enabledB2cReservations?: boolean
	disabledNotifications: {
		[key in RS_NOTIFICATION]: IReservationsSettingsNotification
	}
}

export type NameLocalizationsItem<T = string> = {
	language: T
	value: string | null
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

export type ICalendarFilter = Pick<ICalendarPageURLQueryParams, 'employeeIDs' | 'categoryIDs'>

export interface IEmployeesPayload extends ISearchable<Paths.GetApiB2BAdminEmployees.Responses.$200> {
	tableData: (Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0] & { key: string })[]
}

export interface IDeletedEmployeesPayload extends ISearchable<Paths.GetApiB2BAdminEmployees.Responses.$200> {
	tableData: (Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0] & { key: string })[]
}

export interface IActiveEmployeesPayload extends ISearchable<Paths.GetApiB2BAdminEmployees.Responses.$200> {
	tableData: (Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0] & { key: string })[]
}

export type Employees = NonNullable<IEmployeesPayload['data']>['employees']

export type Employee = Paths.GetApiB2BAdminEmployees.Responses.$200['employees'][0]
export type CalendarEmployee = Pick<
	Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['employees'][0],
	'id' | 'color' | 'firstName' | 'lastName' | 'email' | 'image' | 'inviteEmail' | 'orderIndex'
> & { orderIndex: number; inviteEmail?: string; isDeleted?: boolean }
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
export type ICalendarMonthlyViewDay = { [key: string]: ICalendarMonthlyViewEvent[] }

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

export type HandleUpdateReservationStateFunc = (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD, data?: { serviceId?: string, customerId?: string }) => void

export interface ICalendarReservationPopover {
	data: ReservationPopoverData | null
	position: PopoverTriggerPosition | null
	isOpen: boolean
	setIsOpen: (isOpen: boolean) => void
	handleUpdateReservationState: HandleUpdateReservationStateFunc
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
	query: ICalendarPageURLQueryParams
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
	isReservationCanceled?: boolean
}

export type ConfirmModalUpdateReservationData = {
	key: CONFIRM_MODAL_DATA_TYPE.UPDATE_RESERVATION_STATE
	calendarEventID: string
	state: RESERVATION_STATE
	reason?: string
	paymentMethod?: RESERVATION_PAYMENT_METHOD,
	data?: { serviceId?: string; customerId?: string }
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

export type ISalonReservationsFilter = Omit<ISalonReservationsPageURLQueryParams, 'state' | 'page' | 'limit'>

export type INotinoReservationsFilter = Omit<INotinoReservationsPageURLQueryParams, 'state' | 'page' | 'limit'>

export type IDocumentsFilter = Omit<IDocumentsPageURLQueryParams, 'order' | 'page' | 'limit'>

export type ServicePatchBody = Paths.PatchApiB2BAdminEmployeesEmployeeIdServicesServiceId.RequestBody

export type DisabledNotificationsArray = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['settings']['disabledNotifications']

export type PatchSettingsBody = Paths.PatchApiB2BAdminSalonsSalonIdSettings.RequestBody

export type ReservationsEmployees = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsPaginated.Responses.$200['employees']

export type HandleServicesReorderFunc = (currentIndexes: [number, number?, number?], newIndex: number) => void

export type ServicesActiveKeys = {
	salonID: string
	industries: string[]
	categories: string[]
}

export type IServicesSelectionData = {
	[key: string]: {
		options: CheckboxOptionType[]
		title: string,
		orderIndex: number
	}
}

export interface IIndustryFilter {
	search?: string
}

export type MSRedirectMessage = {
	key: typeof MS_REDIRECT_MESSAGE_KEY,
	status: 'idle' | 'success' | 'error' | 'loading'
	messages?: IErrorMessage[]
}
