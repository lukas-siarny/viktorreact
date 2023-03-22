import { z } from 'zod'
import { stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM, CALENDAR_EVENT_TYPE, EVERY_REPEAT, DAY } from '../utils/enums'
import { CalendarEvent, ICalendarEventDetailPayload, ISelectOptionItem, ServiceType } from '../types/interfaces'
import { dateRegex, timeRegex } from '../utils/regex'

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

export const reservationsSchema = z.object({
	employee: z.any(), // TODO
	customer: z.any(), // TODO
	date: z.string().regex(dateRegex),
	timeFrom: z.string().regex(timeRegex),
	timeTo: z.string().regex(timeRegex),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500),

	service: z.object({}),
	eventType: z.nativeEnum(CALENDAR_EVENT_TYPE)
})

export type IReservationsForm = z.infer<typeof reservationsSchema> & {
	service: ISelectOptionItem<{
		priceAndDurationData?: ServiceType['priceAndDurationData']
		useCategoryParameter?: ServiceType['useCategoryParameter']
		serviceCategoryParameter?: ServiceType['serviceCategoryParameter']
		categoryId?: string
		serviceData?: NonNullable<ICalendarEventDetailPayload['data']>['service']
	}>
	eventId?: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	noteFromB2CCustomer?: string
	reservationData?: CalendarEvent['reservationData']
	isImported?: boolean
	eventType: CALENDAR_EVENT_TYPE
}

export const validationReservationsFn = (values: IReservationsForm, props: any) => zodErrorsToFormErrors(importedReservationSchema, FORM.CALENDAR_RESERVATION_FORM, values, props)
