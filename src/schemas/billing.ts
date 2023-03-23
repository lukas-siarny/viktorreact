import { z } from 'zod'

import { emailConstraint, stringConstraint, twoCharsConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.9#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonIdInvoice
export const billingSchema = z.object({
	// companyInvoiceAddress
	countryCode: twoCharsConstraint.optional(),
	zipCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	city: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	street: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	streetNumber: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	// companyContactPerson
	firstName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	lastName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	email: emailConstraint.optional(),
	phonePrefixCountryCode: twoCharsConstraint.optional(),
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20),
	// companyInfo
	businessID: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20),
	taxID: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20),
	vatID: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20),
	companyName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255)
})

export type IBillingForm = z.infer<typeof billingSchema>

export const validationBillingInfoFn = (values: IBillingForm, props: any) => zodErrorsToFormErrors(billingSchema, FORM.SALON_BILLING_INFO, values, props)
