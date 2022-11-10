/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ICalendarActions, ICalendarEventsPayload, ICalendarEventDetailPayload } from './calendarActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { EVENTS, EVENT_DETAIL, RESERVATIONS, SHIFTS_TIME_OFF } from './calendarTypes'

export const initState = {
	events: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventsPayload & ILoadingAndFailure,
	reservations: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventsPayload & ILoadingAndFailure,
	shiftsTimeOffs: {
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
				events: {
					...state.events,
					isLoading: true
				}
			}
		case EVENTS.EVENTS_LOAD_FAIL:
			return {
				...state,
				events: {
					...initState.events,
					isFailure: true
				}
			}
		case EVENTS.EVENTS_LOAD_DONE:
			return {
				...state,
				events: {
					...initState.events,
					data: action.payload.data
				}
			}
		// Reservations
		case RESERVATIONS.RESERVATIONS_LOAD_START:
			return {
				...state,
				reservations: {
					...state.reservations,
					isLoading: true
				}
			}
		case RESERVATIONS.RESERVATIONS_LOAD_FAIL:
			return {
				...state,
				reservations: {
					...initState.reservations,
					isFailure: true
				}
			}
		case RESERVATIONS.RESERVATIONS_LOAD_DONE:
			return {
				...state,
				reservations: {
					...initState.reservations,
					data: action.payload.data
				}
			}
		case RESERVATIONS.RESERVATIONS_CLEAR:
			return {
				...state,
				reservations: {
					...initState.reservations,
					data: null
				}
			}
		// Shifts / Time off
		case SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_LOAD_START:
			return {
				...state,
				shiftsTimeOffs: {
					...state.shiftsTimeOffs,
					isLoading: true
				}
			}
		case SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_LOAD_FAIL:
			return {
				...state,
				shiftsTimeOffs: {
					...initState.shiftsTimeOffs,
					isFailure: true
				}
			}
		case SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_LOAD_DONE:
			return {
				...state,
				shiftsTimeOffs: {
					...initState.shiftsTimeOffs,
					data: action.payload.data
				}
			}
		case SHIFTS_TIME_OFF.SHIFTS_TIME_OFF_CLEAR:
			return {
				...state,
				shiftsTimeOffs: {
					...initState.shiftsTimeOffs,
					data: null
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
