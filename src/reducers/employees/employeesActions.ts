import { map } from 'lodash'
/* eslint-disable import/no-cycle */
import { ThunkResult } from '../index'
import { EMPLOYEE, EMPLOYEES } from './employeesTypes'

// utils
import { getReq } from '../../utils/request'
import { IResetStore } from '../generalTypes'
import { IQueryParams, IEmployeePayload, IEmployeesPayload } from '../../types/interfaces'
import { getAssignedUserLabel, normalizeQueryParams } from '../../utils/helper'

export type IEmployeesActions = IResetStore | IGetEmployees | IGetEmployee

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
