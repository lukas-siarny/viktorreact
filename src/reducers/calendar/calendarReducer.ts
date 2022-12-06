/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ICalendarActions, ICalendarEventDetailPayload } from './calendarActions'
import { ICalendarEventsPayload, ILoadingAndFailure } from '../../types/interfaces'
import { EVENTS, EVENT_DETAIL } from './calendarTypes'
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
	} as ICalendarEventDetailPayload & ILoadingAndFailure
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
