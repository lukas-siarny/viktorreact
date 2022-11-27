import React, { useCallback, useImperativeHandle, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'
import dayjs from 'dayjs'
import { debounce } from 'lodash'

// fullcalendar
import FullCalendar, { EventDropArg } from '@fullcalendar/react'
import { EventResizeDoneArg } from '@fullcalendar/interaction'

// enums
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
// import CalendarMonthView from '../views/CalendarMonthView'
import CalendarEmptyState from '../CalendarEmptyState'

// types
import { CalendarEvent, Employees, ICalendarEventForm, ICalendarEventsPayload, ICalendarReservationForm } from '../../../../types/interfaces'
import { updateCalendarEvent } from '../../../../reducers/calendar/calendarActions'

type Props = {
	view: CALENDAR_VIEW
	selectedDate: string
	loading: boolean
	reservations: ICalendarEventsPayload['data']
	shiftsTimeOffs: ICalendarEventsPayload['data']
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	employees: Employees
	onShowAllEmployees: () => void
	showEmptyState: boolean
	salonID: string
	onEditEvent: (eventId: string, eventType: CALENDAR_EVENT_TYPE) => void
	handleSubmitReservation: (values: ICalendarReservationForm, onError?: () => void) => void
	handleSubmitEvent: (values: ICalendarEventForm, onError?: () => void) => void
}

export type CalendarRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof FullCalendar> | null
	/* [CALENDAR_VIEW.MONTH]?: InstanceType<typeof FullCalendar> | null */
}

const CalendarContent = React.forwardRef<CalendarRefs, Props>((props, ref) => {
	const {
		view,
		selectedDate,
		loading,
		eventsViewType,
		reservations,
		shiftsTimeOffs,
		employees,
		onShowAllEmployees,
		showEmptyState,
		salonID,
		onEditEvent,
		handleSubmitReservation,
		handleSubmitEvent
	} = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	// const monthView = useRef<InstanceType<typeof FullCalendar>>(null)

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current,
		[CALENDAR_VIEW.WEEK]: weekView?.current
		/* [CALENDAR_VIEW.MONTH]: monthView?.current */
	}))

	// const handleSubmitReservationDebounced = useCallback(debounce(handleSubmitReservation, 1000), [handleSubmitReservation])
	// const handleSubmitEventDebounced = useCallback(debounce(handleSubmitEvent, 1000), [handleSubmitEvent])

	const onEventChange = useCallback(
		(calendarView: CALENDAR_VIEW, arg: EventDropArg | EventResizeDoneArg) => {
			const { event } = arg
			const { start, end, extendedProps } = event
			const { newResource } = arg as EventDropArg

			const eventId = extendedProps.originalEvent?.id
			const calendarBulkEventID = extendedProps.originalEvent?.calendarBulkEvent?.id

			// ak sa zmenil resource, tak updatenut resource (to sa bude diat len pri drope)
			const employeeId = newResource ? newResource.extendedProps?.employee?.id : extendedProps?.originalEvent?.employee?.id

			// zatial predpokladame, ze nebudu viacdnove eventy - takze start a end date by mal byt rovnaky
			const startDajys = dayjs(start)
			const timeFrom = startDajys.format(CALENDAR_DATE_FORMAT.TIME)
			const timeTo = dayjs(end).format(CALENDAR_DATE_FORMAT.TIME)

			let date = startDajys.format(CALENDAR_DATE_FORMAT.QUERY)

			if (calendarView === CALENDAR_VIEW.WEEK) {
				// v pripadne tyzdnoveho view je potrebne ziskat datum z resource (kedze realne sa vyuziva denne view a jednotlive dni su resrouces)
				// (to sa bude diat len pri drope)
				const resource = event.getResources()[0]
				date = newResource ? newResource.extendedProps?.day : resource?.extendedProps?.day
			}

			if (!eventId && !employeeId) {
				// ak nahodou nemam eventID alebo employeeId tak to vrati na povodne miesto
				arg.revert()
				return
			}

			const values = {
				date,
				timeFrom,
				timeTo,
				eventType: extendedProps?.eventType,
				employee: {
					key: employeeId
				},
				eventId
			}

			const onError = () => {
				// ak neprejde request tak to vrati na pôvodne miesto
				arg.revert()
			}

			/* const startTime = {
				minutes: dayjs(start).minute(),
				seconds: dayjs(start).second()
			}

			const endTime = {
				minutes: dayjs(end).minute(),
				seconds: dayjs(end).second()
			}

			const updatedEvent = {
				...((extendedProps.originalEvent as CalendarEvent) || {}),
				start: {
					date,
					time: timeFrom
				},
				end: {
					date,
					time: timeTo
				},
				startDateTime: dayjs(date).add(startTime.minutes, 'minute').add(startTime.seconds, 'second').toISOString(),
				endDateTime: dayjs(date).add(endTime.minutes, 'minute').add(endTime.seconds, 'second').toISOString()
			}

			dispatch(updateCalendarEvent(updatedEvent)) */

			if (extendedProps.eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
				const customerId = extendedProps?.originalEvent?.customer?.id
				const serviceId = extendedProps?.originalEvent?.service?.id

				handleSubmitReservation({ ...values, customer: { key: customerId }, service: { key: serviceId } } as any, onError)
				return
			}
			handleSubmitEvent({ ...values, calendarBulkEventID } as ICalendarEventForm, onError)
		},
		[handleSubmitEvent, handleSubmitReservation]
	)

	const getView = () => {
		if (showEmptyState) {
			return <CalendarEmptyState onButtonClick={onShowAllEmployees} />
		}

		/* if (view === CALENDAR_VIEW.MONTH) {
			return (
				<CalendarMonthView
					ref={monthView}
					selectedDate={selectedDate}
					reservations={reservations}
					shiftsTimeOffs={shiftsTimeOffs}
					employees={employees}
					eventsViewType={eventsViewType}
					salonID={salonID}
					onEditEvent={onEditEvent}
				/>
			)
		} */

		if (view === CALENDAR_VIEW.WEEK) {
			return (
				<CalendarWeekView
					ref={weekView}
					selectedDate={selectedDate}
					reservations={reservations}
					shiftsTimeOffs={shiftsTimeOffs}
					employees={employees}
					eventsViewType={eventsViewType}
					salonID={salonID}
					onEditEvent={onEditEvent}
					onEventChange={onEventChange}
				/>
			)
		}

		return (
			<CalendarDayView
				ref={dayView}
				selectedDate={selectedDate}
				reservations={reservations}
				shiftsTimeOffs={shiftsTimeOffs}
				employees={employees}
				eventsViewType={eventsViewType}
				salonID={salonID}
				onEditEvent={onEditEvent}
				onEventChange={onEventChange}
			/>
		)
	}

	return (
		<Content className={'nc-content'}>
			<Spin spinning={loading}>
				<div id={'nc-content-overlay'} />
				{getView()}
			</Spin>
		</Content>
	)
})

export default React.memo(CalendarContent)
