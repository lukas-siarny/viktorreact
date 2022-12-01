import { CalendarApi, EventApi, EventInput } from '@fullcalendar/react'
import dayjs from 'dayjs'
import { Dispatch } from 'redux'

// redux
// import { refreshEvents } from '../reducers/calendar/calendarActions'

// types
import { ICalendarEventForm, ICosmetic, ISelectable, CalendarEvent, ICalendarEventCardData } from '../types/interfaces'

// utils
import { CALENDAR_EVENT_TYPE, HANDLE_CALENDAR_ACTIONS } from './enums'
// eslint-disable-next-line import/no-cycle
import { getDateTime } from './helper'

const NEW_ID_PREFIX = 'NEW'

let lastEventId: string

let calendarApi: CalendarApi | undefined

let dispatch: Dispatch

export const initVirtualHandler = (dispatchArg: Dispatch, api?: CalendarApi) => {
	dispatch = dispatchArg
	calendarApi = api
}

export const resetEvents = () => {
	// if (calendarApi) {
	// 	const event = calendarApi.getEventById(lastEventId)
	// 	if (event) {
	// 		event.remove()
	// 	}
	// }
	// if (dispatch) {
	// 	dispatch(refreshEvents())
	// }
}

// const addEvent = (start: string, end: string, resourceId: string)

export const updateEvent = (formAction: HANDLE_CALENDAR_ACTIONS | string, payload?: Partial<ICalendarEventForm>) => {
	if (!payload) {
		return
	}

	if (!calendarApi) {
		console.warn(`Missing Calendar API, new event can't be dispalyed`)
		return
	}

	const { date, timeFrom, timeTo, employee, eventType } = payload

	if (date && timeFrom && employee) {
		let { eventId } = payload

		if (!eventId) {
			eventId = `${NEW_ID_PREFIX}_${employee.key}`
		}

		lastEventId = eventId

		const event: EventApi | null = calendarApi.getEventById(eventId)

		const start = getDateTime(date, timeFrom)
		const end = timeTo ? getDateTime(date, timeTo) : dayjs(start).add(15, 'minutes').toISOString()

		// event is not rendered in calendar -> add event
		if (!event) {
			const eventInput: EventInput = {
				id: eventId,
				start,
				end,
				allDay: false,
				resourceId: String(employee.key),
				extendedProps: {
					eventData: {
						eventType
					},
					isPlaceholder: true
				}
			}

			calendarApi.addEvent(eventInput)
		} else {
			console.log('🚀 ~ file: virtualEvents.ts:100 ~ updateEvent ~ event', event)

			const { eventData } = event.toPlainObject({ collapseExtendedProps: true })

			const calendarViewDate = dayjs(calendarApi.getDate())
			console.log('🚀 ~ file: virtualEvents.ts:92 ~ updateEvent ~ calendarViewDate', calendarViewDate)

			const resourceId = event.getResources()[0].id
			const employeeId = String(employee.key)

			const newDate = dayjs(date)

			switch (true) {
				case !dayjs(start).isSame(event.startStr) || !dayjs(end).isSame(event.endStr):
					if (!calendarViewDate.isSame(newDate)) {
						// event.moveDates(calendarViewDate.diff(newDate))
						// event.moveDates(newDate.diff(calendarViewDate))
						event.setDates(start, end)
						calendarApi?.gotoDate(date)
					} else {
						event.setDates(start, end)
					}

					break

				case resourceId !== employeeId:
					event.setResources([employeeId])
					break

				case eventData.eventType !== eventType:
					event.setExtendedProp('eventData', {
						...eventData,
						eventType
					})
					break
				default:
					break
			}
		}
	}
}
