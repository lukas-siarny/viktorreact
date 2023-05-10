import { z } from 'zod'
import { zodErrorsToFormErrors, serializeValidationMessage, uuidConstraint } from './baseSchema'
import { FORM } from '../utils/enums'

export const industriesSchema = z.object({
	categoryIDs: uuidConstraint.array().min(1, { message: serializeValidationMessage('loc:Vyberte aspoň jedno odvetvie') })
})

export const industrySchema = z.object({
	categoryIDs: z.string().array()
})

export type IIndustriesForm = z.infer<typeof industriesSchema>
export type IIndustryForm = z.infer<typeof industrySchema>

export const validationIndustriesFn = (values: IIndustriesForm, props: any) => zodErrorsToFormErrors(industriesSchema, FORM.INDUSTRIES, values, props)
export const validationIndustryFn = (values: IIndustryForm, props: any) => zodErrorsToFormErrors(industrySchema, FORM.INDUSTRY, values, props)
