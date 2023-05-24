import { z } from 'zod'
import { isNil } from 'lodash'

import { serializeValidationMessage, stringConstraint, twoCharsConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM } from '../utils/enums'

// eslint-disable-next-line import/prefer-default-export
export const reviewSchema = z
	.object({
		toxicityScoreFrom: z.number().positive().finite().optional(),
		toxicityScoreTo: z.number().positive().finite().optional(),
		salonCountryCode: twoCharsConstraint.optional(),
		search: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_255)
	})
	.superRefine((values, ctx) => {
		if (!isNil(values?.toxicityScoreFrom) && !isNil(values?.toxicityScoreTo) && (values?.toxicityScoreFrom || 0) > (values?.toxicityScoreTo || 0)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toxicita OD musí byť menšia alebo rovnaká ako toxicita DO'),
				path: ['toxicityScoreFrom']
			})
		}
	})

export type IReviewFilterForm = z.infer<typeof reviewSchema>
export const validationReviewFilterFn = (values: IReviewFilterForm, props: any) => zodErrorsToFormErrors(reviewSchema, FORM.REVIEWS_FILTER, values, props)
