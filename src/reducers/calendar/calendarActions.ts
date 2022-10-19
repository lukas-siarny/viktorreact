import { RESERVATIONS, EVENTS, SHIFTS, TIMEOFF, EMPLOYEES, SERVICES, EVENT_DETAIL } from './calendarTypes'
/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
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
	isShift?: boolean
	isReservation?: boolean
	isTimeOff?: boolean
	type?: string
}

interface ICalendarReservation {
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

interface ICalendarShift {
	id?: string
	employeeId?: string
	start?: string
	end?: string
	isShift?: boolean
	isReservation?: boolean
	isTimeOff?: boolean
	type?: string
}

interface ICalendarTimeOff {
	id?: string
	employeeId?: string
	start?: string
	end?: string
	isShift?: boolean
	isReservation?: boolean
	isTimeOff?: boolean
	type?: string
}

interface ICalendarEmployee {
	id?: string
	name?: string
	image?: string
	accent?: string
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
	type?: string
	isReservation?: string
	isShift?: string
	isTimeOff?: string
}

export type ICalendarActions =
	| IResetStore
	| IGetCalendarEvents
	| IGetCalendarReservations
	| IGetCalendarShifts
	| IGetCalendarTimeOff
	| IGetCalendarEmployees
	| IGetCalendarServices
	| IGetCalendarEventDetail

interface IGetCalendarEvents {
	type: EVENTS
	payload: ICalendarEventsPayload
}

interface IGetCalendarReservations {
	type: RESERVATIONS
	payload: ICalendarReservationsPayload
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

export interface ICalendarReservationsPayload {
	data: ICalendarReservation[] | null
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

const mapQueryParams = (queryParams?: ICalendarQueryParams) => ({
	start_gte: queryParams?.start,
	end_lte: queryParams?.end,
	employeeID: queryParams?.employeeID,
	serviceID: queryParams?.serviceID,
	type: queryParams?.type,
	isShift: queryParams?.isShift,
	isReservation: queryParams?.isReservation,
	isTimeOff: queryParams?.isTimeOff
})

export const getCalendarEvents =
	(queryParams?: ICalendarQueryParams): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload
		try {
			dispatch({ type: EVENTS.EVENTS_LOAD_START })

			const { data } = await getReq('http://localhost:7200/events' as any, { ...normalizeQueryParams(mapQueryParams(queryParams)) })

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

export const getCalendarReservations =
	(queryParams?: ICalendarQueryParams): ThunkResult<Promise<ICalendarReservationsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarReservationsPayload
		try {
			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_START })

			const { data } = await getReq('http://localhost:7200/reservations' as any, { ...normalizeQueryParams(mapQueryParams(queryParams)) })

			payload = {
				data
			}

			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getCalendarShifts =
	(queryParams?: ICalendarQueryParams): ThunkResult<Promise<ICalendarShiftsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarShiftsPayload
		try {
			dispatch({ type: SHIFTS.SHIFTS_LOAD_START })

			const { data } = await getReq('http://localhost:7200/shifts' as any, { ...normalizeQueryParams(mapQueryParams(queryParams)) })

			payload = {
				data
			}

			dispatch({ type: SHIFTS.SHIFTS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SHIFTS.SHIFTS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getCalendarTimeOff =
	(queryParams?: ICalendarQueryParams): ThunkResult<Promise<ICalendarTimeOffPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarTimeOffPayload
		try {
			dispatch({ type: TIMEOFF.TIMEOFF_LOAD_START })

			const { data } = await getReq('http://localhost:7200/timeOff' as any, { ...normalizeQueryParams(mapQueryParams(queryParams)) })

			payload = {
				data
			}

			dispatch({ type: TIMEOFF.TIMEOFF_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: TIMEOFF.TIMEOFF_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getCalendarEmployees = (): ThunkResult<Promise<ICalendarEmployeesPayload>> => async (dispatch) => {
	let payload = {} as ICalendarEmployeesPayload
	try {
		dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_START })

		const { data } = await getReq('http://localhost:7200/employees' as any, undefined)

		payload = {
			data
		}

		dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_FAIL })
		// eslint-disable-next-line no-console
		console.error(err)
	}
	return payload
}

export const getCalendarServices = (): ThunkResult<Promise<ICalendarServicesPayload>> => async (dispatch) => {
	let payload = {} as ICalendarServicesPayload
	try {
		dispatch({ type: SERVICES.SERVICES_LOAD_START })

		const { data } = await getReq('http://localhost:7200/services' as any, undefined)

		payload = {
			data
		}

		dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload })
	} catch (err) {
		dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
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
