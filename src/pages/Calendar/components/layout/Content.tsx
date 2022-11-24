import React, { useCallback, useImperativeHandle, useRef } from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'
import FullCalendar, { DateSpanApi, EventApi, EventDropArg } from '@fullcalendar/react'
import dayjs from 'dayjs'

// enums
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
// import CalendarMonthView from '../views/CalendarMonthView'
import CalendarEmptyState from '../CalendarEmptyState'

// types
import { Employees, ICalendarEventForm, ICalendarEventsPayload, ICalendarReservationForm } from '../../../../types/interfaces'

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
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
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

	const onEventDrop = useCallback(
		(calendarView: CALENDAR_VIEW, arg: EventDropArg) => {
			console.log({ arg })
			const { event, newResource } = arg
			const { start, end, extendedProps } = event

			const eventId = extendedProps.originalEvent?.id
			const calendarBulkEventID = extendedProps.originalEvent?.calendarBulkEvent?.id

			let employeeId = extendedProps?.employee?.id

			// zatial predpokladame, ze nebudu viacdnove eventy - takze start a end date by mal byt rovnaky
			const startDajys = dayjs(start)
			let date = startDajys.format(CALENDAR_DATE_FORMAT.QUERY)
			const timeFrom = startDajys.format(CALENDAR_DATE_FORMAT.TIME)
			const timeTo = dayjs(end).format(CALENDAR_DATE_FORMAT.TIME)

			if (newResource) {
				employeeId = newResource.extendedProps?.employee?.id

				if (calendarView === CALENDAR_VIEW.WEEK) {
					date = newResource.extendedProps?.day
				}
			}

			if (eventId && employeeId) {
				return
			}

			const values = {
				date,
				timeFrom,
				timeTo,
				employee: {
					key: employeeId
				},
				eventId
			}

			if (extendedProps.eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
				handleSubmitReservation(values as ICalendarReservationForm)
				return
			}
			handleSubmitEvent({ ...values, calendarBulkEventID } as ICalendarEventForm)
		},
		[handleSubmitReservation, handleSubmitEvent]
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
					onEventDrop={onEventDrop}
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
				onEventDrop={onEventDrop}
			/>
		)
	}

	return (
		<Content className={'nc-content'}>
			<Spin spinning={loading}>
				<div id={'nc-content-overlay'} />
				{getView()}
				{/* <div className={'nc-content-animate'} key={`${selectedDate} ${view} ${eventsViewType}`}>
					{getView()}
				</div> */}
			</Spin>
		</Content>
	)
})

export default CalendarContent
