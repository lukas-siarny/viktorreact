import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/#/B2b-%3Eadmin/patchApiB2BAdminSalonsSalonIdOpenHoursNote
export const openHoursNoteSchema = z.object({
	openingHoursNote: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_200, true)
})

export type IOpenHoursNoteForm = z.infer<typeof openHoursNoteSchema>

export const validationOpenHoursNoteFn = (values: IOpenHoursNoteForm, props: any) => zodErrorsToFormErrors(openHoursNoteSchema, FORM.OPEN_HOURS_NOTE, values, props)
