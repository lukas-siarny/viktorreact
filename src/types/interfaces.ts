/* eslint-disable import/no-cycle */
import { MSG_TYPE } from '../utils/enums'

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
