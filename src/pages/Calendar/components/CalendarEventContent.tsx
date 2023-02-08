import React, { FC } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { useSearchParams } from 'react-router-dom'

// full calendar
import { EventContentArg } from '@fullcalendar/core'

// utils
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../utils/enums'
import { getTimeText } from '../calendarHelpers'

// components
import AbsenceCard from './AbsenceCard'
import ReservationCard from './ReservationCard'
import { IEventExtenedProps, ReservationPopoverData, ReservationPopoverPosition } from '../../../types/interfaces'

interface ICalendarEventProps {
	calendarView: CALENDAR_VIEW
	data: EventContentArg
	salonID: string
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	onReservationClick: (data: ReservationPopoverData, position: ReservationPopoverPosition) => void
}

const InverseBackgroundEvent = React.memo(() => <div className={cx('nc-bg-event not-set-availability')} />)

const BackgroundEvent: FC<{ eventType?: CALENDAR_EVENT_TYPE }> = React.memo(({ eventType }) => (
	<div
		className={cx('nc-bg-event', {
			break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
			timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
		})}
	/>
))

const CalendarEventContent: FC<ICalendarEventProps> = ({ calendarView, data, salonID, onEditEvent, onReservationClick }) => {
	const { event, backgroundColor } = data || {}
	const { start, end } = event || {}

	const { eventData } = (event.extendedProps as IEventExtenedProps) || {}

	const {
		id,
		start: eventStart,
		end: eventEnd,
		startDateTime,
		endDateTime,
		eventType,
		reservationData,
		service,
		customer,
		employee,
		note,
		noteFromB2CCustomer,
		isFirstMultiDayEventInCurrentRange,
		isLastMultiDaylEventInCurrentRange,
		isMultiDayEvent,
		calendarBulkEvent,
		isPlaceholder
	} = eventData || {}

	const [searchParams] = useSearchParams({
		eventId: ''
	})

	// background events
	if (event.display === 'inverse-background') {
		return <InverseBackgroundEvent />
	}

	if (event.display === 'background') {
		return <BackgroundEvent eventType={eventType as CALENDAR_EVENT_TYPE} />
	}

	const diff = dayjs(event.end).diff(event.start, 'minutes')
	const timeText = getTimeText(event.start, event.end)
	const resourceId = ''
	const originalEventData = {
		id,
		start: eventStart,
		end: eventEnd,
		startDateTime,
		endDateTime
	}

	const isEdit = searchParams.get('eventId') === originalEventData.id

	const timeLeftToEndOfaDay = calendarView === CALENDAR_VIEW.DAY || calendarView === CALENDAR_VIEW.WEEK ? dayjs(start).endOf('day').diff(dayjs(start), 'minutes') : undefined
	const timeLeftClassName = timeLeftToEndOfaDay && timeLeftToEndOfaDay < 14 ? `end-of-day-${14 - timeLeftToEndOfaDay}` : undefined

	// normal events
	switch (eventType) {
		case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
			return (
				<AbsenceCard
					calendarView={calendarView}
					diff={diff}
					timeText={timeText}
					resourceId={resourceId}
					start={start}
					end={end}
					employee={employee}
					backgroundColor={backgroundColor}
					isMultiDayEvent={isMultiDayEvent}
					isFirstMultiDayEventInCurrentRange={isFirstMultiDayEventInCurrentRange}
					isLastMultiDaylEventInCurrentRange={isLastMultiDaylEventInCurrentRange}
					onEditEvent={onEditEvent}
					originalEventData={originalEventData}
					eventType={eventType as CALENDAR_EVENT_TYPE}
					isBulkEvent={!!calendarBulkEvent?.id}
					isPlaceholder={isPlaceholder}
					isEdit={isEdit}
					timeLeftClassName={timeLeftClassName}
				/>
			)
		case CALENDAR_EVENT_TYPE.RESERVATION: {
			return (
				<ReservationCard
					calendarView={calendarView}
					onReservationClick={onReservationClick}
					resourceId={resourceId}
					start={start}
					end={end}
					diff={diff}
					timeText={timeText}
					salonID={salonID}
					reservationData={reservationData}
					customer={customer}
					service={service}
					employee={employee}
					note={note}
					noteFromB2CCustomer={noteFromB2CCustomer}
					backgroundColor={backgroundColor}
					isMultiDayEvent={isMultiDayEvent}
					isFirstMultiDayEventInCurrentRange={isFirstMultiDayEventInCurrentRange}
					isLastMultiDaylEventInCurrentRange={isLastMultiDaylEventInCurrentRange}
					originalEventData={originalEventData}
					isEdit={isEdit}
					isPlaceholder={isPlaceholder}
					timeLeftClassName={timeLeftClassName}
				/>
			)
		}
		default:
			return null
	}
}

export default React.memo(CalendarEventContent, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
