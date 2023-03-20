import { z } from 'zod'
import { stringConstraint, emailConstraint, zodErrorsToFormErrors, serializeValidationMessage } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'
import passwordRegEx from '../utils/regex'

export const registrationSchema = z.object({
	email: emailConstraint,
	password: z.string().regex(passwordRegEx, serializeValidationMessage('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak')),
	phonePrefixCountryCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_2, true),
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	agreeGDPR: z.literal<boolean>(true),
	marketing: z.boolean().optional()
})

export type IRegistrationForm = z.infer<typeof registrationSchema>

export const validationFn = (values: IRegistrationForm, props: any) => zodErrorsToFormErrors(registrationSchema, FORM.REGISTRATION, values, props)
