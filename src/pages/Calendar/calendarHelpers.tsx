import dayjs from 'dayjs'
import { t } from 'i18next'
import { uniqueId } from 'lodash'

// reducers
import { ICalendarEventsPayload } from '../../reducers/calendar/calendarActions'

// types
import { Employees } from '../../types/interfaces'

// utils
import { CALENDAR_EVENT_TYPE, CALENDAR_EVENT_TYPE_FILTER } from '../../utils/enums'

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

const createAllDayInverseEventsFromResourceMap = (resourcesMap: ResourceMap, selectedDate: string) =>
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
	// resources mapa, pre trackovanie, ci zamestnanec ma nejake volno, prestavku alebo zmenu v dany den
	const resourcesMap = createResourceMap(employees)
	const events = [...(reservations || []), ...(shiftsTimeOffs || [])]

	events?.forEach((event) => {
		const employeeID = event.employee?.id

		if (employeeID) {
			const calendarEvent = {
				id: event.id,
				resourceId: employeeID,
				start: getDateTime(event.start.date, event.start.time),
				end: getDateTime(event.end.date, event.end.time),
				eventType: event.eventType,
				allDay: false,
				employee: event.employee
			}

			switch (calendarEvent.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					composedEvents.push({
						...calendarEvent,
						groupId: 'not-set-availability',
						display: 'inverse-background'
					})
					resourcesMap[employeeID] += 1
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					composedEvents.push(
						{
							...calendarEvent,
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
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
					composedEvents.push(
						{
							...calendarEvent,
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

	// ak zamestnanec nema ziadnu zmenu, volno alebo prestavku v dany den
	// tak vytvorime fake 'inverse-background' event, ktory zasrafuje pozadie pre cely den
	const allDayInverseEvents = createAllDayInverseEventsFromResourceMap(resourcesMap, selectedDate)

	return [...composedEvents, ...allDayInverseEvents]
}

const composeDayViewAbsences = (selectedDate: string, shiftsTimeOffs: ICalendarEventsPayload['data'], employees?: Employees) => {
	const composedEvents: any[] = []

	// resources mapa, pre trackovanie, ci zamestnanec ma nejake volno v dany den
	const resourcesMap = createResourceMap(employees)

	shiftsTimeOffs?.forEach((event) => {
		const employeeID = event.employee?.id

		if (employeeID) {
			const calendarEvent = {
				id: event.id,
				resourceId: employeeID,
				start: getDateTime(event.start.date, event.start.time),
				end: getDateTime(event.end.date, event.end.time),
				eventType: event.eventType,
				allDay: false,
				employee: event.employee
			}

			composedEvents.push({
				...calendarEvent
			})

			if (event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT) {
				composedEvents.push({
					...calendarEvent,
					groupId: 'not-set-availability',
					display: 'inverse-background'
				})
				resourcesMap[employeeID] += 1
			}
		}
	})

	// ak zamestnanec nema ziadnu zmenu v dany den
	// tak vytvorime fake 'inverse-background' event, ktory zasrafuje pozadie pre cely den
	const allDayInverseEvents = createAllDayInverseEventsFromResourceMap(resourcesMap, selectedDate)

	return [...composedEvents, ...allDayInverseEvents]
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
	if (employees?.length === 0) {
		return [
			{
				id: 'empty-employees',
				emptyEmployees: true
			}
		]
	}

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

		const employeeWorkingHours = employeeShifts
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
				const newResult = `${result}${dayjs(getDateTime(cv.start.date, cv.start.time)).format('HH:mm')}-${dayjs(getDateTime(cv.end.date, cv.end.time)).format('HH:mm')}${
					i + 1 !== arr.length ? ', ' : ''
				}`
				return newResult
			}, '')

		return {
			id: employee.id,
			name: `${employee.lastName ? employee.firstName || '' : ''} ${employee.lastName || ''}`.trim() || employee.email || employee.inviteEmail || employee.id,
			image: employee.image.resizedImages.thumbnail,
			wokringHours: employeeWorkingHours || t('loc:Not Available'),
			isTimeOff: !!employeeTimeOff.length,
			employeeData: employee
		}
	})
}
