/* eslint-disable import/no-cycle */
import dayjs from 'dayjs'
import axios from 'axios'

// types
import { find, map } from 'lodash'
import { ThunkResult } from '../index'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { CalendarEvent, ICalendarEventsPayload, ISearchable, ICalendarEventDetailPayload, ICalendarDayEvents, ICalendarMonthlyReservationsPayload } from '../../types/interfaces'
import {
	ICalendarEventsQueryParams,
	ICalendarReservationsQueryParams,
	ICalendarShiftsTimeOffQueryParams,
	IGetNotinoReservationsQueryParams,
	IGetSalonReservationsQueryParams
} from '../../schemas/queryParams'

// enums
import {
	EVENTS,
	EVENT_DETAIL,
	MONTHLY_RESERVATIONS,
	SET_DAY_EVENTS,
	RESERVATIONS,
	SET_IS_REFRESHING_EVENTS,
	NOTINO_RESERVATIONS,
	PENDING_RESERVATIONS_COUNT
} from './calendarTypes'
import {
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENT_TYPE,
	DATE_TIME_PARSER_DATE_FORMAT,
	RESERVATION_STATE,
	RESERVATION_SOURCE_TYPE,
	RESERVATION_PAYMENT_METHOD,
	CANCEL_TOKEN_MESSAGES,
	MONTHLY_RESERVATIONS_KEY,
	CALENDAR_DATE_FORMAT,
	RESERVATION_FROM_IMPORT
} from '../../utils/enums'

// utils
import { getReq } from '../../utils/request'
import { formatDateByLocale, getAssignedUserLabel, getDateTime, normalizeDataById, normalizeQueryParams, transalteReservationSourceType } from '../../utils/helper'
import { compareAndSortDayEvents, compareMonthlyReservations, getMonthlyReservationCalendarEventId } from '../../pages/Calendar/calendarHelpers'

// redux
import { clearEvent } from '../virtualEvent/virtualEventActions'
import { setCalendarEmployees } from '../calendarEmployees/calendarEmployeesActions'

// query params types
type CalendarEventsQueryParams = Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.QueryParameters & Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.PathParameters

// action types
export type ICalendarActions =
	| IResetStore
	| IGetCalendarEvents
	| IGetCalendarMonthlyViewReservations
	| IGetCalendarEventDetail
	| ISetIsRefreshingEvents
	| ISetDayEvents
	| IGetSalonReservations
	| IGetNotinoReservations
	| IGetPendingReservationsCount

export interface ISalonReservationsPayload extends ISearchable<Paths.GetApiB2BAdminSalonsSalonIdCalendarEventsPaginated.Responses.$200> {
	tableData: ISalonReservationsTableData[]
}

export interface INotinoReservationsPayload extends ISearchable<Paths.GetApiB2BAdminCalendarEventsReservations.Responses.$200> {
	tableData: INotinoReservationsTableData[]
}

interface IGetNotinoReservations {
	type: NOTINO_RESERVATIONS
	payload: INotinoReservationsPayload
}
export interface IPendingReservationsCount {
	count: number
}

interface IGetPendingReservationsCount {
	type: PENDING_RESERVATIONS_COUNT
	payload: IPendingReservationsCount
}

interface IGetCalendarEvents {
	type: EVENTS
	enumType: CALENDAR_EVENTS_KEYS
	payload: ICalendarEventsPayload
}

interface IGetCalendarMonthlyViewReservations {
	type: MONTHLY_RESERVATIONS
	payload: ICalendarMonthlyReservationsPayload
}

interface IGetCalendarEventDetail {
	type: EVENT_DETAIL
	payload: ICalendarEventDetailPayload
}

interface ISetIsRefreshingEvents {
	type: typeof SET_IS_REFRESHING_EVENTS
	payload: boolean
}

interface ISetDayEvents {
	type: typeof SET_DAY_EVENTS
	payload: ICalendarDayEvents
}
interface ISalonReservationsTableData {
	key: string
	startDate: string | null
	time: string
	createdAt: string | null
	createSourceType: string
	state: RESERVATION_STATE
	employee: any // TODO: optypovat
	customer: any
	service: any
	paymentMethod: RESERVATION_PAYMENT_METHOD
}
export interface INotinoReservationsTableData {
	key: string
	id: string
	salon: {
		name: string
		id: string
		deletedAt?: string
	}
	createdAt: string
	startDate: string
	time: string
	customer: {
		name: string
		thumbnail?: string
		originalImage?: string
		deletedAt?: string
	}
	service: {
		name: string
		thumbnail?: string
		originalImage?: string
		deletedAt?: string
	}
	employee: {
		name: string
		thumbnail?: string
		originalImage?: string
		deletedAt?: string
	}
	createSourceType: string
	state?: RESERVATION_STATE
	paymentMethod?: RESERVATION_PAYMENT_METHOD
	deletedAt?: string
}

export interface IGetSalonReservations {
	type: RESERVATIONS
	payload: ISalonReservationsPayload
}

const storedPreviousParams: any = {
	[MONTHLY_RESERVATIONS_KEY]: {},
	[CALENDAR_EVENTS_KEYS.RESERVATIONS]: {},
	[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS]: {}
}

const RESERVATION_STATES = [RESERVATION_STATE.APPROVED, RESERVATION_STATE.PENDING, RESERVATION_STATE.REALIZED, RESERVATION_STATE.NOT_REALIZED]

export const getCalendarEventsCancelTokenKey = (enumType: CALENDAR_EVENTS_KEYS) => `calendar-events-${enumType}`

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
				isFirstMultiDayEventInCurrentRange: i === 0 && startDifference === 0, // ak vytvaram event z multidnoveho eventu o trvani 2-5.1.2023, tak toto bude true v pripade, ze startTime je 2.1
				isLastMultiDaylEventInCurrentRange: i === currentRangeDaysCount && !endDifference, // ak vytvaram event z multidnoveho eventu o trvani 2-5.1.2023, tak toto bude true v pripade, ze endTime je 5.1
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

			const { data } = await getReq(
				'/api/b2b/admin/salons/{salonID}/calendar-events/',
				normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams,
				undefined,
				undefined,
				undefined,
				true,
				getCalendarEventsCancelTokenKey(enumType)
			)

			// employees sa mapuju do eventov
			const { data: calendarEmployees } = dispatch(setCalendarEmployees(data.employees))

			const employees = normalizeDataById(calendarEmployees)

			const editedEvents = data.calendarEvents.reduce((newEventsArray, event) => {
				const editedEvent: CalendarEvent = {
					...event,
					employee: employees[event.employee.id],
					startDateTime: getDateTime(event.start.date, event.start.time),
					endDateTime: getDateTime(event.end.date, event.end.time),
					isImported: event.eventType === RESERVATION_FROM_IMPORT,
					eventType: event.eventType === RESERVATION_FROM_IMPORT ? CALENDAR_EVENT_TYPE.RESERVATION : event.eventType
				}

				/**
				 * priprava na viacdnove eventy - v dennom a tyzdennom view ich potrebujeme rozdelit na jednodnove eventy
				 */
				if (splitMultidayEventsIntoOneDayEvents) {
					return [...newEventsArray, ...createMultiDayEvents(editedEvent, queryParams.start, queryParams.end)]
				}

				return [...newEventsArray, editedEvent]
			}, [] as CalendarEvent[])

			let eventsWithDayLimit: CalendarEvent[] = []
			if (eventsDayLimit) {
				const sortedEvents = [...editedEvents].sort((a, b) => {
					const aData = {
						start: a.startDateTime,
						end: a.endDateTime,
						id: a.id,
						employeeId: a.employee.id,
						eventType: a.eventType as CALENDAR_EVENT_TYPE,
						orderIndex: a.employee.orderIndex
					}
					const bData = {
						start: b.startDateTime,
						end: b.endDateTime,
						id: b.id,
						employeeId: b.employee.id,
						eventType: b.eventType as CALENDAR_EVENT_TYPE,
						orderIndex: b.employee.orderIndex
					}
					return compareAndSortDayEvents(aData, bData)
				})

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

			dispatch({ type: EVENTS.EVENTS_LOAD_DONE, enumType, payload })
		} catch (err) {
			if (axios.isCancel(err) && (err as any)?.message === CANCEL_TOKEN_MESSAGES.CANCELED_DUE_TO_NEW_REQUEST) {
				// Request bol preruseny novsim requestom, tym padom chceme, aby loading state pokracoval
				dispatch({ type: EVENTS.EVENTS_LOAD_START, enumType })
			} else {
				dispatch({ type: EVENTS.EVENTS_LOAD_FAIL, enumType })
			}
			// eslint-disable-next-line no-console
			console.error(err)
		}

		if (storePreviousParams) {
			storedPreviousParams[enumType] = {
				queryParams,
				splitMultidayEventsIntoOneDayEvents,
				clearVirtualEvent,
				eventsDayLimit
			}
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
			eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION, RESERVATION_FROM_IMPORT],
			reservationStates: RESERVATION_STATES
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

export const clearCalendarMonthlyReservations = (): ThunkResult<Promise<void>> => async (dispatch) => {
	dispatch({ type: MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_CLEAR })
}

export const clearCalendarShiftsTimeoffs = (): ThunkResult<Promise<void>> => clearCalendarEvents(CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS)

export const getCalendarMonthlyViewReservations =
	(queryParams: ICalendarReservationsQueryParams, clearVirtualEvent?: boolean, storePreviousParams = true): ThunkResult<Promise<ICalendarMonthlyReservationsPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarMonthlyReservationsPayload
		try {
			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				categoryIDs: queryParams.categoryIDs,
				employeeIDs: queryParams.employeeIDs,
				eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION, RESERVATION_FROM_IMPORT],
				dateFrom: queryParams.start,
				dateTo: queryParams.end,
				reservationStates: RESERVATION_STATES
			}

			dispatch({ type: MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_LOAD_START })

			const { data } = await getReq(
				'/api/b2b/admin/salons/{salonID}/calendar-events/counts-and-durations',
				normalizeQueryParams(queryParamsEditedForRequest) as CalendarEventsQueryParams,
				undefined,
				undefined,
				undefined,
				true,
				MONTHLY_RESERVATIONS_KEY
			)

			// employees sa mapuju do eventov
			const { data: calendarEmployees } = dispatch(setCalendarEmployees(data.employees))
			const employees = normalizeDataById(calendarEmployees)

			const editedData = Object.entries(data.calendarEvents).reduce((acc, [key, value]) => {
				const formatedDay = dayjs(key).format(CALENDAR_DATE_FORMAT.QUERY)
				return {
					...acc,
					[dayjs(key).format(CALENDAR_DATE_FORMAT.QUERY)]: value
						.map((day) => ({
							id: getMonthlyReservationCalendarEventId(formatedDay, day.employeeID),
							employee: employees[day.employeeID],
							eventsCount: day.eventsCount,
							eventsDuration: day.eventsDuration
						}))
						.sort((a, b) => compareMonthlyReservations(a.employee.orderIndex, b.employee.orderIndex))
				}
			}, {} as ICalendarMonthlyReservationsPayload['data'])

			payload = {
				data: editedData
			}
			dispatch({ type: MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_LOAD_DONE, payload })
		} catch (err) {
			if (axios.isCancel(err) && (err as any)?.message === CANCEL_TOKEN_MESSAGES.CANCELED_DUE_TO_NEW_REQUEST) {
				// Request bol preruseny novsim requestom, tym padom chceme, aby loading state pokracoval
				dispatch({ type: MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_LOAD_START })
			} else {
				dispatch({ type: MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_LOAD_FAIL })
			}
			// eslint-disable-next-line no-console
			console.error(err)
		}

		if (storePreviousParams) {
			storedPreviousParams[MONTHLY_RESERVATIONS_KEY] = {
				queryParams,
				clearVirtualEvent
			}
		}

		if (clearVirtualEvent) {
			dispatch(clearEvent())
		}

		return payload
	}

export const refreshEvents =
	(eventsViewType: CALENDAR_EVENTS_VIEW_TYPE, isMonthlyView = false): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		const reservation = storedPreviousParams[CALENDAR_EVENTS_KEYS.RESERVATIONS]
		const shiftsTimeOff = storedPreviousParams[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS]
		const monthlyReservations = storedPreviousParams[MONTHLY_RESERVATIONS_KEY]

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
				if (isMonthlyView) {
					await dispatch(getCalendarMonthlyViewReservations(monthlyReservations.queryParams, monthlyReservations.clearEvent, true))
				} else {
					await Promise.all([
						dispatch(
							getCalendarReservations(
								reservation.queryParams,
								reservation.splitMultidayEventsIntoOneDayEvents,
								reservation.clearVirtualEvent,
								true,
								reservation.eventsDayLimit
							)
						),
						dispatch(dispatchShiftsTimeOff)
					])
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

export const getCalendarEventDetail =
	(salonID: string, calendarEventID: string): ThunkResult<Promise<ICalendarEventDetailPayload>> =>
	async (dispatch) => {
		let payload = {} as ICalendarEventDetailPayload
		try {
			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}', { calendarEventID, salonID }, undefined, undefined, undefined, true)

			payload = {
				data: {
					...data.calendarEvent,
					eventType: data.calendarEvent.eventType === RESERVATION_FROM_IMPORT ? CALENDAR_EVENT_TYPE.RESERVATION : data.calendarEvent.eventType,
					isImported: data.calendarEvent.eventType === RESERVATION_FROM_IMPORT
				}
			}

			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EVENT_DETAIL.EVENT_DETAIL_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getPaginatedReservations =
	(queryParams: IGetSalonReservationsQueryParams): ThunkResult<Promise<ISalonReservationsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonReservationsPayload
		try {
			const queryParamsEditedForRequest = {
				salonID: queryParams.salonID,
				dateFrom: queryParams.dateFrom,
				dateTo: queryParams.dateTo,
				createdAtFrom: queryParams.createdAtFrom,
				createdAtTo: queryParams.createdAtTo,
				reservationStates: queryParams.reservationStates,
				employeeIDs: queryParams.employeeIDs,
				reservationPaymentMethods: queryParams.reservationPaymentMethods,
				reservationCreateSourceType: queryParams.reservationCreateSourceType,
				categoryIDs: queryParams.categoryIDs,
				limit: queryParams.limit,
				page: queryParams.page,
				order: queryParams.order
			}

			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/paginated', {
				...(normalizeQueryParams(queryParamsEditedForRequest) as any),
				eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION, RESERVATION_FROM_IMPORT]
			})

			const tableData: ISalonReservationsTableData[] = map(data.calendarEvents, (event) => {
				const employee = find(data.employees, { id: event.employee.id })
				return {
					id: event.id,
					key: event.id,
					startDate: formatDateByLocale(event.start.date, true) as string,
					time: `${event.start.time} - ${event.end.time}`,
					createdAt: formatDateByLocale(event.createdAt, true) as string,
					createSourceType: transalteReservationSourceType(event.reservationData?.createSourceType as RESERVATION_SOURCE_TYPE),
					state: event.reservationData?.state as RESERVATION_STATE,
					employee,
					customer: event.customer,
					service: event.service,
					paymentMethod: event.reservationData?.paymentMethod as RESERVATION_PAYMENT_METHOD
				}
			})
			payload = {
				data,
				tableData
			}
			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: RESERVATIONS.RESERVATIONS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getNotinoReservations =
	(queryParams: IGetNotinoReservationsQueryParams): ThunkResult<Promise<any>> =>
	async (dispatch) => {
		let payload = {} as INotinoReservationsPayload
		try {
			const queryParamsEditedForRequest = {
				search: queryParams.search,
				dateFrom: queryParams.dateFrom,
				dateTo: queryParams.dateTo,
				countryCode: queryParams.countryCode,
				createdAtFrom: queryParams.createdAtFrom,
				createdAtTo: queryParams.createdAtTo,
				reservationStates: queryParams.reservationStates,
				reservationPaymentMethods: queryParams.reservationPaymentMethods,
				reservationCreateSourceType: queryParams.reservationCreateSourceType,
				categoryFirstLevelIDs: queryParams.categoryFirstLevelIDs,
				limit: queryParams.limit,
				page: queryParams.page,
				order: queryParams.order
			}

			dispatch({ type: NOTINO_RESERVATIONS.NOTINO_RESERVATIONS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/calendar-events/reservations', {
				...(normalizeQueryParams(queryParamsEditedForRequest) as any)
			})
			const tableData: INotinoReservationsTableData[] = map(data.reservations, (reservation) => {
				const item: INotinoReservationsTableData = {
					key: reservation.id,
					id: reservation.id,
					salon: {
						id: reservation.salon.id || '',
						name: reservation.salon.name || '-',
						deletedAt: reservation.salon.deletedAt
					},
					createdAt: formatDateByLocale(reservation.createdAt) || '-',
					startDate: formatDateByLocale(reservation.start.date, true) || '-',
					time: `${reservation.start.time} - ${reservation.end.time}`,
					customer: {
						name: getAssignedUserLabel(reservation.customer),
						thumbnail: reservation.customer?.profileImage?.resizedImages?.thumbnail,
						originalImage: reservation.customer?.profileImage?.original,
						deletedAt: reservation.customer?.deletedAt
					},
					service: {
						name: reservation.service?.name || '-',
						thumbnail: reservation.service?.icon?.resizedImages?.thumbnail,
						originalImage: reservation.service?.icon?.original,
						deletedAt: reservation.service?.deletedAt
					},
					employee: {
						name: getAssignedUserLabel(reservation.employee),
						thumbnail: reservation.employee?.image?.resizedImages?.thumbnail,
						originalImage: reservation.employee?.image?.original,
						deletedAt: reservation.employee?.deletedAt
					},
					createSourceType: transalteReservationSourceType(reservation.reservationData?.createSourceType as RESERVATION_SOURCE_TYPE),
					state: reservation.reservationData?.state as RESERVATION_STATE,
					paymentMethod: reservation.reservationData?.paymentMethod as RESERVATION_PAYMENT_METHOD,
					deletedAt: formatDateByLocale(reservation.deletedAt) || undefined
				}

				return item
			})
			payload = {
				data,
				tableData
			}
			dispatch({ type: NOTINO_RESERVATIONS.NOTINO_RESERVATIONS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: NOTINO_RESERVATIONS.NOTINO_RESERVATIONS_LOAD_FAIL })
		}
	}

export const getPendingReservationsCount =
	(salonID?: string): ThunkResult<Promise<IPendingReservationsCount>> =>
	async (dispatch) => {
		let payload = {} as IPendingReservationsCount
		try {
			dispatch({ type: PENDING_RESERVATIONS_COUNT.PENDING_RESERVATIONS_COUNT_LOAD_START })
			if (salonID) {
				const { data } = await getReq('/api/b2b/admin/salons/{salonID}/calendar-events/paginated', {
					salonID,
					limit: 1,
					page: 1,
					eventTypes: [CALENDAR_EVENT_TYPE.RESERVATION],
					reservationStates: [RESERVATION_STATE.PENDING]
				})

				payload = {
					count: data.pagination.totalCount
				}
			} else {
				payload = {
					count: 0
				}
			}
			dispatch({ type: PENDING_RESERVATIONS_COUNT.PENDING_RESERVATIONS_COUNT_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: PENDING_RESERVATIONS_COUNT.PENDING_RESERVATIONS_COUNT_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
