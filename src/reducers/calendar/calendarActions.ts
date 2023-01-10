import dayjs from 'dayjs'
import { CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENTS_KEYS, CALENDAR_EVENT_TYPE, DATE_TIME_PARSER_DATE_FORMAT, RESERVATION_STATE } from '../../utils/enums'
/* eslint-disable import/no-cycle */

// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { CalendarEvent, ICalendarDayEvents, ICalendarEventsPayload } from '../../types/interfaces'

// enums
import { EVENTS, EVENT_DETAIL, SET_DAY_DETAIL_DATE, SET_IS_REFRESHING_EVENTS, UPDATE_EVENT, SET_DAY_EVENTS } from './calendarTypes'

// utils
import { getReq } from '../../utils/request'
import { getDateTime, normalizeQueryParams } from '../../utils/helper'

import { clearEvent } from '../virtualEvent/virtualEventActions'
import fakeEvents from './events'
import { compareDayEventsDates } from '../../pages/Calendar/calendarHelpers'

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

export type ICalendarActions = IResetStore | IGetCalendarEvents | IGetCalendarEventDetail | ISetIsRefreshingEvents | ISetDayDetailDay | ISetDayEvents

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

interface ISetDayEvents {
	type: typeof SET_DAY_EVENTS
	payload: ICalendarDayEvents
}

const storedPreviousParams: any = {
	[CALENDAR_EVENTS_KEYS.RESERVATIONS]: {},
	[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS]: {}
}

export const setDayEvents =
	(dayEvents: ICalendarDayEvents): ThunkResult<Promise<ICalendarDayEvents>> =>
	async (dispatch) => {
		dispatch({ type: SET_DAY_EVENTS, payload: dayEvents })
		return dayEvents
	}

export const createMultiDayEvents = (event: CalendarEvent, queryParamsStart: string, queryParamsEnd: string, pushToArray = true, multiDayEventsObject?: ICalendarDayEvents) => {
	const eventStartStartOfDay = dayjs(event.start.date).startOf('day')
	const eventEndStartOfDay = dayjs(event.end.date).startOf('day')

	const isMultipleDayEvent = !eventStartStartOfDay.isSame(eventEndStartOfDay)

	if (isMultipleDayEvent) {
		const multiDayEventsArray: CalendarEvent[] = []
		// kontrola, ci je zaciatok a konec multidnoveho eventu vacsi alebo mensi ako aktualne vybraty rozsah
		// staci nam vytvorit eventy len pre vybrany rozsah
		const rangeStart = dayjs.max(dayjs(queryParamsStart).startOf('day'), eventStartStartOfDay)
		const rangeEnd = dayjs.min(dayjs(queryParamsEnd).startOf('day'), eventEndStartOfDay)
		// rozdiel zaciatku multidnoveho eventu a zaciatku vybrateho rozsahu
		const startDifference = rangeStart.diff(eventStartStartOfDay, 'days')
		// rozdiel konca multidnoveho eventu a konca vybrateho rozsahu
		const endDifference = rangeEnd.diff(eventEndStartOfDay, 'days')
		// pocet eventov, ktore je potrebne vytvorit
		const currentRangeDaysCount = rangeEnd.diff(rangeStart, 'days')

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
				...event,
				id: `${event.id}_${i}`,
				start: newStart,
				end: newEnd,
				startDateTime: getDateTime(newStart.date, newStart.time),
				endDateTime: getDateTime(newEnd.date, newEnd.time),
				isMultiDayEvent: true,
				isFirstMultiDayEventInCurrentRange: i === 0 && startDifference === 0,
				isLastMultiDaylEventInCurrentRange: i === currentRangeDaysCount && !endDifference,
				originalEvent: event
			}

			if (multiDayEventsObject) {
				if (multiDayEventsObject[newStart.date]) {
					multiDayEventsObject[newStart.date].push(multiDayEvent)
				} else {
					// eslint-disable-next-line no-param-reassign
					multiDayEventsObject[newStart.date] = [multiDayEvent]
				}
			}

			if (pushToArray) {
				multiDayEventsArray.push(multiDayEvent)
			}
		}

		return multiDayEventsArray
	}
	if (multiDayEventsObject) {
		if (multiDayEventsObject[event.start.date]) {
			multiDayEventsObject[event.start.date].push(event)
		} else {
			// eslint-disable-next-line no-param-reassign
			multiDayEventsObject[event.start.date] = [event]
		}
	}
	return [event]
}

export const getCalendarEvents =
	(
		enumType: CALENDAR_EVENTS_KEYS = CALENDAR_EVENTS_KEYS.EVENTS,
		queryParams: ICalendarEventsQueryParams,
		splitMultidayEventsIntoOneDayEvents = false,
		clearVirtualEvent = true,
		storePreviousParams = true,
		eventsDayLimit = 0
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

			// employees sa mapuju do eventov
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
					return [...newEventsArray, ...createMultiDayEvents(editedEvent, queryParams.start, queryParams.end)]
				}

				return [...newEventsArray, editedEvent]
			}, [] as CalendarEvent[])

			let eventsWithDayLimit: CalendarEvent[] = []
			if (eventsDayLimit) {
				const sortedEvents = [...editedEvents].sort((a, b) => compareDayEventsDates(a.startDateTime, a.endDateTime, b.startDateTime, b.endDateTime, a.id, b.id))

				// multidnove eventy pre popover je potrebne rozdelit na jednotlive dni
				const dividedEventsIntoDays: ICalendarDayEvents = {}
				// multidnove eventy do kalendara je zasa potrebne nechat v celku
				const dividedEventsIntoDaysWithMultidayEvents: ICalendarDayEvents = {}

				sortedEvents.forEach((event) => {
					if (dividedEventsIntoDays[event.start.date]) {
						dividedEventsIntoDays[event.start.date].push(event)
					} else {
						// eslint-disable-next-line no-param-reassign
						dividedEventsIntoDays[event.start.date] = [event]
					}
					// v pripade, ze este nie su rozdelene multidnove eventy na jednodnove, tak to je pre eventy pre popup potrebne spravit
					if (!splitMultidayEventsIntoOneDayEvents) {
						createMultiDayEvents(event, queryParams.start, queryParams.end, false, dividedEventsIntoDaysWithMultidayEvents)
					}
				})

				dispatch(setDayEvents(splitMultidayEventsIntoOneDayEvents ? dividedEventsIntoDays : dividedEventsIntoDaysWithMultidayEvents))

				Object.values(dividedEventsIntoDays).forEach((day) => {
					eventsWithDayLimit = [...eventsWithDayLimit, ...day.slice(0, eventsDayLimit)]
				})
			}

			payload = {
				data: eventsDayLimit ? eventsWithDayLimit : editedEvents
			}

			if (storePreviousParams) {
				storedPreviousParams[enumType] = {
					queryParams,
					splitMultidayEventsIntoOneDayEvents,
					clearVirtualEvent,
					eventsDayLimit
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
	clearVirtualEvent?: boolean,
	storePreviousParams = true,
	eventsDayLimit = 0
): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(
		CALENDAR_EVENTS_KEYS.RESERVATIONS,
		{
			...queryParams,
			eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION],
			reservationStates: [RESERVATION_STATE.APPROVED, RESERVATION_STATE.PENDING, RESERVATION_STATE.REALIZED, RESERVATION_STATE.NOT_REALIZED]
		},
		splitMultidayEventsIntoOneDayEvents,
		clearVirtualEvent,
		storePreviousParams,
		eventsDayLimit
	)

export const getCalendarShiftsTimeoff = (
	queryParams: ICalendarShiftsTimeOffQueryParams,
	splitMultidayEventsIntoOneDayEvents = false,
	clearVirtualEvent?: boolean,
	storePreviousParams = true,
	eventsDayLimit = 0
): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(
		CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS,
		{ ...queryParams, eventTypes: [CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT, CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF, CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK] },
		splitMultidayEventsIntoOneDayEvents,
		clearVirtualEvent,
		storePreviousParams,
		eventsDayLimit
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
	(eventsViewType: CALENDAR_EVENTS_VIEW_TYPE, isMonthlyView = false): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		const reservation = storedPreviousParams[CALENDAR_EVENTS_KEYS.RESERVATIONS]
		const shiftsTimeOff = storedPreviousParams[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS]

		try {
			dispatch({ type: SET_IS_REFRESHING_EVENTS, payload: true })
			const dispatchShiftsTimeOff = getCalendarShiftsTimeoff(
				shiftsTimeOff.queryParams,
				shiftsTimeOff.splitMultidayEventsIntoOneDayEvents,
				shiftsTimeOff.clearVirtualEvent,
				true,
				shiftsTimeOff.eventsDayLimit
			)

			if (eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
				const dispatchReservations = getCalendarReservations(
					reservation.queryParams,
					reservation.splitMultidayEventsIntoOneDayEvents,
					reservation.clearVirtualEvent,
					true,
					reservation.eventsDayLimit
				)

				if (isMonthlyView) {
					await dispatch(dispatchReservations)
				} else {
					await Promise.all([dispatch(dispatchReservations), dispatch(dispatchShiftsTimeOff)])
				}
			} else if (eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
				await dispatch(dispatchShiftsTimeOff)
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		} finally {
			dispatch({ type: SET_IS_REFRESHING_EVENTS, payload: false })
		}
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
