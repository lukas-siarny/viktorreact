import { z } from 'zod'
import { stringConstraint, emailConstraint, zodErrorsToFormErrors, passwordConstraint } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'
import passwordRegEx from '../utils/regex'

export const registrationSchema = z.object({
	email: emailConstraint,
	password: passwordConstraint,
	phonePrefixCountryCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_2, true),
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	agreeGDPR: z.literal<boolean>(true),
	marketing: z.boolean().optional()
})

export type IRegistrationForm = z.infer<typeof registrationSchema>

export const validationRegistrationFn = (values: IRegistrationForm, props: any) => zodErrorsToFormErrors(registrationSchema, FORM.REGISTRATION, values, props)
