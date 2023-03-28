import i18next from 'i18next'
import { FormErrors, DecoratedFormProps } from 'redux-form'
import { z, ZodString, ZodOptional, ZodNullable, ZodTypeAny } from 'zod'
import { set } from 'lodash'
import { DAY, FORM, LANGUAGE, MONDAY_TO_FRIDAY, VALIDATION_MAX_LENGTH } from '../utils/enums'
import passwordRegEx from '../utils/regex'

/**
 * Serialize args for i18next.t function
 * @param key localization key
 * @param params additional params, if needed
 * @returns serialized string
 */
export const serializeValidationMessage = (key: string, params?: object): string =>
	JSON.stringify({
		key,
		params
	})

/**
 * Deserialize ZOD message to args for i18next.t function
 * @param message serialized args
 * @returns object containing localization key and additional params
 */
export const deserializeValidationMessage = (message?: string) => {
	if (message) {
		try {
			const translation = JSON.parse(message)
			return i18next.t(translation.key, translation.params)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('DeserializeValidationMessage - invalid JSON format of error message:', message)
		}
	}

	return i18next.t('loc:Zadaná hodnota nie je správna')
}

/**
 * Output of ZOD safeParse transform into FormErrors and maps error messages to proper fields
 * @param schema for validation
 * @param formName enum {@link FORM} of relevant form. Prevent to usage of incorrect validation and form.
 * @param values formData
 * @param props additional props from Form component
 * @returns mapped errors to FormErrors
 */
export const zodErrorsToFormErrors = <T, F extends FORM>(schema: ZodTypeAny, formName: F, values: T, props: DecoratedFormProps<T, any, string>): FormErrors<T, string> => {
	if (formName !== props.form) {
		throw new Error(`Mismatch between Form and Validation function. Use proper validation function for Form: ${props.form}`)
	}

	const result = schema.safeParse(values)

	if (!result.success) {
		const errors: FormErrors<T> = {}

		result.error.issues.forEach((issue) => {
			set(errors, issue.path, deserializeValidationMessage(issue.message))
		})

		return errors
	}

	return {}
}

/**
 * {@link https://zod.dev/ERROR_HANDLING?id=global-error-map Global error messages} for ZOD. Feel free to extend this config, if needed. For specific cases will be better to use {@link https://zod.dev/ERROR_HANDLING?id=schema-bound-error-map Schema-bound}
 * @see https://zod.dev/ERROR_HANDLING
 * @param issue {@link https://zod.dev/ERROR_HANDLING?id=zodissue Zod issue}
 * @param ctx context of parsing
 * @returns default errors
 */
export const defaultErrorMap: z.ZodErrorMap = (issue, ctx) => {
	if (issue.code === z.ZodIssueCode.invalid_type) {
		if (issue.received === 'null' || issue.received === 'undefined') {
			return { message: serializeValidationMessage('loc:Toto pole je povinné') }
		}
	}

	if (issue.code === z.ZodIssueCode.too_big) {
		if (issue.type === 'string') {
			return {
				message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', {
					max: issue.maximum
				})
			}
		}
		if (issue.type === 'number') {
			return {
				message: serializeValidationMessage('loc:Max. hodnota je {{max}}', {
					max: issue.maximum
				})
			}
		}
		if (issue.type === 'array') {
			return {
				message: serializeValidationMessage('loc:Max. počet prvkov je {{max}}', {
					max: issue.maximum
				})
			}
		}
	}

	if (issue.code === z.ZodIssueCode.too_small) {
		if (issue.type === 'string') {
			return {
				message: serializeValidationMessage('loc:Min. počet znakov je {{min}}', {
					min: issue.minimum
				})
			}
		}
		if (issue.type === 'number') {
			return {
				message: serializeValidationMessage('loc:Min. hodnota je {{min}}', {
					min: issue.minimum
				})
			}
		}
		if (issue.type === 'array') {
			return {
				message: serializeValidationMessage('loc:Min. počet prvkov je {{min}}', {
					min: issue.minimum
				})
			}
		}
	}

	if (issue.code === z.ZodIssueCode.invalid_string) {
		if (issue.validation === 'email') {
			return { message: serializeValidationMessage('loc:Email nie je platný') }
		}

		if (issue.validation === 'uuid') {
			return { message: serializeValidationMessage('loc:Neplatný formát UUID') }
		}

		if (issue.validation === 'url') {
			return { message: serializeValidationMessage('loc:Neplatná URL') }
		}
	}

	return { message: ctx.defaultError }
}

const timeRangeSchema = z
	.object({
		timeFrom: z.string().nullish(),
		timeTo: z.string().nullish()
	})
	.array()

const OpeningHourSchema = z
	.object({
		day: z.enum([MONDAY_TO_FRIDAY, ...Object.keys(DAY)]),
		timeRanges: timeRangeSchema,
		onDemand: z.boolean().nullish()
	})
	.array()

export type OpeningHours = z.infer<typeof OpeningHourSchema>
export type OpeningHoursTimeRanges = z.infer<typeof timeRangeSchema>

/*
#### CONSTRAINTS ####
*/

export const imageConstraint = z.object({
	url: z.string().url().nullish(),
	thumbUrl: z.string().nullish(),
	uid: z.string(),
	id: z.string().uuid().nullish()
})

export function stringConstraint<T extends true | false>(maxLength: number, required?: T): T extends true ? ZodString : ZodOptional<ZodNullable<ZodString>>
export function stringConstraint<T extends true | false>(maxLength: number, required?: T): ZodString | ZodOptional<ZodNullable<ZodString>> {
	const base = z.string().max(maxLength)

	if (required) {
		return base.min(1)
	}

	return base.nullish()
}

export const emailConstraint = z.string().email().trim().max(VALIDATION_MAX_LENGTH.LENGTH_255)

export const passwordConstraint = z.string().regex(passwordRegEx, serializeValidationMessage('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak'))

/**
 * Constraint for checking checking two characters (min(2) & max(2)) length string (eg: counryCode, phonePrefix...
 * DEFAULT: required
 */
export const twoCharsConstraint = z.string().length(VALIDATION_MAX_LENGTH.LENGTH_2)

/**
 * Constraint for array fields where values can be translated into every supported language.
 * Default and required is {@link LANGUAGE.EN EN}
 * @param required boolean
 * @returns validation schema accepting only values with keys from LANGUAGE
 */
export const localizedValuesConstraint = (required?: boolean, maxLength = VALIDATION_MAX_LENGTH.LENGTH_100) =>
	z
		.tuple([
			z.object({
				language: z.literal(LANGUAGE.EN),
				value: stringConstraint(maxLength, required)
			})
		])
		.rest(
			z.object({
				language: z.nativeEnum(LANGUAGE),
				value: stringConstraint(maxLength)
			})
		)

/**
 * Constraint for array of email fields
 * @param requiredAtLeastOne boolean, default true
 * @param requiredAll boolean, default false
 * @param maxItems boolean, default 5
 * @returns validation schema
 */
export const emailsConstraint = (requiredAtLeastOne = true, requiredAll = false, maxItems: number | null = 5) =>
	z
		.object({
			email: requiredAll ? emailConstraint : emailConstraint.nullish()
		})
		.array()
		.superRefine((val, ctx) => {
			if (requiredAtLeastOne && !requiredAll) {
				const filledEmailInputs = val.filter((email) => email.email)
				if (filledEmailInputs.length < 1) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: serializeValidationMessage('loc:Toto pole je povinné'),
						path: [0, 'email']
					})
				}
			}
			if (maxItems && val.length > maxItems) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Max. počet prvkov je {{max}}', { max: maxItems }),
					path: [0, 'email']
				})
			}
		})

/**
 * Constraint for array of phone number fields
 * @param requiredAtLeastOne boolean, default true
 * @param requiredAll boolean, default false
 * @param maxItems boolean, default 5
 * @returns validation schema
 */
export const phoneNumbersConstraint = (requiredAtLeastOne = true, requiredAll = false, maxItems: number | null = 5) =>
	z
		.object({
			phonePrefixCountryCode: requiredAll ? twoCharsConstraint : twoCharsConstraint.nullish(),
			phone: requiredAll ? stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true) : stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_20, true).nullish()
		})
		.array()
		.superRefine((val, ctx) => {
			if (requiredAtLeastOne && !requiredAll) {
				const filledPhoneInputs = val.filter((phone) => phone.phone && phone.phonePrefixCountryCode)
				if (filledPhoneInputs.length < 1) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: serializeValidationMessage('loc:Toto pole je povinné'),
						path: [0, 'phone']
					})
				}
			}
			if (maxItems && val.length > maxItems) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Max. počet prvkov je {{max}}', { max: maxItems }),
					path: [0, 'phone']
				})
			}
		})

/**
 * Constraint for Opening Hours component
 * @returns validation schema
 */

export const openingHoursConstraint = () => {
	return OpeningHourSchema.superRefine((val, ctx) => {
		val.forEach((day, indexDay) => {
			if (!day.onDemand && day.timeRanges) {
				day.timeRanges.forEach((timeRange, indexRange) => {
					if (!timeRange?.timeFrom) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: serializeValidationMessage('loc:Toto pole je povinné'),
							path: [indexDay, 'timeRanges', indexRange, 'timeFrom']
						})
					}
					if (!timeRange?.timeTo) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: serializeValidationMessage('loc:Toto pole je povinné'),
							path: [indexDay, 'timeRanges', indexRange, 'timeTo']
						})
					}
				})
			}
		})
	})
}
