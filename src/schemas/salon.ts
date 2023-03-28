import { z } from 'zod'
import { emailConstraint, imageConstraint, stringConstraint, twoCharsConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonId
export const salonSchema = z.object({
	// TODO: dorobit aj select validaciu
	name: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255, true),
	aboutUsFirst: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),

	firstName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	lastName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	phonePrefixCountryCode: twoCharsConstraint,
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	avatar: imageConstraint.array().max(1).nullish(),
	assignedCountryCode: twoCharsConstraint.optional()
})

export type ISalonForm = z.infer<typeof salonSchema>

export const validationSalonFn = (values: ISalonForm, props: any) => zodErrorsToFormErrors(salonSchema, FORM.SALON, values, props)
