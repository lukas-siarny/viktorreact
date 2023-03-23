import { z } from 'zod'
import { stringConstraint, imageConstraint, emailConstraint, zodErrorsToFormErrors, twoCharsConstraint } from './baseSchema'
import { VALIDATION_MAX_LENGTH, GENDER, FORM } from '../utils/enums'

export const customerSchema = z.object({
	firstName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100, true),
	lastName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100, true),
	email: emailConstraint.optional(),
	phonePrefixCountryCode: twoCharsConstraint,
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	street: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	city: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	zipCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	streetNumber: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	countryCode: twoCharsConstraint.optional(),
	gender: z.nativeEnum(GENDER).optional(),
	gallery: imageConstraint.nullish().array().max(100).optional(),
	avatar: imageConstraint.array().max(1).nullish()
})

export type ICustomerForm = z.infer<typeof customerSchema>

export const validationCustomerFn = (values: ICustomerForm, props: any) => zodErrorsToFormErrors(customerSchema, FORM.CUSTOMER, values, props)
