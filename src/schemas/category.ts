import { z } from 'zod'
import { localizedValuesConstraint, imageConstraint, zodErrorsToFormErrors, serializeValidationMessage } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

export const categorySchema = z
	.object({
		nameLocalizations: localizedValuesConstraint(true),
		descriptionLocalizations: localizedValuesConstraint(false, VALIDATION_MAX_LENGTH.LENGTH_1500).nullish(),
		level: z.union([z.literal(0), z.literal(1), z.literal(2)]),
		image: imageConstraint.array().max(1).nullish(),
		icon: imageConstraint.array().max(1).nullish()
	})
	.superRefine((values, ctx) => {
		// values are numbers
		if (values.level === 0) {
			if (!values.image) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Toto pole je povinné'),
					path: ['image']
				})
			}

			if (!values.icon) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Toto pole je povinné'),
					path: ['icon']
				})
			}
		}
	})

export type ICategoryForm = z.infer<typeof categorySchema> & {
	name: string
	id: string
	orderIndex: number
	parentId: string
	rootParentId: string | undefined | null
	childrenLength: number
	categoryParameterID: string
}

export const validationFn = (values: ICategoryForm, props: any) => zodErrorsToFormErrors(categorySchema, FORM.CATEGORY, values, props)
