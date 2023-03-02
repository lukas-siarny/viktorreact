import React, { FC } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { useSearchParams } from 'react-router-dom'

// utils
import { CALENDAR_EVENT_DISPLAY_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../../utils/enums'
import { getTimeText } from '../../calendarHelpers'

// components
import AbsenceCard from './AbsenceCard'
import ReservationCard from './ReservationCard'

// types
import { ICalendarEventContent } from '../../../../types/interfaces'

const InverseBackgroundEvent = React.memo(() => <div className={cx('nc-bg-event not-set-availability')} />)

const BackgroundEvent: FC<{ eventType?: CALENDAR_EVENT_TYPE }> = React.memo(({ eventType }) => (
	<div
		className={cx('nc-bg-event', {
			break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
			timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
		})}
	/>
))

const CalendarEventContent: FC<ICalendarEventContent> = (props) => {
	const { start, end, eventData, eventDisplayType, calendarView, onEditEvent, onReservationClick, backgroundColor, isEventsListPopover } = props

	const {
		id: originalEventId,
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
	if (eventDisplayType === CALENDAR_EVENT_DISPLAY_TYPE.INVERSE_BACKGROUND) {
		return <InverseBackgroundEvent />
	}

	if (eventDisplayType === CALENDAR_EVENT_DISPLAY_TYPE.BACKGROUND) {
		return <BackgroundEvent eventType={eventType as CALENDAR_EVENT_TYPE} />
	}

	const diff = dayjs(end).diff(start, 'minutes')
	const timeText = getTimeText(start, end, calendarView === CALENDAR_VIEW.MONTH)
	const resourceId = ''
	const originalEventData = {
		id: originalEventId,
		start: eventStart,
		end: eventEnd,
		startDateTime,
		endDateTime
	}

	const isEdit = searchParams.get('eventId') === originalEventData.id
	const color = calendarView === CALENDAR_VIEW.MONTH ? employee?.color : backgroundColor

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
					backgroundColor={color}
					isMultiDayEvent={isMultiDayEvent}
					isFirstMultiDayEventInCurrentRange={isFirstMultiDayEventInCurrentRange}
					isLastMultiDaylEventInCurrentRange={isLastMultiDaylEventInCurrentRange}
					onEditEvent={onEditEvent}
					originalEventData={originalEventData}
					eventType={eventType as CALENDAR_EVENT_TYPE}
					isBulkEvent={!!calendarBulkEvent?.id}
					isPlaceholder={isPlaceholder}
					isEdit={isEdit}
					isEventsListPopover={isEventsListPopover}
					timeLeftClassName={timeLeftClassName}
				/>
			)
		case CALENDAR_EVENT_TYPE.RESERVATION:
		case CALENDAR_EVENT_TYPE.RESERVATION_FROM_IMPORT: {
			return (
				<ReservationCard
					calendarView={calendarView}
					onReservationClick={onReservationClick}
					resourceId={resourceId}
					start={start}
					end={end}
					diff={diff}
					timeText={timeText}
					reservationData={reservationData}
					customer={customer}
					service={service}
					employee={employee}
					backgroundColor={color}
					note={note}
					noteFromB2CCustomer={noteFromB2CCustomer}
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
