import { SALON_STATES } from './../utils/enums'
/* eslint-disable import/no-cycle */
import { ColumnsType } from 'antd/lib/table'
import { GENDER, MSG_TYPE, LANGUAGE, PERMISSION, SALON_PERMISSION } from '../utils/enums'
import { Paths } from './api'
import { PaginationProps } from 'antd'
import { Path } from 'typescript'

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
}

export interface IUserAccountForm {
	firstName: string
	lastName: string
	email: string
	phone: string
	phonePrefixCountryCode: string
	companyName?: string
	businessID?: string
	vatID?: string
	zipCode?: string
	city?: string
	street?: string
	countryCode?: string
}

export type OpeningHours = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours']

export interface ISalonForm {
	salonNameFromSelect: boolean
	id: string | null
	name: string | null
	nameSelect: { key: string, label: string | null; value: string | null } | null
	aboutUsFirst: string | null
	state?: SALON_STATES
	aboutUsSecond: string | null
	openingHours: OpeningHours
	note: string | null
	noteFrom: string | null
	noteTo: string | null
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
	phones: { phonePrefixCountryCode: string | null, phone: string | null }[]
	email: string | null
	categoryIDs: [string, ...string[] ] | null
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
	phones: { phonePrefixCountryCode: string, phone: string }[]
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

export interface IOpenHoursNoteForm {
	hoursNote: {
		note: string
		range: {
			dateFrom: string
			dateTo: string
		}
	}
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
	salonID: string
	gallery: any,
	avatar: any
}

export interface IEmployeeForm {
	firstName: string
	lastName: string
	salonID: string
	email?: string
	phonePrefixCountryCode?: string
	phone?: string
	services?: any
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

// TODO: change any when BE is done
export type ISpecialistContact = any /* Paths.GetApiB2BAdminEnumsCosmetics.Responses.$200['cosmetics'][0] */

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