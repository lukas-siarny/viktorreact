import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { z, ZodString, ZodOptional } from 'zod'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

function stringConstraint<T extends true | false>(maxLength: number, required?: T): T extends true ? ZodString : ZodOptional<ZodString>
function stringConstraint<T extends true | false>(maxLength: number, required?: T): ZodString | ZodOptional<ZodString> {
	const base = z.string(required ? { required_error: i18next.t('loc:Toto pole je povinné') } : undefined).max(maxLength, {
		message: i18next.t('loc:Max. počet znakov je {{max}}', {
			max: maxLength
		})
	})

	if (required) {
		return base.min(1)
	}

	return base.optional()
}

const imageConstraint = z.object({
	url: z.string().url(),
	thumbnail: z.string().url().optional(),
	uid: z.string().uuid()
})

export const customerSchema = z.object({
	firstName: z.preprocess((firstName) => {
		if (!firstName) {
			return null
		}
		return firstName
	}, stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100, true)),
	lastName: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100, true),
	email: z.optional(
		z
			.string()
			.email({ message: i18next.t('loc:Email nie je platný') })
			.trim()
			.max(VALIDATION_MAX_LENGTH.LENGTH_255, {
				message: i18next.t('loc:Max. počet znakov je {{max}}', {
					max: VALIDATION_MAX_LENGTH.LENGTH_255
				})
			})
	),
	phonePrefixCountryCode: z
		.string({
			required_error: i18next.t('loc:Toto pole je povinné')
		})
		.min(2)
		.max(3),
	phone: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000),
	street: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	city: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	zipCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	streetNumber: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	gender: z.string().optional().nullable(),
	galleryImageIDs: imageConstraint.array().optional(),
	profileImageID: imageConstraint.array().max(1).optional()
})

export type Customer = z.infer<typeof customerSchema>

export default (values: Customer) => {
	const errors: FormErrors<Customer> = {}
	const validationErrors: FormErrors<Customer> = {}

	if (!values.firstName) {
		errors.firstName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.firstName && values.firstName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.firstName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (!values.lastName) {
		errors.lastName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.lastName && values.lastName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.lastName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (values?.email) {
		if (values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		} else if (!isEmail(values?.email)) {
			errors.email = i18next.t('loc:Email nie je platný')
		}
	}

	if (!values?.phone) {
		errors.phone = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (values?.phone && !values?.phonePrefixCountryCode) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.note && values.note?.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.note = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	if (values?.street && values?.street?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.street = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (values?.streetNumber && values?.streetNumber?.length > VALIDATION_MAX_LENGTH.LENGTH_10) {
		errors.streetNumber = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_10
		})
	}

	if (values?.city && values?.city?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.city = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (values?.zipCode && values?.zipCode?.length > VALIDATION_MAX_LENGTH.LENGTH_10) {
		errors.zipCode = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_10
		})
	}

	console.log('🚀 ~ file: validateCustomerForm.tsx:134 ~ errors:', errors)
	// console.log('🚀 ~ file: validateCustomerForm.tsx:132 ~ values:', values)
	const result = customerSchema.safeParse(values)

	if (!result.success) {
		result.error.issues.forEach((issue) => {
			const key = issue.path[0] as keyof Customer
			validationErrors[key] = issue.message
		})

		console.log('🚀 ~ file: validateCustomerForm.tsx:141 ~ validationErrors:', validationErrors)
	} else {
		console.log('Without ZOD errors')
	}

	return errors
}
