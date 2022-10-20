/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs'
import { find, map, reduce } from 'lodash'
import { ICalendarEmployeesPayload, ICalendarEventsPayload } from '../../reducers/calendar/calendarActions'
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../utils/enums'

interface IComposeEventsData {
	events?: ICalendarEventsPayload
	employees?: ICalendarEmployeesPayload
	services?: ICalendarEmployeesPayload
}

export const composeEvents = ({ events, employees, services }: IComposeEventsData, calendarView?: CALENDAR_VIEW) => {
	switch (calendarView) {
		case CALENDAR_VIEW.DAY_RESERVATIONS:
		case CALENDAR_VIEW.WEEK_RESERVATIONS:
		case CALENDAR_VIEW.MONTH_RESERVATIONS:
			return reduce(
				events?.data,
				(acc, calendarEvent) => {
					const employee = find(employees?.data, (e) => calendarEvent?.employeeId === e?.id)
					const service = find(services?.data, (s) => calendarEvent?.serviceID === s?.id)
					const event = {
						id: calendarEvent.id,
						resourceId: employee?.id,
						start: calendarEvent.start,
						end: calendarEvent.end,
						eventType: calendarEvent.type,
						employee,
						allDay: false
					}

					switch (calendarEvent.type) {
						case CALENDAR_EVENT_TYPE.SHIFT:
						case CALENDAR_EVENT_TYPE.TIMEOFF: {
							const bgEvents = []

							const bgEvent = {
								...event,
								display: 'background'
							}

							const startHour = dayjs(calendarEvent.start).hour()
							const endHour = dayjs(calendarEvent.end).hour()

							// eslint-disable-next-line no-plusplus
							for (let i = 0; i < endHour - startHour; i++) {
								bgEvents.push({
									...bgEvent,
									start: dayjs(calendarEvent.start).add(i, 'hour').toISOString(),
									end: dayjs(calendarEvent.start)
										.add(i + 1, 'hour')
										.toISOString()
								})
							}

							return [...acc, ...bgEvents]
						}
						case CALENDAR_EVENT_TYPE.RESERVATION:
						default:
							return [
								...acc,
								{
									...event,
									title: calendarEvent.title,
									service
								}
							]
					}
				},
				[] as any[]
			)

		/* return map(events?.data, (calendarEvent) => {
				const employee = find(employees?.data, (e) => calendarEvent?.employeeId === e?.id)
				const service = find(services?.data, (s) => calendarEvent?.serviceID === s?.id)
				const event = {
					id: calendarEvent.id,
					resourceId: employee?.id,
					start: calendarEvent.start,
					end: calendarEvent.end,
					eventType: calendarEvent.type,
					employee,
					allDay: false
				}

				switch (calendarEvent.type) {
					case CALENDAR_EVENT_TYPE.SHIFT:
						return {
							...event,
							display: 'background'
						}
					case CALENDAR_EVENT_TYPE.TIMEOFF:
						return {
							...event,
							display: 'background'
						}
					case CALENDAR_EVENT_TYPE.RESERVATION:
					default:
						return {
							...event,
							title: calendarEvent.title,
							service
						}
				}
			}) */
		default:
			return []
	}
}

export const composeResources = (events: ICalendarEventsPayload, employees: ICalendarEmployeesPayload) => {
	return map(employees?.data, (employee) => {
		const employeeShifts = events?.data
			?.filter((event) => event.employeeId === employee.id && event.type === CALENDAR_EVENT_TYPE.SHIFT)
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
				const newResult = `${result}${dayjs(cv.start).format('HH:mm')}-${dayjs(cv.end).format('HH:mm')}${i + 1 !== arr.length ? ', ' : ''}`
				return newResult
			}, '')

		return {
			id: employee.id,
			employeeData: employee,
			description: employeeShifts
		}
	})
}
