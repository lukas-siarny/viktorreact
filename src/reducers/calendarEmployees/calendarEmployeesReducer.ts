/* eslint-disable import/no-cycle */
import { ICalendarEmployeesPayload } from '../../types/interfaces'
import { RESET_STORE } from '../generalTypes'
import { ICalendarEmployeesActions } from './calendarEmployeesActions'
import { SET_CALENDAR_EMPLOYEES } from './calendarEmployeesTypes'

// eslint-disable-next-line import/prefer-default-export
export const initState = {
	calendarEmployees: {
		data: null,
		options: []
	} as ICalendarEmployeesPayload
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICalendarEmployeesActions) => {
	switch (action.type) {
		// Employees
		case SET_CALENDAR_EMPLOYEES:
			return {
				...state,
				calendarEmployees: {
					...state.calendarEmployees,
					data: action.payload.data,
					options: action.payload.options
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
