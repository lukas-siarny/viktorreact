import { orderBy } from 'lodash'
import i18next, { TFunction } from 'i18next'
import { Gutter } from 'antd/lib/grid/row'

// types
// eslint-disable-next-line import/no-cycle
import { ICurrency } from '../types/interfaces'

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
	BG = 'bg',
	IT = 'it'
}

export const REFRESH_TOKEN_INTERVAL = 1000 * 60 * 13 // 13 minutes

export const REFRESH_PAGE_INTERVAL = 1000 * 60 * 60 * 4 // 4 hours

export const DEFAULT_LANGUAGE = LANGUAGE.EN

export const DEFAULT_PHONE_PREFIX = 'CZ'

export const DEFAULT_CURRENCY: ICurrency = {
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

export enum FILTER_ENTITY {
	EMPLOYEE = 'EMPLOYEE',
	SALON = 'SALON',
	SERVICE = 'SERVICE',
	USER = 'USER'
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
	REQUEST_NEW_SERVICE_FORM = 'REQUEST_NEW_SERVICE_FORM',
	CUSTOMERS_FILTER = 'CUSTOMERS_FILTER',
	SERVICES_FILTER = 'SERVICES_FILTER',
	OPEN_HOURS_NOTE = 'OPEN_HOURS_NOTE',
	EMPLOYEE = 'EMPLOYEE',
	INVITE_EMPLOYEE = 'INVITE_EMPLOYEE',
	SUPPORT_CONTACTS_FILTER = 'SUPPORT_CONTACTS_FILTER',
	SUPPORT_CONTACT = 'SUPPORT_CONTACT',
	NOTE = 'NOTE',
	EDIT_EMPLOYEE_ROLE = 'EDIT_EMPLOYEE_ROLE',
	SALON_IMPORTS_FORM = 'SALON_IMPORTS_FORM',
	SALON_HISTORY_FILTER = 'SALON_HISTORY_FILTER',
	INDUSTRIES = 'INDUSTRIES',
	INDUSTRY = 'INDUSTRY',
	LANGUAGES = 'LANGUAGES',
	LANGUAGES_FILTER = 'LANGUAGES_FILTER'
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
	USER_ROLE_EDIT = 'USER_ROLE_EDIT'
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

export enum PAGE {
	SALON = 'SALON',
	SALONS = 'SALONS',
	ENUMERATIONS = 'ENUMERATIONS',
	CATEGORIES = 'CATEGORIES',
	CATEGORY_PARAMETERS = 'CATEGORY_PARAMETERS',
	USER_PROFILE = 'USER_PROFILE',
	USERS = 'USERS',
	ROLES = 'ROLES',
	CUSTOMERS = 'CUSTOMERS',
	SERVICES = 'SERVICES',
	PERMISSIONS = 'PERMISSIONS',
	HOME = 'HOME',
	MY_ACCOUNT = 'MY_ACCOUNT',
	ACTIVATION = 'ACTIVATION',
	EMPLOYEES = 'EMPLOYEES',
	SUPPORT_CONTACTS = 'SUPPORT_CONTACTS',
	SUPPORT_CONTACT = 'SUPPORT_CONTACT',
	COSMETICS = 'COSMETICS',
	LANGUAGES = 'LANGUAGES',
	INDUSTRIES = 'INDUSTRIES',
	INDUSTRY = 'INDUSTRY',
	PENDING_INVITES = 'PENDING_INVITES'
}

export enum PARAMETER_TYPE {
	ENUM = 'ENUM',
	TIME = 'TIME'
}

export const DEFAULT_DATE_INPUT_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DATE_INIT_FORMAT = 'YYYY-MM-DD'

export const DEFAULT_TIME_FORMAT = 'HH:mm'

export const DEFAULT_DATE_FORMAT = 'DD.MM.YYYY'

export const DEFAULT_DATE_WITH_TIME_FORMAT = 'DD.MM.YYYY HH:mm'

export const EN_DATE_WITH_TIME_FORMAT = 'MMM DD YYYY HH:mm'

export const EN_DATE_WITHOUT_TIME_FORMAT = 'DD.MM.YYYY'

export const INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT'

export const INDIVIDUAL_TRANSPORT = 0

export const BACK_DATA_QUERY = 'backData'

export enum ENUMERATIONS_KEYS {
	COUNTRIES_PHONE_PREFIX = 'countries_phone_prefix',
	COUNTRIES = 'countries',
	CURRENCIES = 'currencies'
}

export const GOOGLE_MAPS_API_KEY = 'AIzaSyD6Cs7Tw5bfIaocqRl0bKUSwswLuHHc_Kw'
export const GOOGLE_MAP_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&language=sk`

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

export enum SALON_CREATE_TYPES {
	BASIC = 'BASIC',
	NON_BASIC = 'NON_BASIC'
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
	LENGTH_5 = 5
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
	EMPLOEYEE_2 = 'EMPLOEYEE_2',
	EXTERNAL = 'EXTERNAL'
}

export enum SALON_HISTORY_OPERATIONS {
	INSERT = 'INSERT',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
	RESTORE = 'RESTORE'
}

export const SALON_ROLES_KEYS = Object.keys(SALON_ROLES)

export const SALON_ROLES_TRANSLATIONS = () => ({
	[SALON_ROLES.ADMIN]: i18next.t('loc:Admin'),
	[SALON_ROLES.MANAGER]: i18next.t('loc:Manažér'),
	[SALON_ROLES.RECEPTIONIST]: i18next.t('loc:Recepčný'),
	[SALON_ROLES.EMPLOEYEE_1]: i18next.t('loc:Zamestnanec 1'),
	[SALON_ROLES.EMPLOEYEE_2]: i18next.t('loc:Zamestnanec 2'),
	[SALON_ROLES.EXTERNAL]: i18next.t('loc:Externista')
})

export const SALON_ROLES_PERMISSIONS = () => [
	{
		name: i18next.t('loc:Správa profilu salónu'),
		allowed: [SALON_ROLES.ADMIN, SALON_ROLES.MANAGER],
		extra: {
			[SALON_ROLES.MANAGER]: i18next.t('loc:len úprava')
		}
	},
	{
		name: i18next.t('loc:Správa firemných a fakturačných údajov salónu'),
		allowed: [SALON_ROLES.ADMIN],
		extra: {}
	},
	{
		name: i18next.t('loc:Správa oprávnení zamesnancov'),
		allowed: [SALON_ROLES.ADMIN, SALON_ROLES.MANAGER],
		extra: {
			[SALON_ROLES.MANAGER]: i18next.t('loc:okrem Admin')
		}
	},
	{
		name: i18next.t('loc:Správa služieb salónu'),
		allowed: [SALON_ROLES.ADMIN, SALON_ROLES.MANAGER],
		extra: {}
	},
	{
		name: i18next.t('loc:Správa zamestnancov salónu'),
		allowed: [SALON_ROLES.ADMIN, SALON_ROLES.MANAGER],
		extra: {}
	},
	{
		name: i18next.t('loc:Správa zákazníkov salónu'),
		allowed: [SALON_ROLES.ADMIN, SALON_ROLES.MANAGER, SALON_ROLES.RECEPTIONIST, SALON_ROLES.EMPLOEYEE_1, SALON_ROLES.EMPLOEYEE_2],
		extra: {
			[SALON_ROLES.EMPLOEYEE_1]: i18next.t('loc:len vytváranie a úprava'),
			[SALON_ROLES.EMPLOEYEE_2]: i18next.t('loc:len vytváranie a úprava')
		}
	},
	{
		name: i18next.t('loc:Správa online rezervácií'),
		allowed: [SALON_ROLES.ADMIN, SALON_ROLES.MANAGER, SALON_ROLES.RECEPTIONIST, SALON_ROLES.EMPLOEYEE_1, SALON_ROLES.EMPLOEYEE_2],
		extra: {
			[SALON_ROLES.ADMIN]: i18next.t('loc:len úprava a mazanie'),
			[SALON_ROLES.MANAGER]: i18next.t('loc:len úprava a mazanie'),
			[SALON_ROLES.RECEPTIONIST]: i18next.t('loc:len úprava a mazanie'),
			[SALON_ROLES.EMPLOEYEE_1]: i18next.t('loc:len úprava a mazanie'),
			[SALON_ROLES.EMPLOEYEE_2]: i18next.t('loc:len úprava a mazanie, len svoje')
		}
	},
	{
		name: i18next.t('loc:Správa offline rezervácií'),
		allowed: [SALON_ROLES.ADMIN, SALON_ROLES.MANAGER, SALON_ROLES.RECEPTIONIST, SALON_ROLES.EMPLOEYEE_1, SALON_ROLES.EMPLOEYEE_2, SALON_ROLES.EXTERNAL],
		extra: {
			[SALON_ROLES.EMPLOEYEE_2]: i18next.t('loc:len svoje'),
			[SALON_ROLES.EXTERNAL]: i18next.t('loc:len svoje')
		}
	}
]
