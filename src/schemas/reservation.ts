import { z } from 'zod'
import { dateConstraint, selectObjConstraint, stringConstraint, zodErrorsToFormErrors } from './baseSchema'
import { VALIDATION_MAX_LENGTH, FORM, CALENDAR_EVENT_TYPE } from '../utils/enums'
// eslint-disable-next-line import/no-cycle
import { CalendarEvent, ICalendarEmployeeOptionItem, ICalendarEventDetailPayload, ISelectOptionItem, ServiceType } from '../types/interfaces'
import { timeRegex } from '../utils/regex'

export const importedReservationSchema = z.object({
	date: dateConstraint,
	timeFrom: z.string().regex(timeRegex),
	timeTo: z.string().regex(timeRegex),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500)
})

export const reservationsSchema = z.object({
	employee: selectObjConstraint,
	customer: selectObjConstraint,
	service: selectObjConstraint,
	date: dateConstraint,
	timeFrom: z.string().regex(timeRegex),
	timeTo: z.string().regex(timeRegex),
	note: stringConstraint(VALIDATION_MAX_LENGTH.LENGTH_1500)
})

export type ICalendarReservationForm = Omit<z.infer<typeof reservationsSchema>, 'employee' & 'customer' & 'service'> & {
	eventId?: string
	revertEvent?: () => void
	updateFromCalendar?: boolean
	noteFromB2CCustomer?: string
	reservationData?: CalendarEvent['reservationData']
	isImported?: boolean
	eventType: CALENDAR_EVENT_TYPE
	employee: ICalendarEmployeeOptionItem
	customer: ISelectOptionItem<{
		customerData?: NonNullable<ICalendarEventDetailPayload['data']>['customer']
	}>
	service: ISelectOptionItem<{
		priceAndDurationData?: ServiceType['priceAndDurationData']
		useCategoryParameter?: ServiceType['useCategoryParameter']
		serviceCategoryParameter?: ServiceType['serviceCategoryParameter']
		categoryId?: string
		serviceData?: NonNullable<ICalendarEventDetailPayload['data']>['service']
	}>
}

export const validationReservationsFn = (values: ICalendarReservationForm, props: any) => zodErrorsToFormErrors(reservationsSchema, FORM.CALENDAR_RESERVATION_FORM, values, props)
