import { SET_DAY_EVENTS, EVENTS, EVENT_DETAIL, SET_IS_REFRESHING_EVENTS, SET_DAY_DETAIL_DATE } from './calendarTypes'
/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ICalendarActions, ICalendarEventDetailPayload, ISetDayDetailPayload } from './calendarActions'
import { ICalendarDayEvents, ICalendarEventsPayload, ILoadingAndFailure } from '../../types/interfaces'
import { CALENDAR_EVENTS_KEYS } from '../../utils/enums'

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
	eventDetail: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventDetailPayload & ILoadingAndFailure,
	[CALENDAR_EVENTS_KEYS.DAY_DETAIL]: {
		date: null,
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventsPayload & ISetDayDetailPayload & ILoadingAndFailure,
	dayEvents: {} as ICalendarDayEvents,
	isRefreshingEvents: false
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
					...initState[action.enumType],
					isFailure: true
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
		// set day detail day
		case SET_DAY_DETAIL_DATE:
			return {
				...state,
				[CALENDAR_EVENTS_KEYS.DAY_DETAIL]: {
					...state[CALENDAR_EVENTS_KEYS.DAY_DETAIL],
					date: action.payload.date
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
