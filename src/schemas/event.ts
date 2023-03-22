import { z } from 'zod'
import { isEmpty } from 'lodash'
import { serializeValidationMessage, stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { CALENDAR_EVENT_TYPE, DAY, EVERY_REPEAT, FORM, VALIDATION_MAX_LENGTH } from '../utils/enums'
import { dateRegex, timeRegex } from '../utils/regex'

const selectOptionItemSchema = z.object({
	key: z.union([z.string(), z.number()]),
	label: z.string(),
	value: z.union([z.string(), z.number()]),
	disabled: z.boolean().optional(),
	hardSelected: z.boolean().optional(),
	// extra: z.any().optional(),
	className: z.string().optional(),
	level: z.number().optional()
})

// https://notino-admin.goodrequest.dev/api/doc/?urls.primaryName=v2.2.55#/B2b-%3Eadmin/postApiB2BAdminSalonsSalonIdCalendarEvents
export const eventSchema = z
	.object({
		eventType: z.nativeEnum(CALENDAR_EVENT_TYPE),
		date: z.string().regex(dateRegex),
		timeFrom: z.string().regex(timeRegex),
		timeTo: z.string().regex(timeRegex),
		employee: selectOptionItemSchema.transform((selectObj, ctx) => {
			if (!selectObj.value) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:Toto pole je povinné'),
					path: ['employee']
				})
				return z.NEVER
			}
			// TODO: cekovat cez uuid
			if (selectObj.value && !z.string().uuid()) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: serializeValidationMessage('loc:nie je uuid'),
					path: ['employee']
				})
				return z.NEVER
			}
			return {
				...selectObj
			}
		}),
		// TODO: conditionalne
		recurring: z.boolean().optional(),
		end: z.string().regex(dateRegex).optional(),
		allDay: z.boolean().nullish(),
		every: z.nativeEnum(EVERY_REPEAT).nullish(),
		repeatOn: z.nativeEnum(DAY).array().nullish(),
		note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500)
	})
	.superRefine(({ eventType, recurring, end, repeatOn }, ctx) => {
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
	})
export type ICalendarEventForm = z.infer<typeof eventSchema> & {
	eventId?: string | null
	calendarBulkEventID?: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	isImported?: boolean
}

export const validationEventFn = (values: ICalendarEventForm, props: any) => zodErrorsToFormErrors(eventSchema as any, FORM.CALENDAR_EVENT_FORM, values, props)
