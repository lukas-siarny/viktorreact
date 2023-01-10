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
import { CALENDAR_EVENT_TYPE, HANDLE_CALENDAR_ACTIONS, HANDLE_CALENDAR_FORMS, NEW_ID_PREFIX, CALENDAR_DATE_FORMAT } from '../../utils/enums'
import { getDateTime } from '../../utils/helper'
// import { createBaseEvent } from '../../pages/Calendar/calendarHelpers'

export type IVirtualEventActions = IResetStore | IChangeVirtualEvents

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

		let formData: Partial<ICalendarEventForm & ICalendarReservationForm> | undefined

		try {
			formData = getState().form[formName].values
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(`Missing formData, virtual event can't be displayed`, error)
		}

		if (!formData) {
			return
		}
		const { date, timeFrom, timeTo, employee, eventType, customer, service, calendarBulkEventID, note, noteFromB2CCustomer, reservationData } = formData

		if (date && timeFrom && employee && eventType) {
			let { eventId } = formData

			if (!eventId) {
				eventId = `${NEW_ID_PREFIX}_${employee.key}`
			}

			const start = getDateTime(date, timeFrom)
			// NOTE: ak timeTo nie je zadany, pre vykreslenia placeholdera sa pouzije najmensi casovy slot (bunka), ktory je nastaveny na 15min
			const endTime = timeTo || dayjs(start).add(15, 'minutes').format(CALENDAR_DATE_FORMAT.TIME)
			const end = getDateTime(date, endTime)

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
					id: eventId,
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
						time: endTime
					},
					customer: customer
						? {
								...(customer?.extra?.customerData || {}),
								id: customer.key,
								email: customer.label || customer.value
						  }
						: undefined,
					service: service
						? {
								...(service?.extra?.serviceData || {}),
								id: service.key,
								name: service.label || service.value
						  }
						: undefined,
					employee: employee
						? {
								...(employee?.extra?.employeeData || {}),
								id: employee.key,
								email: employee.label || employee.value
						  }
						: undefined,
					calendarBulkEvent: calendarBulkEventID
						? {
								id: calendarBulkEventID
						  }
						: undefined,
					note,
					noteFromB2CCustomer,
					reservationData
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
