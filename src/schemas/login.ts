import { z } from 'zod'
import { stringConstraint, emailConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

export const loginSchema = z.object({
	email: emailConstraint,
	password: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true)
})

export type ILoginForm = z.infer<typeof loginSchema>

export const validationLoginFn = (values: ILoginForm, props: any) => zodErrorsToFormErrors(loginSchema, FORM.LOGIN, values, props)
