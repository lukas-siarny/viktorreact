/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure, IEmployeePayload, IEmployeesPayload, IDeletedIEmployeesPayload } from '../../types/interfaces'
import { DELETED_EMPLOYEES, EMPLOYEE, EMPLOYEES } from './employeesTypes'
import { IEmployeesActions } from './employeesActions'

// eslint-disable-next-line import/prefer-default-export
export const initState = {
	employees: {
		data: null,
		options: [],
		tableData: [],
		isLoading: false,
		isFailure: false
	} as IEmployeesPayload & ILoadingAndFailure,
	deletedEmployees: {
		data: null,
		tableData: [],
		isLoading: false,
		isFailure: false
	} as IDeletedIEmployeesPayload & ILoadingAndFailure,
	employee: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IEmployeePayload & ILoadingAndFailure
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
					data: action.payload.data,
					tableData: action.payload.tableData,
					options: action.payload.options
				}
			}
		// Deleted Employees
		case DELETED_EMPLOYEES.DELETED_EMPLOYEES_LOAD_START:
			return {
				...state,
				deletedEmployees: {
					...state.deletedEmployees,
					isLoading: true
				}
			}
		case DELETED_EMPLOYEES.DELETED_EMPLOYEES_LOAD_FAIL:
			return {
				...state,
				deletedEmployees: {
					...initState.deletedEmployees,
					isFailure: true
				}
			}
		case DELETED_EMPLOYEES.DELETED_EMPLOYEES_LOAD_DONE:
			return {
				...state,
				deletedEmployees: {
					...initState.deletedEmployees,
					data: action.payload.data,
					tableData: action.payload.tableData
				}
			}
		case EMPLOYEES.EMPLOYEES_REORDER:
			return {
				...state,
				employees: {
					...state.employees,
					tableData: action.payload.tableData
				}
			}
		// Employee
		case EMPLOYEE.EMPLOYEE_LOAD_START:
			return {
				...state,
				employee: {
					...state.employee,
					isLoading: true
				}
			}
		case EMPLOYEE.EMPLOYEE_LOAD_FAIL:
			return {
				...state,
				employee: {
					...initState.employee,
					isFailure: true
				}
			}
		case EMPLOYEE.EMPLOYEE_LOAD_DONE:
			return {
				...state,
				employee: {
					...initState.employee,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
