/* eslint-disable import/no-cycle */
import { map } from 'lodash'
import { ThunkResult } from '../index'
import { EMPLOYEE, EMPLOYEES } from './employeesTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { IResetStore } from '../generalTypes'
import { IQueryParams, IEmployeePayload, IEmployeesPayload } from '../../types/interfaces'

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
					// show name if exist at least last name otherwise show fallback values
					label: `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email || employee.inviteEmail || employee.id,
					value: employee.id,
					key: `${employee.id}-key`,
					color: employee.color
				}
			})

			payload = {
				data,
				options: employeesOptions
			}
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
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
