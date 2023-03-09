/* eslint-disable import/no-cycle */
import { filter, map } from 'lodash'
import { ThunkResult } from '../index'
import { DELETED_EMPLOYEES, EMPLOYEE, EMPLOYEES } from './employeesTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { IResetStore } from '../generalTypes'
import { IQueryParams, IEmployeePayload, IEmployeesPayload, IDeletedIEmployeesPayload } from '../../types/interfaces'
import { Paths } from '../../types/api'

export type IEmployeesActions = IResetStore | IGetEmployees | IGetEmployee | IGetDeletedEmployees

interface IGetDeletedEmployees {
	type: DELETED_EMPLOYEES
	payload: IDeletedIEmployeesPayload
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
	(queryParams: IGetEmployeesQueryParams): ThunkResult<Promise<IDeletedIEmployeesPayload>> =>
	async (dispatch) => {
		let payload = {} as IDeletedIEmployeesPayload
		try {
			dispatch({ type: DELETED_EMPLOYEES.DELETED_EMPLOYEES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/employees/', { ...normalizeQueryParams(queryParams) })
			console.log('data', data)
			// TODO: toto bude chodit z BE ked sa implementuje https://goodrequest.atlassian.net/browse/NOT-4568
			const deletedEmployess: any = filter(data.employees, (employe) => employe.deletedAt)
			console.log('deletedEmployess', deletedEmployess)
			const tableData = map(deletedEmployess, (employee) => ({
				...employee,
				key: employee.id
			}))

			payload = {
				data: {
					employees: deletedEmployess,
					pagination: data.pagination
				},
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
