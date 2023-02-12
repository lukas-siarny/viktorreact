/* eslint-disable import/no-cycle */
import { MONTHLY_RESERVATIONS_KEY, CALENDAR_EVENTS_KEYS } from '../../utils/enums'
import { MONTHLY_RESERVATIONS, SET_DAY_EVENTS, EVENTS, EVENT_DETAIL, SET_IS_REFRESHING_EVENTS, RESERVATIONS } from './calendarTypes'
import { RESET_STORE } from '../generalTypes'
import { ICalendarActions, ISalonReservationsPayload } from './calendarActions'
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
	} as ISalonReservationsPayload & ILoadingAndFailure
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
		// Events refresh
		case EVENTS.EVENTS_REFRESH:
			return {
				...state,
				[action.enumType]: {
					...state[action.enumType]
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
		// Refreshing events
		case SET_IS_REFRESHING_EVENTS:
			return {
				...state,
				isRefreshingEvents: action.payload
			}
		// Reservations
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
