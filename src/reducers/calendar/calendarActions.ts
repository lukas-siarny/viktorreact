import dayjs from 'dayjs'
import { CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENTS_KEYS, CALENDAR_EVENT_TYPE, DATE_TIME_PARSER_DATE_FORMAT, RESERVATION_STATE } from '../../utils/enums'
/* eslint-disable import/no-cycle */

// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { CalendarEvent, ICalendarEventsPayload } from '../../types/interfaces'

// enums
import { EVENTS, EVENT_DETAIL, SET_DAY_DETAIL_DATE, SET_IS_REFRESHING_EVENTS, UPDATE_EVENT } from './calendarTypes'

// utils
import { getReq } from '../../utils/request'
import { getDateTime, normalizeQueryParams } from '../../utils/helper'

import { clearEvent } from '../virtualEvent/virtualEventActions'

type CalendarEventsQueryParams = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.QueryParameters & Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.PathParameters

export type CalendarEventDetail = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCalendarEventId.Responses.$200['calendarEvent']

interface ICalendarEventsQueryParams {
	salonID: string
	start: string
	end: string
	employeeIDs?: (string | null)[] | null
	categoryIDs?: (string | null)[] | null
	eventTypes?: (string | null)[] | null
	reservationStates?: (string | null)[] | null
}

interface ICalendarReservationsQueryParams {
	salonID: string
	start: string
	end: string
	employeeIDs?: (string | null)[] | null
	categoryIDs?: (string | null)[] | null
	reservationStates?: (string | null)[] | null
}

interface ICalendarShiftsTimeOffQueryParams {
	salonID: string
	start: string
	end: string
	employeeIDs?: (string | null)[] | null
}

export interface ISetDayDetailPayload {
	date: string | null
}

export type ICalendarActions = IResetStore | IGetCalendarEvents | IGetCalendarEventDetail | ISetIsRefreshingEvents | ISetDayDetailDay

interface IGetCalendarEvents {
	type: EVENTS
	enumType: CALENDAR_EVENTS_KEYS
	payload: ICalendarEventsPayload
}

interface IGetCalendarEventDetail {
	type: EVENT_DETAIL
	payload: ICalendarEventDetailPayload
}

export interface ICalendarEventDetailPayload {
	data: CalendarEventDetail | null
}

interface ISetIsRefreshingEvents {
	type: typeof SET_IS_REFRESHING_EVENTS
	payload: boolean
}

interface ISetDayDetailDay {
	type: typeof SET_DAY_DETAIL_DATE
	payload: ISetDayDetailPayload
}

const storedPreviousParams: any = {
	[CALENDAR_EVENTS_KEYS.RESERVATIONS]: {},
	[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS]: {}
}

export const getCalendarEvents =
	(
		enumType: CALENDAR_EVENTS_KEYS = CALENDAR_EVENTS_KEYS.EVENTS,
		queryParams: ICalendarEventsQueryParams,
		splitMultidayEventsIntoOneDayEvents = false,
		clearVirtualEvent = true,
		storePreviousParams = true
	): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		dispatch({ type: EVENTS.EVENTS_LOAD_START, enumType })

		let payload = {} as ICalendarEventsPayload

		try {
			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				categoryIDs: queryParams.categoryIDs,
				employeeIDs: queryParams.employeeIDs,
				eventTypes: queryParams.eventTypes,
				dateFrom: queryParams.start,
				dateTo: queryParams.end,
				reservationStates: queryParams.reservationStates
			}

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/', normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams)

			// employees z Reduxu, budu sa mapovat do eventov
			const employees = {} as any
			data.employees.forEach((employee) => {
				employees[employee.id] = employee
			})

			const editedEvents = data.calendarEvents.reduce((newEventsArray, event) => {
				const editedEvent: CalendarEvent = {
					...event,
					employee: employees[event.employee.id],
					startDateTime: getDateTime(event.start.date, event.start.time),
					endDateTime: getDateTime(event.end.date, event.end.time)
				}

				if (splitMultidayEventsIntoOneDayEvents) {
					const eventStartStartOfDay = dayjs(event.start.date).startOf('day')
					const eventEndStartOfDay = dayjs(event.end.date).startOf('day')

					const isMultipleDayEvent = !eventStartStartOfDay.isSame(eventEndStartOfDay)
					if (isMultipleDayEvent) {
						// kontrola, ci je zaciatok a konec multidnoveho eventu vacsi alebo mensi ako aktualne vybraty rozsah
						// staci nam vytvorit eventy len pre vybrany rozsah
						const rangeStart = dayjs.max(dayjs(queryParams.start).startOf('day'), eventStartStartOfDay)
						const rangeEnd = dayjs.min(dayjs(queryParams.end).startOf('day'), eventEndStartOfDay)
						// rozdiel zaciatku multidnoveho eventu a zaciatku vybrateho rozsahu
						const startDifference = rangeStart.diff(eventStartStartOfDay, 'days')
						// rozdiel konca multidnoveho eventu a konca vybrateho rozsahu
						const endDifference = rangeEnd.diff(eventEndStartOfDay, 'days')
						// pocet eventov, ktore je potrebne vytvorit
						const currentRangeDaysCount = rangeEnd.diff(rangeStart, 'days')

						const multiDayEvents = []

						for (let i = 0; i <= currentRangeDaysCount; i += 1) {
							const newStart = {
								date: dayjs(rangeStart).add(i, 'days').format(DATE_TIME_PARSER_DATE_FORMAT),
								time: i === 0 && !startDifference ? event.start.time : '00:00'
							}

							const newEnd = {
								date: dayjs(rangeStart).add(i, 'days').format(DATE_TIME_PARSER_DATE_FORMAT),
								time: i === currentRangeDaysCount && !endDifference ? event.end.time : '23:59'
							}

							const multiDayEvent = {
								...editedEvent,
								id: `${i}_${event.id}`,
								start: newStart,
								end: newEnd,
								startDateTime: getDateTime(newStart.date, newStart.time),
								endDateTime: getDateTime(newEnd.date, newEnd.time),
								isMultiDayEvent: true,
								isFirstMultiDayEventInCurrentRange: i === 0 && startDifference === 0,
								isLastMultiDaylEventInCurrentRange: i === currentRangeDaysCount && !endDifference,
								originalEvent: editedEvent
							}

							multiDayEvents.push(multiDayEvent)
						}
						return [...newEventsArray, ...multiDayEvents]
					}
				}

				return [...newEventsArray, editedEvent]
			}, [] as CalendarEvent[])

			payload = {
				data: editedEvents
			}

			if (storePreviousParams) {
				storedPreviousParams[enumType] = {
					queryParams,
					splitMultidayEventsIntoOneDayEvents,
					clearVirtualEvent
				}
			}

			dispatch({ type: EVENTS.EVENTS_LOAD_DONE, enumType, payload })
		} catch (err) {
			dispatch({ type: EVENTS.EVENTS_LOAD_FAIL, enumType })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		if (clearVirtualEvent) {
			dispatch(clearEvent())
		}

		return payload
	}

export const getCalendarReservations = (
	queryParams: ICalendarReservationsQueryParams,
	splitMultidayEventsIntoOneDayEvents = false,
	clearVirtualEvent?: boolean
): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(
		CALENDAR_EVENTS_KEYS.RESERVATIONS,
		{
			...queryParams,
			eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION],
			reservationStates: [RESERVATION_STATE.APPROVED, RESERVATION_STATE.PENDING, RESERVATION_STATE.REALIZED, RESERVATION_STATE.NOT_REALIZED]
		},
		splitMultidayEventsIntoOneDayEvents,
		clearVirtualEvent
	)

export const getCalendarShiftsTimeoff = (
	queryParams: ICalendarShiftsTimeOffQueryParams,
	splitMultidayEventsIntoOneDayEvents = false,
	clearVirtualEvent?: boolean
): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(
		CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS,
		{ ...queryParams, eventTypes: [CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT, CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF, CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK] },
		splitMultidayEventsIntoOneDayEvents,
		clearVirtualEvent
	)

export const clearCalendarEvents =
	(enumType: CALENDAR_EVENTS_KEYS = CALENDAR_EVENTS_KEYS.EVENTS): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		dispatch({ type: EVENTS.EVENTS_CLEAR, enumType })
	}

export const clearCalendarReservations = (): ThunkResult<Promise<void>> => clearCalendarEvents(CALENDAR_EVENTS_KEYS.RESERVATIONS)

export const clearCalendarShiftsTimeoffs = (): ThunkResult<Promise<void>> => clearCalendarEvents(CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS)

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

export const updateCalendarEvent =
	(updatedEvent: CalendarEvent): ThunkResult<Promise<CalendarEvent[]>> =>
	async (dispatch, getState) => {
		const events = getState().calendar.events.data || []
		const newEvents = events.map((event) => {
			if (event.id === updatedEvent.id) {
				return { ...event, ...updatedEvent }
			}
			return event
		})

		dispatch({ type: UPDATE_EVENT, newEvents })
		return newEvents
	}

export const refreshEvents =
	(eventsViewType: CALENDAR_EVENTS_VIEW_TYPE): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		const reservation = storedPreviousParams[CALENDAR_EVENTS_KEYS.RESERVATIONS]
		const shiftsTimeOff = storedPreviousParams[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS]

		dispatch({ type: SET_IS_REFRESHING_EVENTS, payload: true })
		if (eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
			await Promise.all([
				dispatch(getCalendarReservations(reservation.queryParams, reservation.splitMultidayEventsIntoOneDayEvents, reservation.clearVirtualEvent)),
				dispatch(getCalendarShiftsTimeoff(shiftsTimeOff.queryParams, shiftsTimeOff.splitMultidayEventsIntoOneDayEvents, shiftsTimeOff.clearVirtualEvent))
			])
		} else if (eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
			await dispatch(getCalendarShiftsTimeoff(shiftsTimeOff.queryParams, shiftsTimeOff.splitMultidayEventsIntoOneDayEvents, shiftsTimeOff.clearVirtualEvent))
		}
		dispatch({ type: SET_IS_REFRESHING_EVENTS, payload: false })
	}

export const setDayDetailDate =
	(date: string | null): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		dispatch({ type: SET_DAY_DETAIL_DATE, payload: { date } })
	}

export const getDayDetialEvents = (
	date: string,
	queryParams: Omit<ICalendarEventsQueryParams, 'reservationStates' | 'start' | 'end'>,
	splitMultidayEventsIntoOneDayEvents = false,
	clearVirtualEvent?: boolean
): ThunkResult<Promise<ICalendarEventsPayload>> => {
	setDayDetailDate(date)
	return getCalendarEvents(CALENDAR_EVENTS_KEYS.DAY_DETAIL, { ...queryParams, start: date, end: date }, splitMultidayEventsIntoOneDayEvents, clearVirtualEvent, false)
}
