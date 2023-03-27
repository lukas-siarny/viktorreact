import { z } from 'zod'

import { isEmpty, isNil } from 'lodash'
import { serializeValidationMessage, stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH, PARAMETER_TYPE } from '../utils/enums'
// eslint-disable-next-line import/no-cycle
import { arePriceAndDurationDataEmpty } from '../utils/helper'

const validatePriceAndDurationData = (value: z.infer<typeof priceAndDurationSchema>, ctx: z.RefinementCtx, paths: any[] = []) => {
	let isError = false

	if (isNil(value.durationFrom)) {
		isError = true
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Toto pole je povinné'),
			path: [...paths, 'durationFrom']
		})
	}
	if (value.variableDuration && isNil(value.durationTo)) {
		isError = true
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Toto pole je povinné'),
			path: [...paths, 'durationTo']
		})
	}

	if (isNil(value.priceFrom)) {
		isError = true
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Toto pole je povinné'),
			path: [...paths, 'priceFrom']
		})
	}

	if (value.variablePrice && isNil(value.priceTo)) {
		isError = true
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Toto pole je povinné'),
			path: [...paths, 'priceTo']
		})
	}

	if (value.variableDuration && !isNil(value.durationTo) && (value.durationFrom || 0) > value.durationTo) {
		isError = true
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Chybný rozsah'),
			path: [...paths, 'durationFrom']
		})

		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Chybný rozsah'),
			path: [...paths, 'durationTo']
		})
	}

	if (value.variablePrice && !isNil(value.priceTo) && (value.priceFrom || 0) > value.priceTo) {
		isError = true
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Chybný rozsah'),
			path: [...paths, 'priceFrom']
		})

		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: serializeValidationMessage('loc:Chybný rozsah'),
			path: [...paths, 'priceTo']
		})
	}

	return isError
}

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.9#/B2b-%3Eadmin/postApiB2BAdminServicesCategoryServiceSuggest
export const requestNewServiceSchema = z.object({
	description: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500, true).min(VALIDATION_MAX_LENGTH.LENGTH_5),
	rootCategoryID: z.string()
})

const priceAndDurationSchema = z.object({
	durationFrom: z.number().nullish(),
	durationTo: z.number().nullish(),
	variableDuration: z.boolean().optional(),
	priceFrom: z.number().nullish(),
	priceTo: z.number().finite().nullish(),
	variablePrice: z.boolean().optional()
})

const employeeServiceCategoryParameter = z.object({
	employeePriceAndDurationData: priceAndDurationSchema.optional(),
	hasOverriddenPricesAndDurationData: z.boolean().optional()
})

const employeeServiceSchema = z
	.object({
		useCategoryParameter: z.boolean().optional(),
		employeePriceAndDurationData: priceAndDurationSchema.optional(),
		hasOverriddenPricesAndDurationData: z.boolean().optional(),
		serviceCategoryParameter: employeeServiceCategoryParameter.array().optional()
	})
	.superRefine((values, ctx) => {
		const priceAndDurationData = values?.employeePriceAndDurationData

		if (!values?.useCategoryParameter) {
			// NOTE: first check is necessary because of TS
			if (priceAndDurationData && !arePriceAndDurationDataEmpty(priceAndDurationData)) {
				validatePriceAndDurationData(priceAndDurationData, ctx, ['employeePriceAndDurationData'])
			}
		} else {
			const areAllEmpty = !values.serviceCategoryParameter?.some((parameterValue) => !arePriceAndDurationDataEmpty(parameterValue.employeePriceAndDurationData))

			if (!areAllEmpty) {
				let serviceCategoryParameterError = false
				values.serviceCategoryParameter?.forEach((parameterValue, parameterValueIndex) => {
					if (parameterValue.employeePriceAndDurationData) {
						const isPriceAndDurationDataError = validatePriceAndDurationData(parameterValue.employeePriceAndDurationData, ctx, [
							'serviceCategoryParameter',
							parameterValueIndex,
							'employeePriceAndDurationData'
						])

						serviceCategoryParameterError = isPriceAndDurationDataError

						if (isPriceAndDurationDataError) {
							ctx.addIssue({
								code: z.ZodIssueCode.custom,
								message: serializeValidationMessage('loc:Zadaná hodnota nie je správna'),
								path: ['serviceCategoryParameter', parameterValueIndex, 'error']
							})
						}
					}
				})

				if (serviceCategoryParameterError) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: serializeValidationMessage('loc:Je potrebné vyplniť povinné údaje pre všetky hodnoty parametra'),
						path: ['serviceCategoryParameter', '_error']
					})
				}
			}
		}
	})

const parameterValueSchema = priceAndDurationSchema.extend({
	id: z.string().uuid(),
	name: z.string().optional(),
	useParameter: z.boolean()
})

const serviceSchema = priceAndDurationSchema
	.extend({
		useCategoryParameter: z.boolean(),
		employee: z.string().uuid().array().nullish(),
		settings: z.object({
			enabledB2cReservations: z.boolean(),
			autoApproveReservations: z.boolean()
		}),
		serviceCategoryParameter: parameterValueSchema.array()
	})
	.superRefine((val, ctx) => {
		if (!val.useCategoryParameter) {
			validatePriceAndDurationData(val, ctx)
		} else {
			if (val.useCategoryParameter && isEmpty(val.serviceCategoryParameter?.filter((value) => value.useParameter))) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Musíte zvoliť a nastaviť aspoň jednu hodnotu parametra!'),
					path: ['serviceCategoryParameter', '_error']
				})
			}

			val.serviceCategoryParameter.forEach((paramter, index) => {
				if (paramter.useParameter) {
					const isPriceAndDurationDataError = validatePriceAndDurationData(paramter, ctx, ['serviceCategoryParameter', index])

					if (isPriceAndDurationDataError) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: serializeValidationMessage('loc:Zadaná hodnota nie je správna'),
							path: ['serviceCategoryParameter', index, 'error']
						})
					}
				}
			})
		}
	})

export type IRequestNewServiceForm = z.infer<typeof requestNewServiceSchema> & {
	salonID: string
}

export type FormPriceAndDurationData = z.infer<typeof priceAndDurationSchema>

export type IEmployeeServiceEditForm = Omit<z.infer<typeof employeeServiceSchema>, 'serviceCategoryParameter'> & {
	id: string
	employee: {
		id: string
		name?: string
		image?: string
		fallbackImage?: string
		email?: string
		inviteEmail?: string
		hasActiveAccount?: boolean
	}
	name?: string
	industry?: string
	category?: string
	image?: string
	salonPriceAndDurationData?: FormPriceAndDurationData
	serviceCategoryParameterType?: PARAMETER_TYPE
	serviceCategoryParameterName?: string
	serviceCategoryParameterId?: string
	serviceCategoryParameter?: (z.infer<typeof employeeServiceCategoryParameter> & {
		id: string
		name?: string
		salonPriceAndDurationData?: FormPriceAndDurationData
	})[]
}

export type IServiceForm = z.infer<typeof serviceSchema> & {
	id: string
	serviceCategoryParameterType?: PARAMETER_TYPE
	serviceCategoryParameterName?: string
	employees: IEmployeeServiceEditForm[]
}

export type IParameterValue = z.infer<typeof parameterValueSchema>

export const validationRequestNewServiceFn = (values: IRequestNewServiceForm, props: any) =>
	zodErrorsToFormErrors(requestNewServiceSchema, FORM.REQUEST_NEW_SERVICE_FORM, values, props)

export const validationServiceFn = (values: IServiceForm, props: any) => zodErrorsToFormErrors(serviceSchema, FORM.SERVICE_FORM, values, props)

export const validationEmployeeServiceEditFn = (values: IEmployeeServiceEditForm, props: any) =>
	zodErrorsToFormErrors(employeeServiceSchema, FORM.EMPLOYEE_SERVICE_EDIT, values, props)
