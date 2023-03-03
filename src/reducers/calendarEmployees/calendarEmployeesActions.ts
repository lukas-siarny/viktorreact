import i18next from 'i18next'
/* eslint-disable import/no-cycle */
import { ThunkResult } from '../index'
import { SET_CALENDAR_EMPLOYEES } from './calendarEmployeesTypes'

// utils
import { CalendarEmployee, ISelectOptionItem } from '../../types/interfaces'
import { VIRTUAL_EMPLOYEE_IDENTIFICATOR, VIRTUAL_EMPLOYEE_NAME } from '../../utils/enums'
import { getAssignedUserLabel } from '../../utils/helper'

// types
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

export type ICalendarEmployeesActions = IResetStore | IGetEmployees

export interface ICalendarEmployeesPayload {
	data: CalendarEmployee[] | null
	options: ISelectOptionItem[]
}

interface IGetEmployees {
	type: typeof SET_CALENDAR_EMPLOYEES
	payload: ICalendarEmployeesPayload
}

export const setCalendarEmployees =
	(employees?: Paths.GetApiB2BAdminSalonsSalonIdCalendarEvents.Responses.$200['employees'][0][]): ThunkResult<Promise<ICalendarEmployeesPayload>> =>
	async (dispatch, getState) => {
		let payload = {
			data: null,
			options: []
		} as ICalendarEmployeesPayload

		const options: ISelectOptionItem[] = []

		const calendarEmployees: CalendarEmployee[] = (employees || [])
			.map((employee, i) => {
				const isForImportedEvents = employee.firstName === VIRTUAL_EMPLOYEE_IDENTIFICATOR
				return {
					id: employee.id,
					firstName: employee.firstName,
					lastName: employee.lastName,
					email: employee.email,
					orderIndex: isForImportedEvents ? -1 : i, // TODO: potom z BE tahat
					color: employee.color,
					image: employee.image,
					isForImportedEvents
				}
			})
			.sort((a, b) => a.orderIndex - b.orderIndex)

		calendarEmployees.forEach((employee) => {
			options.push({
				// show name if exist at least last name otherwise show fallback values
				label: employee?.isForImportedEvents
					? VIRTUAL_EMPLOYEE_NAME(i18next.t)
					: getAssignedUserLabel({ id: employee.id, firstName: employee.firstName, lastName: employee.lastName, email: employee.email }),
				value: employee.id,
				key: `${employee.id}-key`,
				extra: {
					color: employee.color
				}
			})
		})

		payload = {
			data: calendarEmployees,
			options
		}

		// update state only when new employees are different from currently stored employees
		const currentCalendarEmployees = getState().calendarEmployees.calendarEmployees.data

		if (JSON.stringify(currentCalendarEmployees) !== JSON.stringify(calendarEmployees)) {
			dispatch({ type: SET_CALENDAR_EMPLOYEES, payload })
		}

		return payload
	}
