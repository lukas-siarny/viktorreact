import { capitalize, orderBy } from 'lodash'
import i18next, { TFunction } from 'i18next'
import { Gutter } from 'antd/lib/grid/row'
import en_GB from 'antd/lib/locale-provider/en_GB'
import sk_SK from 'antd/lib/locale-provider/sk_SK'
import cs_CZ from 'antd/lib/locale-provider/cs_CZ'

// types
// eslint-disable-next-line import/no-cycle
import { ICountryLabel } from '../types/interfaces'

export enum KEYBOARD_KEY {
	ENTER = 'Enter'
}

export enum NAMESPACE {
	PATHS = 'paths',
	LOC = 'loc'
}

export enum LANGUAGE {
	SK = 'sk',
	CZ = 'cz',
	EN = 'en'
}

export const REFRESH_TOKEN_INTERVAL = 1000 * 60 * 13 // 13 minutes

export const REFRESH_PAGE_INTERVAL = 1000 * 60 * 60 * 4 // 4 hurs

export const DEFAULT_LANGUAGE = LANGUAGE.SK

export const LOCALES = {
	[LANGUAGE.SK]: {
		ISO_639: 'sk',
		antD: sk_SK
	},
	[LANGUAGE.CZ]: {
		ISO_639: 'cs',
		antD: cs_CZ
	},
	[LANGUAGE.EN]: {
		ISO_639: 'en',
		antD: en_GB
	}
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
	USER_ACCOUNT_FORM = 'USER_ACCOUNT_FORM',
	LOGIN = 'LOGIN',
	CATEGORY = 'CATEGORY',
	SALONS_FILTER = 'SALONS_FILTER',
	ACTIVATION = 'ACTIVATION',
	FORGOT_PASSWORD = 'FORGOT_PASSWORD',
	CREATE_PASSWORD = 'CREATE_PASSWORD',
	REGISTRATION = 'REGISTRATION',
	USER_PROFILE = 'USER_PROFILE',
	ADMIN_USERS_FILTER = 'ADMIN_USERS_FILTER',
	ENUMERATION_FORM = 'ENUMERATION_FORM',
	ENUMERATION_FORM_2 = 'ENUMERATION_FORM_2',
	ROLE_FORM = 'ROLE_FORM',
	ADMIN_CREATE_USER = 'ADMIN_CREATE_USER',
	ADMIN_UPDATE_USER = 'ADMIN_UPDATE_USER',
	ADMIN_PERMISSIONS_FORM = 'ADMIN_PERMISSIONS_FORM',
	ADMIN_CONFIRM_USER_FORM = 'ADMIN_CONFIRM_USER_FORM',
	SELECT_USER_FORM = 'SELECT_USER_FORM',
	ASSIGN_ROLE_FORM = 'ASSIGN_ROLE_FORM',
	ACCOMMODATION_FACILITIES_FILTER = 'ACCOMMODATION_FACILITIES_FILTER',
	ACCOMMODATION_FACILITY_INFO_FORM = 'ACCOMMODATION_FACILITY_INFO_FORM',
	ADDRESS_FORM = 'ADDRESS_FORM',
	HOUSE_ADDRESS_FORM = 'HOUSE_ADDRESS_FORM',
	DESTINATION_FORM = 'DESTINATION_FORM',
	DESTINATIONS_FILTER = 'DESTINATIONS_FILTER',
	AIR_TRANSPORTS_FILTER = 'AIR_TRANSPORTS_FILTER',
	BUS_TRANSPORTS_FILTER = 'BUS_TRANSPORTS_FILTER',
	TRANSPORT_INFO_FORM = 'TRANSPORT_INFO_FORM',
	TRANSPORT_ROADS_FILTER = 'TRANSPORT_ROADS_FILTER',
	TRANSPORT_ROAD_FORM = 'TRANSPORT_ROAD_FORM',
	ADD_UNIT_TEMPLATE_FORM = 'ADD_UNIT_TEMPLATE_FORM',
	ADD_STATION_FORM = 'ADD_STATION_FORM',
	ADD_TERM_STATION_FORM = 'ADD_TERM_STATION_FORM',
	FILE_FORM = 'FILE_FORM',
	TAGS_FORM = 'TAGS_FORM',
	ADD_FOLDER_FORM = 'ADD_FOLDER_FORM',
	TEXT_DESCRIPTION_FORM = 'TEXT_DESCRIPTION_FORM',
	TEXT_ITEM_TABLE = 'TEXT_ITEM_TABLE',
	ACCOMMODATION_FACILITY_PROPERTY_CATEGORIES_FORM = 'ACCOMMODATION_FACILITY_PROPERTY_CATEGORIES_FORM',
	DESTINATION_SEASONS_FILTER = 'DESTINATION_SEASONS_FILTER',
	DESTINATION_SEASONS_PRICELIST_ITEMS_SEARCH_FORM = 'DESTINATION_SEASONS_PRICELIST_ITEMS_SEARCH_FORM',
	DESTINATION_SEASONS_PRICELIST_ITEMS_CREATE_FORM = 'DESTINATION_SEASONS_PRICELIST_ITEMS_CREATE_FORM',
	DESTINATION_SEASONS_PRICELIST_ITEMS_UPDATE_FORM = 'DESTINATION_SEASONS_PRICELIST_ITEMS_UPDATE_FORM',
	DESTINATION_SEASON_FORM = 'DESTINATION_SEASON_FORM',
	TRANSPORTATION_SERVICE_STEP_1_FORM = 'TRANSPORTATION_SERVICE_STEP_1_FORM', // nazov + linky
	TRANSPORTATION_SERVICE_STEP_2_FORM = 'TRANSPORTATION_SERVICE_STEP_2_FORM', // generovanie jazd
	TRANSPORTATION_SERVICE_STEP_3_FORM = 'TRANSPORTATION_SERVICE_STEP_3_FORM', // potvrdenie
	TERM_NOTE_FORM = 'TERM_NOTE_FORM',
	COST_SEASONS_FORM = 'COST_SEASONS_FORM',
	GENERAL_PRICELIST_ITEM_COST_SEASONS_FORM = 'GENERAL_PRICELIST_ITEM_COST_SEASONS_FORM',
	ENUMERATION_FORM_FILTER = 'ENUMERATION_FORM_FILTER',
	TERM_SERIALS_FORM = 'TERM_SERIALS_FORM',
	TERMS_FORM = 'TERMS_FORM',
	UPDATE_TERMS_FORM = 'UPDATE_TERMS_FORM',
	SERVICE_FORM = 'SERVICE_FORM',
	ASSIGN_FACILITY_SERVICE_FORM = 'ASSIGN_FACILITY_SERVICE_FORM',
	FILES_FILTER_FORM = 'FILES_FILTER_FORM',
	USER_PERMISSION_FILTER = 'USER_PERMISSION_FILTER',
	TERM_SERIAL_SECTION_FORM = 'TERM_SERIAL_SECTION_FORM',
	SERVICE_UNIT_TEMPLATE_FORM = 'SERVICE_UNIT_TEMPLATE_FORM',
	SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM = 'SERVICE_UNIT_TEMPLATE_PRICELIST_ITEM_FORM',
	CORPORATION_FORM = 'CORPORATION_FORM',
	CORPORATION_BRANCH_FORM = 'CORPORATION_BRANCH_FORM',
	CORPORATION_BRANCHES_FILTER = 'CORPORATION_BRANCHES_FILTER',
	BUSINESS_CASE_SUGGEST = 'BUSINESS_CASE_SUGGEST',
	BUSINESS_CASE_INDIVIDUAL_FORM = 'BUSINESS_CASE_INDIVIDUAL_FORM',
	BUSINESS_CASE_LEGAL_FORM = 'BUSINESS_CASE_LEGAL_FORM',
	BUSINESS_CASE_EXTEND_EXPIRATION_FORM = 'BUSINESS_CASE_EXTEND_EXPIRATION_FORM',
	BUSINESS_CASES_FILTER = 'BUSINESS_CASES_FILTER',
	ADD_TRAVELER_FORM = 'ADD_TRAVELER_FORM',
	TRAVELER_FORM = 'TRAVELER_FORM',
	TRAVELER_FORM_NEW = 'TRAVELER_FORM_NEW',
	CUSTOMERS_FILTER = 'CUSTOMERS_FILTER',
	PRODUCTS_FILTER = 'PRODUCTS_FILTER',
	PRODUCTS_EXTENDED_FILTER = 'PRODUCTS_EXTENDED_FILTER',
	ADVANCED_FILTERS_FORM = 'ADVANCED_FILTERS_FORM',
	DISCOUNTS_FILTER = 'DISCOUNTS_FILTER',
	DISCOUNT_FORM = 'DISCOUNT_FORM',
	INDIVIDUAL_FACILITY_FORM = 'INDIVIDUAL_FACILITY_FORM',
	GROUP_FACILITY_FORM = 'GROUP_FACILITY_FORM',
	RESERVATION_FORM = 'RESERVATION_FORM',
	INSURANCE_FORM = 'INSURANCE_FORM',
	REPORT_FORM = 'REPORT_FORM',
	PAYMENTS_FILTER = 'PAYMENTS_FILTER',
	PAYMENT_FORM = 'PAYMENT_FORM',
	COMMISIONS_FILTER = 'COMMISIONS_FILTER',
	COMMISION_FORM = 'COMMISION_FORM',
	BUSINESS_CASE_NOTE_FORM = 'BUSINESS_CASE_NOTE_FORM',
	SERVICES_FILTER = 'SERVICES_FILTER',
	OPEN_HOURS_NOTE = 'OPEN_HOURS_NOTE'
}

export enum PERMISSION {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	PARTNER = 'PARTNER',
	USER_CREATE = 'USER_CREATE',
	USER_BROWSING = 'USER_BROWSING',
	USER_EDIT = 'USER_EDIT',
	USER_DELETE = 'USER_DELETE',
	ENUM_BROWSING = 'ENUM_BROWSING',
	ENUM_EDIT = 'ENUM_EDIT',
	SALON_BROWSING = 'SALON_BROWSING',
	SALON_EDIT = 'SALON_EDIT'
}

export enum SUBMENU_PARENT {
	GENERAL = 'GENERAL',
	INVENTORY = 'INVENTORY',
	SALES = 'SALES',
	PRODUCTS = 'PRODUCTS'
}

export enum DISCOUNT_PRIORITY {
	NONE = 'NONE',
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	MAX = 'MAX'
}

export enum DISCOUNT_VALUE_TYPE {
	PERCENT = 'PERCENT',
	FIX = 'FIX'
}

export enum REQ_TYPE {
	UPDATE = 'UPDATE',
	CREATE = 'CREATE'
}

export enum TOKEN_AUDIENCE {
	API = 'jwt-api',
	FORGOTTEN_PASSWORD = 'FORGOTTEN_PASSWORD',
	INVITATION = 'INVITATION'
}

export enum PERSON_TYPE {
	CHILD = 'CHILD',
	ADULT = 'ADULT'
}

export const PERSON_TYPE_INFANT = 'PERSON_TYPE_INFANT'

export const ADULT_PERSON_TYPE_MIN_AGE = 18
export const ADULT_PERSON_TYPE_MAX_AGE = 120
export const CHILD_PERSON_TYPE_MAX_AGE = 17
export const CUSTOMER_MIN_AGE = 18
export const MIN_DEPOSIT_AMOUNT = 100

export const ROOM_CAPACITY = {
	MAX_ROOM_OCCUPANCY: 4,
	MAX_ROOMS: 20,
	MAX_ADULT_COUNT: 30,
	MAX_CHILDREN_COUNT: 10,
	MAX_INFANT_COUNT: 5
}

export const EMPTY_FILTER_ROOM = {
	count: 1,
	occupancy: {
		[PERSON_TYPE.ADULT]: { count: 1 },
		[PERSON_TYPE.CHILD]: { count: 0, ages: [] }
	}
}

export enum PAGE {
	SALONS = 'SALONS',
	ENUMERATIONS = 'ENUMERATIONS',
	CATEGORIES = 'CATEGORIES',
	USER_PROFILE = 'USER_PROFILE',
	USERS = 'USERS',
	ACCOMMODATION_FACILITIES = 'ACCOMMODATION_FACILITIES',
	ROLES = 'ROLES',
	DESTINATIONS = 'DESTINATIONS',
	BUS_TRANSPORTATION = 'BUS_TRANSPORTATION',
	AIR_TRANSPORTATION = 'AIR_TRANSPORTATION',
	FOLDERS = 'FOLDERS',
	DESTINATION_SEASON = 'DESTINATION_SEASON',
	CUSTOMERS = 'CUSTOMERS',
	SALE = 'SALE',
	SERVICES = 'SERVICES',
	PERMISSIONS = 'PERMISSIONS',
	COMPANIES = 'COMPANIES',
	BRANCHES = 'BRANCHES',
	BUSINESS_CASES = 'BUSINESS_CASES',
	BUSINESS_CASE_PAYMENTS = 'BUSINESS_CASE_PAYMENTS',
	DISCOUNTS = 'DISCOUNTS',
	INSURANCES = 'INSURANCES',
	PAYMENTS = 'PAYMENTS',
	// Parent pages
	GENERAL = 'GENERAL',
	INVENTORY = 'INVENTORY',
	PRODUCTS = 'PRODUCTS',
	SALES = 'SALES',
	COMMISIONS = 'COMMISIONS',
	ENTRY = 'ENTRY',
	HOME = 'HOME',
	MY_ACCOUNT = 'MY_ACCOUNT',
	ACTIVATION = 'ACTIVATION'
}

export enum PAGE_ACCOMMODATION_FACILITY_TABS {
	ACCOMMODATION_FACILITY_INFO_TAB = 'ACCOMMODATION_FACILITY_INFO_TAB',
	ACCOMMODATION_FACILITY_PROPERTIES = 'ACCOMMODATION_FACILITY_PROPERTIES',
	ACCOMMODATION_FACILITY_PHOTOS_TAB = 'ACCOMMODATION_FACILITY_PHOTOS_TAB',
	ACCOMMODATION_FACILITY_UNIT_TEMPLATES_TAB = 'ACCOMMODATION_FACILITY_UNIT_TEMPLATES_TAB',
	ACCOMMODATION_FACILITY_GALLERY = 'ACCOMMODATION_FACILITY_GALLERY'
}

export enum PAGE_TRANSPORT_ROAD_TABS {
	TRANSPORT_ROAD_INFO_TAB = 'TRANSPORT_ROAD_INFO_TAB'
}

export enum PAGE_COMPANY_TABS {
	COMPANY_INFO_TAB = 'COMPANY_INFO_TAB',
	COMPANY_BRANCHES_TAB = 'COMPANY_BRANCHES_TAB'
}

export enum PAGE_COMMISION_TABS {
	COMMISION_INFO_TAB = 'COMMISION_INFO_TAB'
}

export enum PAGE_CUSTOMER_TABS {
	CUSTOMER_INFO_TAB = 'CUSTOMER_INFO_TAB'
}

export enum PAGE_USER_PROFILE_TABS {
	USER_PROFILE_INFO_TAB = 'USER_PROFILE_INFO_TAB'
}

export enum PAGE_COMPANY_BRANCH_TABS {
	COMPANY_BRANCH_INFO_TAB = 'COMPANY_BRANCH_INFO_TAB'
}

export enum PAGE_DESTINATION_TABS {
	INFO = 'INFO',
	GALLERY = 'GALLERY',
	TEXT_DESCRIPTION = 'TEXT_DESCRIPTION'
}

export enum PAGE_DISCOUNT_TABS {
	INFO = 'INFO'
}

export enum PAGE_SERVICES_TABS {
	INFO = 'INFO',
	GALLERY = 'GALLERY',
	TEXT_DESCRIPTION = 'TEXT_DESCRIPTION'
}

export enum PAGE_LINE_TABS {
	LINE_INFO_TAB = 'LINE_INFO_TAB',
	LINE_STATIONS_TAB = 'LINE_STATIONS_TAB',
	LINE_UNIT_TEMPLATES_TAB = 'LINE_UNIT_TEMPLATES_TAB',
	LINE_ROADS_TAB = 'LINE_ROADS_TAB', // Lety
	LINE_TEXT_DESCRIPTION = 'LINE_TEXT_DESCRIPTION'
}

export enum PAGE_DESTINATION_SEASON_TABS {
	INFO = 'INFO',
	TERMS = 'TERMS',
	TRANSPORTATION = 'TRANSPORTATION',
	FACILITY = 'FACILITY',
	ERROR_CONSOLE = 'ERROR_CONSOLE',
	GENERAL_PRICELIST_ITEMS = 'GENERAL_PRICELIST_ITEMS'
}

export const TAB_ID_PREFIX = 'noti-tabs'

export enum PAGE_BUSINESS_CASE_TABS {
	TRAVELERS = 'TRAVELERS',
	GENERAL = 'GENERAL',
	PAYMENTS = 'PAYMENTS',
	DOCUMENTS = 'DOCUMENTS'
}

export enum PAGE_BUSINESS_CASE_PAYMENTS_TABS {
	INFO = 'INFO',
	LOGS = 'LOGS'
}
export enum PAGE_INSURANCE_TABS {
	INFO = 'INFO'
}

export enum PAGE_ENUMMERATION_TABS {
	INFO = 'INFO'
}

export enum WEB_PROJECT_CODE {
	TIPTRAVEL = 'TIPTRAVEL',
	TATRATOUR = 'TATRATOUR',
	SENECA = 'SENECA',
	HECHTER = 'HECHTER',
	KOALA = 'KOALA',
	COMMON = 'COMMON'
}

export const DEFAULT_DATE_INPUT_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DATE_INIT_FORMAT = 'YYYY-MM-DD'

export const DEFAULT_TIME_FORMAT = 'HH:mm'

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DATE_WITH_TIME_FORMAT = 'DD.MM.YYYY HH:mm'

export const INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT'

export const INDIVIDUAL_TRANSPORT = 0

export enum SOCKET_EVENT {
	FOLDER_COMPRESSION_PROGRESS = 'folderCompressionProgress'
}

export const BACK_DATA_QUERY = 'backData'
export const INIT_DATA_QUERY = 'initkData'

export enum BACK_ENTITY {
	ROAD = 'ROAD',
	FACILITY = 'FACILITY'
}

export enum ENUMERATIONS_KEYS {
	// LANGUAGES = 'languages',
	// VAT_RATES = 'vatRates',
	// CURRENCIES = 'currencies',
	COUNTRIES_PHONE_PREFIX = 'countries_phone_prefix',
	COUNTRIES = 'countries'
	// UNIT_TEMPLATES = 'unitTemplates',
	// TEXT_TEMPLATES = 'textTemplates',
	// TIME_ZONES = 'timeZones',
	// PROPERTIES = 'properties',
	// PRODUCT_TYPES = 'productTypes',
	// PRODUCT_CATALOGUES = 'productCatalogues',
	// PERSON_TYPES = 'personTypes',
	// PRICE_GROUPS = 'priceGroups',
	// EXCHANGE_RATES = 'exchangeRates',
	// DISCOUNT_MARKS = 'discountMarks',
	// RESERVATION_EXPIRATION_TIMES = 'reservationExpirationTimes',
	// DEPOSIT_AMOUNTS = 'depositAmounts'
}

export const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBYEtWbN4XE4lcmntowheFqUGKpUKORwZ0&libraries=places&language=sk'
export const UNSPLASH_API_KEY = '-fx2nNGTarjuitKIz4qAUOCP1uLAlPClByWS6YpaSLc'
export const UNSPLASH_IMAGE_SEARCH_STRING = 'nature'
export const EMPTY_KEY = 'EMPTY_KEY'

export enum ENUMERATIONS_PATHS {
	LANGUAGES = 'languages',
	VAT_RATES = 'vat-rates',
	CURRENCIES = 'currencies',
	COUNTRIES = 'countries',
	UNIT_TEMPLATES = 'unit-templates',
	TEXT_TEMPLATES = 'text-templates',
	PROPERTIES = 'properties',
	PRODUCT_TYPES = 'product-types',
	PRODUCT_CATALOGUES = 'product-catalogues',
	PERSON_TYPES = 'person-types',
	PRICE_GROUPS = 'price-groups',
	EXCHANGE_RATES = 'exchange-rates',
	DISCOUNT_MARKS = 'discount-marks',
	RESERVATION_EXPIRATION_TIMES = 'reservation-expiration-times',
	DEPOSIT_AMOUNTS = 'deposit-amounts'
}

export const PAGINATION = {
	defaultPageSize: 25,
	pageSizeOptions: ['25', '50', '100'],
	limit: 25 // 25 | 50 | 100
}

export const QUERY_LIMIT = {
	MAX_255: 255
}

export enum RESERVATION_STATE {
	RESERVED = 'RESERVED',
	EXPIRED = 'EXPIRED',
	EXPIRED_WITH_PAYMENT = 'EXPIRED_WITH_PAYMENT',
	PARTIALLY_PAID = 'PARTIALLY_PAID',
	AFTER_EXPIRATION_DATE = 'AFTER_EXPIRATION_DATE',
	FULLY_PAID = 'FULLY_PAID',
	CANCELED = 'CANCELED'
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

export const INPUT_MASK = {
	IBAN_SK_CZ: 'aa99 9999 9999 9999 9999 9999'
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

export const MAP = {
	defaultZoom: 10,
	defaultLatitude: 48.736277,
	defaultLongitude: 19.1461917,
	minLatitude: -90,
	maxLatitude: 90,
	minLongitude: -180,
	maxLongitude: 180,
	minZoom: 1,
	maxZoom: 10
}

export enum SALON_STATUSES {
	PUBLISHED = 'PUBLISHED',
	VISIBLE = 'VISIBLE',
	DELETED = 'DELETED',
	ALL = 'ALL'
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

export enum GLOBAL_DISCOUNT_TYPE {
	OLD_BUSINESS_CASE = 'OLD_BUSINESS_CASE', // zľava pre stálych klientov
	NEW_BUSINESS_CASE = 'NEW_BUSINESS_CASE', // zľava pre nových klientov
	LIMIT_CAPACITY_UNIT_TEMPLATE = 'LIMIT_CAPACITY_UNIT_TEMPLATE', // zľava pre prvých XY leteniek alebo izieb
	TRIP = 'TRIP', // zľava na zájazd
	CASHBACK = 'CASHBACK' // cashback
}

export const PAGE_VIEW_OPTIONS = [
	{
		label: 'Tabuľka',
		key: PAGE_VIEW.TABLE
	},
	{
		label: 'Strom',
		key: PAGE_VIEW.TREE
	}
]

export enum COUNTER_TYPE {
	INCREASE = 'INCREASE',
	DECREASE = 'DECREASE'
}

export enum ADDITIONAL_SERVICE_TYPE {
	GENERAL_INSURANCE = 'GENERAL_INSURANCE',
	GENERAL_PRICELIST_ITEM = 'GENERAL_PRICELIST_ITEM',
	INDIVIDUAL_PRICELIST_ITEM = 'INDIVIDUAL_PRICELIST_ITEM'
}

export const ENUMERATIONS_OPTIONS = () =>
	orderBy(
		[
			// {
			// 	label: i18next.t('loc:Jazyky'),
			// 	key: ENUMERATIONS_KEYS.LANGUAGES,
			// 	url: ENUMERATIONS_PATHS.LANGUAGES
			// },
			// {
			// 	label: i18next.t('loc:Sadzba DPH'),
			// 	key: ENUMERATIONS_KEYS.VAT_RATES,
			// 	url: ENUMERATIONS_PATHS.VAT_RATES
			// },
			// {
			// 	label: i18next.t('loc:Mena'),
			// 	key: ENUMERATIONS_KEYS.CURRENCIES,
			// 	url: ENUMERATIONS_PATHS.CURRENCIES
			// },
			{
				label: i18next.t('loc:Krajiny'),
				key: ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX,
				url: ENUMERATIONS_PATHS.COUNTRIES
			}
			// {
			// 	label: i18next.t('loc:Vzory jednotiek'),
			// 	key: ENUMERATIONS_KEYS.UNIT_TEMPLATES,
			// 	url: ENUMERATIONS_PATHS.UNIT_TEMPLATES
			// },
			// {
			// 	label: i18next.t('loc:Textové popisy'),
			// 	key: ENUMERATIONS_KEYS.TEXT_TEMPLATES,
			// 	url: ENUMERATIONS_PATHS.TEXT_TEMPLATES
			// },
			// {
			// 	label: i18next.t('loc:Vlastnosti zariadenia'),
			// 	key: ENUMERATIONS_KEYS.PROPERTIES,
			// 	url: ENUMERATIONS_PATHS.PROPERTIES
			// },
			// {
			// 	label: i18next.t('loc:Typ produktu'),
			// 	key: ENUMERATIONS_KEYS.PRODUCT_TYPES,
			// 	url: ENUMERATIONS_PATHS.PRODUCT_TYPES
			// },
			// {
			// 	label: i18next.t('loc:Katalóg produktov'),
			// 	key: ENUMERATIONS_KEYS.PRODUCT_CATALOGUES,
			// 	url: ENUMERATIONS_PATHS.PRODUCT_CATALOGUES
			// },
			// {
			// 	label: i18next.t('loc:Typ osoby'),
			// 	key: ENUMERATIONS_KEYS.PERSON_TYPES,
			// 	url: ENUMERATIONS_PATHS.PERSON_TYPES
			// },
			// {
			// 	label: i18next.t('loc:Cenová skupina'),
			// 	key: ENUMERATIONS_KEYS.PRICE_GROUPS,
			// 	url: ENUMERATIONS_PATHS.PRICE_GROUPS
			// },
			// {
			// 	label: i18next.t('loc:Výmenný menový kurz'),
			// 	key: ENUMERATIONS_KEYS.EXCHANGE_RATES,
			// 	url: ENUMERATIONS_PATHS.EXCHANGE_RATES
			// },
			// {
			// 	label: i18next.t('loc:Príznak zľavy'),
			// 	key: ENUMERATIONS_KEYS.DISCOUNT_MARKS,
			// 	url: ENUMERATIONS_PATHS.DISCOUNT_MARKS
			// },
			// {
			// 	label: i18next.t('loc:Expirácia rezervácie'),
			// 	key: ENUMERATIONS_KEYS.RESERVATION_EXPIRATION_TIMES,
			// 	url: ENUMERATIONS_PATHS.RESERVATION_EXPIRATION_TIMES
			// },
			// {
			// 	label: i18next.t('loc:Výška zálohy'),
			// 	key: ENUMERATIONS_KEYS.DEPOSIT_AMOUNTS,
			// 	url: ENUMERATIONS_PATHS.DEPOSIT_AMOUNTS
			// }
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
	EMPTY_TABLE_COLUMN_PLACEHOLDER: '---',
	DEFAULT_LANGUAGE: t('loc:slovensky')
})

export enum PUBLICATION_STATUS {
	PUBLISHED = 'PUBLISHED',
	UNPUBLISHED = 'UNPUBLISHED'
}

export enum ADDRESS_TYPE {
	CORRESPONDENCE = 'CORRESPONDENCE',
	PRESENTATION = 'PRESENTATION',
	BILLING = 'BILLING',
	ORGANIZATION = 'ORGANIZATION'
}

export const addressTypeOrderPattern = [ADDRESS_TYPE.ORGANIZATION, ADDRESS_TYPE.BILLING, ADDRESS_TYPE.CORRESPONDENCE, ADDRESS_TYPE.PRESENTATION] // Sídlo, Fakturačná, Korešpondenčná, Prezentačná

export enum LINE_DIRECTION {
	FORTH = 'FORTH',
	BACK = 'BACK',
	BACK_AND_FORTH = 'BACK_AND_FORTH'
}

export const lineDirectionFilterOptions = [
	{
		key: LINE_DIRECTION.FORTH,
		value: LINE_DIRECTION.FORTH,
		label: 'Tam'
	},
	{
		key: LINE_DIRECTION.BACK,
		value: LINE_DIRECTION.BACK,
		label: 'Späť'
	},
	{
		key: LINE_DIRECTION.BACK_AND_FORTH,
		value: LINE_DIRECTION.BACK_AND_FORTH,
		label: 'Tam a späť'
	}
]

export const lineDirectionOptions = [
	{
		key: LINE_DIRECTION.FORTH,
		value: LINE_DIRECTION.FORTH,
		label: 'Tam'
	},
	{
		key: LINE_DIRECTION.BACK,
		value: LINE_DIRECTION.BACK,
		label: 'Späť'
	}
]

export enum UNIT_TEMPLATE_FACILITY_TYPE {
	FAMILY_SUITE = 'FAMILY_SUITE',
	FAMILY_ROOM = 'FAMILY_ROOM',
	APARTMAN = 'APARTMAN',
	STUDIO = 'STUDIO',
	DELUXE = 'DELUXE'
}

export enum STATION_DIRECTION {
	START = 'START',
	END = 'END'
}

export enum OWNERSHIP_TYPE {
	PURCHASED = 'PURCHASED',
	OWN = 'OWN'
}

export const lineOwnershipOptions = [
	{
		key: OWNERSHIP_TYPE.PURCHASED,
		value: OWNERSHIP_TYPE.PURCHASED,
		label: 'Nakupované'
	},
	{
		key: OWNERSHIP_TYPE.OWN,
		value: OWNERSHIP_TYPE.OWN,
		label: 'Vlastné'
	}
]

export enum LINE_CONNECTION_TYPE {
	CHARTER = 'CHARTER',
	REGULAR = 'REGULAR'
}

export const lineConnectionTypeOptions = [
	{
		key: LINE_CONNECTION_TYPE.CHARTER,
		value: LINE_CONNECTION_TYPE.CHARTER,
		label: 'Charterová linka'
	},
	{
		key: LINE_CONNECTION_TYPE.REGULAR,
		value: LINE_CONNECTION_TYPE.REGULAR,
		label: 'Pravidelná linka'
	}
]

export enum UPLOAD_ERROR_TYPE {
	MAX_SIZE = 'MAX_SIZE',
	MAX_FILES = 'MAX_FILES',
	INVALID_TYPE = 'INVALID_TYPE'
}

export enum TEXT_TEMPLATE_TYPE {
	DESTINATION = 'DESTINATION',
	AIR_TRANSPORT = 'AIR_TRANSPORT',
	BUS_TRANSPORT = 'BUS_TRANSPORT',
	SERVICE = 'SERVICE'
}

export enum PROPERTY_TYPE {
	BOOLEAN = 'BOOLEAN',
	TEXT = 'TEXT',
	NUMBER = 'NUMBER'
}

export enum FACILITY_PROPERTY_CATEGORIES {
	BASE = 'BASE',
	LOCATION = 'LOCATION',
	BEACHES = 'BEACHES',
	DESCRIPTION = 'DESCRIPTION',
	SPORT = 'SPORT',
	ACCOMMODATION = 'ACCOMMODATION'
}

export enum PROPERTY_USAGE {
	FACILITY = 'FACILITY',
	AIR_TRANSPORT = 'AIR_TRANSPORT', // NOTE: unused yet
	BUS_TRANSPORT = 'BUS_TRANSPORT' // NOTE: unused yet
}

export enum PRICELIST_ITEM_USAGE {
	FACILITY = 'FACILITY',
	TRANSPORTATION = 'TRANSPORTATION'
}

export enum PRICELIST_ITEM_TIME_RELATION {
	NIGHT = 'NIGHT',
	DAY = 'DAY',
	X_NIGHTS = 'X_NIGHTS',
	TRIP = 'TRIP'
}

export enum PRICELIST_ITEM_UNIT_RELATION {
	PERSON = 'PERSON',
	UNIT = 'UNIT'
}

export enum TERM_GENERATION_REPETITION_TYPE {
	START_AT_PREVIOUS_END = 'START_AT_PREVIOUS_END',
	EVERY_X_DAY = 'EVERY_X_DAY',
	EVERY_X_WEEK = 'EVERY_X_WEEK'
}

export enum DAY {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY'
}

export enum SERVICE_TYPE {
	TRANSPORTATION = 'TRANSPORTATION',
	FACILITY = 'FACILITY',
	INSURANCE = 'INSURANCE'
}

export enum DEPARTURE_SHIFT {
	SAME_DAY = 'SAME_DAY',
	ONE_DAY_BEFORE = 'ONE_DAY_BEFORE',
	TWO_DAYS_BEFORE = 'TWO_DAYS_BEFORE'
}

export enum ARRIVAL_SHIFT {
	SAME_DAY = 'SAME_DAY',
	ONE_DAY_AFTER = 'ONE_DAY_AFTER',
	TWO_DAYS_AFTER = 'TWO_DAYS_AFTER'
}

export const serviceTypeOptions = [
	{
		key: SERVICE_TYPE.FACILITY,
		value: SERVICE_TYPE.FACILITY,
		label: 'Ubytovacie zariadenie'
	},
	{
		key: SERVICE_TYPE.TRANSPORTATION,
		value: SERVICE_TYPE.TRANSPORTATION,
		label: 'Doprava'
	},
	{
		key: SERVICE_TYPE.INSURANCE,
		value: SERVICE_TYPE.INSURANCE,
		label: 'Poistenie',
		disabled: true // TODO: oddisablovat ked bude implmentovany tento druh dopravy
	}
]

export const facilityCategoryOurOptions = [
	{
		key: 1,
		value: 1,
		label: '☀'
	},
	{
		key: 1.5,
		value: 1.5,
		label: '☀+'
	},
	{
		key: 2,
		value: 2,
		label: '☀☀'
	},
	{
		key: 2.5,
		value: 2.5,
		label: '☀☀+'
	},
	{
		key: 3,
		value: 3,
		label: '☀☀☀'
	},
	{
		key: 3.5,
		value: 3.5,
		label: '☀☀☀+'
	},
	{
		key: 4,
		value: 4,
		label: '☀☀☀☀'
	},
	{
		key: 4.5,
		value: 4.5,
		label: '☀☀☀☀+'
	},
	{
		key: 5,
		value: 5,
		label: '☀☀☀☀☀'
	},
	{
		key: 5.5,
		value: 5.5,
		label: '☀☀☀☀☀+'
	},
	{
		key: 6,
		value: 6,
		label: '☀☀☀☀☀☀'
	},
	{
		key: 6.5,
		value: 6.5,
		label: '☀☀☀☀☀☀+'
	},
	{
		key: 7,
		value: 7,
		label: '☀☀☀☀☀☀☀'
	}
]

export enum USER_STATE {
	ACTIVE = 'ACTIVE',
	DELETED = 'DELETED'
}

export const userStateOptions = () => [
	{
		key: USER_STATE.ACTIVE,
		value: USER_STATE.ACTIVE,
		label: i18next.t('loc:Aktivovaný')
	},
	{
		key: USER_STATE.DELETED,
		value: USER_STATE.DELETED,
		label: i18next.t('loc:Odstránený')
	}
]

export enum TRAVELER_ROLE {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	CHILD = 'CHILD',
	INFANT = 'INFANT',
	STORNO = 'STORNO',
	TAX_FREE = 'TAX_FREE'
}

export enum GENDER {
	MALE = 'MALE',
	FEMALE = 'FEMALE'
}

export enum CUSTOMER_TYPE {
	INDIVIDUAL = 'INDIVIDUAL',
	LEGAL = 'LEGAL'
}

export enum CLIENT_TYPE {
	CUSTOMER = 'CUSTOMER', // => moze byt INDIVIDUAL / LEGAL
	TRAVELER = 'TRAVLER' // Obycajny zakaznik (Cestujuci) kde sa enrozlisuje CUSTOMER_TYPE
}

export const customerTypeOptions = () => [
	{
		key: CUSTOMER_TYPE.LEGAL,
		value: CUSTOMER_TYPE.LEGAL,
		label: i18next.t('loc:Právnická osoba')
	},
	{
		key: CUSTOMER_TYPE.INDIVIDUAL,
		value: CUSTOMER_TYPE.INDIVIDUAL,
		label: i18next.t('loc:Fyzická osoba')
	}
]

export enum PAGE_PAYMENT_TABS {
	INFO = 'INFO',
	LOGS = 'LOGS'
}

export enum VALIDATION_MAX_LENGTH {
	LENGTH_255 = 255,
	LENGTH_100 = 100,
	LENGTH_20 = 20,
	LENGTH_10 = 10
}

export const getTranslatedCountriesLabels = (): ICountryLabel => {
	return {
		SK: `${i18next.t('loc:Slovenská republika')}`,
		CZ: `${i18next.t('loc:Česká republika')}`
	} as ICountryLabel
}

export const GDPR_URL = 'https://www.notino.sk/ochrana-osobnych-udajov/'
export const GTC_URL = 'https://www.notino.sk/obchodne-podmienky-vip/'
export const MARKETING_URL = 'https://www.notino.sk/'

export const OCCUPANCY_ALL_PERSONS_EXTRA_BED = 'OCCUPANCY_ALL_PERSONS_EXTRA_BED'
export const OCCUPANCY_ALL_PERSONS_WITHOUT_BED = 'OCCUPANCY_ALL_PERSONS_WITHOUT_BED'
export const COST_SEASON_ALL_TERMS_KEY = 'COST_SEASON_ALL_TERMS_KEY'

export enum BYTE_MULTIPLIER {
	KILO = 10 ** 3,
	MEGA = 10 ** 6
}

export const PUBLICATION_STATUSES = Object.keys(PUBLICATION_STATUS)
export const TEXT_TEMPLATE_TYPES = Object.keys(TEXT_TEMPLATE_TYPE)
export const PROPERTY_TYPES = Object.keys(PROPERTY_TYPE)
export const PROPERTY_USAGES = Object.keys(PROPERTY_USAGE)
export const PRICELIST_ITEM_USAGES = Object.keys(PRICELIST_ITEM_USAGE) as PRICELIST_ITEM_USAGE[]
export const PRICELIST_ITEM_TIME_RELATIONS = Object.keys(PRICELIST_ITEM_TIME_RELATION) as PRICELIST_ITEM_TIME_RELATION[]
export const PRICELIST_ITEM_UNIT_RELATIONS = Object.keys(PRICELIST_ITEM_UNIT_RELATION) as PRICELIST_ITEM_UNIT_RELATION[]
export const DEPARTURE_SHIFTS = Object.keys(DEPARTURE_SHIFT) as DEPARTURE_SHIFT[]
export const ARRIVAL_SHIFTS = Object.keys(ARRIVAL_SHIFT) as ARRIVAL_SHIFT[]
export const GENDERS = Object.keys(GENDER) as GENDER[]
export const TRAVELER_ROLES = Object.keys(TRAVELER_ROLE) as TRAVELER_ROLE[]
export const PERSON_TYPES = Object.keys(PERSON_TYPE) as PERSON_TYPE[]
export const DAYS = Object.keys(DAY) as DAY[]
