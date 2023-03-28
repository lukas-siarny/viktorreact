import { z } from 'zod'
import { zodErrorsToFormErrors, stringConstraint, emailsConstraint, phoneNumbersConstraint, openingHoursConstraint, twoCharsConstraint } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

export const supportContactSchema = z.object({
	emails: emailsConstraint(),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	street: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	city: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	zipCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	streetNumber: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	countryCode: twoCharsConstraint,
	phones: phoneNumbersConstraint(),
	openingHours: openingHoursConstraint(),
	sameOpenHoursOverWeek: z.boolean().nullish(),
	openOverWeekend: z.boolean().nullish()
})

export type ISupportContactForm = z.infer<typeof supportContactSchema>

export const validationSupportContactFn = (values: ISupportContactForm, props: any) => zodErrorsToFormErrors(supportContactSchema, FORM.SUPPORT_CONTACT, values, props)
