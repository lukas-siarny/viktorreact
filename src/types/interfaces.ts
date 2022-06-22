/* eslint-disable import/no-cycle */
import { GENDER, MSG_TYPE, LANGUAGE } from '../utils/enums'
import { Paths } from './api'

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
}

/**
 * ValueType  number | string
 */
export interface ILabelInValueOption<ValueType = number, ExtraType = any> {
	key: ValueType
	value: ValueType
	label: string
	extra?: ExtraType
}

export interface ILoginForm {
	email: string
	password: string
}


export interface IInviteEmployeeForm {
	email: string
}

export interface ICreateUserForm {
	email: string
	phonePrefixCountryCode: string
	phone: string
	roleID: number
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

interface GalleryItem {
	id: number
}

export interface IServiceForm {
	name: string
	description: string
	salonID: number
	durationFrom: number
	durationTo: number
	variableDuration: boolean
	priceFrom: number
	priceTo: number
	variablePrice: boolean
	gallery: GalleryItem[]
	categoryRoot: number
	categoryFirstLevel: number
	categorySecondLevel: number
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

export interface IJwtPayload {
	aud: string
	exp: number
	iat: number
	uid: number
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
	action?: any
	titleName?: string | null | undefined
}

export interface IBreadcrumbs {
	items: IBreadcrumbItem[]
}

export interface ICountryLabel {
	[key: string]: string
}

export interface IStructuredAddress {
	zip: string | null
	street: string | null
	streetNumber: string | null
	city: string | null
	country: string | null
	houseNumber: string | null
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
	zipCode?: string
	city?: string
	street?: string
	streetNumber?: string
	countryCode?: string
	salonID: number
}

export interface IEmployeeForm {
	firstName: string
	lastName: string
	salonID: number
	email?: string
	phonePrefixCountryCode?: string
	phone?: string
	services?: any
	imageID?: number
}

export interface ILanguagePickerForm {
	language: LANGUAGE
}

export interface IPrice {
	exponent: number
	significand: number
}

export interface IUserAvatar {
	src?: string
	alt?: string
	text?: string
	key?: string | number
}
