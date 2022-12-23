import { EventContentArg } from '@fullcalendar/react'
import React from 'react'
import { PopoverTriggerPosition, ReservationPopoverData } from '../../types/interfaces'
import { CALENDAR_EVENT_DISPLAY_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../utils/enums'
import CalendarEventContent from './components/CalendarEventContent'

export default (
	data: EventContentArg,
	calendarView: CALENDAR_VIEW,
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void,
	onReservationClick: (data: ReservationPopoverData, position: PopoverTriggerPosition) => void
) => {
	const { event, backgroundColor } = data || {}
	const { display = CALENDAR_EVENT_DISPLAY_TYPE.REGULAR, start, end, extendedProps } = event || {}

	return (
		<CalendarEventContent
			start={start}
			end={end}
			backgroundColor={backgroundColor}
			eventDisplayType={display as CALENDAR_EVENT_DISPLAY_TYPE}
			calendarView={calendarView}
			eventData={extendedProps?.eventData}
			onEditEvent={onEditEvent}
			onReservationClick={onReservationClick}
		/>
	)
}
