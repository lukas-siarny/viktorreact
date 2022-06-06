/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { EMPLOYEES } from './employeesTypes'
import { IEmployeesActions, IEmployeesPayload } from './employeesActions'

// eslint-disable-next-line import/prefer-default-export
export const initState = {
	employees: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IEmployeesPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IEmployeesActions) => {
	switch (action.type) {
		// Employees
		case EMPLOYEES.EMPLOYEES_LOAD_START:
			return {
				...state,
				employees: {
					...state.employees,
					isLoading: true
				}
			}
		case EMPLOYEES.EMPLOYEES_LOAD_FAIL:
			return {
				...state,
				employees: {
					...initState.employees,
					isFailure: true
				}
			}
		case EMPLOYEES.EMPLOYEES_LOAD_DONE:
			return {
				...state,
				employees: {
					...initState.employees,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
