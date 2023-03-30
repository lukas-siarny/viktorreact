import { map } from 'lodash'
/* eslint-disable import/no-cycle */
import { ThunkResult } from '../index'
import { ACTIVE_EMPLOYEES, DELETED_EMPLOYEES, EMPLOYEE, EMPLOYEES } from './employeesTypes'

// utils
import { getReq } from '../../utils/request'
import { IResetStore } from '../generalTypes'
import { IQueryParams, IEmployeePayload, IEmployeesPayload, IDeletedEmployeesPayload, IActiveEmployeesPayload } from '../../types/interfaces'
import { getAssignedUserLabel, normalizeQueryParams } from '../../utils/helper'

export type IEmployeesActions = IResetStore | IGetEmployees | IGetEmployee | IGetDeletedEmployees | IGetActiveEmployees

interface IGetDeletedEmployees {
	type: DELETED_EMPLOYEES
	payload: IDeletedEmployeesPayload
}

interface IGetActiveEmployees {
	type: ACTIVE_EMPLOYEES
	payload: IActiveEmployeesPayload
}

interface IGetEmployees {
	type: EMPLOYEES
	payload: IEmployeesPayload
}

interface IGetEmployee {
	type: EMPLOYEE
	payload: IEmployeePayload
}

export interface IGetEmployeesQueryParams extends IQueryParams {
	salonID?: string | undefined | null
	serviceID?: string | undefined | null
	accountState?: string | undefined | null
}

export const getEmployees =
	(queryParams: IGetEmployeesQueryParams, disableDeletedEmployees?: boolean): ThunkResult<Promise<IEmployeesPayload>> =>
	async (dispatch) => {
		let payload = {} as IEmployeesPayload
		try {
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/employees/', { ...normalizeQueryParams(queryParams) })
			const employeesOptions = map(data.employees, (employee) => {
				return {
					label: getAssignedUserLabel({
						firstName: employee.firstName,
						lastName: employee.lastName,
						email: employee.email,
						id: employee.id
					}),
					disabled: !!(disableDeletedEmployees && employee.deletedAt),
					value: employee.id,
					key: `${employee.id}-key`,
					color: employee.color
				}
			})

			const tableData = map(data.employees, (employee) => ({
				...employee,
				key: employee.orderIndex
			}))

			payload = {
				data,
				options: employeesOptions,
				tableData
			}

			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getDeletedEmployees =
	(queryParams: IGetEmployeesQueryParams): ThunkResult<Promise<IDeletedEmployeesPayload>> =>
	async (dispatch) => {
		let payload = {} as IDeletedEmployeesPayload
		try {
			dispatch({ type: DELETED_EMPLOYEES.DELETED_EMPLOYEES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/employees/', { ...normalizeQueryParams({ ...queryParams, deleted: true }) })

			const tableData = map(data.employees, (employee) => ({
				...employee,
				key: employee.id
			}))

			payload = {
				data,
				tableData
			}

			dispatch({ type: DELETED_EMPLOYEES.DELETED_EMPLOYEES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: DELETED_EMPLOYEES.DELETED_EMPLOYEES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getActiveEmployees =
	(queryParams: IGetEmployeesQueryParams): ThunkResult<Promise<IActiveEmployeesPayload>> =>
	async (dispatch) => {
		let payload = {} as IActiveEmployeesPayload
		try {
			dispatch({ type: ACTIVE_EMPLOYEES.ACTIVE_EMPLOYEES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/employees/', { ...normalizeQueryParams({ ...queryParams, deleted: false }) })

			const employeesOptions = map(data.employees, (employee) => {
				return {
					label: getAssignedUserLabel({
						firstName: employee.firstName,
						lastName: employee.lastName,
						email: employee.email,
						id: employee.id
					}),
					value: employee.id,
					key: `${employee.id}-key`,
					color: employee.color
				}
			})

			const tableData = map(data.employees, (employee) => ({
				...employee,
				key: employee.orderIndex
			}))

			payload = {
				data,
				tableData,
				options: employeesOptions
			}

			dispatch({ type: ACTIVE_EMPLOYEES.ACTIVE_EMPLOYEES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: ACTIVE_EMPLOYEES.ACTIVE_EMPLOYEES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

// reorder aktivovanych pouzivatelov
export const reorderEmployees =
	(reorderedTableData: IEmployeesPayload['tableData']): ThunkResult<void> =>
	async (dispatch) => {
		const payload = {
			tableData: reorderedTableData
		}
		dispatch({ type: EMPLOYEES.EMPLOYEES_REORDER, payload })
	}

export const getEmployee =
	(employeeID: string): ThunkResult<Promise<IEmployeePayload>> =>
	async (dispatch) => {
		let payload = {} as IEmployeePayload
		try {
			dispatch({ type: EMPLOYEE.EMPLOYEE_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/employees/{employeeID}', { employeeID })
			payload = {
				data
			}
			dispatch({ type: EMPLOYEE.EMPLOYEE_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EMPLOYEE.EMPLOYEE_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
