/* eslint-disable import/no-cycle */
import dayjs from 'dayjs'
import { t } from 'i18next'
import { uniqueId } from 'lodash'

// reducers
import { CalendarEvent, ICalendarEventsPayload } from '../../reducers/calendar/calendarActions'

// types
import { Employees } from '../../types/interfaces'

// utils
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../utils/enums'

export const getCustomerName = (customer: CalendarEvent['customer']) => {
	return `${customer?.lastName ? customer?.firstName || '' : ''} ${customer?.lastName || ''}`.trim() || customer?.email
}

export const getEmployeeName = (employee: CalendarEvent['employee']) => {
	return `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email
}

/**
 * monthViewFull = true;
 * prida datumy aj z konca predosleho a zaciatku nasledujuceho mesiaca (do konca tyzdna + dalsi tyzden, tak to zobrazuje FC), aby sa vyplnilo cele mesacne view
 * monthViewFull = false;
 * vrati klasicky zaciatok a koniec mesiaca
 */

export const getSelectedDateRange = (view: CALENDAR_VIEW, selectedDate: string, monthViewFull = true, format: string | false = CALENDAR_DATE_FORMAT.QUERY) => {
	let result = {
		view,
		start: dayjs(selectedDate).startOf('day'),
		end: dayjs(selectedDate).endOf('day')
	}

	switch (view) {
		case CALENDAR_VIEW.MONTH: {
			const start = dayjs(selectedDate).startOf('month').startOf('day')
			const end = dayjs(selectedDate).endOf('month').startOf('day')
			result = {
				...result,
				view,
				start: monthViewFull ? dayjs(selectedDate).startOf('week') : start,
				end: monthViewFull ? dayjs(selectedDate).endOf('week').add(1, 'week') : end
			}
			break
		}
		case CALENDAR_VIEW.WEEK: {
			result = {
				...result,
				view,
				start: dayjs(selectedDate).startOf('week'),
				end: dayjs(selectedDate).endOf('week')
			}
			break
		}
		default:
			break
	}

	return {
		view: result.view,
		start: format ? result.start.format(format) : result.start.toISOString(),
		end: format ? result.end.format(format) : result.end.toISOString()
	}
}

export const isRangeAleardySelected = (view: CALENDAR_VIEW, currentSelectedDate: string, newSelectedDate: string | dayjs.Dayjs) => {
	const { start, end } = getSelectedDateRange(view, currentSelectedDate, false)
	return dayjs(newSelectedDate).isSameOrAfter(start) && dayjs(newSelectedDate).isSameOrBefore(end)
}

export const getHoursMinutesFromMinutes = (minutes: number) => {
	const hours = Math.floor(minutes / 60)
	const min = minutes % 60
	return `${hours ? `${hours}${t('loc:h')}` : ''} ${min ? `${min}${t('loc:m')}` : ''}`.trim()
}

const getDateTime = (date: string, time?: string) => {
	const [hours, minutes] = (time || '').split(':')

	if (Number.isInteger(Number(hours)) && Number.isInteger(Number(minutes))) {
		return dayjs(date).add(Number(hours), 'hours').add(Number(minutes), 'minutes').toISOString()
	}

	return dayjs(date).toISOString()
}

type ResourceMap = {
	[key: string]: number
}

const createResourceMap = (employees?: Employees) =>
	employees?.reduce((resources, employee) => {
		return {
			...resources,
			[employee.id]: 0
		}
	}, {} as ResourceMap) || {}

const createAllDayInverseEventFromResourceMap = (resourcesMap: ResourceMap, selectedDate: string) =>
	Object.entries({ ...resourcesMap }).reduce((acc, [key, value]) => {
		if (!value) {
			return [
				...acc,
				{
					id: uniqueId(),
					resourceId: key,
					start: dayjs(selectedDate).startOf('day').toISOString(),
					end: dayjs(selectedDate).startOf('day').add(1, 'seconds').toISOString(),
					allDay: false,
					employee: key,
					display: 'inverse-background'
				}
			]
		}
		return acc
	}, [] as any[])

const composeDayViewReservations = (selectedDate: string, reservations: ICalendarEventsPayload['data'], shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees) => {
	const composedEvents: any[] = []
	// resources mapa, pre trackovanie, ci zamestnanec ma zmenu alebo dovolenku v dany den
	const resourcesMap = createResourceMap(employees)
	const events = [...(reservations || []), ...(shiftsTimeOffs || [])]

	dayjs(selectedDate).endOf('day').subtract(15, 'minutes')

	events?.forEach((event) => {
		const employeeID = event.employee?.id

		const start = getDateTime(event.start.date, event.start.time)
		const end = getDateTime(event.end.date, event.end.time)

		// NOTE: Co s eventom, ktory ma start > end ?
		// FC v takom pripade hodi null na end a automaticky ho vytvori na hodinu
		// bude na to nejaka validacia vo formulari na vytvaranie?
		// zatial taky event v FC odignorujem
		if (employeeID && dayjs(start).isBefore(end)) {
			const calendarEvent = {
				id: event.id,
				resourceId: employeeID,
				start,
				end,
				eventType: event.eventType,
				allDay: dayjs(start).isSame(dayjs(selectedDate).startOf('day')) && dayjs(end).isAfter(dayjs(selectedDate).endOf('day').subtract(1, 'minutes')),
				employee: event.employee
			}

			switch (calendarEvent.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					composedEvents.push({
						...calendarEvent,
						// ak je dlzka bg eventu mensia ako min dielik v kalendari (u nas 15 minut), tak ho to vytvori na vysku tohto min dielika
						// preto treba tieto inverse-background evnety tiez takto upravit, aby sa potom neprekryvali srafy
						end: dayjs(end).diff(start, 'minutes') < 15 ? dayjs(start).add(15, 'minutes').toISOString() : end,
						groupId: 'not-set-availability',
						display: 'inverse-background'
					})
					resourcesMap[employeeID] += 1
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF: {
					composedEvents.push(
						{
							...calendarEvent,
							// ak je dlzka bg eventu mensia ako min dielik v kalendari (u nas 15 minut), tak ho to vytvori na vysku tohto min dielika
							// preto treba tieto inverse-background evnety tiez takto upravit, aby sa potom neprekryvali srafy
							end: dayjs(end).diff(start, 'minutes') < 15 ? dayjs(start).add(15, 'minutes').toISOString() : end,
							groupId: 'not-set-availability',
							display: 'inverse-background'
						},
						{
							...calendarEvent,
							display: 'background'
						}
					)
					resourcesMap[employeeID] += 1
					break
				}
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					composedEvents.push({
						...calendarEvent
					})
					break
				case CALENDAR_EVENT_TYPE.RESERVATION:
				default:
					composedEvents.push({
						...calendarEvent,
						reservationData: event.reservationData,
						service: event.service,
						customer: event.customer,
						note: event.note
					})
					break
			}
		}
	})

	// ak zamestnanec nema ziadnu zmenu alebo dovolenku v dany den
	// tak vytvorime "fake" 'inverse-background' event, ktory zasrafuje pozadie pre cely den
	const allDayInverseEvents = createAllDayInverseEventFromResourceMap(resourcesMap, selectedDate)

	return [...composedEvents, ...allDayInverseEvents]
}

const composeDayViewAbsences = (selectedDate: string, shiftsTimeOffs: ICalendarEventsPayload['data'], employees?: Employees) => {
	const composedEvents: any[] = []

	// resources mapa, pre trackovanie, ci zamestnanec ma nejake volno v dany den
	const resourcesMap = createResourceMap(employees)

	shiftsTimeOffs?.forEach((event) => {
		const employeeID = event.employee?.id

		if (employeeID) {
			composedEvents.push({
				id: event.id,
				resourceId: employeeID,
				start: getDateTime(event.start.date, event.start.time),
				end: getDateTime(event.end.date, event.end.time),
				eventType: event.eventType,
				allDay: false,
				employee: event.employee
			})

			/* if (event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT) {
				resourcesMap[employeeID] += 1
			} */
		}
	})

	// ak zamestnanec nema ziadnu zmenu v dany den
	// tak vytvorime "fake" 'inverse-background' event, ktory zasrafuje pozadie pre cely den
	// const allDayInverseEvents = createAllDayInverseEventFromResourceMap(resourcesMap, selectedDate)

	// return [...composedEvents, ...allDayInverseEvents]
	return composedEvents
}

export const composeDayViewEvents = (
	selectedDate: string,
	eventTypeFilter: CALENDAR_EVENTS_VIEW_TYPE,
	reservations: ICalendarEventsPayload['data'],
	shiftsTimeOffs: ICalendarEventsPayload['data'],
	employees: Employees
) => {
	switch (eventTypeFilter) {
		case CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF:
			return composeDayViewAbsences(selectedDate, shiftsTimeOffs, employees)
		case CALENDAR_EVENTS_VIEW_TYPE.RESERVATION:
		default:
			return composeDayViewReservations(selectedDate, reservations, shiftsTimeOffs, employees)
	}
}

export const composeDayEventResources = (shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees) => {
	return employees.map((employee) => {
		const employeeShifts: any[] = []
		const employeeTimeOff: any[] = []

		shiftsTimeOffs?.forEach((event) => {
			if (event.employee?.id === employee.id) {
				if (event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT) {
					employeeShifts.push(event)
				} else if (event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF) {
					employeeTimeOff.push(event)
				}
			}
		})

		/* const employeeWorkingHours = employeeShifts
			.sort((eventA, eventB) => {
				const key1 = eventA.start
				const key2 = eventB.start

				if (key1 && key2) {
					if (key1 < key2) {
						return -1
					}
					if (key1 === key2) {
						return 0
					}
				}
				return 1
			})
			.reduce((result, cv, i, arr) => {
				const newResult = `${result}${dayjs(getDateTime(cv.start.date, cv.start.time)).format(CALENDAR_DATE_FORMAT.TIME)}-${dayjs(getDateTime(cv.end.date, cv.end.time)).format(CALENDAR_DATE_FORMAT.TIME)}${
					i + 1 !== arr.length ? ', ' : ''
				}`
				return newResult
			}, '') */

		let description = t('loc:Domyslime textik')

		if (employeeShifts.length) {
			const employeeWorkingHours =
				employeeShifts?.length &&
				employeeShifts.reduce((result, cv, i) => {
					const startCv = getDateTime(cv.start.date, cv.start.time)
					const endCv = getDateTime(cv.end.date, cv.end.time)

					if (i === 0) {
						return {
							start: startCv,
							end: endCv
						}
					}

					const startResult = result.start
					const endResult = result.end

					return {
						start: dayjs(startCv).isBefore(dayjs(startResult)) ? startCv : startResult,
						end: dayjs(endCv).isAfter(dayjs(endResult)) ? endCv : endResult
					}
				}, {})
			description = `${dayjs(employeeWorkingHours.start).format(CALENDAR_DATE_FORMAT.TIME)}-${dayjs(employeeWorkingHours.end).format(CALENDAR_DATE_FORMAT.TIME)}`
		} else if (employeeTimeOff.length && !employeeShifts.length) {
			description = t('loc:Dovolenka')
		}

		return {
			id: employee.id,
			name: `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email || employee.inviteEmail || employee.id,
			image: employee.image.resizedImages.thumbnail,
			description,
			isTimeOff: !!employeeTimeOff.length,
			employeeData: employee
		}
	})
}
