import { z } from 'zod'
import { passwordConstraint, serializeValidationMessage, zodErrorsToFormErrors } from './baseSchema'
import { FORM } from '../utils/enums'

export const createPasswordSchema = z
	.object({
		password: passwordConstraint,
		confirmPassword: z.string()
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Heslá sa nezhodujú'),
				path: ['confirmPassword']
			})
		}
	})

export type ICreatePasswordForm = z.infer<typeof createPasswordSchema>

export const validationCreatePasswordFn = (values: ICreatePasswordForm, props: any) => zodErrorsToFormErrors(createPasswordSchema, FORM.CREATE_PASSWORD, values, props)
