import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM, CALENDAR_EVENT_TYPE, dateRegex, timeRegex } from '../utils/enums'
import { ISelectOptionItem } from '../types/interfaces'

export const importedReservationSchema = z.object({
	date: z.string().regex(dateRegex),
	timeFrom: z.string().regex(timeRegex),
	timeTo: z.string().regex(timeRegex),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500)
})

export type ICalendarImportedReservationForm = z.infer<typeof importedReservationSchema> & {
	eventId: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	employee: ISelectOptionItem
	isImported?: boolean
	eventType: CALENDAR_EVENT_TYPE
}

export const validationImportedReservationFn = (values: ICalendarImportedReservationForm, props: any) =>
	zodErrorsToFormErrors(importedReservationSchema, FORM.CALENDAR_RESERVATION_FROM_IMPORT_FORM, values, props)
