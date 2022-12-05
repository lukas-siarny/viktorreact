/* eslint-disable import/no-cycle */
import { CalendarApi, EventApi, EventInput } from '@fullcalendar/react'
import dayjs from 'dayjs'
import { destroy } from 'redux-form'

// types
import { IResetStore } from '../generalTypes'
import VIRTUAL_EVENT from './virtualEventTypes'
import { ThunkResult } from '../index'
import { ICalendarEventForm, ICalendarReservationForm, CalendarEvent, ICalendarEventCardData } from '../../types/interfaces'

// utils
import { getReq } from '../../utils/request'
import { CALENDAR_EVENT_TYPE, HANDLE_CALENDAR_ACTIONS, HANDLE_CALENDAR_FORMS } from '../../utils/enums'
import { getDateTime } from '../../utils/helper'
// import { createBaseEvent } from '../../pages/Calendar/calendarHelpers'

export type IVirtualEventActions = IResetStore | IChangeVirtualEvents

const NEW_ID_PREFIX = 'NEW'

let calendarApi: CalendarApi | undefined

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

export const clearEvent = (): ThunkResult<void> => (dispatch, getState) => {
	dispatch({ type: VIRTUAL_EVENT.VIRTUAL_EVENT_CLEAR, payload: { data: null } })
	Object.keys(HANDLE_CALENDAR_FORMS).forEach((key) => dispatch(destroy(key)))
	if (calendarApi) {
		const eventId = getState().virtualEvent.virtualEvent.data?.id

		if (eventId) {
			const event: EventApi | null = calendarApi.getEventById(eventId)

			if (event) {
				console.log('🚀 ~ file: virtualEventActions.ts:52 ~ clearEvent ~ Event exists:', event)
				event.remove()
			}
		}
	}
}

export const addOrUpdateEvent =
	(formAction: HANDLE_CALENDAR_ACTIONS | string, formName: string /* formData?: Partial<ICalendarEventForm & ICalendarReservationForm> */): ThunkResult<void> =>
	(dispatch, getState) => {
		if (!formName) {
			return
		}

		console.log('🚀 ~ file: virtualEventActions.ts:61 ~ formAction', formAction)
		console.log('🚀 ~ file: virtualEventActions.ts:63 ~ formData', formName)

		if (!calendarApi) {
			// eslint-disable-next-line no-console
			console.warn(`Missing Calendar API, new event can't be dispalyed`)
			return
		}

		const formData: Partial<ICalendarEventForm & ICalendarReservationForm> | undefined = getState().form[formName].values

		if (!formData) {
			return
		}

		// if (formAction === HANDLE_CALENDAR_ACTIONS.SUBMIT) {
		// 	dispatch(clearEvent())
		// 	return
		// }

		const { date, timeFrom, timeTo, employee, eventType, customer, service } = formData

		if (date && timeFrom && employee && eventType) {
			let { eventId } = formData

			if (!eventId) {
				eventId = `${NEW_ID_PREFIX}_${employee.key}`
			}

			// const event: EventApi | null = calendarApi.getEventById(eventId)

			const start = getDateTime(date, timeFrom)
			const end = timeTo ? getDateTime(date, timeTo) : dayjs(start).add(15, 'minutes').toISOString()

			// event is not rendered in calendar -> add event
			// if (!event) {

			const calendarViewDate = dayjs(calendarApi.getDate())
			const newDate = dayjs(date)

			if (!calendarViewDate.isSame(newDate)) {
				calendarApi?.gotoDate(date)
			}

			const eventInput: EventInput = {
				id: eventId,
				start,
				end,
				allDay: false,
				resourceId: String(employee.key),
				extendedProps: {
					eventData: {
						eventType,
						date,
						customer: customer
							? {
									id: customer.key,
									email: customer.label
							  }
							: undefined,
						service: service
							? {
									id: service.key,
									name: service.label
							  }
							: undefined
					},
					isPlaceholder: true
				}
			}
			console.log('🚀 ~ file: virtualEventActions.ts:115 ~ eventInput', eventInput)

			const payload: IVirtualEventPayload = {
				data: {
					id: eventId,
					type: eventType,
					event: eventInput,
					isNew: eventId.startsWith(NEW_ID_PREFIX)
				}
			}

			// setTimeout(() => dispatch({ type: VIRTUAL_EVENT.VIRTUAL_EVENT_CHANGE, payload }), 300)
			dispatch({ type: VIRTUAL_EVENT.VIRTUAL_EVENT_CHANGE, payload })
			// } else {
			// 	const state = getState()

			// 	console.log('🚀 ~ file: virtualEvents.ts:100 ~ updateEvent ~ event', event)

			// 	const { eventData } = event.toPlainObject({ collapseExtendedProps: true })

			// 	const calendarViewDate = dayjs(calendarApi.getDate())
			// 	console.log('🚀 ~ file: virtualEvents.ts:92 ~ updateEvent ~ calendarViewDate', calendarViewDate)

			// 	const resourceId = event.getResources()[0].id
			// 	const employeeId = String(employee.key)

			// 	const newDate = dayjs(date)

			// 	switch (true) {
			// 		case !dayjs(start).isSame(event.startStr) || !dayjs(end).isSame(event.endStr):
			// 			if (!calendarViewDate.isSame(newDate)) {
			// 				// event.moveDates(calendarViewDate.diff(newDate))
			// 				// event.moveDates(newDate.diff(calendarViewDate))
			// 				event.setDates(start, end)
			// 				calendarApi?.gotoDate(date)
			// 			} else {
			// 				event.setDates(start, end)
			// 			}

			// 			break

			// 		case resourceId !== employeeId:
			// 			event.setResources([employeeId])
			// 			break

			// 		case eventData.eventType !== eventType:
			// 			event.setExtendedProp('eventData', {
			// 				...eventData,
			// 				eventType
			// 			})
			// 			break
			// 		default:
			// 			break
			// 	}
			// }
		}
	}
