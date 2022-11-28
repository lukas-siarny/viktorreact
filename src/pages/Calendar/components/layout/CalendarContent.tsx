import { Spin } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import React, { useCallback, useImperativeHandle, useRef } from 'react'

// fullcalendar
import { EventResizeDoneArg } from '@fullcalendar/interaction'
import FullCalendar, { EventDropArg } from '@fullcalendar/react'

// enums
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
// import CalendarMonthView from '../views/CalendarMonthView'
import CalendarEmptyState from '../CalendarEmptyState'

// types
import {
	ICalendarEventForm,
	ICalendarReservationForm,
	ICalendarView,
	IDayViewResourceExtenedProps,
	IEventExtenedProps,
	IWeekViewResourceExtenedProps
} from '../../../../types/interfaces'

type Props = {
	view: CALENDAR_VIEW
	loading: boolean
	onShowAllEmployees: () => void
	showEmptyState: boolean
	handleSubmitReservation: (values: ICalendarReservationForm, onError?: () => void) => void
	handleSubmitEvent: (values: ICalendarEventForm, onError?: () => void) => void
} & ICalendarView

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
		onAddEvent,
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

	const handleSubmitReservationDebounced = useCallback(debounce(handleSubmitReservation, 1000), [handleSubmitReservation])
	const handleSubmitEventDebounced = useCallback(debounce(handleSubmitEvent, 1000), [handleSubmitEvent])

	const onEventChange = useCallback(
		(calendarView: CALENDAR_VIEW, arg: EventDropArg | EventResizeDoneArg) => {
			const { event } = arg
			const { start, end } = event
			const { newResource } = arg as EventDropArg
			const eventExtenedProps = (event.extendedProps as IEventExtenedProps) || {}
			const eventData = eventExtenedProps?.eventData
			const newResourceExtendedProps = newResource?.extendedProps as IWeekViewResourceExtenedProps | IDayViewResourceExtenedProps

			const eventId = eventData?.id
			const calendarBulkEventID = eventData?.calendarBulkEvent?.id || eventData?.calendarBulkEvent

			// ak sa zmenil resource, tak updatenut resource (to sa bude diat len pri drope)
			const employeeId = newResource ? newResourceExtendedProps?.employee?.id : eventData?.employee.id

			// zatial predpokladame, ze nebudu viacdnove eventy - takze start a end date by mal byt rovnaky
			const startDajys = dayjs(start)
			const timeFrom = startDajys.format(CALENDAR_DATE_FORMAT.TIME)
			const timeTo = dayjs(end).format(CALENDAR_DATE_FORMAT.TIME)

			let date = startDajys.format(CALENDAR_DATE_FORMAT.QUERY)

			if (calendarView === CALENDAR_VIEW.WEEK) {
				// v pripadne tyzdnoveho view je potrebne ziskat datum z resource (kedze realne sa vyuziva denne view a jednotlive dni su resrouces)
				// (to sa bude diat len pri drope)
				const resource = event.getResources()[0]
				date = newResource ? (newResourceExtendedProps as IWeekViewResourceExtenedProps)?.day : resource?.extendedProps?.day
			}

			if (!eventId || !employeeId) {
				// ak nahodou nemam eventID alebo employeeId tak to vrati na povodne miesto
				arg.revert()
				return
			}

			const values = {
				date,
				timeFrom,
				timeTo,
				eventType: eventData?.eventType,
				employee: {
					key: employeeId
				},
				eventId
			}

			const onError = () => {
				// ak neprejde request tak to vrati na pôvodne miesto
				arg.revert()
			}

			if (eventData?.eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
				const customerId = eventData.customer?.id
				const serviceId = eventData.service?.id

				handleSubmitReservationDebounced({ ...values, customer: { key: customerId }, service: { key: serviceId } } as any, onError)
				return
			}
			handleSubmitEventDebounced({ ...values, calendarBulkEventID } as ICalendarEventForm, onError)
		},
		[handleSubmitReservationDebounced, handleSubmitEventDebounced]
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
					{...props}
					ref={weekView}
					selectedDate={selectedDate}
					reservations={reservations}
					shiftsTimeOffs={shiftsTimeOffs}
					employees={employees}
					eventsViewType={eventsViewType}
					salonID={salonID}
					onAddEvent={onAddEvent}
					onEditEvent={onEditEvent}
					onEventChange={onEventChange}
				/>
			)
		}

		return (
			<CalendarDayView
				{...props}
				ref={dayView}
				selectedDate={selectedDate}
				reservations={reservations}
				shiftsTimeOffs={shiftsTimeOffs}
				employees={employees}
				eventsViewType={eventsViewType}
				salonID={salonID}
				onAddEvent={onAddEvent}
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

export default CalendarContent
