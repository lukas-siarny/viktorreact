import { z } from 'zod'
import { zodErrorsToFormErrors, stringConstraint } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

export const supportContactSchema = z.object({
	emails: z.array(z.object({ email: z.string() })),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	street: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	city: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	zipCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	streetNumber: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	countryCode: z.string().length(2).nullish(),
	phones: z.array(z.object({ phonePrefixCountryCode: z.string(), phone: z.string() })),
	openingHours: z.any(),
	sameOpenHoursOverWeek: z.boolean(),
	openOverWeekend: z.boolean()
})

/**
 *
 * 	id: string | null
	note: string
	openingHours: OpeningHours
	sameOpenHoursOverWeek: boolean
	openOverWeekend: boolean
	countryCode: string
	zipCode: string
	city: string
	street: string
	streetNumber: string
	phones: { phonePrefixCountryCode: string; phone: string }[]
	emails: { email: string }[]
 */

export type ISupportContactForm = z.infer<typeof supportContactSchema>

export const validationSupportContactFn = (values: ISupportContactForm, props: any) => zodErrorsToFormErrors(supportContactSchema, FORM.SUPPORT_CONTACT, values, props)
