/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import {
	ICalendarActions,
	ICalendarEventsPayload,
	ICalendarShiftsPayload,
	ICalendarTimeOffPayload,
	ICalendarEmployeesPayload,
	ICalendarServicesPayload,
	ICalendarEventDetailPayload
} from './calendarActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { EVENTS, SHIFTS, TIMEOFF, EMPLOYEES, SERVICES, EVENT_DETAIL } from './calendarTypes'

export const initState = {
	events: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEventsPayload & ILoadingAndFailure,
	shifts: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarShiftsPayload & ILoadingAndFailure,
	timeOff: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarTimeOffPayload & ILoadingAndFailure,
	employees: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarEmployeesPayload & ILoadingAndFailure,
	services: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ICalendarServicesPayload & ILoadingAndFailure,
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
		// Shifts
		case SHIFTS.SHIFTS_LOAD_START:
			return {
				...state,
				shifts: {
					...state.shifts,
					isLoading: true
				}
			}
		case SHIFTS.SHIFTS_LOAD_FAIL:
			return {
				...state,
				shifts: {
					...initState.shifts,
					isFailure: true
				}
			}
		case SHIFTS.SHIFTS_LOAD_DONE:
			return {
				...state,
				shifts: {
					...initState.shifts,
					data: action.payload.data
				}
			}
		// TimeOff
		case TIMEOFF.TIMEOFF_LOAD_START:
			return {
				...state,
				timeOff: {
					...state.shifts,
					isLoading: true
				}
			}
		case TIMEOFF.TIMEOFF_LOAD_FAIL:
			return {
				...state,
				timeOff: {
					...initState.shifts,
					isFailure: true
				}
			}
		case TIMEOFF.TIMEOFF_LOAD_DONE:
			return {
				...state,
				timeOff: {
					...initState.shifts,
					data: action.payload.data
				}
			}
		// Employees
		case EMPLOYEES.EMPLOYEES_LOAD_START:
			return {
				...state,
				employees: {
					...state.shifts,
					isLoading: true
				}
			}
		case EMPLOYEES.EMPLOYEES_LOAD_FAIL:
			return {
				...state,
				employees: {
					...initState.shifts,
					isFailure: true
				}
			}
		case EMPLOYEES.EMPLOYEES_LOAD_DONE:
			return {
				...state,
				employees: {
					...initState.shifts,
					data: action.payload.data
				}
			}
		// Services
		case SERVICES.SERVICES_LOAD_START:
			return {
				...state,
				services: {
					...state.shifts,
					isLoading: true
				}
			}
		case SERVICES.SERVICES_LOAD_FAIL:
			return {
				...state,
				services: {
					...initState.shifts,
					isFailure: true
				}
			}
		case SERVICES.SERVICES_LOAD_DONE:
			return {
				...state,
				services: {
					...initState.shifts,
					data: action.payload.data
				}
			}
		// Event detail
		case EVENT_DETAIL.EVENT_DETAIL_LOAD_START:
			return {
				...state,
				eventDetail: {
					...state.shifts,
					isLoading: true
				}
			}
		case EVENT_DETAIL.EVENT_DETAIL_LOAD_FAIL:
			return {
				...state,
				eventDetail: {
					...initState.shifts,
					isFailure: true
				}
			}
		case EVENT_DETAIL.EVENT_DETAIL_LOAD_DONE:
			return {
				...state,
				eventDetail: {
					...initState.shifts,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
