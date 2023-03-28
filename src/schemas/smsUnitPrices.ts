import { z } from 'zod'
import { twoCharsConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM } from '../utils/enums'

export const smsUnitPricesSchema = z.object({
	validFrom: z.string(),
	amount: z.number().positive().finite(),
	countryCode: twoCharsConstraint
})

export type ISmsUnitPricesForm = z.infer<typeof smsUnitPricesSchema>

export const validationSmsUnitPricesFn = (values: ISmsUnitPricesForm, props: any) => zodErrorsToFormErrors(smsUnitPricesSchema, FORM.SMS_UNIT_PRICES_FORM, values, props)
