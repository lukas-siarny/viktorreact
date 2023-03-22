import { z } from 'zod'
import { isEmpty, get } from 'lodash'
import { localizedValuesConstraint, zodErrorsToFormErrors, serializeValidationMessage } from './baseSchema'
import { FORM, PARAMETERS_VALUE_TYPES } from '../utils/enums'

const categoryParamsSchema = z
	.object({
		valueType: z.nativeEnum(PARAMETERS_VALUE_TYPES).default(PARAMETERS_VALUE_TYPES.ENUM),
		values: z
			.object({
				value: z.number().positive().finite().nullish(),
				id: z.string().uuid().nullish()
			})
			.array()
			.superRefine((val, ctx) => {
				if (!isEmpty(val)) {
					const onlyValues = val.map((item) => item.value)

					val.forEach((item, index) => {
						if (item.value && onlyValues.indexOf(item.value) !== index) {
							// duplicates.push(index)
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: serializeValidationMessage('loc:Táto hodnota už je zadaná'),
								path: [index, 'value']
							})
						}
					})
				}
			}),
		localizedValues: z
			.object({
				valueLocalizations: localizedValuesConstraint()
			})
			.array()
	})
	.superRefine((val, ctx) => {
		// values are numbers
		if (val.valueType === PARAMETERS_VALUE_TYPES.TIME) {
			const enteredValues = val.values.filter((item) => item.value)

			if (enteredValues.length < 1) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Toto pole je povinné'),
					path: ['values', 0, 'value']
				})
			}
		} else if (!get(val, 'localizedValues[0].valueLocalizations[0].value', undefined)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['localizedValues', 0, 'valueLocalizations', 0, 'value']
			})
		} else {
			val.localizedValues.forEach((localizedValue, rootIndex) => {
				if (localizedValue && localizedValue.valueLocalizations) {
					const defaultValueIsEmpty = !localizedValue.valueLocalizations[0].value
					const otherValueIsFilled = localizedValue.valueLocalizations.some((entry, index) => index > 0 && entry.value)

					if (defaultValueIsEmpty && otherValueIsFilled) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: serializeValidationMessage('loc:Toto pole je povinné'),
							path: ['localizedValues', rootIndex, 'valueLocalizations', 0, 'value']
						})
					}
				}
			})
		}
	})
	.and(
		z.object({
			nameLocalizations: localizedValuesConstraint(true)
		})
	)

export type ICategoryParamsForm = z.infer<typeof categoryParamsSchema>

export const validationFn = (values: ICategoryParamsForm, props: any) => zodErrorsToFormErrors(categoryParamsSchema, FORM.CATEGORY_PARAMS, values, props)
