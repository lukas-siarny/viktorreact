import { z } from 'zod'
import { emailConstraint, passwordConstraint, serializeValidationMessage, zodErrorsToFormErrors } from './baseSchema'
import { FORM } from '../utils/enums'

// create password
export const createPasswordSchema = z
	.object({
		password: passwordConstraint,
		confirmPassword: z.string()
	})
	.refine(({ confirmPassword, password }) => confirmPassword === password, {
		message: serializeValidationMessage('loc:Heslá sa nezhodujú'),
		path: ['confirmPassword']
	})

export type ICreatePasswordForm = z.infer<typeof createPasswordSchema>

export const validationCreatePasswordFn = (values: ICreatePasswordForm, props: any) => zodErrorsToFormErrors(createPasswordSchema, FORM.CREATE_PASSWORD, values, props)

// forgot password
export const forgotPasswordSchema = z.object({
	email: emailConstraint
})

export type IForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const validationForgotPasswordFn = (values: IForgotPasswordForm, props: any) => zodErrorsToFormErrors(forgotPasswordSchema, FORM.FORGOT_PASSWORD, values, props)
