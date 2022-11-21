/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, FC, useCallback } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import { EventContentArg } from '@fullcalendar/react' // must go before plugins

// utils
import { CALENDAR_EVENT_TYPE, RESERVATION_SOURCE_TYPE, RESERVATION_STATE, CALENDAR_VIEW } from '../../../utils/enums'
import { getHoursMinutesFromMinutes, getTimeText } from '../calendarHelpers'
import { getAssignedUserLabel } from '../../../utils/helper'

// assets
import { ReactComponent as AbsenceIcon } from '../../../assets/icons/absence-icon.svg'
import { ReactComponent as BreakIcon } from '../../../assets/icons/break-icon-16.svg'

// components
import CalendarEventPopover from './CalendarEventPopover'

interface IEventCardProps {
	calendarView: CALENDAR_VIEW
	data: EventContentArg
	salonID: string
	onEditEvent: (eventId: string, eventType: CALENDAR_EVENT_TYPE) => void
}

interface IEventContentProps {
	data: EventContentArg
	diff: number
	timeText: string
}

const DayEventContent: FC<IEventContentProps> = ({ data, diff, timeText }) => {
	const { event, backgroundColor } = data || {}
	const { extendedProps } = event || {}
	const { eventType } = extendedProps || {}

	switch (eventType) {
		case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK: {
			return (
				<div className={'event-content'}>
					<div className={'event-info'}>
						<div className={'flex items-center gap-1 min-w-0'}>
							<span className={'color'} style={{ backgroundColor }} />
							{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
							{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
							{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'title'}>{extendedProps.employee?.name || extendedProps.employee?.email}</span>}
						</div>
						<span className={'duration'}>{getHoursMinutesFromMinutes(diff)}</span>
					</div>
					{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'time'}>{timeText}</span>}
				</div>
			)
		}
		case CALENDAR_EVENT_TYPE.RESERVATION:
		default: {
			return (
				<>
					<div className={'event-accent'} style={{ backgroundColor }} />
					<div className={'event-background'} style={{ backgroundColor }} />
					<div className={'event-content'}>
						<div className={'event-info'}>
							<div className={'title-wrapper'}>
								<span className={'title'}>
									{getAssignedUserLabel({
										id: extendedProps.customer?.id,
										firstName: extendedProps.customer?.firstName,
										lastName: extendedProps.customer?.lastName,
										email: extendedProps.customer?.email
									})}
								</span>
								<div className={'state'} style={{ backgroundColor }} />
							</div>
							<span className={'time'}>{timeText}</span>
							{extendedProps.service?.name && <span className={'desc'}>{extendedProps.service.name}</span>}
						</div>
						<div className={'icons'}>
							<span
								className={'icon customer'}
								style={{
									backgroundImage: extendedProps.customer?.image ? `url("${extendedProps.customer?.resizedImages?.thumbnail}")` : undefined
								}}
							/>
							<span className={'icon service'} style={{ backgroundImage: extendedProps.service?.icon ? `url("${extendedProps.service?.icon}")` : undefined }} />
						</div>
					</div>
				</>
			)
		}
	}
}

const WeekEventContent: FC<IEventContentProps> = ({ data, diff, timeText }) => {
	const { event, backgroundColor } = data || {}
	const { extendedProps } = event || {}
	const { eventType } = extendedProps || {}

	switch (eventType) {
		case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
		case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK: {
			return (
				<div className={'event-content'}>
					<div className={'sticky-container'}>
						<div className={'event-info'}>
							<span className={'color'} style={{ backgroundColor }} />
							{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
							{eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
							{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <span className={'time'}>{timeText}</span>}
						</div>
					</div>
					<span className={'duration'}>{getHoursMinutesFromMinutes(diff)}</span>
				</div>
			)
		}
		case CALENDAR_EVENT_TYPE.RESERVATION:
		default: {
			const state = <div className={'state'} style={{ backgroundColor }} />
			return (
				<>
					<div className={'event-accent'} style={{ backgroundColor }} />
					<div className={'event-background'} style={{ backgroundColor }} />
					<div className={'event-content'}>
						<div className={'title-wrapper'}>
							<span className={'title'}>
								{getAssignedUserLabel({
									id: extendedProps.customer?.id,
									firstName: extendedProps.customer?.firstName,
									lastName: extendedProps.customer?.lastName,
									email: extendedProps.customer?.email
								})}
							</span>
							{state}
						</div>
						{extendedProps.service?.name && <span className={'desc'}>{extendedProps.service.name}</span>}
						<div className={'icons'}>
							<div className={'service-icon'} style={{ backgroundImage: `url("${extendedProps.service?.icon}")` }} />
							{state}
						</div>
					</div>
				</>
			)
		}
	}
}

const CalendarEventCard: FC<IEventCardProps> = ({ calendarView, data, salonID, onEditEvent }) => {
	const { event, backgroundColor } = data || {}
	const { extendedProps } = event || {}
	const { eventType, isMultiDayEvent, isLastMultiDaylEventInCurrentRange, isFirstMultiDayEventInCurrentRange, originalEvent, reservationData } = extendedProps || {}

	const [isCardPopoverOpen, setIsCardPopoverOpen] = useState(false)

	const handleUpdateReservationState = useCallback(
		async (calendarEventID: string, state: RESERVATION_STATE, reason?: string) => {
			try {
				/* await patchReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}/state',
					{ calendarEventID, salonID },
					{ state, reason },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				) */
				console.log({ state })
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		},
		[salonID]
	)

	const diff = dayjs(event.end).diff(event.start, 'minutes')
	const timeText = getTimeText(event.start, event.end)
	const isPast = dayjs(originalEvent.endDateTime).isAfter(dayjs())

	return (
		<CalendarEventPopover
			event={originalEvent}
			start={event.start}
			end={event.end}
			isOpen={isCardPopoverOpen}
			color={backgroundColor}
			setIsOpen={setIsCardPopoverOpen}
			handleUpdateReservationState={handleUpdateReservationState}
			onEditEvent={onEditEvent}
		>
			<div
				className={cx('nc-event', {
					reservation: eventType === CALENDAR_EVENT_TYPE.RESERVATION,
					shift: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
					timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
					break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
					'multiday-event': isMultiDayEvent,
					'multiday-event-first': isFirstMultiDayEventInCurrentRange,
					'multiday-event-last': isLastMultiDaylEventInCurrentRange,
					'min-15': Math.abs(diff) <= 15,
					'min-30': Math.abs(diff) <= 30 && Math.abs(diff) > 15,
					'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 30,
					'min-75': Math.abs(diff) <= 75 && Math.abs(diff) > 45,
					focused: isCardPopoverOpen,
					'is-past': isPast,
					'is-online': reservationData?.createSourceType === RESERVATION_SOURCE_TYPE.ONLINE,
					'state-pending': reservationData?.state === RESERVATION_STATE.PENDING,
					'state-approved': reservationData?.state === RESERVATION_STATE.APPROVED,
					'state-realized': reservationData?.state === RESERVATION_STATE.REALIZED || reservationData?.state === RESERVATION_STATE.NOT_REALIZED,
					// daily view spacific classnames
					'nc-day-event': calendarView === CALENDAR_VIEW.DAY,
					// weekly view specific classnames,
					'nc-week-event': calendarView === CALENDAR_VIEW.WEEK
				})}
				onClick={() => {
					if (eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
						setIsCardPopoverOpen(true)
					} else {
						onEditEvent(originalEvent.id || event.id, eventType)
					}
				}}
				// style={eventType === CALENDAR_EVENT_TYPE.RESERVATION ? { outlineColor: backgroundColor } : undefined}
			>
				{(() => {
					switch (calendarView) {
						case CALENDAR_VIEW.WEEK:
							return <WeekEventContent diff={diff} timeText={timeText} data={data} />
						case CALENDAR_VIEW.DAY:
						default:
							return <DayEventContent diff={diff} timeText={timeText} data={data} />
					}
				})()}
			</div>
		</CalendarEventPopover>
	)
}

export default CalendarEventCard
