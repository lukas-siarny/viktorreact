import { z } from 'zod'

import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH, PARAMETER_TYPE } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.9#/B2b-%3Eadmin/postApiB2BAdminServicesCategoryServiceSuggest
export const requestNewServiceSchema = z.object({
	description: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500, true).min(VALIDATION_MAX_LENGTH.LENGTH_5),
	rootCategoryID: z.string()
})

/**
 export interface IParameterValue {
	id: string | undefined
	name: string | undefined
	durationFrom: number | null | undefined
	durationTo: number | null | undefined
	variableDuration: boolean
	priceFrom: number | null | undefined
	priceTo: number | null | undefined
	variablePrice: boolean
	useParameter: boolean
}
 */

const priceAndDurationSchema = z.object({
	durationFrom: z.number().finite().max(999).nullish(),
	durationTo: z.number().finite().max(999).nullish(),
	variableDuration: z.boolean(),
	priceFrom: z.number().finite().nullish(),
	priceTo: z.number().finite().nullish(),
	variablePrice: z.boolean()
})

export const parameterValueSchema = priceAndDurationSchema.extend({
	id: z.string().uuid(),
	name: z.string().optional(),
	useParameter: z.boolean()
})

export const serviceSchema = priceAndDurationSchema.extend({
	id: z.string().uuid(),
	useCategoryParameter: z.boolean(),
	serviceCategoryParameterType: z.nativeEnum(PARAMETER_TYPE).optional(),
	serviceCategoryParameterName: z.string().optional(),
	employee: z.string().uuid().array().nullable(),
	settings: z.object({
		enabledB2cReservations: z.boolean(),
		autoApproveReservations: z.boolean()
	})
})

/**
 	id: string
	durationFrom?: number
	durationTo?: number
	variableDuration: boolean
	priceFrom?: number | null
	priceTo?: number | null
	variablePrice: boolean
	useCategoryParameter: boolean
	serviceCategoryParameterType?: PARAMETER_TYPE
	serviceCategoryParameterName?: string
	serviceCategoryParameter: IParameterValue[]
	employee?: string[]
	employees: EmployeeServiceData[]
	settings: {
		enabledB2cReservations: boolean
		autoApproveReservations: boolean
	}
 */


export type IRequestNewServiceForm = z.infer<typeof requestNewServiceSchema> & {
	salonID: string
}

export const validationRequestNewServiceFn = (values: IRequestNewServiceForm, props: any) =>
	zodErrorsToFormErrors(requestNewServiceSchema, FORM.REQUEST_NEW_SERVICE_FORM, values, props)
