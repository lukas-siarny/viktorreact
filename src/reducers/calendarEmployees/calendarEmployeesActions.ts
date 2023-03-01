/* eslint-disable import/no-cycle */
import i18next from 'i18next'
import { ThunkResult } from '../index'
import { SET_CALENDAR_EMPLOYEES } from './calendarEmployeesTypes'

// utils
import { CalendarEmployee, CalendarEventsEmployee, IEmployeesPayload, ISelectOptionItem } from '../../types/interfaces'
import { VIRTUAL_EMPLOYEE_IDENTIFICATOR, VIRTUAL_EMPLOYEE_NAME } from '../../utils/enums'

// types
import { IResetStore } from '../generalTypes'

export type ICalendarEmployeesActions = IResetStore | IGetEmployees

export interface ICalendarEmployeesPayload {
	data: CalendarEmployee[] | null
	options: ISelectOptionItem[]
	areLoaded: boolean
}

interface IGetEmployees {
	type: typeof SET_CALENDAR_EMPLOYEES
	payload: ICalendarEmployeesPayload
}

export const setCalendarEmployees =
	(employees: IEmployeesPayload, calendarEventsEmployees: CalendarEventsEmployee[]): ThunkResult<Promise<ICalendarEmployeesPayload>> =>
	async (dispatch, getState) => {
		let payload = {
			data: null,
			options: [],
			areLoaded: false
		} as ICalendarEmployeesPayload

		const virtualEmployee = calendarEventsEmployees.find((employee) => employee.firstName === VIRTUAL_EMPLOYEE_IDENTIFICATOR)
		let newEmployeeIDs: string[] = []
		let calendarEmployees: CalendarEmployee[] | undefined = []

		employees?.data?.employees?.forEach((employee) => {
			newEmployeeIDs.push(employee.id)
			calendarEmployees?.push({
				id: employee.id,
				firstName: employee.firstName,
				lastName: employee.lastName,
				email: employee.email,
				inviteEmail: employee.inviteEmail,
				orderIndex: employee.orderIndex,
				color: employee.color,
				image: employee.image,
				isVirtual: false
			})
		})

		let options = employees?.options || []

		if (virtualEmployee) {
			calendarEmployees = [
				{
					id: virtualEmployee.id,
					firstName: virtualEmployee.firstName,
					lastName: virtualEmployee.lastName,
					color: virtualEmployee.color,
					image: virtualEmployee.image,
					orderIndex: -1,
					isVirtual: true
				},
				...calendarEmployees
			]
			newEmployeeIDs = [virtualEmployee.id, ...newEmployeeIDs]
			options = [
				{
					label: VIRTUAL_EMPLOYEE_NAME(i18next.t),
					value: virtualEmployee.id,
					key: `${virtualEmployee.id}-key`,
					color: virtualEmployee.color
				} as any, // TODO: pozriet color
				...options
			]
		}

		payload = {
			data: calendarEmployees,
			options,
			areLoaded: true
		}

		// update state only when new employees are different from currently stored employees
		const currentCalendarEmployeeIDs = getState()
			.calendarEmployees.calendarEmployees.data?.map((employee) => employee.id)
			.sort()
			.join('_')

		if (currentCalendarEmployeeIDs !== newEmployeeIDs.sort().join('_')) {
			dispatch({ type: SET_CALENDAR_EMPLOYEES, payload })
		}

		return payload
	}
