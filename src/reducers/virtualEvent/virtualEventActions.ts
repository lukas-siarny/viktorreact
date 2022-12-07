/* eslint-disable import/no-cycle */
import { CalendarApi, EventApi, EventInput } from '@fullcalendar/react'
import dayjs from 'dayjs'
import { destroy } from 'redux-form'

// types
import { IResetStore } from '../generalTypes'
import VIRTUAL_EVENT from './virtualEventTypes'
import { ThunkResult } from '../index'
import { ICalendarEventForm, ICalendarReservationForm } from '../../types/interfaces'

// utils
import { CALENDAR_EVENT_TYPE, HANDLE_CALENDAR_ACTIONS, HANDLE_CALENDAR_FORMS } from '../../utils/enums'
import { getDateTime } from '../../utils/helper'
// import { createBaseEvent } from '../../pages/Calendar/calendarHelpers'

export type IVirtualEventActions = IResetStore | IChangeVirtualEvents

const NEW_ID_PREFIX = 'NEW'

// NOTE: treba, aby calendarApi a changeCalendarDate boli setnute 'z vonku' z komponentu
let calendarApi: CalendarApi | undefined

let changeCalendarDate: any

interface IChangeVirtualEvents {
	type: VIRTUAL_EVENT
	payload: IVirtualEventPayload
}

export interface IVirtualEventPayload {
	data: {
		id: string
		type: CALENDAR_EVENT_TYPE
		event: EventInput
		isNew?: boolean
	} | null
}

export const setCalendarApi = (api?: CalendarApi) => {
	calendarApi = api
}

export const setCalendarDateHandler = (handler: (newDate: string) => void) => {
	changeCalendarDate = handler
}

export const clearEvent = (): ThunkResult<void> => (dispatch, getState) => {
	// clear store
	dispatch({ type: VIRTUAL_EVENT.VIRTUAL_EVENT_CLEAR, payload: { data: null } })
	// destroy calendar forms
	Object.keys(HANDLE_CALENDAR_FORMS).forEach((key) => dispatch(destroy(key)))
	// remove event from Calendar API
	if (calendarApi) {
		const eventId = getState().virtualEvent.virtualEvent.data?.id

		if (eventId) {
			const event: EventApi | null = calendarApi.getEventById(eventId)

			if (event) {
				event.remove()
			}
		}
	}
	// const highlight = document.getElementsByClassName('fc-highlight')[0]
	// if (highlight) highlight.remove()
}

export const addOrUpdateEvent =
	(formAction: HANDLE_CALENDAR_ACTIONS | string, formName: string): ThunkResult<void> =>
	(dispatch, getState) => {
		if (!formName) {
			return
		}

		// praca s formularom bude nadalej fungovat, nevykresloval by sa iba placeholder
		if (!calendarApi) {
			// eslint-disable-next-line no-console
			console.warn(`Missing Calendar API, new event can't be dispalyed`)
			return
		}

		const formData: Partial<ICalendarEventForm & ICalendarReservationForm> | undefined = getState().form[formName].values

		if (!formData) {
			return
		}

		const { date, timeFrom, timeTo, employee, eventType, customer, service, calendarBulkEventID } = formData

		if (date && timeFrom && employee && eventType) {
			let { eventId } = formData

			if (!eventId) {
				eventId = `${NEW_ID_PREFIX}_${employee.key}`
			}

			const start = getDateTime(date, timeFrom)
			const end = timeTo ? getDateTime(date, timeTo) : dayjs(start).add(15, 'minutes').toISOString()

			const calendarViewDate = dayjs(calendarApi.getDate())
			const newDate = dayjs(date)

			if (!calendarViewDate.isSame(newDate) && changeCalendarDate) {
				changeCalendarDate(date)
			}

			const eventInput: EventInput = {
				id: eventId,
				start,
				end,
				allDay: false,
				resourceId: String(employee.key),
				eventData: {
					eventType,
					isPlaceholder: true,
					date,
					startDateTime: start,
					endDateTime: end,
					start: {
						date,
						time: timeFrom
					},
					end: {
						date,
						time: timeTo
					},
					customer: customer
						? {
								id: customer.key,
								email: customer.label || customer.value
						  }
						: undefined,
					service: service
						? {
								id: service.key,
								name: service.label || service.value
						  }
						: undefined,
					employee: employee
						? {
								id: employee.key,
								email: employee.label || employee.value
						  }
						: undefined,
					calendarBulkEvent: {
						id: calendarBulkEventID
					}
				}
			}

			const payload: IVirtualEventPayload = {
				data: {
					id: eventId,
					type: eventType,
					event: eventInput,
					isNew: eventId.startsWith(NEW_ID_PREFIX)
				}
			}

			dispatch({ type: VIRTUAL_EVENT.VIRTUAL_EVENT_CHANGE, payload })
		}
	}
