/* eslint-disable import/no-cycle */
import dayjs from 'dayjs'
import { t } from 'i18next'
import { uniqueId } from 'lodash'

// reducers
import { CalendarEvent, ICalendarEventsPayload } from '../../reducers/calendar/calendarActions'

// types
import { Employees } from '../../types/interfaces'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../utils/enums'
import { getAssignedUserLabel, getDateTime } from '../../utils/helper'

/*
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
			const start = dayjs(selectedDate).startOf('month')
			const end = dayjs(selectedDate).endOf('month')
			result = {
				...result,
				view,
				start: monthViewFull ? start.startOf('week') : start,
				end: monthViewFull ? end.endOf('week').add(1, 'week') : end
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
	return `${hours ? `${hours}${'h'}` : ''} ${min ? `${min}${'m'}` : ''}`.trim()
}

type ResourceMap = {
	[key: string]: number
}

const createAllDayInverseEventFromResourceMap = (resourcesMap: ResourceMap, selectedDate: string) =>
	Object.entries({ ...resourcesMap }).reduce((acc, [key, value]) => {
		if (!value) {
			return [
				...acc,
				{
					id: uniqueId((Math.random() * Math.random()).toString()),
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

/* const isAllDayEvent = (selectedDate: string, eventStart: string, eventEnd: string) => {
	const startOfSelectedDate = dayjs(selectedDate).startOf('day')
	const endOfSelectedDate = dayjs(selectedDate).endOf('day')
	return dayjs(dayjs(eventStart)).isSameOrBefore(startOfSelectedDate) && dayjs(eventEnd).isSameOrAfter(endOfSelectedDate.subtract(1, 'minutes'))
} */

// ak je dlzka bg eventu mensia ako min dielik v kalendari (u nas 15 minut), tak ho to vytvori na vysku tohto min dielika
// preto treba tieto inverse-background evnety tiez takto upravit, aby sa potom neprekryvali srafy
const getBgEventEnd = (start: string, end: string) =>
	dayjs(end).diff(start, 'minutes') < CALENDAR_COMMON_SETTINGS.EVENT_MIN_DURATION ? dayjs(start).add(CALENDAR_COMMON_SETTINGS.EVENT_MIN_DURATION, 'minutes').toISOString() : end

const createBaseEvent = (event: CalendarEvent, resourceId: string, start: string, end: string) => ({
	id: event.id,
	resourceId,
	start,
	end,
	eventType: event.eventType,
	editable: !event.isMultiDayEvent,
	resourceEditable: !event.isMultiDayEvent,
	allDay: false,
	employee: event.employee,
	isMultiDayEvent: event.isMultiDayEvent,
	isLastMultiDaylEventInCurrentRange: event.isLastMultiDaylEventInCurrentRange,
	isFirstMultiDayEventInCurrentRange: event.isFirstMultiDayEventInCurrentRange,
	originalEvent: event.originalEvent
})

/*
 * Daily view helpers
 */
const composeDayViewReservations = (selectedDate: string, reservations: ICalendarEventsPayload['data'], shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees) => {
	const composedEvents: any[] = []
	// resources mapa, pre trackovanie, ci zamestnanec ma zmenu alebo dovolenku v dany den
	const resourcesMap = employees?.reduce((resources, employee) => {
		return {
			...resources,
			[employee.id]: 0
		}
	}, {} as ResourceMap)

	const events = [...(reservations || []), ...(shiftsTimeOffs || [])]

	events?.forEach((event) => {
		const employeeID = event.employee?.id

		const start = event.startDateTime
		const end = event.endDateTime

		if (employeeID && dayjs(start).isBefore(end)) {
			const calendarEvent = createBaseEvent(event, employeeID, start, end)
			const bgEventEnd = getBgEventEnd(start, end)

			switch (calendarEvent.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					composedEvents.push({
						...calendarEvent,
						end: bgEventEnd,
						groupId: 'not-set-availability',
						display: 'inverse-background'
					})
					resourcesMap[employeeID] += 1
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF: {
					composedEvents.push(
						{
							...calendarEvent,
							end: bgEventEnd,
							groupId: 'not-set-availability',
							display: 'inverse-background'
						},
						{
							...calendarEvent,
							end: bgEventEnd,
							groupId: `timeoff-${employeeID}`,
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

const composeDayViewAbsences = (shiftsTimeOffs: ICalendarEventsPayload['data']) => {
	const composedEvents: any[] = []

	shiftsTimeOffs?.forEach((event) => {
		const employeeID = event.employee?.id

		const start = event.startDateTime
		const end = event.endDateTime

		if (employeeID && dayjs(start).isBefore(end)) {
			composedEvents.push(createBaseEvent(event, employeeID, start, end))
		}
	})
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
			return composeDayViewAbsences(shiftsTimeOffs)
		case CALENDAR_EVENTS_VIEW_TYPE.RESERVATION:
		default:
			return composeDayViewReservations(selectedDate, reservations, shiftsTimeOffs, employees)
	}
}

export const composeDayViewResources = (shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees) => {
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

		let description = t('loc:Nenastavená zmena')

		if (employeeShifts.length) {
			const employeeWorkingHours = employeeShifts.reduce((result, cv, i) => {
				const startCv = cv.startDateTime
				const endCv = cv.endDateTime

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
			name: getAssignedUserLabel({
				id: employee.id,
				firstName: employee.firstName,
				lastName: employee?.lastName,
				email: employee.email
			}),
			eventBackgroundColor: employee.color,
			image: employee.image.resizedImages.thumbnail,
			description,
			isTimeOff: !!employeeTimeOff.length,
			employeeData: employee
		}
	})
}

/*
 * Weekly view helpers
 */
export const getWeekDays = (selectedDate: string) => {
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
	employeeColor?: string
	isTimeOff: boolean
	employeeData: Employees[0]
}

type WeekDayResource = { id: string; day: string; employee: EmployeeWeekResource }

export const composeWeekResources = (weekDays: string[], shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees): WeekDayResource[] => {
	return weekDays.reduce((resources, weekDay) => {
		const timeOffsWeekDay = shiftsTimeOffs?.filter((event) => dayjs(event.start.date).isSame(dayjs(weekDay)) && event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF)

		const weekDayEmployees = employees.map((employee) => {
			return {
				id: getWeekDayResourceID(employee.id, weekDay),
				day: weekDay,
				eventBackgroundColor: employee.color,
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

export const getWeekViewSelectedDate = (selectedDate: string, weekDays: string[]) => {
	const today = dayjs().startOf('day')
	return weekDays.some((day) => dayjs(day).startOf('day').isSame(today)) ? today.format(CALENDAR_DATE_FORMAT.QUERY) : selectedDate
}

const composeWeekViewReservations = (
	selectedDate: string,
	weekDays: string[],
	reservations: ICalendarEventsPayload['data'],
	shiftsTimeOffs: ICalendarEventsPayload['data'],
	employees: Employees
) => {
	const composedEvents: any[] = []

	// resources mapa, pre trackovanie, ci zamestnanec ma zmenu alebo dovolenku v dany den
	const resourcesMap = weekDays?.reduce((resources, weekDay) => {
		return {
			...resources,
			...employees.reduce((resourcesDay, employee) => {
				return {
					...resourcesDay,
					[getWeekDayResourceID(employee.id, weekDay)]: 0
				}
			}, {} as ResourceMap)
		}
	}, {} as ResourceMap)
	const events = [...(reservations || []), ...(shiftsTimeOffs || [])]

	events?.forEach((event) => {
		const startOriginal = event.startDateTime
		const start = getDateTime(selectedDate, event.start.time)
		const end = getDateTime(selectedDate, event.end.time)

		const employeeID = event.employee?.id
		const weekDayIndex = weekDays.findIndex((weekDay) => dayjs(weekDay).startOf('day').isSame(dayjs(startOriginal).startOf('day')))

		if (employeeID && dayjs(start).isBefore(end) && weekDayIndex >= 0) {
			const resourceId = getWeekDayResourceID(employeeID, weekDays[weekDayIndex])
			const calendarEvent = createBaseEvent(event, resourceId, start, end)
			const bgEventEnd = getBgEventEnd(start, end)

			switch (calendarEvent.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					composedEvents.push({
						...calendarEvent,
						end: bgEventEnd,
						groupId: 'not-set-availability',
						display: 'inverse-background'
					})
					resourcesMap[resourceId] += 1
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF: {
					composedEvents.push(
						{
							...calendarEvent,
							end: bgEventEnd,
							groupId: 'not-set-availability',
							display: 'inverse-background'
						},
						{
							...calendarEvent,
							end: bgEventEnd,
							groupId: `timeoff-${resourceId}`,
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

const composeWeekViewAbsences = (selectedDate: string, weekDays: string[], shiftsTimeOffs: ICalendarEventsPayload['data']) => {
	const composedEvents: any[] = []

	shiftsTimeOffs?.forEach((event) => {
		const startOriginal = getDateTime(event.start.date, event.start.time)
		const start = getDateTime(selectedDate, event.start.time)
		const end = getDateTime(selectedDate, event.end.time)

		const employeeID = event.employee?.id
		const weekDayIndex = weekDays.findIndex((weekDay) => dayjs(weekDay).startOf('day').isSame(dayjs(startOriginal).startOf('day')))

		if (employeeID && dayjs(start).isBefore(end) && weekDayIndex >= 0) {
			const resourceId = getWeekDayResourceID(employeeID, weekDays[weekDayIndex])
			composedEvents.push(createBaseEvent(event, resourceId, start, end))
		}
	})
	return composedEvents
}

export const composeWeekViewEvents = (
	selectedDate: string,
	weekDays: string[],
	eventTypeFilter: CALENDAR_EVENTS_VIEW_TYPE,
	reservations: ICalendarEventsPayload['data'],
	shiftsTimeOffs: ICalendarEventsPayload['data'],
	employees: Employees
) => {
	switch (eventTypeFilter) {
		case CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF:
			return composeWeekViewAbsences(selectedDate, weekDays, shiftsTimeOffs)
		case CALENDAR_EVENTS_VIEW_TYPE.RESERVATION:
		default:
			return composeWeekViewReservations(selectedDate, weekDays, reservations, shiftsTimeOffs, employees)
	}
}
