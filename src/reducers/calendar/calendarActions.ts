/* eslint-disable import/no-cycle */
import dayjs from 'dayjs'

// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'

// enums
import { EVENTS, EVENT_DETAIL } from './calendarTypes'
import { CALENDAR_VIEW } from '../../utils/enums'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams, getFirstDayOfWeek, getLastDayOfWeek, getFirstDayOfMonth, getLasttDayOfMonth } from '../../utils/helper'

interface ICalendarEvent {
	id?: string
	employeeId?: string
	serviceID?: string
	title?: string
	start?: string
	end?: string
	isShift?: boolean
	isReservation?: boolean
	isTimeOff?: boolean
	type?: string
}

interface ICalendarQueryParams {
	salonID: string
	date: string
	employeeID?: string
	serviceID?: string
	type?: string
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
	data: ICalendarEvent[] | null
}

export interface ICalendarEventDetailPayload {
	data: ICalendarEvent | null
}

const getQueryParams = (queryParams: ICalendarQueryParams, view: CALENDAR_VIEW) => {
	// NOTE: employee, service and type filters not supported yet
	const params = {
		employeeID: queryParams?.employeeID,
		serviceID: queryParams?.serviceID,
		type: queryParams?.type
	}

	switch (view) {
		case CALENDAR_VIEW.DAY:
			return {
				...params,
				dateFrom: dayjs(queryParams.date).startOf('day').toISOString(),
				dateTo: dayjs(queryParams.date).endOf('day').toISOString()
			}
		case CALENDAR_VIEW.WEEK:
			return {
				...params,
				dateFrom: getFirstDayOfWeek(queryParams.date).toISOString(),
				dateTo: getLastDayOfWeek(queryParams.date).toISOString()
			}
		case CALENDAR_VIEW.MONTH: {
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

			return {
				...params,
				dateFrom: mondayBeforeFirstDayOfMonth,
				dateTo: sundayAfterLastDayOfMonth
			}
		}
		default:
			return ''
	}
}

export const getCalendarEvents =
	(queryParams: ICalendarQueryParams, view: CALENDAR_VIEW): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload
		try {
			dispatch({ type: EVENTS.EVENTS_LOAD_START })

			const { data } = await getReq('http://localhost:7200/events' as any, { ...normalizeQueryParams(getQueryParams(queryParams, view)) })

			payload = {
				data
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
	(eventID: string): ThunkResult<Promise<ICalendarEventDetailPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventDetailPayload
		try {
			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_START })

			const { data } = await getReq('http://localhost:7200/events/{eventID}' as any, { eventID })

			payload = {
				data
			}

			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
