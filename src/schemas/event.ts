import { z } from 'zod'
import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

import { dateConstraint, selectObjConstraint, serializeValidationMessage, stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { CALENDAR_EVENT_TYPE, DAY, EVERY_REPEAT, FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { timeRegex } from '../utils/regex'
// eslint-disable-next-line import/no-cycle
import { formatDate } from '../utils/helper'
import { ICalendarEmployeeOptionItem } from '../types/interfaces'

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.55#/B2b-%3Eadmin/postApiB2BAdminSalonsSalonIdCalendarEvents
export const eventSchema = z
	.object({
		recurring: z.boolean().optional(),
		end: dateConstraint.optional(),
		allDay: z.boolean().nullish(),
		every: z.nativeEnum(EVERY_REPEAT).nullish(),
		repeatOn: z.nativeEnum(DAY).array().nullish(),
		date: dateConstraint
	})
	.superRefine(({ recurring, end, repeatOn, date }, ctx) => {
		if (recurring && !end) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Toto pole je povinné'),
				path: ['end']
			})
		}
		if (recurring && isEmpty(repeatOn)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Možnosť opakovania musí obsahovať aspoň jeden platný deň'),
				path: ['repeatOn']
			})
		}
		if (dayjs(date).isSameOrAfter(dayjs(end))) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: serializeValidationMessage('loc:Koniec opakovania musí byť po dátume {{ date }}', { date: formatDate(date) }),
				path: ['end']
			})
		}
	})
	.and(
		z.object({
			eventType: z.nativeEnum(CALENDAR_EVENT_TYPE),
			employee: selectObjConstraint,
			timeFrom: z.string().regex(timeRegex),
			timeTo: z.string().regex(timeRegex),
			note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500)
		})
	)

export type ICalendarEventForm = Omit<z.infer<typeof eventSchema>, 'employee'> & {
	eventId?: string | null
	calendarBulkEventID?: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	isImported?: boolean
	employee: ICalendarEmployeeOptionItem
}

export const validationEventFn = (values: ICalendarEventForm, props: any) => zodErrorsToFormErrors(eventSchema as any, FORM.CALENDAR_EVENT_FORM, values, props)
