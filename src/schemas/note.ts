import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonIdResolvePublication
export const noteSchema = z.object({
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1000, true)
})

export type INoteForm = z.infer<typeof noteSchema>

export const validationNoteFn = (values: INoteForm, props: any) => zodErrorsToFormErrors(noteSchema, FORM.NOTE, values, props)
