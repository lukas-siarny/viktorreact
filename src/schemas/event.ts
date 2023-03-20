import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { CALENDAR_EVENT_TYPE, dateRegex, DAY, EVERY_REPEAT, FORM, timeRegex, VALIDATION_MAX_LENGTH } from '../utils/enums'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.55#/B2b-%3Eadmin/postApiB2BAdminSalonsSalonIdCalendarEvents
export const eventSchema = z.object({
	eventType: z.nativeEnum(CALENDAR_EVENT_TYPE),
	date: z.string().regex(dateRegex),
	timeFrom: z.string().regex(timeRegex),
	timeTo: z.string().regex(timeRegex),
	employee: z.any(), // TODO

	recurring: z.boolean().nullish(),
	end: z.string().regex(dateRegex).nullish(),
	allDay: z.boolean().nullish(),
	every: z.nativeEnum(EVERY_REPEAT).nullish(),
	repeatOn: z.nativeEnum(DAY).array().nullish(),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500)
})

export type ICalendarEventForm = z.infer<typeof eventSchema> & {
	eventId?: string | null
	calendarBulkEventID?: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	isImported?: boolean
}

export const validationEventFn = (values: ICalendarEventForm, props: any) => zodErrorsToFormErrors(eventSchema, FORM.CALENDAR_EVENT_FORM, values, props)
