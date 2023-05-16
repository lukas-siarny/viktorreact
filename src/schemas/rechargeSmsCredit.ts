import { z } from 'zod'
import { isNil } from 'lodash'

import { serializeValidationMessage, stringConstraint, twoCharsConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM, SALON_SOURCE_TYPE } from '../utils/enums'

// eslint-disable-next-line import/prefer-default-export
export const rechargeSmsCreditSchema = z.object({
	amount: z.number().positive().finite(),
	transactionNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255)
})

export type IRechargeSmsCreditForm = z.infer<typeof rechargeSmsCreditSchema>

export const validationRechargeSmsCreditFn = (values: IRechargeSmsCreditForm, props: any) => zodErrorsToFormErrors(rechargeSmsCreditSchema, FORM.RECHARGE_SMS_CREDIT, values, props)

export const rechargeSmsCreditFilterSchema = z
	.object({
		walletAvailableBalanceFrom: z.number().positive().finite().optional(),
		walletAvailableBalanceTo: z.number().positive().finite().optional()
	})
	.superRefine((values, ctx) => {
		if (
			!isNil(values?.walletAvailableBalanceFrom) &&
			!isNil(values?.walletAvailableBalanceTo) &&
			(values?.walletAvailableBalanceFrom || 0) > (values?.walletAvailableBalanceTo || 0)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Stav konta OD musí byť menší alebo rovnaký ako stav konta DO'),
				path: ['walletAvailableBalanceFrom']
			})
		}
	})
	.and(
		z.object({
			search: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255),
			countryCode: twoCharsConstraint.optional(),
			sourceType: z.nativeEnum(SALON_SOURCE_TYPE).nullish()
		})
	)
export type IRechargeSmsCreditFilterForm = z.infer<typeof rechargeSmsCreditFilterSchema>

export const validationRechargeSmsCreditFilterFn = (values: IRechargeSmsCreditFilterForm, props: any) =>
	zodErrorsToFormErrors(rechargeSmsCreditFilterSchema, FORM.RECHARGE_SMS_CREDIT_FILTER, values, props)
