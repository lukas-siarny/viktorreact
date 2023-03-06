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
import { CalendarEmployee, ISelectOptionItem } from '../../types/interfaces'

export type ICalendarEmployeesActions = IResetStore | IGetEmployees

export type ICalendarEmployeeOptionItem = ISelectOptionItem<{ employeeData: { color: string }; thumbnail: string; color: string; isForImportedEvents: boolean }>
export interface ICalendarEmployeesPayload {
	data: CalendarEmployee[] | null
	options: ICalendarEmployeeOptionItem[]
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

		const options: ICalendarEmployeeOptionItem[] = []
		const calendarEmployees: CalendarEmployee[] = []

		employees?.forEach((employee) => {
			const isForImportedEvents = employee.firstName === VIRTUAL_EMPLOYEE_IDENTIFICATOR
			calendarEmployees.push({
				id: employee.id,
				firstName: employee.firstName,
				lastName: employee.lastName,
				email: employee.email,
				orderIndex: employee.orderIndex,
				color: employee.color,
				image: employee.image,
				isForImportedEvents
			})
			options.push({
				// show name if exist at least last name otherwise show fallback values
				label: getAssignedUserLabel({ id: employee.id, firstName: employee.firstName, lastName: employee.lastName, email: employee.email }),
				value: employee.id,
				key: `${employee.id}-key`,
				extra: {
					// employeeData s hodnotou color je potrebne, aby sa v mesacnom view zobrazila spravne farba pri vytvarani noveho eventu
					employeeData: {
						color: employee.color
					},
					thumbnail: employee.image.resizedImages.thumbnail,
					color: employee.color,
					isForImportedEvents
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
