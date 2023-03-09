/* eslint-disable import/no-cycle */
import { filter, map } from 'lodash'
import { ThunkResult } from '../index'
import { ACTIVE_EMPLOYEES, DELETED_EMPLOYEES, EMPLOYEE, EMPLOYEES } from './employeesTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { IResetStore } from '../generalTypes'
import { IQueryParams, IEmployeePayload, IEmployeesPayload, IDeletedEmployeesPayload, IActiveEmployeesPayload } from '../../types/interfaces'
import { Paths } from '../../types/api'

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
	(queryParams: IGetEmployeesQueryParams): ThunkResult<Promise<IEmployeesPayload>> =>
	async (dispatch) => {
		let payload = {} as IEmployeesPayload
		try {
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/employees/', { ...normalizeQueryParams(queryParams) })
			const employeesOptions = map(data.employees, (employee) => {
				return {
					// show name if exist at least last name otherwise show fallback values
					label: `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email || employee.inviteEmail || employee.id,
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
			console.log('data', data)
			const tableData = map(data.employees, (employee) => ({
				...employee,
				key: employee.orderIndex
			}))

			payload = {
				data,
				tableData
			}

			dispatch({ type: ACTIVE_EMPLOYEES.ACTIVE_EMPLOYEES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: ACTIVE_EMPLOYEES.ACTIVE_EMPLOYEES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

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
