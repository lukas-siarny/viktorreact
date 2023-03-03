import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { z, ZodString, ZodOptional, ZodNullable, ZodTypeAny } from 'zod'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

const imageConstraint = z.object({
	url: z.string().url(),
	thumbnail: z.string().url().nullish(),
	uid: z.string().uuid()
})

type Image = z.infer<typeof imageConstraint>
type NonNullableImage = MakeFieldsNonNullable<Image, 'thumbnail'>

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
/**
const imageConstraint = z.object({
	url: z.string().url(),
	thumbnail: z.string().url().nullish(),
	uid: z.string().uuid()
})

type ImageNullableFields = z.infer<typeof imageConstraint>

function makeFieldsNonNullable(originalConstraint: any, fields: string[]): any {
	return originalConstraint.merge(z.object(Object.fromEntries(fields.map((field: string) => [field, originalConstraint.shape[field].unwrap().unwrap()]))))
}

const imageNonnullableConstraint = makeFieldsNonNullable(imageConstraint, ['thumbnail'])
*/
const stringSchema = (maxLength: number) =>
	z
		.string({ required_error: i18next.t('loc:Toto pole je povinné') })
		.max(maxLength, {
			message: i18next.t('loc:Max. počet znakov je {{max}}', {
				max: maxLength
			})
		})
		.nullish()

export const customerSchema = z.object({
	firstName: stringSchema(VALIDATION_MAX_LENGTH.LENGTH_100),
	lastName: stringSchema(VALIDATION_MAX_LENGTH.LENGTH_100),
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
	phone: stringSchema(VALIDATION_MAX_LENGTH.LENGTH_20),
	note: stringSchema(VALIDATION_MAX_LENGTH.LENGTH_1000),
	street: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	city: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
	zipCode: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	streetNumber: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_10),
	gender: z.string().optional().nullable(),
	galleryImageIDs: imageConstraint.array().optional(),
	profileImageID: imageConstraint.array().max(1).optional()
})

// function makeFieldsRequired<T extends z.ZodObject<any>>(schema: ReturnType<typeof z.object>, fields: Partial<keyof T>[]): ReturnType<typeof z.object> {
// return schema.extend(Object.fromEntries(fields.map((field: string) => [field, schema.shape[field].unwrap().unwrap()])))
// }

// export declare type output<T extends ZodType<any, any, any>> = T["_output"];

function instanceOfString(shape: any): shape is ZodNullable<ZodOptional<ZodString>> {
	return 'merge' in shape
}

// merge<Incoming extends AnyZodObject, Augmentation extends Incoming["shape"]>(merging: Incoming): ZodObject<extendShape<T, Augmentation>, Incoming["_def"]["unknownKeys"], Incoming["_def"]["catchall"]>;

type aaa = InstanceType<typeof z.ZodObject>
type Income = ReturnType<aaa['merge']>
type Retuuurn = ReturnType<typeof z.object>

// function makeFieldsRequired<T extends Retuuurn>(origSchema: T, fields: keyof z.infer<typeof origSchema>[]): Income {
// 	return origSchema.merge(
// 		z.object(
// 			Object.fromEntries(
// 				fields.map((field: string) => [
// 					field,
// 					instanceOfString(origSchema.shape[field]) ? (origSchema.shape[field] as ZodNullable<ZodOptional<ZodString>>).unwrap().unwrap() : origSchema.shape[field]
// 				])
// 			)
// 		)
// 	)
// }

type MakeFieldsNonNullable<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }

// function makeFieldsNonNullable<T extends object, K extends keyof T>(original: T, ...keys: K[]): MakeFieldsNonNullable<T, K> {

interface Dictionary<T> {
	[key: string]: T
}

export type Final = z.infer<typeof customerSchema>
// const fff = makeFieldsRequired(customerSchema, ['firstName', 'lastName', 'phone'])
// const finalScheme = makeFieldsRequired<Final>(customerSchema, ['firtsName', 'lastName', 'phone'])
const finalScheme = customerSchema.merge(
	z.object({
		phone: customerSchema.shape.phone.unwrap().unwrap(),
		firstName: customerSchema.shape.firstName.unwrap().unwrap(),
		lastName: customerSchema.shape.lastName.unwrap().unwrap()
	})
)

// type MakeFieldsNonNullable<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
type AsRequired<T, K extends keyof T> = NonNullable<Pick<T, K>> // & Omit<T, K>

export type Customer = MakeFieldsNonNullable<Final, 'firstName' | 'lastName' | 'phone'>

const data: Customer = {}

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
