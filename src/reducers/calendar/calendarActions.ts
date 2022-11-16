/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// enums
import { EVENTS, EVENT_DETAIL } from './calendarTypes'
import { CALENDAR_EVENTS_KEYS, CALENDAR_VIEW, CALENDAR_EVENT_TYPE } from '../../utils/enums'

// utils
import { getReq } from '../../utils/request'
import { getSelectedDateRange } from '../../pages/Calendar/calendarHelpers'
import { getDateTime, normalizeQueryParams } from '../../utils/helper'

export type CalendarEvents = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['calendarEvents']
export type CalendarEvent = CalendarEvents[0] & {
	startDateTime: string
	endDateTime: string
}
type CalendarEventsQueryParams = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.QueryParameters & Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.PathParameters

export type CalendarEventDetail = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCalendarEventId.Responses.$200['calendarEvent']

interface ICalendarEventsQueryParams {
	salonID: string
	date: string
	employeeIDs?: (string | null)[] | null
	categoryIDs?: (string | null)[] | null
	eventTypes?: (string | null)[] | null
}

interface ICalendarReservationsQueryParams {
	salonID: string
	date: string
	employeeIDs?: (string | null)[] | null
	categoryIDs?: (string | null)[] | null
}

interface ICalendarShiftsTimeOffQueryParams {
	salonID: string
	date: string
	employeeIDs?: (string | null)[] | null
}

export type ICalendarActions = IResetStore | IGetCalendarEvents | IGetCalendarEventDetail

interface IGetCalendarEvents {
	type: EVENTS
	enumType: CALENDAR_EVENTS_KEYS
	payload: ICalendarEventsPayload
}

interface IGetCalendarEventDetail {
	type: EVENT_DETAIL
	payload: ICalendarEventDetailPayload
}

export interface ICalendarEventsPayload {
	data: CalendarEvent[] | null
}

export interface ICalendarEventDetailPayload {
	data: CalendarEventDetail | null
}

export const getCalendarEvents =
	(enumType: CALENDAR_EVENTS_KEYS = CALENDAR_EVENTS_KEYS.EVENTS, queryParams?: ICalendarEventsQueryParams, view?: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload

		if (!queryParams || !view) {
			dispatch({ type: EVENTS.EVENTS_CLEAR })
			return payload
		}

		try {
			const { start, end } = getSelectedDateRange(view, queryParams.date)

			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				categoryIDs: queryParams.categoryIDs,
				employeeIDs: queryParams.employeeIDs,
				eventTypes: queryParams.eventTypes,
				dateFrom: start,
				dateTo: end
			}

			dispatch({ type: EVENTS.EVENTS_LOAD_START, enumType })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/', normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams)

			payload = {
				data: data.calendarEvents.map((event) => ({
					...event,
					startDateTime: getDateTime(event.start.date, event.start.time),
					endDateTime: getDateTime(event.end.date, event.end.time)
				}))
			}

			dispatch({ type: EVENTS.EVENTS_LOAD_DONE, enumType, payload })
		} catch (err) {
			dispatch({ type: EVENTS.EVENTS_LOAD_FAIL, enumType })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getCalendarReservations = (queryParams?: ICalendarReservationsQueryParams, view?: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(CALENDAR_EVENTS_KEYS.RESERVATIONS, queryParams ? { ...queryParams, eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION] } : undefined, view)

export const getCalendarShiftsTimeoff = (queryParams?: ICalendarShiftsTimeOffQueryParams, view?: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(
		CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS,
		queryParams ? { ...queryParams, eventTypes: [CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT, CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF, CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK] } : undefined,
		view
	)

export const getCalendarEventDetail =
	(salonID: string, calendarEventID: string): ThunkResult<Promise<ICalendarEventDetailPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventDetailPayload
		try {
			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}', { calendarEventID, salonID })

			payload = {
				data: data.calendarEvent
			}

			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
