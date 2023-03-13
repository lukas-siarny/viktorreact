import i18next from 'i18next'
import { FormErrors, DecoratedFormProps } from 'redux-form'
import { z, ZodString, ZodOptional, ZodNullable, ZodDefault, ZodObject } from 'zod'

import { FORM } from '../utils/enums'

const serializeValidationMessage = (key: string, params?: object): string =>
	JSON.stringify({
		key,
		params
	})

const deserializeValidationMessage = (message?: string) => {
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

export const zodErrorsToFormErrors = <T, F extends FORM>(schema: ZodObject<any>, formName: F, values: T, props: DecoratedFormProps<T, any, string>): FormErrors<T, string> => {
	if (formName !== props.form) {
		throw new Error(`Mismatch between Form and Validation function. Use proper validation function for Form: ${props.form}`)
	}

	const result = schema.safeParse(values)

	if (!result.success) {
		const { fieldErrors } = result.error.flatten()
		return Object.entries(fieldErrors || {}).reduce((acc, [key, value]) => {
			return {
				...acc,
				[key]: deserializeValidationMessage(value ? value[0] : undefined)
			}
		}, {} as FormErrors<T>)
	}

	return {}
}

export const defaultErrorMap: z.ZodErrorMap = (issue, ctx) => {
	if (issue.code === z.ZodIssueCode.invalid_type) {
		if (issue.received === 'null' || issue.received === 'undefined') {
			return { message: serializeValidationMessage('loc:Toto pole je povinné') }
		}
	}

	if (issue.code === z.ZodIssueCode.too_big) {
		return {
			message: serializeValidationMessage('loc:Max. počet znakov je {{max}}', {
				max: issue.maximum
			})
		}
	}

	if (issue.code === z.ZodIssueCode.invalid_string) {
		if (issue.validation === 'email') {
			return { message: serializeValidationMessage('loc:Email nie je platný') }
		}
	}

	return { message: ctx.defaultError }
}

export const imageConstraint = z.object({
	url: z.string().url(),
	thumbUrl: z.string().nullish(),
	uid: z.string(),
	id: z.string().uuid().nullish()
})

export function stringConstraint<T extends true | false>(maxLength: number, required?: T): T extends true ? ZodString : ZodDefault<ZodOptional<ZodNullable<ZodString>>>
export function stringConstraint<T extends true | false>(maxLength: number, required?: T): ZodString | ZodDefault<ZodOptional<ZodNullable<ZodString>>> {
	const base = z.string().max(maxLength)

	if (required) {
		return base.min(1)
	}

	return base.nullish().default(null)
}
