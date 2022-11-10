/* eslint-disable import/no-cycle */
import dayjs from 'dayjs'

// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// enums
import { EVENTS, EVENT_DETAIL, RESERVATIONS, SHIFTS_TIME_OFF } from './calendarTypes'
import { CALENDAR_VIEW, CALENDAR_EVENT_TYPE, CALENDAR_DATE_FORMAT } from '../../utils/enums'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

export type CalendarEvents = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['calendarEvents']
export type CalendarEvent = CalendarEvents[0]
type CalendarEventsQueryParams = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.QueryParameters & Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.PathParameters

export type CalendarEventDetail = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCalendarEventId.Responses.$200['calendarEvent']

interface ICalendarEventsQueryParams {
	salonID: string
	date: string
	employeeIDs?: (string | null)[] | null
	categoryIDs?: (string | null)[] | null
	eventType?: (string | null)[] | null
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

export type ICalendarActions = IResetStore | IGetCalendarEvents | IGetCalendarReservations | IGetCalendarShiftsTimeoff | IGetCalendarEventDetail

interface IGetCalendarEvents {
	type: EVENTS
	payload: ICalendarEventsPayload
}

interface IGetCalendarReservations {
	type: RESERVATIONS
	payload: ICalendarEventsPayload
}

interface IGetCalendarShiftsTimeoff {
	type: SHIFTS_TIME_OFF
	payload: ICalendarEventsPayload
}

interface IGetCalendarEventDetail {
	type: EVENT_DETAIL
	payload: ICalendarEventDetailPayload
}

export interface ICalendarEventsPayload {
	data: CalendarEvents | null
}

export interface ICalendarEventDetailPayload {
	data: CalendarEventDetail | null
}

const getTimeFromTo = (selectedDate: string, view: CALENDAR_VIEW) => {
	switch (view) {
		case CALENDAR_VIEW.MONTH: {
			// NOTE: je potrebne najst eventy aj z konca predosleho a zaciatku nasledujuceho mesiaca, aby sa vyplnilo cele mesacne view
			return {
				dateFrom: dayjs(selectedDate).startOf('month').startOf('week').format(CALENDAR_DATE_FORMAT.QUERY),
				dateTo: dayjs(selectedDate).endOf('month').endOf('week').format(CALENDAR_DATE_FORMAT.QUERY)
			}
		}
		case CALENDAR_VIEW.WEEK:
			return {
				dateFrom: dayjs(selectedDate).startOf('week').format(CALENDAR_DATE_FORMAT.QUERY),
				dateTo: dayjs(selectedDate).endOf('week').format(CALENDAR_DATE_FORMAT.QUERY)
			}
		case CALENDAR_VIEW.DAY:
		default:
			return {
				dateFrom: selectedDate,
				dateTo: selectedDate
			}
	}
}

export const getCalendarEvents =
	(queryParams: ICalendarEventsQueryParams, view: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload
		try {
			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				categoryIDs: queryParams.categoryIDs,
				employeeIDs: queryParams.employeeIDs,
				eventTypes: queryParams.eventType,
				...getTimeFromTo(queryParams.date, view)
			}

			dispatch({ type: EVENTS.EVENTS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/', normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams)

			payload = {
				data: data.calendarEvents
			}

			dispatch({ type: EVENTS.EVENTS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EVENTS.EVENTS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getCalendarReservations =
	(queryParams?: ICalendarReservationsQueryParams, view?: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload

		if (!queryParams || !view) {
			dispatch({ type: RESERVATIONS.RESERVATIONS_CLEAR })
			return payload
		}

		try {
			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				categoryIDs: queryParams.categoryIDs,
				employeeIDs: queryParams.employeeIDs,
				eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION],
				...getTimeFromTo(queryParams.date, view)
			}

			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/', normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams)

			payload = {
				data: data.calendarEvents
			}

			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getCalendarShiftsTimeoff =
	(queryParams?: ICalendarShiftsTimeOffQueryParams, view?: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload

		if (!queryParams || !view) {
			dispatch({ type: SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_CLEAR })
			return payload
		}

		try {
			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				employeeIDs: queryParams.employeeIDs,
				eventTypes: [CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT, CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF, CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK],
				...getTimeFromTo(queryParams.date, view)
			}

			dispatch({ type: SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/', normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams)

			payload = {
				data: data.calendarEvents
			}

			dispatch({ type: SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

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
