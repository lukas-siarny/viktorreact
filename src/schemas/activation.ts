import { z } from 'zod'
import { zodErrorsToFormErrors, serializeValidationMessage } from './baseSchema'
import { FORM, PIN_LENGTH } from '../utils/enums'

const errorMsg = serializeValidationMessage('loc:Zadajte celý PIN')

export const activationSchema = z.object({
	code: z.string({ required_error: errorMsg }).length(PIN_LENGTH, errorMsg)
})

export type IActivationForm = z.infer<typeof activationSchema>

export const validationActivationFn = (values: IActivationForm, props: any) => zodErrorsToFormErrors(activationSchema, FORM.ACTIVATION, values, props)
