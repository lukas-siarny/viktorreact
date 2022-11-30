import React, { FC } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'
import { StringParam, useQueryParams } from 'use-query-params'

// full calendar
import { EventContentArg } from '@fullcalendar/react' // must go before plugins

// utils
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW } from '../../../utils/enums'
import { getTimeText } from '../calendarHelpers'

// components
import AbsenceCard from './AbsenceCard'
import ReservationCard from './ReservationCard'
import { IEventExtenedProps } from '../../../types/interfaces'

interface ICalendarEventProps {
	calendarView: CALENDAR_VIEW
	data: EventContentArg
	salonID: string
	onEditEvent: (eventType: CALENDAR_EVENT_TYPE, eventId: string) => void
	refetchData: () => void
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

const CalendarEventContent: FC<ICalendarEventProps> = ({ calendarView, data, salonID, onEditEvent, refetchData }) => {
	const { event, backgroundColor } = data || {}
	const { start, end } = event || {}
	const { eventData, isPlaceholder } = (event.extendedProps as IEventExtenedProps) || {}
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
		isFirstMultiDayEventInCurrentRange,
		isLastMultiDaylEventInCurrentRange,
		isMultiDayEvent,
		calendarBulkEvent
	} = eventData || {}

	const [query] = useQueryParams({
		eventId: StringParam
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

	const isEdit = query?.eventId === originalEventData.id

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
				/>
			)
		case CALENDAR_EVENT_TYPE.RESERVATION: {
			return (
				<ReservationCard
					calendarView={calendarView}
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
					backgroundColor={backgroundColor}
					isMultiDayEvent={isMultiDayEvent}
					isFirstMultiDayEventInCurrentRange={isFirstMultiDayEventInCurrentRange}
					isLastMultiDaylEventInCurrentRange={isLastMultiDaylEventInCurrentRange}
					onEditEvent={onEditEvent}
					originalEventData={originalEventData}
					refetchData={refetchData}
					isEdit={isEdit}
				/>
			)
		}
		default:
			return null
	}
}

export default CalendarEventContent
