import { z } from 'zod'
import { stringConstraint, emailConstraint, zodErrorsToFormErrors, twoCharsConstrain } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/postApiB2BAdminEnumsContacts
export const specialistSchema = z.object({
	email: emailConstraint.optional(),
	phonePrefixCountryCode: twoCharsConstrain,
	countryCode: twoCharsConstrain,
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true)
})

export type ISpecialistContactForm = z.infer<typeof specialistSchema>

export const validationSpecialistContactFn = (values: ISpecialistContactForm, props: any) => zodErrorsToFormErrors(specialistSchema, FORM.SPECIALIST_CONTACT, values, props)
