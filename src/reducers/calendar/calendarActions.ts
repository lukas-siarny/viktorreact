/* eslint-disable import/no-cycle */
import dayjs from 'dayjs'

// types
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// enums
import { EVENTS, EVENT_DETAIL } from './calendarTypes'
import { CALENDAR_EVENTS_KEYS, CALENDAR_VIEW, CALENDAR_EVENT_TYPE, DATE_TIME_PARSER_DATE_FORMAT, RESERVATION_STATE } from '../../utils/enums'

// utils
import { getReq } from '../../utils/request'
import { getSelectedDateRange } from '../../pages/Calendar/calendarHelpers'
import { getDateTime, normalizeQueryParams } from '../../utils/helper'

export type CalendarEvents = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['calendarEvents']
export type CalendarEvent = CalendarEvents[0] & {
	startDateTime: string
	endDateTime: string
	isMultiDayEvent?: boolean
	isFirstMultiDayEventInCurrentRange?: boolean
	isLastMultiDaylEventInCurrentRange?: boolean
	originalEvent?: CalendarEvent
}
type CalendarEventsQueryParams = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.QueryParameters & Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.PathParameters

export type CalendarEventDetail = Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsCalendarEventId.Responses.$200['calendarEvent']

interface ICalendarEventsQueryParams {
	salonID: string
	date: string
	employeeIDs?: (string | null)[] | null
	categoryIDs?: (string | null)[] | null
	eventTypes?: (string | null)[] | null
	reservationStates?: (string | null)[] | null
}

interface ICalendarReservationsQueryParams {
	salonID: string
	date: string
	employeeIDs?: (string | null)[] | null
	categoryIDs?: (string | null)[] | null
	reservationStates?: (string | null)[] | null
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
	(
		enumType: CALENDAR_EVENTS_KEYS = CALENDAR_EVENTS_KEYS.EVENTS,
		queryParams: ICalendarEventsQueryParams,
		view: CALENDAR_VIEW,
		splitMultidayEventsIntoOneDayEvents = false
	): ThunkResult<Promise<ICalendarEventsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventsPayload

		try {
			const { start, end } = getSelectedDateRange(view, queryParams.date)

			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				categoryIDs: queryParams.categoryIDs,
				employeeIDs: queryParams.employeeIDs,
				eventTypes: queryParams.eventTypes,
				dateFrom: start,
				dateTo: end,
				reservationStates: queryParams.reservationStates
			}

			dispatch({ type: EVENTS.EVENTS_LOAD_START, enumType })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/', normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams)

			const editedEvents = data.calendarEvents.reduce((newEventsArray, event) => {
				const editedEvent: CalendarEvent = {
					...event,
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
						const rangeStart = dayjs.max(dayjs(start).startOf('day'), eventStartStartOfDay)
						const rangeEnd = dayjs.min(dayjs(end).startOf('day'), eventEndStartOfDay)
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

			dispatch({ type: EVENTS.EVENTS_LOAD_DONE, enumType, payload })
		} catch (err) {
			dispatch({ type: EVENTS.EVENTS_LOAD_FAIL, enumType })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getCalendarReservations = (
	queryParams: ICalendarReservationsQueryParams,
	view: CALENDAR_VIEW,
	splitMultidayEventsIntoOneDayEvents = false
): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(
		CALENDAR_EVENTS_KEYS.RESERVATIONS,
		{
			...queryParams,
			eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION],
			reservationStates: [RESERVATION_STATE.APPROVED, RESERVATION_STATE.PENDING, RESERVATION_STATE.REALIZED, RESERVATION_STATE.NOT_REALIZED]
		},
		view,
		splitMultidayEventsIntoOneDayEvents
	)

export const getCalendarShiftsTimeoff = (
	queryParams: ICalendarShiftsTimeOffQueryParams,
	view: CALENDAR_VIEW,
	splitMultidayEventsIntoOneDayEvents = false
): ThunkResult<Promise<ICalendarEventsPayload>> =>
	getCalendarEvents(
		CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS,
		{ ...queryParams, eventTypes: [CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT, CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF, CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK] },
		view,
		splitMultidayEventsIntoOneDayEvents
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
