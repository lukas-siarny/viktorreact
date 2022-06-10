import { orderBy } from 'lodash'
import i18next, { TFunction } from 'i18next'
import { Gutter } from 'antd/lib/grid/row'
import en_GB from 'antd/lib/locale-provider/en_GB'
import sk_SK from 'antd/lib/locale-provider/sk_SK'
import cs_CZ from 'antd/lib/locale-provider/cs_CZ'

import { ReactComponent as SK_Flag } from '../assets/flags/SK.svg'
import { ReactComponent as EN_Flag } from '../assets/flags/GB.svg'
import { ReactComponent as CZ_Flag } from '../assets/flags/CZ.svg'

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
		antD: sk_SK,
		icon: SK_Flag
	},
	[LANGUAGE.CZ]: {
		ISO_639: 'cs',
		antD: cs_CZ,
		icon: CZ_Flag
	},
	[LANGUAGE.EN]: {
		ISO_639: 'en',
		antD: en_GB,
		icon: EN_Flag
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
	CUSTOMER = 'CUSTOMER',
	USER_ACCOUNT = 'USER_ACCOUNT',
	SALON = 'SALON',
	LOGIN = 'LOGIN',
	CATEGORY = 'CATEGORY',
	SALONS_FILTER = 'SALONS_FILTER',
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
	SERVICE_FORM = 'SERVICE_FORM',
	CUSTOMERS_FILTER = 'CUSTOMERS_FILTER',
	SERVICES_FILTER = 'SERVICES_FILTER',
	OPEN_HOURS_NOTE = 'OPEN_HOURS_NOTE',
	EMPLOYEE = 'EMPLOYEE',
	INVITE_EMPLOYEE = 'INVITE_EMPLOYEE'
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
	SALON_EDIT = 'SALON_EDIT',
	CUSTOMER_BROWSING = 'CUSTOMER_BROWSING',
	CUSTOMER_EDIT = 'CUSTOMER_EDIT',
	EMPLOYEE_BROWSING = 'EMPLOYEE_BROWSING',
	EMPLOYEE_EDIT = 'EMPLOYEE_EDIT'
}

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

export enum PAGE {
	SALON = 'SALON',
	SALONS = 'SALONS',
	ENUMERATIONS = 'ENUMERATIONS',
	CATEGORIES = 'CATEGORIES',
	USER_PROFILE = 'USER_PROFILE',
	USERS = 'USERS',
	ROLES = 'ROLES',
	CUSTOMERS = 'CUSTOMERS',
	SERVICES = 'SERVICES',
	PERMISSIONS = 'PERMISSIONS',
	HOME = 'HOME',
	MY_ACCOUNT = 'MY_ACCOUNT',
	ACTIVATION = 'ACTIVATION',
	EMPLOYEES = 'EMPLOYEES'
}

export const DEFAULT_DATE_INPUT_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DATE_INIT_FORMAT = 'YYYY-MM-DD'

export const DEFAULT_TIME_FORMAT = 'HH:mm'

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DATE_WITH_TIME_FORMAT = 'DD.MM.YYYY HH:mm'

export const EN_DATE_WITH_TIME_FORMAT = 'MMM DD YYYY HH:mm'

export const INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT'

export const INDIVIDUAL_TRANSPORT = 0

export const BACK_DATA_QUERY = 'backData'

export enum ENUMERATIONS_KEYS {
	COUNTRIES_PHONE_PREFIX = 'countries_phone_prefix',
	COUNTRIES = 'countries'
}

export const GOOGLE_MAPS_API_KEY = 'AIzaSyDg42FXI6ehKk2h9R9I01TRjcwaY-Bcvuw'
export const GOOGLE_MAP_URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDg42FXI6ehKk2h9R9I01TRjcwaY-Bcvuw&libraries=places&language=sk'

export enum ENUMERATIONS_PATHS {
	COUNTRIES = 'countries'
}

export const PAGINATION = {
	defaultPageSize: 25,
	pageSizeOptions: ['25', '50', '100'],
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

export const MAP = {
	defaultZoom: 10,
	defaultLatitude: 48.736277,
	defaultLongitude: 19.1461917,
	minLatitude: -90,
	maxLatitude: 90,
	minLongitude: -180,
	maxLongitude: 180,
	minZoom: 1,
	maxZoom: 20
}

export enum SALON_STATUSES {
	PUBLISHED = 'PUBLISHED',
	VISIBLE = 'VISIBLE',
	DELETED = 'DELETED',
	NOT_DELETED = 'NOT_DELETED',
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
	EMPTY_TABLE_COLUMN_PLACEHOLDER: '---',
	DEFAULT_LANGUAGE: t('loc:slovensky')
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
	LENGTH_1000 = 1000,
	LENGTH_500 = 500,
	LENGTH_255 = 255,
	LENGTH_100 = 100,
	LENGTH_60 = 60,
	LENGTH_50 = 50,
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

export enum BYTE_MULTIPLIER {
	KILO = 10 ** 3,
	MEGA = 10 ** 6
}

export const LOCALIZATIONS = 'LOCALIZATIONS'

export enum UPLOAD_IMG_CATEGORIES {
	SALON = 'SALON',
	USER = 'USER'
}

export const URL_UPLOAD_IMAGES = '/api/b2b/admin/files/sign-urls'
export const PUBLICATION_STATUSES = Object.keys(PUBLICATION_STATUS)
export const GENDERS = Object.keys(GENDER) as GENDER[]
export const DAYS = Object.keys(DAY) as DAY[]
