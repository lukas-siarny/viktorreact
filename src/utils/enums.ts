import { orderBy } from 'lodash'
import i18next, { TFunction } from 'i18next'
import { Gutter } from 'antd/lib/grid/row'
import { LoadScriptUrlOptions } from '@react-google-maps/api/dist/utils/make-load-script-url'
import { AliasToken } from 'antd/es/theme/internal'
import { FormatterInput } from '@fullcalendar/react'
import { UseGoogleLoginOptionsAuthCodeFlow } from '@react-oauth/google'

export enum CYPRESS_CLASS_NAMES {
	LOGOUT_BUTTON = 'noti-logout-button',
	MY_ACCOUNT = 'noti-my-account',
	MY_ACCOUNT_BUTTON = 'noti-my-account-button',
	FORBIDDEN_MODAL = 'noti-forbidden-modal',
	ASSIGN_SERVICES_BUTTON = 'noti-assign-services-button'
}

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
	EN = 'en',
	HU = 'hu',
	RO = 'ro',
	BG = 'bg'
	/* IT = 'it' */
}

export enum BROWSERS {
	CHROME = 'chrome',
	SAFARI = 'safari',
	FIREFOX = 'firefox',
	EDGE = 'edge',
	OPERA = 'opera'
}

export enum BROWSER_TYPE {
	UNKNOWN = 'unknown',
	SUPPORTED = 'supported',
	UNSUPPORTED = 'unsupported'
}

export enum IMPORT_TYPE {
	IMPORT = 'IMPORT',
	UPLOAD = 'UPLOAD'
}

export enum ASSET_TYPE {
	B2C_PRIVACY_POLICY = 'B2C_PRIVACY_POLICY',
	B2C_RESERVATIONS_TERMS = 'B2C_RESERVATIONS_TERMS',
	B2B_PRIVACY_POLICY = 'B2B_PRIVACY_POLICY',
	B2B_APP_TERMS_CONDITIONS = 'B2B_APP_TERMS_CONDITIONS',
	B2C_PLACEHOLDER_HOMESCREEN = 'B2C_PLACEHOLDER_HOMESCREEN'
}

export const MIN_SUPPORTED_BROWSER_VERSION = (browserName?: string) => {
	switch (browserName) {
		case BROWSERS.CHROME:
			// Released: 2020-02-04
			return 80

		case BROWSERS.SAFARI:
			// Released: 2020-09-16
			return 14

		case BROWSERS.FIREFOX:
			// Released: 2020-01-07
			return 72

		case BROWSERS.EDGE:
			// Released: 2020-01-15
			return 79

		case BROWSERS.OPERA:
			// Released: 2020-01-28
			return 67
		default:
			return -1
	}
}

export const CHANGE_DEBOUNCE_TIME = 300 // 300ms change debounce time for forms that have onChange submit

export const REFRESH_TOKEN_INTERVAL = 1000 * 60 * 13 // 13 minutes

export const REFRESH_PAGE_INTERVAL = 1000 * 60 * 60 * 4 // 4 hours

export const REFRESH_CALENDAR_INTERVAL = 1000 * 60 * 2 // 2 minutes

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

export enum ERROR_MSG_CODE {
	MISSING_COUNTRY_CODE = 'MISSING_COUNTRY_CODE'
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
	NOTINO_USER = 'NOTINO_USER',
	COSMETICS = 'COSMETICS'
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
	DOCUMENTS_FILTER = 'DOCUMENTS_FILTER',
	EMPLOYEES_FILTER = 'EMPLOYEES_FILTER',
	RESERVATIONS_FILTER = 'RESERVATIONS_FILTER',
	NOTINO_RESERVATIONS_FILTER = 'NOTINO_RESERVATIONS_FILTER',
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
	VOUCHER_FORM = 'VOUCHER_FORM',
	NOTINO_USER = 'NOTINO_USER',
	EDIT_EMPLOYEE_ROLE = 'EDIT_EMPLOYEE_ROLE',
	IMPORT_FORM = 'IMPORT_FORM',
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
	CALENDAR_RESERVATION_FROM_IMPORT_FORM = 'CALENDAR_RESERVATION_FROM_IMPORT_FORM',
	CONFIRM_BULK_FORM = 'CONFIRM_BULK_FORM',
	RESEVATION_SYSTEM_SETTINGS = 'RESEVATION_SYSTEM_SETTINGS',
	HEADER_COUNTRY_FORM = 'HEADER_COUNTRY_FORM',
	EMPLOYEE_SERVICE_EDIT = 'EMPLOYEE_SERVICE_EDIT',
	CALENDAR_EVENT_FORM = 'CALENDAR_EVENT_FORM',
	REVIEWS_FILTER = 'REVIEWS_FILTER',
	SMS_UNIT_PRICES_FORM = 'SMS_UNIT_PRICES_FORM',
	SMS_UNIT_PRICES_FILTER = 'SMS_UNIT_PRICES_FILTER',
	SMS_HISTORY_FILTER = 'SMS_HISTORY_FILTER',
	RECHARGE_SMS_CREDIT = 'RECHARGE_SMS_CREDIT',
	RECHARGE_SMS_CREDIT_FILTER = 'RECHARGE_SMS_CREDIT_FILTER',
	SALONS_REPORT = 'SALONS_REPORT',
	INDUSTRY_FILTER = 'INDUSTRY_FILTER',
	SALON_IDS_FORM = 'SALON_IDS_FORM',
	DOCUMENTS_FORM = 'DOCUMENTS_FORM'
}

export enum PERMISSION {
	NOTINO_SUPER_ADMIN = 'NOTINO_SUPER_ADMIN',
	NOTINO_ADMIN = 'NOTINO_ADMIN',
	NOTINO = 'NOTINO',
	PARTNER = 'PARTNER',
	USER_CREATE = 'USER_CREATE',
	USER_BROWSING = 'USER_BROWSING',
	USER_EDIT = 'USER_EDIT',
	USER_DELETE = 'USER_DELETE',
	ENUM_EDIT = 'ENUM_EDIT',
	SALON_PUBLICATION_RESOLVE = 'SALON_PUBLICATION_RESOLVE',
	IMPORT_SALON = 'IMPORT_SALON',
	REVIEW_READ = 'REVIEW_READ',
	REVIEW_VERIFY = 'REVIEW_VERIFY',
	REVIEW_DELETE = 'REVIEW_DELETE',
	PARTNER_ADMIN = 'PARTNER_ADMIN',
	SALON_UPDATE = 'SALON_UPDATE',
	SALON_DELETE = 'SALON_DELETE',
	SALON_BILLING_UPDATE = 'SALON_BILLING_UPDATE',
	SERVICE_CREATE = 'SERVICE_CREATE',
	SERVICE_UPDATE = 'SERVICE_UPDATE',
	SERVICE_DELETE = 'SERVICE_DELETE',
	CUSTOMER_CREATE = 'CUSTOMER_CREATE',
	CUSTOMER_UPDATE = 'CUSTOMER_UPDATE',
	CUSTOMER_DELETE = 'CUSTOMER_DELETE',
	EMPLOYEE_CREATE = 'EMPLOYEE_CREATE',
	EMPLOYEE_UPDATE = 'EMPLOYEE_UPDATE',
	EMPLOYEE_DELETE = 'EMPLOYEE_DELETE',
	EMPLOYEE_ROLE_UPDATE = 'EMPLOYEE_ROLE_UPDATE',
	CALENDAR_EVENT_CREATE = 'CALENDAR_EVENT_CREATE',
	CALENDAR_EVENT_UPDATE = 'CALENDAR_EVENT_UPDATE',
	CALENDAR_EVENT_DELETE = 'CALENDAR_EVENT_DELETE',
	READ_WALLET = 'READ_WALLET',
	SMS_UNIT_PRICE_EDIT = 'SMS_UNIT_PRICE_EDIT',
	CATEGORY_EDIT = 'CATEGORY_EDIT',
	CATEGORY_PARAMETER_EDIT = 'CATEGORY_PARAMETER_EDIT',
	COSMETIC_EDIT = 'COSMETIC_EDIT',
	LANGUAGE_EDIT = 'LANGUAGE_EDIT',
	WALLET_TRANSACTION_CREATE = 'WALLET_TRANSACTION_CREATE'
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
export const NOT_ALLOWED_REDIRECT_PATHS = ['/404', '/403']

export enum SUBMENU_PARENT {
	GENERAL = 'GENERAL',
	INVENTORY = 'INVENTORY',
	SALES = 'SALES',
	PRODUCTS = 'PRODUCTS'
}

export enum TOKEN_AUDIENCE {
	API = 'jwt-api',
	FORGOTTEN_PASSWORD = 'FORGOTTEN_PASSWORD',
	INVITATION = 'INVITATION',
	CANCEL_RESERVATION = 'CANCEL_RESERVATION'
}

export enum SALON_TABS_KEYS {
	SALON_DETAIL = 'SALON_DETAIL',
	SALON_HISTORY = 'SALON_HISTORY'
}

export enum SALONS_TAB_KEYS {
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED',
	MISTAKES = 'MISTAKES'
}

export enum EMPLOYEES_TAB_KEYS {
	ACTIVE = 'active',
	DELETED = 'deleted'
}

export enum DASHBOARD_TAB_KEYS {
	SALONS_STATE = 'SALONS_STATE',
	RESERVATION_SYSTEM = 'RESERVATION_SYSTEM'
}

export enum RESERVATIONS_STATE {
	PENDING = 'PENDING',
	ALL = 'ALL'
}

export enum REVIEWS_TAB_KEYS {
	PUBLISHED = 'published',
	DELETED = 'deleted'
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
	CALENDAR = 'CALENDAR',
	SALON_SETTINGS = 'SALON_SETTINGS',
	RESERVATIONS = 'RESERVATIONS',
	NOTINO_RESERVATIONS = 'NOTINO_RESERVATIONS',
	REVIEWS = 'REVIEWS',
	SMS_CREDIT = 'SMS_CREDIT',
	SMS_CREDITS = 'SMS_CREDITS',
	DOCUMENTS = 'DOCUMENTS'
}

export enum PARAMETER_TYPE {
	ENUM = 'ENUM',
	TIME = 'TIME'
}

export const NEW_ID_PREFIX = 'NEW'

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

export const MONTH_NAME_YEAR_FORMAT = 'MMM YYYY'

export const D_M_YEAR_FORMAT = 'D.M.YYYY'

export const YEAR_M_FORMAT = 'YYYY-MM'

export const DATE_TIME_PARSER_DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_PARSER_FORMAT = `${DATE_TIME_PARSER_DATE_FORMAT}:HH:mm`

export const INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT'

export const INDIVIDUAL_TRANSPORT = 0

export const BACK_DATA_QUERY = 'backData'

export const PIN_LENGTH = 6

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
	MAX_COUNT: 100,
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
export enum REQUEST_STATUS {
	SUBMITTING = 'SUBMITTING',
	SUCCESS = 'SUCCESS',
	ERROR = 'ERROR'
}
export enum DROPPABLE_IDS {
	FOLDER_FILES = 'FOLDER_FILES',
	WEBPROJECTS_FILES = 'WEBPROJECTS_FILES'
}

const PRAGUE_LOCATION = {
	lat: 50.0755381,
	lng: 14.4378005
}
export const CYPRESS = {
	// Wait times in [ms]
	S3_UPLOAD_WAIT_TIME: 2000,
	ANIMATION_WAIT_TIME: 1000
}
export const MAP = {
	defaultZoom: 10,
	minLatitude: -90,
	maxLatitude: 90,
	minLongitude: -180,
	maxLongitude: 180,
	minZoom: 8,
	maxZoom: 20,
	placeZoom: 16,
	defaultLocation: PRAGUE_LOCATION,
	locations: {
		[LANGUAGE.CZ]: PRAGUE_LOCATION,
		[LANGUAGE.EN]: PRAGUE_LOCATION,
		// TODO po rolloute nastavit hlavne mesto podla jazyka
		[LANGUAGE.HU]: PRAGUE_LOCATION,
		[LANGUAGE.RO]: PRAGUE_LOCATION,
		[LANGUAGE.BG]: PRAGUE_LOCATION,
		// Bratislava
		[LANGUAGE.SK]: {
			lat: 48.1485965,
			lng: 17.1077477
		}
	}
}

export const mapApiConfig = () =>
	({
		// https://react-google-maps-api-docs.netlify.app/#usejsapiloader
		libraries: ['places'],
		// eslint-disable-next-line no-underscore-dangle
		googleMapsApiKey: window.__RUNTIME_CONFIG__.REACT_APP_GOOGLE_MAPS_API_KEY
	} as LoadScriptUrlOptions)

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

export enum SALON_FILTER_RS {
	ENABLED = 'ENABLED',
	NOT_ENABLED = 'NOT_ENABLED'
}

export enum SALON_FILTER_RS_AVAILABLE_ONLINE {
	AVAILABLE = 'AVAILABLE',
	NOT_AVAILABLE = 'NOT_AVAILABLE'
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
	cancel: (entity: string) => t('loc:Zrušiť {{entity}}', { entity }),
	decline: (entity: string) => t('loc:Zamietnuť {{entity}}', { entity }),
	select: (entity: string) => t('loc:Vyberte {{entity}}', { entity }), // non searchable select field
	search: (entity: string) => t('loc:Vyhľadajte {{entity}}', { entity }), // searchable select field
	searchBy: (entity: string) => t('loc:Vyhľadajte podľa {{entity}}', { entity }), // input field vyhladavaci
	enter: (entity: string) => t('loc:Zadajte {{entity}}', { entity }), // all input fields
	generate: (entity: string) => t('loc:Generovať {{entity}}', { entity }),
	MISSING_PERMISSIONS_TEXT: t('loc:Používateľovi chýbajú oprávnenia na akciu'),
	EMPTY_TABLE_COLUMN_PLACEHOLDER: '---'
})
export const TABLE_DRAG_AND_DROP_KEY = 'sort'
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
	LENGTH_200 = 200,
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
	SALON_LOGO = 'SALON_LOGO',
	SALON_IMAGE = 'SALON_IMAGE',
	SALON_PRICELIST = 'SALON_PRICELIST',
	EMPLOYEE = 'EMPLOYEE_IMAGE',
	USER = 'USER_IMAGE',
	CATEGORY_IMAGE = 'CATEGORY_IMAGE',
	CATEGORY_ICON = 'CATEGORY_ICON',
	COSMETIC = 'COSMETIC_IMAGE',
	CUSTOMER = 'CUSTOMER_IMAGE',
	LANGUAGE_IMAGE = 'LANGUAGE_IMAGE',
	ASSET_DOC_TYPE = 'ASSET_DOC_TYPE',
	ASSET_IMAGE_TYPE = 'ASSET_IMAGE_TYPE'
}

export const ANTD_THEME_VARIABLES_OVERRIDE: Partial<AliasToken> = {
	// Override AntD colors
	colorPrimary: '#000000', // black
	colorLink: '#DC0069', // notino-pink
	colorText: '#404040', // true-gray-700,
	colorTextHeading: '#3F3F46', // cool-gray-900
	colorTextSecondary: '#BFBFBF', // notino-gray
	colorTextDisabled: '#9CA3AF', // cool-gray-100,
	colorSuccess: '#008700', // notino-success
	colorWarning: '#D97706', // amber-600
	colorError: '#D21414', // notino-red
	colorTextPlaceholder: '#BFBFBF', // notino-gray
	borderRadius: 2
}

export const URL_UPLOAD_FILE = '/api/b2b/admin/files/sign-urls'
export const PUBLICATION_STATUSES = Object.keys(PUBLICATION_STATUS)
export const GENDERS = Object.keys(GENDER) as GENDER[]
export const DAYS = Object.keys(DAY) as DAY[]

export enum ACCOUNT_STATE {
	UNPAIRED = 'UNPAIRED',
	PENDING = 'PENDING',
	PAIRED = 'PAIRED'
}

export const UPLOAD_IN_PROGRESS_PROP = 'uploadInProgress'

export const DELETE_BUTTON_ID = 'delete-btn'

export const CREATE_BUTTON_ID = 'create-btn'

export const SUBMIT_BUTTON_ID = 'submit-btn'

export const RESET_BUTTON_ID = 'reset-btn'

export const ADD_BUTTON_ID = 'add-btn'

export const FILTER_BUTTON_ID = 'filter-btn'

export const FORGOT_PASSWORD_BUTTON_ID = 'forgot-password-btn'

export const SIGNUP_BUTTON_ID = 'signup-btn'

export const HELP_BUTTON_ID = 'help-password-btn'

export const CHANGE_PASSWORD_NEW_LINK_BUTTON_ID = 'change-password-new-link-btn'

export const CREATE_EMPLOYEE_BUTTON_ID = 'create-employee-btn'

export const CREATE_CUSTOMER_BUTTON_ID = 'create-customer-btn'

export const IMPORT_BUTTON_ID = (suffix?: string) => `import-btn${suffix ? `-${suffix}` : ''}`

export const GENERATE_REPORT_BUTTON_ID = 'generate-report-button'

export const ROW_BUTTON_WITH_ID = (id: string) => `row-btn-with-id_${id}`

export const SMS_UNIT_PRICES_TABLE_ID = 'sms-unit-prices-table'

export const SMS_TIME_STATS_COUNTRY_PICKER_ID = 'sms-time-stats-country-picker'

export const SMS_TIME_STATS_DATE_PICKER_ID = 'sms-time-stats-date-picker'

export const RECHARGE_SMS_CREDIT_CONTINUE_BUTTON_ID = 'recharge-sms-credit-continue-button'

export const RECHARGE_SMS_CREDIT_BUTTON_ID = 'recharge-sms-credit-button'

export const DOWNLOAD_BUTTON_ID = 'download-button'

export const PUBLISHED_PREMIUM_SALONS_BAR_ID = 'published-premium-salons-bar'

export const SALON_STATS_MONTHLY_ID = 'salon-stats-monthly'

export const SALON_STATS_ANNUAL_ID = 'salon-stats-annual'

export const ENABLE_RS_BUTTON_ID = 'enable-rs-button'

export const ENABLE_RS_BUTTON_FAKE_BUTTON_ID = 'enable-rs-fake-button'

export const CHANGE_SERVICES_ORDER_BUTTON_ID = 'change-services-order-button'

export const CHANGE_SERVICES_ORDER_SAVE_BUTTON_ID = 'change-services-order-save-button'

export const CATEGORY_PARAMS_SWITCH_TYPE_ID = 'category-params-switch-type-id'

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
		changesOverPeriod: `${i18next.t('paths:salons')}?salonState=active&lastUpdatedAtFrom=${from}&lastUpdatedAtTo=${to}`,
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

export enum RESERVATIONS_STATS_TYPE {
	NEW_RS_B2B = 'NEW_RS_B2B',
	NEW_RS_B2C = 'NEW_RS_B2C'
}

export enum TIME_STATS_SOURCE_TYPE {
	MONTH = 'MONTH',
	YEAR = 'YEAR'
}

export enum REVIEW_VERIFICATION_STATUS {
	NOT_VERIFIED = 'NOT_VERIFIED',
	VISIBLE_IN_B2C = 'VISIBLE_IN_B2C',
	HIDDEN_IN_B2C = 'HIDDEN_IN_B2C'
}

// CALENDAR ENUMS
export const CALENDAR_COMMON_SETTINGS = {
	// add condition for cypress E2E errors
	// eslint-disable-next-line no-underscore-dangle
	LICENSE_KEY: window.__RUNTIME_CONFIG__ && window.__RUNTIME_CONFIG__.FULLCALENDAR_LICENSE_KEY ? `${window.__RUNTIME_CONFIG__.FULLCALENDAR_LICENSE_KEY}` : '',
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
	},
	SELECT_CONSTRAINT: {
		startTime: '00:00',
		endTime: '24:00'
	}
}

export enum CALENDAR_VIEW {
	// eslint-disable-next-line @typescript-eslint/no-shadow
	DAY = 'DAY',
	WEEK = 'WEEK',
	MONTH = 'MONTH'
}

export enum CALENDAR_EVENT_TYPE {
	RESERVATION = 'RESERVATION',
	EMPLOYEE_SHIFT = 'EMPLOYEE_SHIFT',
	EMPLOYEE_TIME_OFF = 'EMPLOYEE_TIME_OFF',
	EMPLOYEE_BREAK = 'EMPLOYEE_BREAK'
}

export const RESERVATION_FROM_IMPORT = 'RESERVATION_FROM_IMPORT'

export const CALENDAR_EVENT_TYPE_REQUEST = [RESERVATION_FROM_IMPORT, ...Object.keys(CALENDAR_EVENT_TYPE)] as const

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
	HEADER_MONTH = 'MMMM YYYY',
	TIME = 'HH:mm',
	MONTH_HEADER_DAY_NAME = 'ddd',
	EVENTS_LIST_POPOVER = 'dddd, D MMM'
}

export enum CALENDAR_SET_NEW_DATE {
	FIND_START_ADD = 'ADD',
	FIND_START_SUBSTRACT = 'SUBTRACT',
	FIND_START = 'FIND_START',
	DEFAULT = 'DEFAULT'
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

export const EVENT_NAMES = (t: TFunction, eventType?: CALENDAR_EVENT_TYPE, capitalizeFirstLetter = false) => {
	let string = ''
	switch (eventType) {
		case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
			string = t('loc:prestávku')
			break
		case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
			string = t('loc:shift-akuzativ')
			break
		case CALENDAR_EVENT_TYPE.RESERVATION:
			string = t('loc:rezerváciu')
			break
		case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
			string = t('loc:voľno')
			break
		default:
			break
	}
	if (capitalizeFirstLetter && string) {
		const firstLetterCapitalized = string.charAt(0).toUpperCase()
		return firstLetterCapitalized + string.slice(1)
	}
	return string
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

export const MONTHLY_RESERVATIONS_KEY = 'monthlyReservations'

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
export const CALENDAR_INIT_TIME = 500 // in ms

export const HANDLE_CALENDAR_FORMS = [FORM.CALENDAR_RESERVATION_FORM, FORM.CALENDAR_EVENT_FORM, FORM.CALENDAR_RESERVATION_FROM_IMPORT_FORM]

export enum HANDLE_CALENDAR_ACTIONS {
	CHANGE = 'CHANGE',
	INITIALIZE = 'INITIALIZE'
}
export const CREATE_EVENT_PERMISSIONS = [PERMISSION.PARTNER_ADMIN, PERMISSION.CALENDAR_EVENT_CREATE]
export const UPDATE_EVENT_PERMISSIONS = [PERMISSION.PARTNER_ADMIN, PERMISSION.CALENDAR_EVENT_UPDATE]
export const DELETE_EVENT_PERMISSIONS = [PERMISSION.PARTNER_ADMIN, PERMISSION.CALENDAR_EVENT_DELETE]

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

/**
 * Reservation system (RS)
 */

// relevant types for settings
export enum RS_NOTIFICATION {
	RESERVATION_AWAITING_APPROVAL = 'RESERVATION_AWAITING_APPROVAL',
	RESERVATION_CONFIRMED = 'RESERVATION_CONFIRMED',
	RESERVATION_CHANGED = 'RESERVATION_CHANGED',
	RESERVATION_CANCELLED = 'RESERVATION_CANCELLED',
	RESERVATION_REJECTED = 'RESERVATION_REJECTED',
	RESERVATION_REMINDER = 'RESERVATION_REMINDER'
}

// NOTE: order definition reflect order of options in UI
export enum RS_NOTIFICATION_TYPE {
	EMAIL = 'EMAIL',
	PUSH = 'PUSH',
	SMS = 'SMS'
}

export const NOTIFICATION_TYPES = Object.keys(RS_NOTIFICATION_TYPE)

export enum NOTIFICATION_CHANNEL {
	B2B = 'B2B',
	B2C = 'B2C'
}

export const RS_NOTIFICATION_FIELD_TEXTS = (notificationType: RS_NOTIFICATION, channel: NOTIFICATION_CHANNEL) => {
	const entity = i18next.t(channel === NOTIFICATION_CHANNEL.B2B ? 'loc:Zamestnanec' : 'loc:Zákazník')

	const result = {
		title: '',
		tooltip: ''
	}

	switch (notificationType) {
		case RS_NOTIFICATION.RESERVATION_AWAITING_APPROVAL:
			result.title = i18next.t('loc:Rezervácia čakajúca na schválenie')
			result.tooltip =
				channel === NOTIFICATION_CHANNEL.B2C
					? i18next.t('loc:Zákazník dostane notifikáciu, že jeho rezervácia čaká na schválenie salónom.')
					: i18next.t('loc:Zamestnanec dostane notifikáciu, že rezervácia vytvorená zákazníkom čaká na schválenie.')
			break

		case RS_NOTIFICATION.RESERVATION_CONFIRMED:
			result.title = i18next.t('loc:Potvrdenie rezervácie')
			result.tooltip = i18next.t('loc:{{entity}} dostane notifikáciu, že jeho rezervácia bola potvrdená.', { entity })
			break

		case RS_NOTIFICATION.RESERVATION_CHANGED:
			result.title = i18next.t('loc:Zmena rezervácie')
			result.tooltip =
				channel === NOTIFICATION_CHANNEL.B2C
					? i18next.t('loc:Zákazník dostane notifikáciu, že jeho rezervácia bola zmenená salónom.')
					: i18next.t('loc:Zamestnanec dostane notifikáciu, že jeho rezervácia bola zmenená.')
			break

		case RS_NOTIFICATION.RESERVATION_CANCELLED:
			result.title = i18next.t('loc:Zrušenie rezervácie')
			result.tooltip = i18next.t('loc:{{entity}} dostane notifikáciu, že jeho rezervácia bola zrušená.', { entity })
			break

		case RS_NOTIFICATION.RESERVATION_REJECTED:
			// NOTE: zobrazene iba pre B2C channel
			result.title = i18next.t('loc:Zamietnutie rezervácie')
			result.tooltip = i18next.t('loc:{{entity}} dostane notifikáciu, že jeho rezervácia bola zamietnutá salónom.', { entity })
			break

		case RS_NOTIFICATION.RESERVATION_REMINDER:
			result.title = i18next.t('loc:Pripomenutie rezervácie')
			result.tooltip = i18next.t('loc:{{entity}} dostane deň vopred notifikáciu o blížiacom sa termíne rezervácie.', { entity })
			break

		default:
			break
	}

	return result
}

export enum CALENDAR_DISABLED_NOTIFICATION_TYPE {
	RESERVATION_CHANGED_CUSTOMER = 'RESERVATION_CHANGED_CUSTOMER',
	RESERVATION_REJECTED_CUSTOMER = 'RESERVATION_REJECTED_CUSTOMER',
	RESERVATION_CANCELLED_CUSTOMER = 'RESERVATION_CANCELLED_CUSTOMER',
	RESERVATION_CHANGED_EMPLOYEE = 'RESERVATION_CHANGED_EMPLOYEE',
	RESERVATION_CANCELLED_EMPLOYEE = 'RESERVATION_CANCELLED_EMPLOYEE',
	RESERVATION_REJECTED_EMPLOYEE = 'RESERVATION_REJECTED_EMPLOYEE'
}

export enum CONFIRM_MODAL_DATA_TYPE {
	RESERVATION = 'RESERVATION',
	EVENT = 'EVENT',
	DELETE_EVENT = 'DELETE_EVENT',
	UPDATE_RESERVATION_STATE = 'UPDATE_RESERVATION_STATE'
}

export enum CALENDAR_EVENT_DISPLAY_TYPE {
	REGULAR = 'regular',
	BACKGROUND = 'background',
	INVERSE_BACKGROUND = 'inverse-background'
}

export const CALENDAR_DAY_EVENTS_SHOWN = 5
export const CALENDAR_DAY_EVENTS_LIMIT = CALENDAR_DAY_EVENTS_SHOWN + 1
export const RESERVATION_STATES = Object.keys(RESERVATION_STATE)
export const RESERVATION_PAYMENT_METHODS = Object.keys(RESERVATION_PAYMENT_METHOD)
export const RESERVATION_SOURCE_TYPES = Object.keys(RESERVATION_SOURCE_TYPE)

export const CALENDAR_UPDATE_SIZE_DELAY_AFTER_SIDER_CHANGE = 300 // in ms
export const CALENDAR_UPDATE_SIZE_DELAY = 100 // in ms

export enum CANCEL_TOKEN_MESSAGES {
	CANCELED_DUE_TO_NEW_REQUEST = 'Operation canceled due to new request.',
	CANCELED_ON_DEMAND = 'Operation canceled.'
}

export enum SMS_NOTIFICATION_EVENT_TYPE {
	RESERVATION_CONFIRMED_CUSTOMER = 'RESERVATION_CONFIRMED_CUSTOMER',
	RESERVATION_CHANGED_CUSTOMER = 'RESERVATION_CHANGED_CUSTOMER',
	RESERVATION_REJECTED_CUSTOMER = 'RESERVATION_REJECTED_CUSTOMER',
	RESERVATION_REMINDER_CUSTOMER = 'RESERVATION_REMINDER_CUSTOMER'
}

export enum SMS_NOTIFICATION_STATUS {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	IGNORED = 'IGNORED'
}

export const SMS_NOTIFICATION_EVENT_TYPE_NAME = (notificationType: SMS_NOTIFICATION_EVENT_TYPE) => {
	switch (notificationType) {
		case SMS_NOTIFICATION_EVENT_TYPE.RESERVATION_CONFIRMED_CUSTOMER:
			return i18next.t('loc:Potvrdenie')
		case SMS_NOTIFICATION_EVENT_TYPE.RESERVATION_CHANGED_CUSTOMER:
			return i18next.t('loc:Zmena')
		case SMS_NOTIFICATION_EVENT_TYPE.RESERVATION_REJECTED_CUSTOMER:
			return i18next.t('loc:Zrušenie')
		case SMS_NOTIFICATION_EVENT_TYPE.RESERVATION_REMINDER_CUSTOMER:
			return i18next.t('loc:Pripomienka')
		default:
			return ''
	}
}

export const SMS_STATUS_NAME = (status: SMS_NOTIFICATION_STATUS) => {
	switch (status) {
		case SMS_NOTIFICATION_STATUS.SUCCESS:
			return i18next.t('loc:Prijatá')
		case SMS_NOTIFICATION_STATUS.FAILURE:
			return i18next.t('loc:Nedoručená')
		case SMS_NOTIFICATION_STATUS.IGNORED:
			return i18next.t('loc:Ignorovaná')
		default:
			return ''
	}
}

export enum EXTERNAL_CALENDAR_TYPE {
	MICROSOFT = 'MICROSOFT',
	GOOGLE = 'GOOGLE'
}

export const EXTERNAL_CALENDAR_CONFIG = {
	[EXTERNAL_CALENDAR_TYPE.MICROSOFT]: {
		redirect_uri: `${window.location.protocol}//${window.location.host}/ms-oauth2`,
		scope: 'offline_access user.read Calendars.ReadWrite Calendars.Read',
		authorize_url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
		response_mode: 'query',
		response_type: 'code',
		prompt: 'select_account'
	},
	[EXTERNAL_CALENDAR_TYPE.GOOGLE]: {
		flow: 'auth-code',
		scope: 'email profile https://www.googleapis.com/auth/calendar openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
		redirect_uri: 'postmessage'
	} as UseGoogleLoginOptionsAuthCodeFlow
}

export const SERVICE_ROW_KEY = (categoryID: string, serviceID: string) => `${categoryID}_${serviceID}`

export const SERVICES_LIST_INIT = {
	industries: {
		data: [],
		servicesCount: 0,
		servicesAvailableForOnlineReservationsCount: 0,
		servicesVisibleInPricelistCount: 0
	}
}

export enum SERVICE_DESCRIPTION_LNG {
	DEFAULT = 'DEFAULT',
	EN = 'en'
}

export const MS_REDIRECT_MESSAGE_KEY = 'MS_REDIRECT_MESSAGE_KEY'
