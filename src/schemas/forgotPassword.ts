import { z } from 'zod'
import { emailConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM } from '../utils/enums'

export const forgotPasswordSchema = z.object({
	email: emailConstraint
})

export type IForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export const validationForgotPasswordFn = (values: IForgotPasswordForm, props: any) => zodErrorsToFormErrors(forgotPasswordSchema, FORM.FORGOT_PASSWORD, values, props)
