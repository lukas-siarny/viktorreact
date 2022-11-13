import dayjs from 'dayjs'
import { t } from 'i18next'
import { uniqueId } from 'lodash'

// reducers
import { CalendarEvent, ICalendarEventsPayload } from '../../reducers/calendar/calendarActions'

// types
import { Employees } from '../../types/interfaces'

// utils
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE, CALENDAR_EVENT_TYPE_FILTER } from '../../utils/enums'

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

export const getCustomerName = (customer: CalendarEvent['customer']) => {
	return `${customer?.lastName ? customer?.firstName || '' : ''} ${customer?.lastName || ''}`.trim() || customer?.email
}

export const getEmployeeName = (employee: CalendarEvent['employee']) => {
	return `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email
}

type ResourceMap = {
	[key: string]: number
}

const createDayViewResourcesMap = (employees?: Employees) =>
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
	const resourcesMap = createDayViewResourcesMap(employees)
	const events = [...(reservations || []), ...(shiftsTimeOffs || [])]

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
	const resourcesMap = createDayViewResourcesMap(employees)

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
	eventTypeFilter: CALENDAR_EVENT_TYPE_FILTER,
	reservations: ICalendarEventsPayload['data'],
	shiftsTimeOffs: ICalendarEventsPayload['data'],
	employees: Employees
) => {
	switch (eventTypeFilter) {
		case CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF:
			return composeDayViewAbsences(selectedDate, shiftsTimeOffs, employees)
		case CALENDAR_EVENT_TYPE_FILTER.RESERVATION:
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
				}, {} as { start: string; end: string })
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

const getWeekDays = (selectedDate: string) => {
	const monday = dayjs(selectedDate).startOf('week')
	const weekDays = []
	for (let i = 0; i < 7; i += 1) {
		weekDays.push(monday.add(i, 'days').format(CALENDAR_DATE_FORMAT.QUERY))
	}
	return weekDays
}

/* const weekDayResources = [
	{ id: `employeeID1_mondayDate`, day: mondayDate, employee: employee1Data },
	{ id: `employeeID2_mondayDate`, day: mondayDate, employee: employee2Data },
	{ id: `employeeID1_tuesdayDate`, day: tuesdayDate, employee: employee1Data },
	{ id: `employeeID2_tuesdayDate`, day: tuesdayDate, employee: employee2Data }
] */

const getWeekDayResourceID = (employeeID: string, weekDay: string) => `${weekDay}_${employeeID}`

interface EmployeeWeekResource {
	id: string
	name: string
	image: string
	isTimeOff: boolean
	employeeData: Employees[0]
}

type WeekDayResource = { id: string; day: string; employee: EmployeeWeekResource }

export const composeWeekResources = (selectedDate: string, shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees): WeekDayResource[] => {
	const weekDays = getWeekDays(selectedDate)

	return weekDays.reduce((resources, weekDay) => {
		const timeOffsWeekDay = shiftsTimeOffs?.filter((event) => dayjs(event.start.date).isSame(dayjs(weekDay)) && event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF)

		const weekDayEmployees = employees.map((employee) => {
			return {
				id: getWeekDayResourceID(employee.id, weekDay),
				day: weekDay,
				employee: {
					id: employee.id,
					name: `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email || employee.inviteEmail || employee.id,
					image: employee.image.resizedImages.thumbnail,
					isTimeOff: !!timeOffsWeekDay?.filter((timeOff) => timeOff.employee?.id === employee.id).length,
					employeeData: employee
				}
			}
		})
		return [...resources, ...weekDayEmployees]
	}, [] as any[])
}

export const getWeekViewIntialdDate = (selectedDate: string) => {
	const weekDays = getWeekDays(selectedDate)
	const today = dayjs().startOf('day')
	return weekDays.some((day) => dayjs(day).startOf('day').isSame(today)) ? today.format(CALENDAR_DATE_FORMAT.QUERY) : selectedDate
}

const createWeekViewResourcesMap = (weekDays: string[], employees: Employees) =>
	weekDays?.reduce((resources, weekDay) => {
		return {
			...resources,
			...employees.reduce((resourcesDay, employee) => {
				return {
					...resourcesDay,
					[getWeekDayResourceID(employee.id, weekDay)]: 0
				}
			}, {} as ResourceMap)
		}
	}, {} as ResourceMap) || {}

const composeWeekViewReservations = (selectedDate: string, reservations: ICalendarEventsPayload['data'], shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees) => {
	const composedEvents: any[] = []
	const weekDays = getWeekDays(selectedDate)
	// resources mapa, pre trackovanie, ci zamestnanec ma zmenu alebo dovolenku v dany den
	const resourcesMap = createWeekViewResourcesMap(weekDays, employees)
	const events = [...(reservations || []), ...(shiftsTimeOffs || [])]

	events?.forEach((event) => {
		const start = getDateTime(event.start.date, event.start.time)
		const end = getDateTime(event.end.date, event.end.time)

		const employeeID = event.employee?.id
		const weekDayIndex = weekDays.findIndex((weekDay) => dayjs(weekDay).startOf('day').isSame(dayjs(start).startOf('day')))

		if (employeeID && dayjs(start).isBefore(end) && weekDayIndex >= 0) {
			const resourceId = getWeekDayResourceID(employeeID, weekDays[weekDayIndex])
			const calendarEvent = {
				id: event.id,
				resourceId,
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
					resourcesMap[resourceId] += 1
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
					resourcesMap[resourceId] += 1
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

const composeWeekViewAbsences = (selectedDate: string, shiftsTimeOffs: ICalendarEventsPayload['data'], employees?: Employees) => {
	const composedEvents: any[] = []
	const weekDays = getWeekDays(selectedDate)

	shiftsTimeOffs?.forEach((event) => {
		const start = getDateTime(event.start.date, event.start.time)
		const end = getDateTime(event.end.date, event.end.time)

		const employeeID = event.employee?.id
		const weekDayIndex = weekDays.findIndex((weekDay) => dayjs(weekDay).startOf('day').isSame(dayjs(start).startOf('day')))

		if (employeeID && dayjs(start).isBefore(end) && weekDayIndex >= 0) {
			const resourceId = getWeekDayResourceID(employeeID, weekDays[weekDayIndex])
			composedEvents.push({
				id: event.id,
				resourceId,
				start: getDateTime(event.start.date, event.start.time),
				end: getDateTime(event.end.date, event.end.time),
				eventType: event.eventType,
				allDay: dayjs(start).isSame(dayjs(selectedDate).startOf('day')) && dayjs(end).isAfter(dayjs(selectedDate).endOf('day').subtract(1, 'minutes')),
				employee: event.employee
			})
		}
	})
	return composedEvents
}

export const composeWeekViewEvents = (
	selectedDate: string,
	eventTypeFilter: CALENDAR_EVENT_TYPE_FILTER,
	reservations: ICalendarEventsPayload['data'],
	shiftsTimeOffs: ICalendarEventsPayload['data'],
	employees: Employees
) => {
	switch (eventTypeFilter) {
		case CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF:
			return composeWeekViewAbsences(selectedDate, shiftsTimeOffs, employees)
		case CALENDAR_EVENT_TYPE_FILTER.RESERVATION:
		default:
			return composeWeekViewReservations(selectedDate, reservations, shiftsTimeOffs, employees)
	}
}
