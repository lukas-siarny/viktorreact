import { z } from 'zod'
import { stringConstraint, emailConstraint, zodErrorsToFormErrors, passwordConstraint, twoCharsConstraint, serializeValidationMessage } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

export const registrationSchema = z.object({
	email: emailConstraint,
	password: passwordConstraint,
	phonePrefixCountryCode: twoCharsConstraint,
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	agreeGDPR: z.literal<boolean>(true, { errorMap: () => ({ message: serializeValidationMessage('loc:Toto pole je povinné') }) }),
	marketing: z.boolean().optional()
})

export type IRegistrationForm = z.infer<typeof registrationSchema>

export const validationRegistrationFn = (values: IRegistrationForm, props: any) => zodErrorsToFormErrors(registrationSchema, FORM.REGISTRATION, values, props)
