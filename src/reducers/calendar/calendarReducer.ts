/* eslint-disable import/no-cycle */
import { MONTHLY_RESERVATIONS_KEY, CALENDAR_EVENTS_KEYS } from '../../utils/enums'
import {
	MONTHLY_RESERVATIONS,
	SET_DAY_EVENTS,
	EVENTS,
	EVENT_DETAIL,
	SET_IS_REFRESHING_EVENTS,
	RESERVATIONS,
	NOTINO_RESERVATIONS,
	PENDING_RESERVATIONS_COUNT
} from './calendarTypes'
import { RESET_STORE } from '../generalTypes'
import { ICalendarActions, INotinoReservationsPayload, IPendingReservationsCount, ISalonReservationsPayload } from './calendarActions'
import { ICalendarEventsPayload, ILoadingAndFailure, ICalendarEventDetailPayload, ICalendarDayEvents, ICalendarMonthlyReservationsPayload } from '../../types/interfaces'

export const initState = {
	[CALENDAR_EVENTS_KEYS.EVENTS]: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventsPayload & ILoadingAndFailure,
	[CALENDAR_EVENTS_KEYS.RESERVATIONS]: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventsPayload & ILoadingAndFailure,
	[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS]: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventsPayload & ILoadingAndFailure,
	[MONTHLY_RESERVATIONS_KEY]: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarMonthlyReservationsPayload & ILoadingAndFailure,
	eventDetail: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventDetailPayload & ILoadingAndFailure,
	dayEvents: {} as ICalendarDayEvents,
	isRefreshingEvents: false,
	paginatedReservations: {
		data: null,
		tableData: [],
		isLoading: false,
		isFailure: false
	} as ISalonReservationsPayload & ILoadingAndFailure,
	notinoReservations: {
		data: null,
		tableData: [],
		isLoading: false,
		isFailure: false
	} as INotinoReservationsPayload & ILoadingAndFailure,
	pendingReservationsCount: {
		count: 0,
		isLoading: false,
		isFailure: false
	} as IPendingReservationsCount & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICalendarActions) => {
	switch (action.type) {
		// Events
		case EVENTS.EVENTS_LOAD_START:
			return {
				...state,
				[action.enumType]: {
					...state[action.enumType],
					isLoading: true
				}
			}
		case EVENTS.EVENTS_LOAD_FAIL:
			return {
				...state,
				[action.enumType]: {
					...state[action.enumType],
					isFailure: true,
					isLoading: false
				}
			}
		case EVENTS.EVENTS_LOAD_DONE:
			return {
				...state,
				[action.enumType]: {
					...initState[action.enumType],
					data: action.payload.data
				}
			}
		case MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_LOAD_START:
			return {
				...state,
				[MONTHLY_RESERVATIONS_KEY]: {
					...state[MONTHLY_RESERVATIONS_KEY],
					isLoading: true
				}
			}
		case MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_LOAD_FAIL:
			return {
				...state,
				[MONTHLY_RESERVATIONS_KEY]: {
					...state[MONTHLY_RESERVATIONS_KEY],
					isFailure: true,
					isLoading: false
				}
			}
		case MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_LOAD_DONE:
			return {
				...state,
				[MONTHLY_RESERVATIONS_KEY]: {
					...initState[MONTHLY_RESERVATIONS_KEY],
					data: action.payload.data
				}
			}
		// Event detail
		case EVENT_DETAIL.EVENT_DETAIL_LOAD_START:
			return {
				...state,
				eventDetail: {
					...state.eventDetail,
					isLoading: true
				}
			}
		case EVENT_DETAIL.EVENT_DETAIL_LOAD_FAIL:
			return {
				...state,
				eventDetail: {
					...initState.eventDetail,
					isFailure: true
				}
			}
		case EVENT_DETAIL.EVENT_DETAIL_LOAD_DONE:
			return {
				...state,
				eventDetail: {
					...initState.eventDetail,
					data: action.payload.data
				}
			}
		// set day events
		case SET_DAY_EVENTS:
			return {
				...state,
				dayEvents: action.payload
			}
		// clear events
		case EVENTS.EVENTS_CLEAR:
			return {
				...state,
				[action.enumType]: {
					...state[action.enumType],
					data: null
				}
			}
		// clear events
		case MONTHLY_RESERVATIONS.MONTHLY_RESERVATIONS_CLEAR:
			return {
				...state,
				[MONTHLY_RESERVATIONS_KEY]: {
					...state[MONTHLY_RESERVATIONS_KEY],
					data: null
				}
			}
		// Refreshing events
		case SET_IS_REFRESHING_EVENTS:
			return {
				...state,
				isRefreshingEvents: action.payload
			}
		// Salon Reservations
		case RESERVATIONS.RESERVATIONS_LOAD_START:
			return {
				...state,
				paginatedReservations: {
					...state.paginatedReservations,
					isLoading: true
				}
			}
		case RESERVATIONS.RESERVATIONS_LOAD_FAIL:
			return {
				...state,
				paginatedReservations: {
					...initState.paginatedReservations,
					isFailure: true
				}
			}
		case RESERVATIONS.RESERVATIONS_LOAD_DONE:
			return {
				...state,
				paginatedReservations: {
					...initState.paginatedReservations,
					data: action.payload.data,
					tableData: action.payload.tableData
				}
			}
		// Notino Reservations
		case NOTINO_RESERVATIONS.NOTINO_RESERVATIONS_LOAD_START:
			return {
				...state,
				notinoReservations: {
					...state.notinoReservations,
					isLoading: true
				}
			}
		case NOTINO_RESERVATIONS.NOTINO_RESERVATIONS_LOAD_FAIL:
			return {
				...state,
				notinoReservations: {
					...initState.notinoReservations,
					isFailure: true
				}
			}
		case NOTINO_RESERVATIONS.NOTINO_RESERVATIONS_LOAD_DONE:
			return {
				...state,
				notinoReservations: {
					...initState.notinoReservations,
					data: action.payload.data,
					tableData: action.payload.tableData
				}
			}
		// Pending Reservations count
		case PENDING_RESERVATIONS_COUNT.PENDING_RESERVATIONS_COUNT_LOAD_START:
			return {
				...state,
				pendingReservationsCount: {
					...state.pendingReservationsCount,
					isLoading: true
				}
			}
		case PENDING_RESERVATIONS_COUNT.PENDING_RESERVATIONS_COUNT_LOAD_FAIL:
			return {
				...state,
				pendingReservationsCount: {
					...initState.pendingReservationsCount,
					isFailure: true
				}
			}
		case PENDING_RESERVATIONS_COUNT.PENDING_RESERVATIONS_COUNT_LOAD_DONE:
			return {
				...state,
				pendingReservationsCount: {
					...initState.pendingReservationsCount,
					count: action.payload.count
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
