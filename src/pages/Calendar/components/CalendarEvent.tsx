import React, { FC } from 'react'
import cx from 'classnames'

// full calendar
import { EventContentArg } from '@fullcalendar/react' // must go before plugins

// utils
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../utils/enums'

// components
import CalendarEventCard from './CalendarEventCard'

interface ICalendarEventProps {
	calendarView: CALENDAR_VIEW
	data: EventContentArg
	salonID: string
	onEditEvent: (eventId: string, eventType: CALENDAR_EVENT_TYPE) => void
}

const CalendarEvent: FC<ICalendarEventProps> = ({ calendarView, data, salonID, onEditEvent }) => {
	const { event } = data || {}

	// background events
	if (event.display === 'inverse-background') {
		return <div className={cx('nc-bg-event not-set-availability')} />
	}

	if (event.display === 'background') {
		return (
			<div
				className={cx('nc-bg-event', {
					break: event.extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
					timeoff: event.extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
				})}
			/>
		)
	}

	// normal events
	return <CalendarEventCard data={data} salonID={salonID} calendarView={calendarView} onEditEvent={onEditEvent} />
}

export default CalendarEvent
