/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs'
import { ICalendarEventsPayload } from '../../reducers/calendar/calendarActions'
import { Employees } from '../../types/interfaces'
import { CALENDAR_EVENT_TYPE } from '../../utils/enums'

const getDateTime = (date: string, time?: string) => {
	const [hours, minutes] = (time || '').split(':')

	if (Number.isInteger(Number(hours)) && Number.isInteger(Number(minutes))) {
		return dayjs(date).add(Number(hours), 'hours').add(Number(minutes), 'minutes').toISOString()
	}

	return dayjs(date).toISOString()
}

export const composeDayViewEvents = (events: ICalendarEventsPayload['data'], employees?: Employees) => {
	const composedEvents: any[] = []

	events?.forEach((event) => {
		const resource = employees?.find((employee) => event.employee?.id === employee.id)

		if (resource) {
			const calendarEvent = {
				id: event.id,
				resourceId: resource.id,
				start: getDateTime(event.start.date, event.start.time),
				end: getDateTime(event.end.date, event.end.time),
				eventType: event.eventType,
				allDay: false,
				employee: event.employee,
				note: event.note
			}

			switch (calendarEvent.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					composedEvents.push({
						...calendarEvent,
						display: 'inverse-background'
					})
					break
				case CALENDAR_EVENT_TYPE.RESERVATION:
				default:
					composedEvents.push({
						...calendarEvent,
						reservationData: event.reservationData,
						service: event.service,
						customer: event.customer
					})
					break
			}
		}
	})

	return composedEvents
}

export const composeDayEventResources = (events: ICalendarEventsPayload['data'], employees?: Employees) => {
	return employees?.map((employee) => {
		const employeeShifts = events
			?.filter((event) => event.employee?.id === employee.id && event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT)
			.sort((eventA, eventB) => {
				const key1 = eventA.start
				const key2 = eventB.start

				if (key1 && key2) {
					if (key1 < key2) {
						return -1
					}
					if (key1 === key2) {
						return 0
					}
				}
				return 1
			})
			.reduce((result, cv, i, arr) => {
				const newResult = `${result}${dayjs(getDateTime(cv.start.date, cv.start.time)).format('HH:mm')}-${dayjs(getDateTime(cv.end.date, cv.end.time)).format('HH:mm')}${
					i + 1 !== arr.length ? ', ' : ''
				}`
				return newResult
			}, '')

		return {
			id: employee.id,
			name: `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email || employee.inviteEmail || employee.id,
			image: employee.image.resizedImages.thumbnail,
			description: employeeShifts || '-',
			employeeData: employee
		}
	})
}
