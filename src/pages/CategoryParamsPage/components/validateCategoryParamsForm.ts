import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { set, isEmpty } from 'lodash'

import { z } from 'zod'
import { stringConstraint } from '../../../schemas/baseSchema'
import { ICategoryParamForm } from '../../../types/interfaces'
import { PARAMETERS_VALUE_TYPES, LANGUAGE, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

const localizedValuesSchema = z
	.tuple([
		z.object({
			language: z.literal(LANGUAGE.EN),
			value: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100, true)
		})
	])
	.rest(
		z.object({
			language: z.nativeEnum(LANGUAGE),
			value: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100)
		})
	)

const numberOrLozalizedValues = z
	.object({
		values: z
			.object({
				value: z.number().positive().finite(), // stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
				id: z.string().uuid().nullish()
			})
			.array()
			.nonempty()
			.superRefine((val, ctx) => {
				const onlyValues = val.map((item) => item.value)

				val.forEach((item, index) => {
					if (item.value && onlyValues.indexOf(item.value) !== index) {
						// duplicates.push(index)
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: `No duplicates allowed.`,
							path: [index, 'value']
						})
					}
				})
			})
	})
	.or(
		z.object({
			localizedValues: z
				.object({
					valueLocalizations: localizedValuesSchema
				})
				.array()
		})
	)

const schema = z
	.object({
		valueType: z.nativeEnum(PARAMETERS_VALUE_TYPES).default(PARAMETERS_VALUE_TYPES.ENUM),
		nameLocalizations: localizedValuesSchema,
		values: z
			.object({
				value: z.number().positive().finite(), // stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_100),
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
								message: `No duplicates allowed.`,
								path: [index, 'value']
							})
						}
					})
				}
			}),
		localizedValues: z
			.object({
				valueLocalizations: localizedValuesSchema
			})
			.array()
	})
	.superRefine((val, ctx) => {
		if (val.valueType === PARAMETERS_VALUE_TYPES.TIME) {
			if (isEmpty(val.values)) {
			}

			const enteredValues = val.values

			const filledValues = enteredValues.filter((item) => item.value)

			if (filledValues.length < 1) {
				valuesErrors[0] = { value: i18next.t('loc:Toto pole je povinné') }
			} else {
				const onlyValues = enteredValues.map((item) => item.value)

				const duplicates: number[] = []

				enteredValues.forEach((item, index) => {
					if (item.value && onlyValues.indexOf(item.value) !== index) {
						duplicates.push(index)
					}
				})

				duplicates.forEach((index: number) => {
					valuesErrors[index] = { value: i18next.t('loc:Táto hodnota už je zadaná') }
				})
			}

			errors.values = valuesErrors
		}
	})

// const final = schema.and(numberOrLozalizedValues)

type TypeFromScheme = z.infer<typeof schema>

// const aaa: TypeFromScheme = {
// 	values: [
// 		{
// 			value: 44
// 		}
// 	],
// 	localizedValues: [
// 		{
// 			valueLocalizations: [
// 				{
// 					language: LANGUAGE.EN,
// 					value: 'aaaaa'
// 				}
// 			]
// 		}
// 	]
// }

export default (values: ICategoryParamForm) => {
	console.log('🚀 ~ file: validateCategoryParamsForm.ts:10 ~ values:', values)
	const errors: FormErrors<ICategoryParamForm> = {}

	if (!values.nameLocalizations?.[0]?.value) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		errors.nameLocalizations = [{ value: i18next.t('loc:Toto pole je povinné') }]
	}

	const valuesErrors: any = {}

	if (!values.valueType) {
		errors.valueType = i18next.t('loc:Toto pole je povinné')
	} else if (values.valueType === PARAMETERS_VALUE_TYPES.TIME) {
		const enteredValues = values.values

		const filledValues = enteredValues.filter((item) => item.value)

		if (filledValues.length < 1) {
			valuesErrors[0] = { value: i18next.t('loc:Toto pole je povinné') }
		} else {
			const onlyValues = enteredValues.map((item) => item.value)

			const duplicates: number[] = []

			enteredValues.forEach((item, index) => {
				if (item.value && onlyValues.indexOf(item.value) !== index) {
					duplicates.push(index)
				}
			})

			duplicates.forEach((index: number) => {
				valuesErrors[index] = { value: i18next.t('loc:Táto hodnota už je zadaná') }
			})
		}

		errors.values = valuesErrors
	} else {
		const { localizedValues } = values

		if (!localizedValues || localizedValues.length < 1 || !localizedValues[0] || !localizedValues[0].valueLocalizations || !localizedValues[0].valueLocalizations[0]?.value) {
			valuesErrors[0] = { valueLocalizations: [{ value: i18next.t('loc:Toto pole je povinné') }] }
		} else {
			const missingDefaultLanguage: number[] = []

			localizedValues.forEach((localizedValue, rootIndex) => {
				if (localizedValue && localizedValue.valueLocalizations) {
					valuesErrors[rootIndex] = { valueLocalizations: [{ value: undefined }] }

					const defaultValueIsEmpty = !localizedValue.valueLocalizations[0].value
					const otherValueIsFilled = localizedValue.valueLocalizations.some((entry, index) => index > 0 && entry.value)

					if (defaultValueIsEmpty && otherValueIsFilled) {
						missingDefaultLanguage.push(rootIndex)
					}
				}
			})

			missingDefaultLanguage.forEach((index: number) => {
				valuesErrors[index].valueLocalizations[0] = { value: i18next.t('loc:Toto pole je povinné') }
			})
		}
		errors.localizedValues = valuesErrors
	}

	const result = schema.safeParse(values)

	const zodErrors = {}
	if (!result.success) {
		result.error.issues.forEach((issue) => {
			set(zodErrors, issue.path, issue.message)
		})
		console.log('🚀 ~ file: validateCategoryParamsForm.ts:98 ~ ZOD errors:', zodErrors)
	}

	console.log('🚀 ~ file: validateCategoryParamsForm.ts:92 ~ errors:', errors)

	return zodErrors // errors
}
