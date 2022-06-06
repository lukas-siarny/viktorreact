/* eslint-disable import/no-cycle */
import { ThunkResult } from '../index'
import { EMPLOYEE, EMPLOYEES } from './employeesTypes'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

export type IEmployeesActions = IResetStore | IGetEmployees | IGetEmployee

interface IGetEmployees {
	type: EMPLOYEES
	payload: IEmployeesPayload
}

interface IGetEmployee {
	type: EMPLOYEE
	payload: IEmployeePayload
}

export interface IEmployeePayload {
	data: Paths.GetApiB2BAdminEmployeesEmployeeId.Responses.$200 | null
}

export interface IEmployeesPayload {
	data: Paths.GetApiB2BAdminEmployees.Responses.$200 | null
}

export const getEmployees =
	(page: number, limit?: any | undefined, order?: string | undefined, queryParams = {}): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/employees/', { page: page || 1, limit, order, ...normalizeQueryParams(queryParams) })

			const payload = {
				data
			}
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: EMPLOYEES.EMPLOYEES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}

export const getEmployee =
	(employeeID: number): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: EMPLOYEE.EMPLOYEE_LOAD_START })
			const data = await getReq('/api/b2b/admin/employees/{employeeID}', { employeeID } as any)
			dispatch({ type: EMPLOYEE.EMPLOYEE_LOAD_DONE, payload: data })
		} catch (err) {
			dispatch({ type: EMPLOYEE.EMPLOYEE_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}
