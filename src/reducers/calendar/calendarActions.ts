/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { EVENTS, SHIFTS, TIMEOFF, EMPLOYEES, SERVICES, EVENT_DETAIL } from './calendarTypes'
import { IResetStore } from '../generalTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

interface ICalendarEvent {
	id?: string
	employeeId?: string
	serviceID?: string
	title?: string
	start?: string
	end?: string
}

interface ICalendarShift {
	id?: string
	employeeId?: string
	start?: string
	end?: string
}

interface ICalendarTimeOff {
	id?: string
	employeeId?: string
	start?: string
	end?: string
}

interface ICalendarEmployee {
	id?: string
	name?: string
	image?: string
	color?: string
}

interface ICalendarService {
	id?: string
	name?: string
}

interface ICalendarQueryParams {
	start?: string
	end?: string
	employeeID?: string
	serviceID?: string
}

export type ICalendarActions = IResetStore | IGetCalendarEvents | IGetCalendarShifts | IGetCalendarTimeOff | IGetCalendarEmployees | IGetCalendarServices | IGetCalendarEventDetail

interface IGetCalendarEvents {
	type: EVENTS
	payload: ICalendarEventsPayload
}

interface IGetCalendarShifts {
	type: SHIFTS
	payload: ICalendarShiftsPayload
}

interface IGetCalendarTimeOff {
	type: TIMEOFF
	payload: ICalendarTimeOffPayload
}

interface IGetCalendarEmployees {
	type: EMPLOYEES
	payload: ICalendarEmployeesPayload
}

interface IGetCalendarServices {
	type: SERVICES
	payload: ICalendarServicesPayload
}

interface IGetCalendarEventDetail {
	type: EVENT_DETAIL
	payload: ICalendarEventDetailPayload
}

export interface ICalendarEventsPayload {
	data: ICalendarEvent[] | null
}

export interface ICalendarShiftsPayload {
	data: ICalendarShift[] | null
}

export interface ICalendarTimeOffPayload {
	data: ICalendarTimeOff[] | null
}

export interface ICalendarEmployeesPayload {
	data: ICalendarEmployee[] | null
}

export interface ICalendarServicesPayload {
	data: ICalendarService[] | null
}

export interface ICalendarEventDetailPayload {
	data: ICalendarEvent | null
}

export const getCalendarEvents =
	(queryParams?: ICalendarQueryParams): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		const params: any = {
			start_gte: queryParams?.start,
			end_lte: queryParams?.end,
			employeeID: queryParams?.employeeID,
			serviceID: queryParams?.serviceID
		}

		try {
			dispatch({ type: EVENTS.EVENTS_LOAD_START })

			const { data } = await getReq('http://localhost:7200/events' as any, { ...normalizeQueryParams(params) })

			const payload = {
				data
			}

			dispatch({ type: EVENTS.EVENTS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EVENTS.EVENTS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const getCalendarShifts =
	(queryParams?: ICalendarQueryParams): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		const params: any = {
			start_gte: queryParams?.start,
			end_lte: queryParams?.end,
			employeeID: queryParams?.employeeID
		}

		try {
			dispatch({ type: SHIFTS.SHIFTS_LOAD_START })

			const { data } = await getReq('http://localhost:7200/shifts' as any, { ...normalizeQueryParams(params) })

			const payload = {
				data
			}

			dispatch({ type: SHIFTS.SHIFTS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SHIFTS.SHIFTS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const getCalendarTimeOff =
	(queryParams?: ICalendarQueryParams): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		const params: any = {
			start_gte: queryParams?.start,
			end_lte: queryParams?.end,
			employeeID: queryParams?.employeeID
		}

		try {
			dispatch({ type: TIMEOFF.TIMEOFF_LOAD_START })

			const { data } = await getReq('http://localhost:7200/timeOff' as any, { ...normalizeQueryParams(params) })

			const payload = {
				data
			}

			dispatch({ type: TIMEOFF.TIMEOFF_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: TIMEOFF.TIMEOFF_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const getCalendarEmployees = (): ThunkResult<Promise<void>> => async (dispatch) => {
	try {
		dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_START })

		const { data } = await getReq('http://localhost:7200/employees' as any, undefined)

		const payload = {
			data
		}

		dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}
}

export const getCalendarServices = (): ThunkResult<Promise<void>> => async (dispatch) => {
	try {
		dispatch({ type: SERVICES.SERVICES_LOAD_START })

		const { data } = await getReq('http://localhost:7200/services' as any, undefined)

		const payload = {
			data
		}

		dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}
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
