/* eslint-disable import/no-cycle */
import { DateSpanApi, EventApi } from '@fullcalendar/react'
import dayjs from 'dayjs'
import i18next, { t } from 'i18next'
import { isEmpty, uniqueId, startsWith } from 'lodash'
import Scroll from 'react-scroll'
import { Paths } from '../../types/api'

// types
import {
	CalendarEvent,
	ICalendarEventsPayload,
	Employees,
	ICalendarEventCardData,
	IEventExtenedProps,
	IResourceEmployee,
	IWeekViewResourceExtenedProps,
	IDayViewResourceExtenedProps,
	DisabledNotificationsArray
} from '../../types/interfaces'

// utils
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_DATE_FORMAT,
	CALENDAR_DISABLED_NOTIFICATION_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	NEW_ID_PREFIX,
	NOTIFICATION_TYPES
} from '../../utils/enums'
import { getAssignedUserLabel, getDateTime } from '../../utils/helper'

/*
 * monthViewFull = true;
 * prida datumy aj z konca predosleho a zaciatku nasledujuceho mesiaca (do konca tyzdna + dalsi tyzden, tak to zobrazuje FC), aby sa vyplnilo cele mesacne view
 * monthViewFull = false;
 * vrati klasicky zaciatok a koniec mesiaca
 */

export const getSelectedDateRange = (view: CALENDAR_VIEW, selectedDate: string, monthViewFull = false, format: string | false = CALENDAR_DATE_FORMAT.QUERY) => {
	let result = {
		view,
		start: dayjs(selectedDate).startOf('day'),
		end: dayjs(selectedDate).endOf('day')
	}

	switch (view) {
		/* case CALENDAR_VIEW.MONTH: {
			const start = dayjs(selectedDate).startOf('month')
			const end = dayjs(selectedDate).endOf('month')
			result = {
				...result,
				view,
				start: monthViewFull ? start.startOf('week') : start,
				end: monthViewFull ? end.endOf('week').add(1, 'week') : end
			}
			break
		} */
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

export const isDateInRange = (start: string, end: string, date: string | dayjs.Dayjs) => dayjs(date).isSameOrAfter(start) && dayjs(date).isSameOrBefore(end)

export const isRangeAleardySelected = (view: CALENDAR_VIEW, currentSelectedDate: string, newSelectedDate: string | dayjs.Dayjs) => {
	const { start, end } = getSelectedDateRange(view, currentSelectedDate, false)
	return isDateInRange(start, end, newSelectedDate)
}

export const parseTimeFromMinutes = (minutes: number) => {
	const days = Math.floor(minutes / 1440)
	const hoursLeft = minutes % 1440
	const hours = Math.floor(hoursLeft / 60)
	const min = hoursLeft % 60

	return `${days ? `${days}${'d'} ${hours}h` : ''} ${!days && hours ? `${hours}${'h'}` : ''} ${min ? `${min}${'m'}` : ''}`.trim()
}

export const getTimeText = (start: Date | null, end: Date | null) => `${dayjs(start).format(CALENDAR_DATE_FORMAT.TIME)}-${dayjs(end).format(CALENDAR_DATE_FORMAT.TIME)}`

export const getTimeScrollId = (hour: number) => dayjs().startOf('day').add(Math.floor(hour), 'hour').format('HH:mm:ss')

type ResourceMap = {
	[key: string]: number
}

const createAllDayInverseEventFromResourceMap = (resourcesMap: ResourceMap, selectedDate: string) => {
	return Object.entries({ ...resourcesMap }).reduce((acc, [key, value]) => {
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
}

/* const isAllDayEvent = (selectedDate: string, eventStart: string, eventEnd: string) => {
	const startOfSelectedDate = dayjs(selectedDate).startOf('day')
	const endOfSelectedDate = dayjs(selectedDate).endOf('day')
	return dayjs(dayjs(eventStart)).isSameOrBefore(startOfSelectedDate) && dayjs(eventEnd).isSameOrAfter(endOfSelectedDate.subtract(1, 'minutes'))
} */

// ak je dlzka bg eventu mensia ako min dielik v kalendari (u nas 15 minut), tak ho to vytvorime ako 15 minutovy, lebo to vyzera divne potom
const getBgEventEnd = (start: string, end: string) =>
	dayjs(end).diff(start, 'minutes') < CALENDAR_COMMON_SETTINGS.EVENT_MIN_DURATION ? dayjs(start).add(CALENDAR_COMMON_SETTINGS.EVENT_MIN_DURATION, 'minutes').toISOString() : end

const createEmployeeResourceData = (employee: CalendarEvent['employee'], isTimeOff: boolean, description?: string): IResourceEmployee => {
	return {
		id: employee.id,
		name: getAssignedUserLabel({
			id: employee.id,
			firstName: employee.firstName,
			lastName: employee?.lastName,
			email: employee.email
		}),
		color: employee.color,
		image: employee.image.resizedImages.thumbnail,
		description,
		isTimeOff
	}
}

const createBaseEvent = (event: CalendarEvent, resourceId: string, start: string, end: string): ICalendarEventCardData => {
	const baseEvent = {
		id: event.id,
		resourceId,
		start,
		end,
		allDay: false,
		eventData: {
			...(event.originalEvent || event || {}),
			isMultiDayEvent: event.isMultiDayEvent,
			isLastMultiDaylEventInCurrentRange: event.isLastMultiDaylEventInCurrentRange,
			isFirstMultiDayEventInCurrentRange: event.isFirstMultiDayEventInCurrentRange
		}
	}

	// pri multidnovom evente zakazeme dnd a resize cez kalendar, pretoze to sposobuje viacero komplikacii
	// editable a resourceEditable nastavene na evente prebije aj globalne nastavene editable v kalendari
	// preto pri beznych eventoch tuto propu nenastavujeme, aby tieto evetny brali do uvahy globalne nastavenie v kalendari
	if (event.isMultiDayEvent) {
		return {
			...baseEvent,
			editable: false,
			resourceEditable: false
		}
	}

	return baseEvent
}

/**
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

			switch (calendarEvent.eventData.eventType) {
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
				case CALENDAR_EVENT_TYPE.RESERVATION:
					composedEvents.push({
						...calendarEvent
					})
					break
				default:
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
			description = t('loc:Voľno')
		}

		return {
			id: employee.id,
			eventBackgroundColor: employee.color,
			employee: createEmployeeResourceData(employee, !!employeeTimeOff.length, description)
		}
	})
}

/**
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

export const getWeekDayResourceID = (employeeID: string, weekDay: string) => `${weekDay}_${employeeID}`

interface EmployeeWeekResource {
	id: string
	name: string
	image: string
	employeeColor?: string
	isTimeOff: boolean
	employee: Employees[0]
}

type WeekDayResource = { id: string; day: string; employee: EmployeeWeekResource }

/**
 * Returns e.g.
	const weekDayResources = [
		{ id: `employeeID1_mondayDate`, day: mondayDate, employee: employee1Data },
		{ id: `employeeID2_mondayDate`, day: mondayDate, employee: employee2Data },
		{ id: `employeeID1_tuesdayDate`, day: tuesdayDate, employee: employee1Data },
		{ id: `employeeID2_tuesdayDate`, day: tuesdayDate, employee: employee2Data }
]
*/

export const composeWeekResources = (weekDays: string[], shiftsTimeOffs: ICalendarEventsPayload['data'], employees: Employees): WeekDayResource[] => {
	return weekDays.reduce((resources, weekDay) => {
		const timeOffsWeekDay = shiftsTimeOffs?.filter((event) => dayjs(event.start.date).isSame(dayjs(weekDay)) && event.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF)

		const weekDayEmployees = employees.map((employee) => {
			return {
				id: getWeekDayResourceID(employee.id, weekDay),
				eventBackgroundColor: employee.color,
				day: weekDay,
				employee: createEmployeeResourceData(employee, !!timeOffsWeekDay?.filter((timeOff) => timeOff.employee?.id === employee.id).length)
			}
		})
		return [...resources, ...weekDayEmployees]
	}, [] as any[])
}

export const getWeekViewSelectedDate = (weekDays: string[]) => {
	const today = dayjs().startOf('day')
	return weekDays.some((day) => dayjs(day).startOf('day').isSame(today)) ? today.format(CALENDAR_DATE_FORMAT.QUERY) : weekDays[0]
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

			switch (calendarEvent.eventData.eventType) {
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
				case CALENDAR_EVENT_TYPE.RESERVATION:
					composedEvents.push({
						...calendarEvent
					})
					break
				default:
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

export const eventAllow = (dropInfo: DateSpanApi, movingEvent: EventApi | null) => {
	const extenedProps: IEventExtenedProps | undefined = movingEvent?.extendedProps
	const { eventData } = extenedProps || {}

	if (eventData?.eventType === CALENDAR_EVENT_TYPE.RESERVATION || startsWith(movingEvent?.id, NEW_ID_PREFIX)) {
		return true
	}

	const resourceExtenedProps = dropInfo?.resource?.extendedProps as IWeekViewResourceExtenedProps | IDayViewResourceExtenedProps

	const resourceEmployeeId = resourceExtenedProps?.employee?.id
	const eventEmployeeId = eventData?.employee?.id

	return resourceEmployeeId === eventEmployeeId
}

export const getSelectedDateForCalendar = (view: CALENDAR_VIEW, selectedDate: string) => {
	switch (view) {
		case CALENDAR_VIEW.WEEK: {
			// v tyzdenom view je potrebne skontrolovat, ci sa vramci novo nastaveneho tyzdnoveho rangu nachadza dnesok
			// ak ano, je potrebne ho nastavit ako aktualny den do kalendara, aby sa ukazal now indicator
			// kedze realne sa na tyzdenne view pouziva denne view
			const weekDays = getWeekDays(selectedDate)
			return getWeekViewSelectedDate(weekDays)
		}
		case CALENDAR_VIEW.DAY:
		default:
			return selectedDate
	}
}

export const scrollToSelectedDate = (scrollId: string, options?: Object) => {
	// scroll ID je datum v tvare YYYY-MM-DD
	Scroll.scroller.scrollTo(scrollId, {
		containerId: 'nc-calendar-week-wrapper',
		offset: -25, // - hlavicka
		...(options || {})
	})
}

/**
 * @param baseNotificationText base notification text
 * @param disabledNotificationTypes array of disabled notification types to check if they are included in disabled notications types source
 * @param disabledNotificationsSource source of disabled notifications types
 * @return string
 *
 *  Return base notification text including information whether employee, customer, both or none of them will be notified
 *
 */
export const getConfirmModalText = (
	baseNotificationText: string,
	disabledNotificationTypesToCheck: CALENDAR_DISABLED_NOTIFICATION_TYPE[],
	disabledNotificationsSource?: DisabledNotificationsArray
) => {
	let isCustomerNotified = true
	let isEmployeeNotified = true

	disabledNotificationTypesToCheck.forEach((notificationToCheck) => {
		const disabledNotificationSource = disabledNotificationsSource?.find((notificationSource) => notificationSource.eventType === notificationToCheck)
		// when array length is equal to NOTIFICATION_TYPES length it means all notifications are disabled for entity
		if (disabledNotificationSource && disabledNotificationSource?.channels?.length === NOTIFICATION_TYPES.length) {
			if (disabledNotificationSource?.eventType?.endsWith('CUSTOMER')) {
				isCustomerNotified = false
			}
			if (disabledNotificationSource?.eventType?.endsWith('EMPLOYEE')) {
				isEmployeeNotified = false
			}
		}
	})

	const notifiactionText = (entity: string) => i18next.t('loc:{{entity}} dostane notifikáciu.', { entity })

	if (isCustomerNotified && isEmployeeNotified) {
		return `${baseNotificationText} ${i18next.t('loc:Zamestnanec aj zákazník dostanú notifikáciu.')}`
	}

	if (isCustomerNotified) {
		return `${baseNotificationText} ${notifiactionText(i18next.t('loc:Zákazník'))}`
	}

	if (isEmployeeNotified) {
		return `${baseNotificationText} ${notifiactionText(i18next.t('loc:Zamestnanec'))}`
	}

	return baseNotificationText
}
