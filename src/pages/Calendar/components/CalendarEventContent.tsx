import React, { FC } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { StringParam, useQueryParams } from 'use-query-params'

// utils
import { CALENDAR_EVENT_DISPLAY_TYPE, CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../utils/enums'
import { getTimeText } from '../calendarHelpers'

// components
import AbsenceCard from './AbsenceCard'
import ReservationCard from './ReservationCard'
import { ICalendarEventContent } from '../../../types/interfaces'

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
	const { start, end, eventData, eventDisplayType, calendarView, onEditEvent, onReservationClick, backgroundColor, isDayEventsPopover } = props

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

	const [query] = useQueryParams({
		eventId: StringParam
	})

	// background events
	if (eventDisplayType === CALENDAR_EVENT_DISPLAY_TYPE.INVERSE_BACKGROUND) {
		return <InverseBackgroundEvent />
	}

	if (eventDisplayType === CALENDAR_EVENT_DISPLAY_TYPE.BACKGROUND) {
		return <BackgroundEvent eventType={eventType as CALENDAR_EVENT_TYPE} />
	}

	const diff = dayjs(start).diff(end, 'minutes')
	const timeText = getTimeText(start, end, calendarView === CALENDAR_VIEW.MONTH)
	const resourceId = ''
	const originalEventData = {
		id,
		start: eventStart,
		end: eventEnd,
		startDateTime,
		endDateTime
	}

	const isEdit = query?.eventId === originalEventData.id
	const color = calendarView === CALENDAR_VIEW.MONTH ? employee?.color : backgroundColor

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
					isDayEventsPopover={isDayEventsPopover}
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
					isDayEventsPopover={isDayEventsPopover}
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
