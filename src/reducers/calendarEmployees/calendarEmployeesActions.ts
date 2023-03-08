/* eslint-disable import/no-cycle */
import i18next from 'i18next'
import { ThunkResult } from '../index'

// utils
import { VIRTUAL_EMPLOYEE_IDENTIFICATOR, VIRTUAL_EMPLOYEE_NAME } from '../../utils/enums'
import { getAssignedUserLabel } from '../../utils/helper'
import { SET_CALENDAR_EMPLOYEES } from './calendarEmployeesTypes'

// types
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'
import { CalendarEmployee, ICalendarEmployeeOptionItem, ICalendarEmployeesPayload } from '../../types/interfaces'

export type ICalendarEmployeesActions = IResetStore | IGetEmployees

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

		const options: ICalendarEmployeeOptionItem[] = []
		const calendarEmployees: CalendarEmployee[] = []

		employees?.forEach((employee, index) => {
			const isForImportedEvents = employee.firstName === VIRTUAL_EMPLOYEE_IDENTIFICATOR
			const firstName = isForImportedEvents ? VIRTUAL_EMPLOYEE_NAME(i18next.t) : employee.firstName
			const lastName = isForImportedEvents ? '' : employee.lastName
			const isDeleted = !isForImportedEvents && !!employee.deletedAt
			const color = isDeleted ? '#808080' : employee.color // deleted: grayDark

			const employeeData = {
				id: employee.id,
				firstName,
				lastName,
				email: employee.email,
				inviteEmail: employee.inviteEmail,
				orderIndex: index,
				color,
				image: employee.image,
				isForImportedEvents,
				isDeleted
			}

			calendarEmployees.push(employeeData)
			options.push({
				label: getAssignedUserLabel({ id: employee.id, firstName, lastName, email: employee.email || employee.inviteEmail }),
				value: employee.id,
				key: employee.id,
				extra: { employeeData, thumbnail: employee.image.resizedImages.thumbnail, color, isDeleted }
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
