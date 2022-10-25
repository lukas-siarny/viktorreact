/* eslint-disable import/no-cycle */
import dayjs from 'dayjs'

// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// enums
import { EVENTS, EVENT_DETAIL } from './calendarTypes'
import { CALENDAR_VIEW } from '../../utils/enums'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams, getFirstDayOfWeek, getLastDayOfWeek, getFirstDayOfMonth, getLasttDayOfMonth } from '../../utils/helper'

export type CalendarEvents = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['calendarEvents']
export type CalendarEvent = CalendarEvents[0]
type CalendarEventsQueryParams = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.QueryParameters & Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.PathParameters

export type CalendarEventDetail = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCalendarEventId.Responses.$200['calendarEvent']

interface ICalendarQueryParams {
	salonID: string
	date: string
	employeeIDs?: string[]
	serviceIDs?: string[]
	eventType?: string
}

export type ICalendarActions = IResetStore | IGetCalendarEvents | IGetCalendarEventDetail

interface IGetCalendarEvents {
	type: EVENTS
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

const getEventsQueryParams = (queryParams: ICalendarQueryParams, view: CALENDAR_VIEW): CalendarEventsQueryParams => {
	// NOTE: employees, services and event type filters are not supported yet
	let params: any = {
		// employeeID: queryParams?.employeeIDs,
		// serviceID: queryParams?.serviceIDs,
		salonID: queryParams.salonID,
		eventType: queryParams?.eventType
	}

	switch (view) {
		case CALENDAR_VIEW.MONTH: {
			// NOTE: je potrebne najst eventy aj z konca predosleho a zaciatku nasledujuceho mesiaca, aby sa vyplnilo cele mesacne view
			// stlpce v zobrazeni - Pondelok - Nedela
			const firstDayOfMonth = getFirstDayOfMonth(queryParams.date)
			const lastDayOfMonth = getLasttDayOfMonth(queryParams.date)
			let mondayBeforeFirstDayOfMonth = firstDayOfMonth
			let sundayAfterLastDayOfMonth = lastDayOfMonth

			// 0 (Sunday) to 6 (Saturday)
			if (firstDayOfMonth.day() !== 1) {
				mondayBeforeFirstDayOfMonth = firstDayOfMonth.subtract(firstDayOfMonth.day() - 1, 'day')
			}

			if (firstDayOfMonth.day() !== 0) {
				sundayAfterLastDayOfMonth = lastDayOfMonth.add(7 - lastDayOfMonth.day(), 'day')
			}

			params = {
				...params,
				dateFrom: mondayBeforeFirstDayOfMonth,
				dateTo: sundayAfterLastDayOfMonth
			}
			break
		}
		case CALENDAR_VIEW.WEEK:
			params = {
				...params,
				dateFrom: getFirstDayOfWeek(queryParams.date).toISOString(),
				dateTo: getLastDayOfWeek(queryParams.date).toISOString()
			}
			break
		case CALENDAR_VIEW.DAY:
		default:
			params = {
				...params,
				dateFrom: dayjs(queryParams.date).startOf('day').toISOString(),
				dateTo: dayjs(queryParams.date).endOf('day').toISOString()
			}
			break
	}

	return normalizeQueryParams(params) as CalendarEventsQueryParams
}

export const getCalendarEvents =
	(queryParams: ICalendarQueryParams, view: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload
		try {
			dispatch({ type: EVENTS.EVENTS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/', getEventsQueryParams(queryParams, view))

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

export const getCalendarEventDetail =
	(calendarEventID: string): ThunkResult<Promise<ICalendarEventDetailPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventDetailPayload
		try {
			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}', { calendarEventID } as any)

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
