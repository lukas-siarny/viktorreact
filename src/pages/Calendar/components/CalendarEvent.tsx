import React, { FC } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import { EventContentArg } from '@fullcalendar/react' // must go before plugins

// utils
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../utils/enums'
import { getTimeText } from '../calendarHelpers'

// components
import AbsenceCard from './AbsenceCard'
import ReservationCard from './ReservationCard'

interface ICalendarEventProps {
	calendarView: CALENDAR_VIEW
	data: EventContentArg
	salonID: string
	onEditEvent: (eventId: string, eventType: CALENDAR_EVENT_TYPE) => void
}

const CalendarEvent: FC<ICalendarEventProps> = ({ calendarView, data, salonID, onEditEvent }) => {
	const { event } = data || {}
	const { extendedProps } = event || {}
	const { eventType } = extendedProps || {}

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

	const diff = dayjs(event.end).diff(event.start, 'minutes')
	const timeText = getTimeText(event.start, event.end)

	// normal events
	switch (eventType) {
		case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
			return <AbsenceCard calendarView={calendarView} diff={diff} timeText={timeText} data={data} onEditEvent={onEditEvent} />
		case CALENDAR_EVENT_TYPE.RESERVATION:
		default:
			return <ReservationCard calendarView={calendarView} diff={diff} timeText={timeText} data={data} salonID={salonID} onEditEvent={onEditEvent} />
	}
}

export default CalendarEvent
