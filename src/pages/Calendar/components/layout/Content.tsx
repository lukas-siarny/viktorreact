import React, { useCallback, useImperativeHandle, useRef } from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'
import FullCalendar, { DateSpanApi, EventApi } from '@fullcalendar/react'

// enums
import { CALENDAR_EVENTS_VIEW_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
// import CalendarMonthView from '../views/CalendarMonthView'
import CalendarEmptyState from '../CalendarEmptyState'

// types
import { Employees, ICalendarEventsPayload } from '../../../../types/interfaces'

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
}

export type CalendarRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof FullCalendar> | null
	/* [CALENDAR_VIEW.MONTH]?: InstanceType<typeof FullCalendar> | null */
}

const allowDropAndUpdateData = (dropInfo: DateSpanApi, movingEvent: EventApi | null) => {
	// TODO: update dat cez CB
	const isReservation = movingEvent?.extendedProps?.eventType === CALENDAR_EVENT_TYPE.RESERVATION

	if (isReservation) {
		return true
	}

	const resourceEmployeeId = dropInfo?.resource?.extendedProps?.employee?.id
	const eventEmployeeId = movingEvent?.extendedProps.employee?.id

	return resourceEmployeeId === eventEmployeeId
}

const CalendarContent = React.forwardRef<CalendarRefs, Props>((props, ref) => {
	const { view, selectedDate, loading, eventsViewType, reservations, shiftsTimeOffs, employees, onShowAllEmployees, showEmptyState, salonID, onEditEvent } = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	// const monthView = useRef<InstanceType<typeof FullCalendar>>(null)

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current,
		[CALENDAR_VIEW.WEEK]: weekView?.current
		/* [CALENDAR_VIEW.MONTH]: monthView?.current */
	}))

	const eventAllow = useCallback((dropInfo: DateSpanApi, movingEvent: EventApi | null) => allowDropAndUpdateData(dropInfo, movingEvent), [])

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
					eventAllow={eventAllow}
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
				eventAllow={eventAllow}
			/>
		)
	}

	return (
		<Content className={'nc-content'}>
			<Spin spinning={loading}>
				<div id={'nc-content-overlay'} />
				<div className={'nc-content-animate'} key={`${selectedDate} ${view} ${eventsViewType}`}>
					{getView()}
				</div>
			</Spin>
		</Content>
	)
})

export default CalendarContent
