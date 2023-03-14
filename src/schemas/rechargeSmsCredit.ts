import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

// eslint-disable-next-line import/prefer-default-export
export const rechargeSmsCreditSchema = z.object({
	amount: z.number().positive().finite(),
	transactionNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255)
})

export type IRechargeSmsCredit = z.infer<typeof rechargeSmsCreditSchema>

export const validationFn = (values: IRechargeSmsCredit, props: any) => zodErrorsToFormErrors(rechargeSmsCreditSchema, FORM.RECHARGE_SMS_CREDIT, values, props)
