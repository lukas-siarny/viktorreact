import { filter, orderBy } from 'lodash'
import i18next, { TFunction } from 'i18next'
import { Gutter } from 'antd/lib/grid/row'
import { FormatterInput } from '@fullcalendar/react'

export enum KEYBOARD_KEY {
	ENTER = 'Enter'
}

export enum NAMESPACE {
	PATHS = 'paths',
	LOC = 'loc'
}

export enum LANGUAGE {
	SK = 'sk',
	CZ = 'cs',
	EN = 'en'
	/* HU = 'hu',
	RO = 'ro',
	BG = 'bg',
	IT = 'it' */
}

export const REFRESH_TOKEN_INTERVAL = 1000 * 60 * 13 // 13 minutes

export const REFRESH_PAGE_INTERVAL = 1000 * 60 * 60 * 4 // 4 hours

export const REFRESH_CALENDAR_INTERVAL = 1000 * 15 // 60 * 2 // 2 minutes

export const DEFAULT_LANGUAGE = LANGUAGE.EN

export const DEFAULT_PHONE_PREFIX = 'CZ'

export const DEFAULT_CURRENCY = {
	code: 'EUR',
	symbol: '€'
}

export enum NOTIFICATION_TYPE {
	MODAL = 'MODAL',
	NOTIFICATION = 'NOTIFICATION'
}

export enum MSG_TYPE {
	INFO = 'INFO',
	ERROR = 'ERROR',
	WARNING = 'WARNING',
	SUCCESS = 'SUCCESS'
}

export enum FIELD_MODE {
	INPUT = 'INPUT',
	FILTER = 'FILTER'
}

export enum REQUEST_TYPE {
	DELETE = 'DELETE',
	PATCH = 'PATCH',
	PUT = 'PUT',
	GET = 'GET',
	POST = 'POST'
}

export enum FILTER_ENTITY {
	EMPLOYEE = 'EMPLOYEE',
	SALON = 'SALON',
	SERVICE = 'SERVICE',
	USER = 'USER',
	BASIC_SALON = 'BASIC_SALON',
	NOTINO_USER = 'NOTINO_USER'
}

export enum TABS_TYPE {
	LINE = 'line',
	CARD = 'card',
	EDITABLE_CARD = 'editable-card'
}

export const ROW_GUTTER_X_DEFAULT = [4, 0] as Gutter
export const ROW_GUTTER_X_M = [16, 0] as Gutter
export const ROW_GUTTER_X_L = [32, 0] as Gutter

export const MIN_SUPPORTED_RESOLUTION = 744 // 744px breakpoint is also defined in tailwind config

export const DROPDOWN_POSITION = {
	BOTTOM_LEFT: {
		points: ['tl', 'bl'],
		offset: [0, 4],
		overflow: {
			adjustX: false,
			adjustY: false
		}
	}
}

export enum FORM {
	CUSTOMER = 'CUSTOMER',
	USER_ACCOUNT = 'USER_ACCOUNT',
	SALON = 'SALON',
	LOGIN = 'LOGIN',
	CATEGORY = 'CATEGORY',
	CATEGORY_PARAMS = 'CATEGORY_PARAMS',
	CATEGORY_PARAMS_FILTER = 'CATEGORY_PARAMS_FILTER',
	COSMETIC = 'COSMETIC',
	COSMETICS_FILTER = 'COSMETICS_FILTER',
	SALONS_FILTER_ACITVE = 'SALONS_FILTER_ACTIVE',
	SALONS_FILTER_DELETED = 'SALONS_FILTER_DELETED',
	ACTIVATION = 'ACTIVATION',
	FORGOT_PASSWORD = 'FORGOT_PASSWORD',
	CREATE_PASSWORD = 'CREATE_PASSWORD',
	REGISTRATION = 'REGISTRATION',
	USER_PROFILE = 'USER_PROFILE',
	ADMIN_USERS_FILTER = 'ADMIN_USERS_FILTER',
	EMPLOYEES_FILTER = 'EMPLOYEES_FILTER',
	CREATE_SALON_FROM = 'CREATE_SALON_FROM',
	ROLE_FORM = 'ROLE_FORM',
	ADMIN_CREATE_USER = 'ADMIN_CREATE_USER',
	ADMIN_UPDATE_USER = 'ADMIN_UPDATE_USER',
	EDIT_USER_ROLE = 'EDIT_USER_ROLE',
	SERVICE_FORM = 'SERVICE_FORM',
	REQUEST_NEW_SERVICE_FORM = 'REQUEST_NEW_SERVICE_FORM',
	CUSTOMERS_FILTER = 'CUSTOMERS_FILTER',
	SERVICES_FILTER = 'SERVICES_FILTER',
	OPEN_HOURS_NOTE = 'OPEN_HOURS_NOTE',
	EMPLOYEE = 'EMPLOYEE',
	INVITE_EMPLOYEE = 'INVITE_EMPLOYEE',
	SUPPORT_CONTACTS_FILTER = 'SUPPORT_CONTACTS_FILTER',
	SUPPORT_CONTACT = 'SUPPORT_CONTACT',
	NOTE = 'NOTE',
	NOTINO_USER = 'NOTINO_USER',
	EDIT_EMPLOYEE_ROLE = 'EDIT_EMPLOYEE_ROLE',
	SALON_IMPORTS_FORM = 'SALON_IMPORTS_FORM',
	SALON_HISTORY_FILTER = 'SALON_HISTORY_FILTER',
	INDUSTRIES = 'INDUSTRIES',
	INDUSTRY = 'INDUSTRY',
	LANGUAGES = 'LANGUAGES',
	LANGUAGES_FILTER = 'LANGUAGES_FILTER',
	SPECIALIST_CONTACT = 'SPECIALIST_CONTACT',
	SPECIALIST_CONTACT_FILTER = 'SPECIALIST_CONTACT_FILTER',
	SALON_BILLING_INFO = 'SALON_BILLING_INFO',
	FILTER_REJECTED_SUGGESTIONS = 'FILTER_REJECTED_SUGGESTIONS',
	CALENDAR_FILTER = 'CALENDAR_FILTER',
	CALENDAR_RESERVATION_FORM = 'CALENDAR_RESERVATION_FORM',
	CALENDAR_EMPLOYEE_SHIFT_FORM = 'CALENDAR_EMPLOYEE_SHIFT_FORM',
	CALENDAR_EMPLOYEE_TIME_OFF_FORM = 'CALENDAR_EMPLOYEE_TIME_OFF_FORM',
	CALENDAR_EMPLOYEE_BREAK_FORM = 'CALENDAR_EMPLOYEE_BREAK_FORM',
	CONFIRM_BULK_FORM = 'CONFIRM_BULK_FORM',
	EVENT_TYPE_FILTER_FORM = 'EVENT_TYPE_FILTER_FORM'
}

// System permissions
export enum PERMISSION {
	NOTINO_SUPER_ADMIN = 'NOTINO_SUPER_ADMIN',
	NOTINO_ADMIN = 'NOTINO_ADMIN',
	PARTNER = 'PARTNER',
	USER_CREATE = 'USER_CREATE',
	USER_BROWSING = 'USER_BROWSING',
	USER_EDIT = 'USER_EDIT',
	USER_DELETE = 'USER_DELETE',
	ENUM_EDIT = 'ENUM_EDIT'
}

// Salon's permissions
export enum SALON_PERMISSION {
	PARTNER_ADMIN = 'PARTNER_ADMIN',
	SALON_UPDATE = 'SALON_UPDATE',
	SALON_DELETE = 'SALON_DELETE',
	SALON_BILLING_UPDATE = 'SALON_BILLING_UPDATE',
	SERVICE_CREATE = 'SERVICE_CREATE',
	SERVICE_UPDATE = 'SERVICE_UDPATE',
	SERVICE_DELETE = 'SERVICE_DELETE',
	CUSTOMER_CREATE = 'CUSTOMER_CREATE',
	CUSTOMER_UPDATE = 'CUSTOMER_UPDATE',
	CUSTOMER_DELETE = 'CUSTOMER_DELETE',
	EMPLOYEE_CREATE = 'EMPLOYEE_CREATE',
	EMPLOYEE_UPDATE = 'EMPLOYEE_UPDATE',
	EMPLOYEE_DELETE = 'EMPLOYEE_DELETE',
	USER_ROLE_EDIT = 'USER_ROLE_EDIT',
	CALENDAR_EVENT_CREATE = 'CALENDAR_EVENT_CREATE',
	CALENDAR_EVENT_UPDATE = 'CALENDAR_EVENT_UPDATE',
	CALENDAR_EVENT_DELETE = 'CALENDAR_EVENT_DELETE'
}

export const ADMIN_PERMISSIONS: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]

export enum RESOLUTIONS {
	SM = 'SM',
	MD = 'MD',
	L = 'L',
	XL = 'XL',
	XXL = 'XXL',
	XXXL = 'XXXL'
}

export enum SUBMENU_PARENT {
	GENERAL = 'GENERAL',
	INVENTORY = 'INVENTORY',
	SALES = 'SALES',
	PRODUCTS = 'PRODUCTS'
}

export enum TOKEN_AUDIENCE {
	API = 'jwt-api',
	FORGOTTEN_PASSWORD = 'FORGOTTEN_PASSWORD',
	INVITATION = 'INVITATION'
}

export enum TAB_KEYS {
	SALON_DETAIL = 'SALON_DETAIL',
	SALON_HISTORY = 'SALON_HISTORY'
}

export enum SALONS_TAB_KEYS {
	ACTIVE = 'active',
	DELETED = 'deleted',
	MISTAKES = 'mistakes'
}

export enum PAGE {
	SALONS = 'SALONS',
	ENUMERATIONS = 'ENUMERATIONS',
	CATEGORIES = 'CATEGORIES',
	CATEGORY_PARAMETERS = 'CATEGORY_PARAMETERS',
	USER_PROFILE = 'USER_PROFILE',
	USERS = 'USERS',
	ROLES = 'ROLES',
	CUSTOMERS = 'CUSTOMERS',
	PERMISSIONS = 'PERMISSIONS',
	HOME = 'HOME',
	MY_ACCOUNT = 'MY_ACCOUNT',
	ACTIVATION = 'ACTIVATION',
	EMPLOYEES = 'EMPLOYEES',
	SUPPORT_CONTACTS = 'SUPPORT_CONTACTS',
	COSMETICS = 'COSMETICS',
	LANGUAGES = 'LANGUAGES',
	INDUSTRIES_AND_SERVICES = 'INDUSTRIES_AND_SERVICES',
	SERVICES_SETTINGS = 'SERVICES_SETTINGS',
	PENDING_INVITES = 'PENDING_INVITES',
	SPECIALIST_CONTACTS = 'SPECIALIST_CONTACTS',
	BILLING_INFO = 'BILLING_INFO',
	CALENDAR = 'CALENDAR'
}

export enum PARAMETER_TYPE {
	ENUM = 'ENUM',
	TIME = 'TIME'
}

export const DEFAULT_DATE_INPUT_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DATE_INIT_FORMAT = 'YYYY-MM-DD'

export const DEFAULT_TIME_FORMAT = 'HH:mm'

export const DEFAULT_TIME_FORMAT_MINUTES = 'mm'

export const DEFAULT_TIME_FORMAT_HOURS = 'HH'

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DAYJS_FORMAT = 'MM.DD.YYYY'

export const DEFAULT_DATE_WITH_TIME_FORMAT = 'DD.MM.YYYY HH:mm'

export const EN_DATE_WITH_TIME_FORMAT = 'MMM DD YYYY HH:mm'

export const EN_DATE_WITHOUT_TIME_FORMAT = 'DD.MM.YYYY'

export const DATE_TIME_PARSER_DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_PARSER_FORMAT = `${DATE_TIME_PARSER_DATE_FORMAT}:HH:mm`

export const INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT'

export const INDIVIDUAL_TRANSPORT = 0

export const BACK_DATA_QUERY = 'backData'

export enum ENUMERATIONS_KEYS {
	COUNTRIES_PHONE_PREFIX = 'countries_phone_prefix',
	COUNTRIES = 'countries',
	CURRENCIES = 'currencies'
}

export enum ENUMERATIONS_PATHS {
	COUNTRIES = 'countries'
}

export const PAGINATION = {
	defaultPageSize: 25,
	pageSizeOptions: [25, 50, 100],
	limit: 25 // 25 | 50 | 100
}

export const QUERY_LIMIT = {
	MAX_255: 255
}

export const UPLOAD = {
	MAX_FILE_SIZE: 20,
	MAX_SIZE: 100000000, // 100MB
	INSURANCE_COMPANIES_LOGO: {
		maxFileSize: 2 * 10 ** 6 // 2MB
	},
	INSURANCE_COMPANIES_VPP: {
		maxFileSize: 4 * 10 ** 6 // 4MB
	},
	INSURANCES_FILE: {
		maxFileSize: 2 * 10 ** 6 // 2MB
	},
	CORPORATION_STAMP_FILE: {
		maxFileSize: 2 * 10 ** 6 // 2MB
	}
}

export enum FILE_DATA_TYPE {
	PDF = 'PDF',
	JPEG = 'JPEG',
	PNG = 'PNG',
	DOC = 'DOC',
	XLS = 'XLS',
	OTHER = 'OTHER'
}

export enum FILE_FILTER_DATA_TYPE {
	PDF = 'PDF',
	IMAGE = 'IMAGE',
	DOC = 'DOC',
	EXCEL = 'EXCEL',
	OTHER = 'OTHER'
}

export enum DROPPABLE_IDS {
	FOLDER_FILES = 'FOLDER_FILES',
	WEBPROJECTS_FILES = 'WEBPROJECTS_FILES'
}

const PRAGUE_LOCATION = {
	lat: 50.0755381,
	lng: 14.4378005
}

export const MAP = {
	defaultZoom: 10,
	minLatitude: -90,
	maxLatitude: 90,
	minLongitude: -180,
	maxLongitude: 180,
	minZoom: 1,
	maxZoom: 20,
	placeZoom: 16,
	defaultLocation: PRAGUE_LOCATION,
	locations: {
		[LANGUAGE.CZ]: PRAGUE_LOCATION,
		[LANGUAGE.EN]: PRAGUE_LOCATION,
		// Bratislava
		[LANGUAGE.SK]: {
			lat: 48.1485965,
			lng: 17.1077477
		}
	}
}

export enum SALON_FILTER_STATES {
	PUBLISHED = 'PUBLISHED',
	NOT_PUBLISHED = 'NOT_PUBLISHED',
	DELETED = 'DELETED',
	NOT_DELETED = 'NOT_DELETED',
	PENDING_PUBLICATION = 'PENDING_PUBLICATION',
	DECLINED = 'DECLINED',
	ALL = 'ALL'
}

export enum SALON_STATES {
	NOT_PUBLISHED = 'NOT_PUBLISHED',
	PUBLISHED = 'PUBLISHED',
	NOT_PUBLISHED_PENDING = 'NOT_PUBLISHED_PENDING',
	PUBLISHED_PENDING = 'PUBLISHED_PENDING',
	NOT_PUBLISHED_DECLINED = 'NOT_PUBLISHED_DECLINED',
	PUBLISHED_DECLINED = 'PUBLISHED_DECLINED'
}

export enum SALON_CREATE_TYPE {
	NON_BASIC = 'NON_BASIC',
	BASIC = 'BASIC'
}

export enum SALON_SOURCE_TYPE {
	NOTINO = 'NOTINO',
	PARTNER = 'PARTNER',
	IMPORT = 'IMPORT'
}

export enum SALON_FILTER_OPENING_HOURS {
	SET = 'SET',
	NOT_SET = 'NOT_SET'
}

export enum PAGE_VIEW {
	TABLE = 'TABLE',
	TREE = 'TREE'
}

export enum EXPIRATION_TYPE {
	MINUTE = 'MINUTE',
	HOUR = 'HOUR',
	DAY = 'DAY'
}

export const ENUMERATIONS_OPTIONS = () =>
	orderBy(
		[
			{
				label: i18next.t('loc:Krajiny'),
				key: ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX,
				url: ENUMERATIONS_PATHS.COUNTRIES
			}
		],
		['label'],
		['asc']
	)

export const STRINGS = (t: TFunction) => ({
	accessEditTab: t('loc:Pre prístup potvrďte základné údaje'),
	areYouSureDelete: (entity: string) => t('loc:Naozaj chcete odstrániť {{entity}} ?', { entity }),
	addRecord: (entity: string) => t('loc:Pridať {{entity}}', { entity }),
	assign: (entity: string) => t('loc:Priradiť {{entity}}', { entity }),
	loading: t('loc:Načítavam...'),
	delete: (entity: string) => t('loc:Odstrániť {{entity}}', { entity }),
	save: (entity: string) => t('loc:Uložiť {{entity}}', { entity }),
	edit: (entity: string) => t('loc:Upraviť {{entity}}', { entity }),
	createRecord: (entity: string) => t('loc:Vytvoriť {{entity}}', { entity }),
	cancel: t('loc:Zrušiť'),

	select: (entity: string) => t('loc:Vyberte {{entity}}', { entity }), // non searchable select field
	search: (entity: string) => t('loc:Vyhľadajte {{entity}}', { entity }), // searchable select field
	searchBy: (entity: string) => t('loc:Vyhľadajte podľa {{entity}}', { entity }), // input field vyhladavaci
	enter: (entity: string) => t('loc:Zadajte {{entity}}', { entity }), // all input fields

	MISSING_PERMISSIONS_TEXT: t('loc:Používateľovi chýbajú oprávnenia na akciu'),
	EMPTY_TABLE_COLUMN_PLACEHOLDER: '---'
})

export enum PUBLICATION_STATUS {
	PUBLISHED = 'PUBLISHED',
	UNPUBLISHED = 'UNPUBLISHED'
}

export enum UPLOAD_ERROR_TYPE {
	MAX_SIZE = 'MAX_SIZE',
	MAX_FILES = 'MAX_FILES',
	INVALID_TYPE = 'INVALID_TYPE'
}

// NOTE: do not change days order!
export enum DAY {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY'
}

export const MONDAY_TO_FRIDAY = 'MONDAY_TO_FRIDAY'

export enum GENDER {
	MALE = 'MALE',
	FEMALE = 'FEMALE'
}

export enum VALIDATION_MAX_LENGTH {
	LENGTH_3000 = 3000,
	LENGTH_1500 = 1500,
	LENGTH_1000 = 1000,
	LENGTH_500 = 500,
	LENGTH_255 = 255,
	LENGTH_100 = 100,
	LENGTH_75 = 75,
	LENGTH_60 = 60,
	LENGTH_50 = 50,
	LENGTH_30 = 30,
	LENGTH_20 = 20,
	LENGTH_10 = 10,
	LENGTH_5 = 5,
	LENGTH_2 = 2
}

export enum BYTE_MULTIPLIER {
	KILO = 10 ** 3,
	MEGA = 10 ** 6
}

export const LOCALIZATIONS = 'LOCALIZATIONS'

export enum UPLOAD_IMG_CATEGORIES {
	SALON = 'SALON_IMAGE',
	SALON_PRICELIST = 'SALON_PRICELIST',
	EMPLOYEE = 'EMPLOYEE_IMAGE',
	USER = 'USER_IMAGE',
	CATEGORY_IMAGE = 'CATEGORY_IMAGE',
	CATEGORY_ICON = 'CATEGORY_ICON',
	COSMETIC = 'COSMETIC_IMAGE',
	CUSTOMER = 'CUSTOMER_IMAGE',
	LANGUAGE_IMAGE = 'LANGUAGE_IMAGE'
}

export const URL_UPLOAD_IMAGES = '/api/b2b/admin/files/sign-urls'
export const PUBLICATION_STATUSES = Object.keys(PUBLICATION_STATUS)
export const GENDERS = Object.keys(GENDER) as GENDER[]
export const DAYS = Object.keys(DAY) as DAY[]

export enum ACCOUNT_STATE {
	UNPAIRED = 'UNPAIRED',
	PENDING = 'PENDING',
	PAIRED = 'PAIRED'
}

export const IMAGE_UPLOADING_PROP = 'imageUploading'

export const DELETE_BUTTON_ID = 'delete-btn'

export const CREATE_BUTTON_ID = 'create-btn'

export const MAX_VALUES_PER_PARAMETER = 20

export enum PARAMETERS_VALUE_TYPES {
	TIME = 'TIME',
	ENUM = 'ENUM'
}

export enum PARAMETERS_UNIT_TYPES {
	MINUTES = 'MINUTES'
}

export const NEW_SALON_ID = 'new_salon'

export enum SALON_ROLES {
	ADMIN = 'ADMIN',
	MANAGER = 'MANAGER',
	RECEPTIONIST = 'RECEPTIONIST',
	EMPLOEYEE_1 = 'EMPLOEYEE_1',
	/* EMPLOEYEE_2 = 'EMPLOEYEE_2', */
	EXTERNAL = 'EXTERNAL'
}

export enum SALON_HISTORY_OPERATIONS {
	INSERT = 'INSERT',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
	RESTORE = 'RESTORE'
}

export enum SALON_HISTORY_OPERATIONS_COLORS {
	INSERT = 'success',
	UPDATE = 'warning',
	DELETE = 'danger',
	RESTORE = 'info'
}

export const SALON_ROLES_KEYS = Object.keys(SALON_ROLES)

export enum DATE_TIME_RANGE {
	LAST_DAY = 'LAST_DAY',
	LAST_TWO_DAYS = 'LAST_TWO_DAYS',
	LAST_WEEK = 'LAST_WEEK'
}

export const DEFAULT_DATE_TIME_OPTIONS = (): { [key: string]: any } => {
	return {
		[DATE_TIME_RANGE.LAST_DAY]: { name: i18next.t('loc:24 hodín'), value: 1, unit: 'day' },
		[DATE_TIME_RANGE.LAST_TWO_DAYS]: { name: i18next.t('loc:48 hodín'), value: 2, unit: 'day' },
		[DATE_TIME_RANGE.LAST_WEEK]: { name: i18next.t('loc:Týždeň'), value: 1, unit: 'week' }
	}
}

export const FILTER_PATHS = (from?: string, to?: string) => ({
	SALONS: {
		[SALON_FILTER_STATES.PUBLISHED]: `${i18next.t('paths:salons')}?salonState=active&statuses_published=${SALON_FILTER_STATES.PUBLISHED}`,
		[SALON_FILTER_STATES.NOT_PUBLISHED]: `${i18next.t('paths:salons')}?salonState=active&statuses_published=${SALON_FILTER_STATES.NOT_PUBLISHED}`,
		[SALON_FILTER_STATES.DECLINED]: `${i18next.t('paths:salons')}?salonState=active&statuses_changes=${SALON_FILTER_STATES.DECLINED}`,
		[SALON_FILTER_STATES.PENDING_PUBLICATION]: `${i18next.t('paths:salons')}?salonState=active&statuses_changes=${SALON_FILTER_STATES.PENDING_PUBLICATION}`,
		[SALON_CREATE_TYPE.BASIC]: `${i18next.t('paths:salons')}?createType=${SALON_CREATE_TYPE.BASIC}`,
		publishedChanges: `${i18next.t('paths:salons')}?salonState=active&lastUpdatedAtFrom=${from}&lastUpdatedAtTo=${to}`,
		rejectedSuggestions: `${i18next.t('paths:salons')}?salonState=mistakes`,
		publishedBasics: `${i18next.t('paths:salons')}?createType=${SALON_CREATE_TYPE.BASIC}&statuses_published=${SALON_FILTER_STATES.PUBLISHED}`,
		publishedPremiums: `${i18next.t('paths:salons')}?createType=${SALON_CREATE_TYPE.NON_BASIC}&statuses_published=${SALON_FILTER_STATES.PUBLISHED}`
	}
})

export enum OPENING_HOURS_STATES {
	CUSTOM_ORDER = 'CUSTOM_ORDER'
}

export enum SALONS_TIME_STATS_TYPE {
	BASIC = 'BASIC',
	PENDING = 'PENDING',
	PREMIUM = 'PREMIUM'
}

export enum TIME_STATS_SOURCE_TYPE {
	MONTH = 'MONTH',
	YEAR = 'YEAR'
}

// CALENDAR ENUMS
export const CALENDAR_COMMON_SETTINGS = {
	LICENSE_KEY: 'CC-Attribution-NonCommercial-NoDerivatives',
	TIME_ZONE: 'local',
	TIME_FORMAT: {
		hour: '2-digit',
		minute: '2-digit',
		separator: '-',
		hour12: false
	} as FormatterInput,
	SCROLL_TIME: '08:00:00',
	SLOT_DURATION: '00:15:00',
	EVENT_MIN_DURATION: 15, // znaci, aky najuzzsi event zobrazime v kalendari (v minutach) (teda ak bude mat event 10 minut, zobrazi v kalendari ako 15 minutovy - jeho realny casovy rozsah to ale neovplyvni, jedna sa len o vizualne zobrazenie)
	SLOT_LABEL_INTERVAL: '01:00:00',
	FIXED_MIRROR_PARENT: document.body,
	EVENT_CONSTRAINT: {
		startTime: '00:00',
		endTime: '23:59'
	}
}

export enum CALENDAR_VIEW {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	DAY = 'DAY',
	WEEK = 'WEEK' /* ,
	MONTH = 'MONTH' */
}

export enum CALENDAR_EVENT_TYPE {
	RESERVATION = 'RESERVATION',
	EMPLOYEE_SHIFT = 'EMPLOYEE_SHIFT',
	EMPLOYEE_TIME_OFF = 'EMPLOYEE_TIME_OFF',
	EMPLOYEE_BREAK = 'EMPLOYEE_BREAK'
}

export enum CALENDAR_EVENTS_VIEW_TYPE {
	RESERVATION = 'RESERVATION',
	EMPLOYEE_SHIFT_TIME_OFF = 'EMPLOYEE_SHIFT_TIME_OFF'
}

export enum CALENDAR_DATE_FORMAT {
	QUERY = 'YYYY-MM-DD',
	HEADER_DAY = 'ddd, D MMM YY',
	HEADER_WEEK_START = 'D',
	HEADER_WEEK_END = 'D MMM YY',
	HEADER_WEEK_START_TURN_OF_THE_MONTH = 'D MMM',
	HEADER_WEEK_END_TURN_OF_THE_MONTH = 'D MMM YY',
	HEADER_MONTH = 'MMMM YY',
	TIME = 'HH:mm'
}

export enum CALENDAR_SET_NEW_DATE {
	FIND_START_ADD = 'ADD',
	FIND_START_SUBSTRACT = 'SUBTRACT',
	FIND_START = 'FIND_START',
	DEFAULT = 'DEFAULT'
}

export enum ENDS_EVENT {
	WEEK = 'WEEK',
	MONTH = 'MONTH',
	THREE_MONTHS = 'THREE_MONTHS',
	SIX_MONTHS = 'SIX_MONTHS',
	YEAR = 'YEAR'
}

export enum EVERY_REPEAT {
	ONE_WEEK = 'ONE_WEEK',
	TWO_WEEKS = 'TWO_WEEKS'
}

export const EVERY_REPEAT_OPTIONS = () => [
	{
		key: EVERY_REPEAT.ONE_WEEK,
		label: i18next.t('loc:Týždeň')
	},
	{
		key: EVERY_REPEAT.TWO_WEEKS,
		label: i18next.t('loc:Druhý týždeň')
	}
]

export const ENDS_EVENT_OPTIONS = () => [
	{
		key: ENDS_EVENT.WEEK,
		label: i18next.t('loc:Týždeň')
	},
	{
		key: ENDS_EVENT.MONTH,
		label: i18next.t('loc:Mesiac')
	},
	{
		key: ENDS_EVENT.THREE_MONTHS,
		label: i18next.t('loc:Tri mesiace')
	},
	{
		key: ENDS_EVENT.SIX_MONTHS,
		label: i18next.t('loc:Šesť mesiacov')
	},
	{
		key: ENDS_EVENT.YEAR,
		label: i18next.t('loc:Rok')
	}
]

export const EVENT_NAMES = (eventType: CALENDAR_EVENT_TYPE) => {
	switch (eventType) {
		case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
			return i18next.t('loc:prestávku')
		case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
			return i18next.t('loc:zmenu')

		case CALENDAR_EVENT_TYPE.RESERVATION:
			return i18next.t('loc:rezerváciu')

		case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
			return i18next.t('loc:dovolenku')
		default:
			return ''
	}
}

export const EVENT_TYPE_OPTIONS = (eventType?: CALENDAR_EVENTS_VIEW_TYPE) => {
	const options = [
		{
			key: CALENDAR_EVENT_TYPE.RESERVATION,
			label: i18next.t('loc:Rezervácia')
		},
		{
			key: CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
			label: i18next.t('loc:Pracovná zmena')
		},
		{
			key: CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
			label: i18next.t('loc:Dovolenka')
		},
		{
			key: CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
			label: i18next.t('loc:Prestávka')
		}
	]
	if (eventType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
		// rezervacia a break
		return filter(options, (item) => item.key === CALENDAR_EVENT_TYPE.RESERVATION || item.key === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK)
	}
	if (eventType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
		// shift, break a vacation
		return filter(options, (item) => item.key !== CALENDAR_EVENT_TYPE.RESERVATION)
	}
	// vsetky optiony
	return options
}

export const SHORTCUT_DAYS_OPTIONS = (length = 2) => [
	{ label: i18next.t('loc:Pondelok').substring(0, length), value: DAY.MONDAY },
	{ label: i18next.t('loc:Utorok').substring(0, length), value: DAY.TUESDAY },
	{ label: i18next.t('loc:Streda').substring(0, length), value: DAY.WEDNESDAY },
	{ label: i18next.t('loc:Štvrtok').substring(0, length), value: DAY.THURSDAY },
	{ label: i18next.t('loc:Piatok').substring(0, length), value: DAY.FRIDAY },
	{ label: i18next.t('loc:Sobota').substring(0, length), value: DAY.SATURDAY },
	{ label: i18next.t('loc:Nedeľa').substring(0, length), value: DAY.SUNDAY }
]

export enum CALENDAR_EVENTS_KEYS {
	EVENTS = 'events',
	RESERVATIONS = 'reservations',
	SHIFTS_TIME_OFFS = 'shiftsTimeOffs'
}

export enum CONFIRM_BULK {
	BULK = 'BULK',
	SINGLE_RECORD = 'SINGLE_RECORD'
}

export enum RESERVATION_STATE {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	DECLINED = 'DECLINED',
	CANCEL_BY_SALON = 'CANCEL_BY_SALON',
	CANCEL_BY_CUSTOMER = 'CANCEL_BY_CUSTOMER',
	REALIZED = 'REALIZED',
	NOT_REALIZED = 'NOT_REALIZED'
}

export enum RESERVATION_SOURCE_TYPE {
	ONLINE = 'ONLINE',
	OFFLINE = 'OFFLINE'
}

export enum RESERVATION_ASSIGNMENT_TYPE {
	SYSTEM = 'SYSTEM',
	USER = 'USER'
}

export enum RESERVATION_PAYMENT_METHOD {
	CASH = 'CASH',
	CARD = 'CARD',
	OTHER = 'OTHER'
}

export const CALENDAR_DEBOUNCE_DELAY = 300 // in ms

export const HANDLE_CALENDAR_FORMS: { [key: string]: CALENDAR_EVENT_TYPE } = {
	[FORM.CALENDAR_RESERVATION_FORM]: CALENDAR_EVENT_TYPE.RESERVATION,
	[FORM.CALENDAR_EMPLOYEE_SHIFT_FORM]: CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
	[FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM]: CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
	[FORM.CALENDAR_EMPLOYEE_BREAK_FORM]: CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK
}

export enum CALENDAR_FORM_HANDLER {
	SUBMIT = 'SUBMIT',
	CHANGE = 'CHANGE',
	INITIALIZE = 'INITIALIZE'
}
export const CREATE_EVENT_PERMISSIONS = [...ADMIN_PERMISSIONS, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CALENDAR_EVENT_CREATE]
export const UPDATE_EVENT_PERMISSIONS = [...ADMIN_PERMISSIONS, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CALENDAR_EVENT_UPDATE]
export const DELETE_EVENT_PERMISSIONS = [...ADMIN_PERMISSIONS, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CALENDAR_EVENT_DELETE]

export const getDayNameFromNumber = (day: number) => {
	switch (day) {
		case 0: // prvy den dayjs.day() -> nedela
			return DAY.SUNDAY
		case 1:
			return DAY.MONDAY
		case 2:
			return DAY.TUESDAY
		case 3:
			return DAY.WEDNESDAY
		case 4:
			return DAY.THURSDAY
		case 5:
			return DAY.FRIDAY
		case 6:
			return DAY.SATURDAY
		default:
			return null
	}
}
/**
 * @returns localized texts for Sentry report dialog and common EN texts for result view
 */
export const ERROR_BOUNDARY_TEXTS = () => ({
	result: {
		subtitle: 'An unexpected error has occurred and your request cannot be completed. Please contact us about the error.',
		buttonLabel: 'Contact about the error'
	},
	reportDialog: {
		successMessage: i18next.t('loc:Vaša spätná väzba bola odoslaná. Ďakujeme!'),
		title: i18next.t('loc:Nastala neočakávaná chyba'),
		subtitle: i18next.t('loc:Prosím kontaktujte nás'),
		labelName: i18next.t('loc:Meno'),
		labelComments: i18next.t('loc:Popis chyby'),
		labelClose: i18next.t('loc:Zatvoriť'),
		labelSubmit: i18next.t('loc:Odoslať hlásenie o chybe')
	}
})
