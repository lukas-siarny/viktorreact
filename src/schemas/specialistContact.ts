import { z } from 'zod'
import { stringConstraint, emailConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

export const specialistContactSchema = z.object({
	email: emailConstraint.optional(),
	phonePrefixCountryCode: z.string().length(2),
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	countryCode: z.string().length(2)
})

export type ISpecialistContactForm = z.infer<typeof specialistContactSchema>

export const validationSpecialistContactFn = (values: ISpecialistContactForm, props: any) => zodErrorsToFormErrors(specialistContactSchema, FORM.SPECIALIST_CONTACT, values, props)
