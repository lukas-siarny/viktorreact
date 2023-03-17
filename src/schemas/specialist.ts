import { z } from 'zod'
import { stringConstraint, emailConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/postApiB2BAdminEnumsContacts
export const specialistSchema = z.object({
	email: emailConstraint.optional(),
	phonePrefixCountryCode: z.string().length(VALIDATION_MAX_LENGTH.LENGTH_2),
	countryCode: z.string().length(VALIDATION_MAX_LENGTH.LENGTH_2),
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true)
})

export type ISpecialistContactForm = z.infer<typeof specialistSchema>
export const validationSpecialistContactFn = (values: ISpecialistContactForm, props: any) => zodErrorsToFormErrors(specialistSchema, FORM.SPECIALIST_CONTACT, values, props)
