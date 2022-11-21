import React from 'react'
import dayjs from 'dayjs'

// full calendar
import FullCalendar, { SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW } from '../../../../utils/enums'
import { composeDayViewResources, composeDayViewEvents } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'

// components
import CalendarEvent from '../CalendarEvent'

/*  interface ICardProps {
	data: EventContentArg
	salonID: string
	onEditEvent: (eventId: string, eventType: CALENDAR_EVENT_TYPE) => void
}

const EventCard: FC<ICardProps> = ({ data, salonID, onEditEvent }) => {
	const { event, backgroundColor } = data || {}
	const { extendedProps } = event || {}
	const { eventType, isMultiDayEvent, isLastMultiDaylEventInCurrentRange, isFirstMultiDayEventInCurrentRange, originalEvent, reservationData } = extendedProps || {}

	const [isCardPopoverOpen, setIsCardPopoverOpen] = useState(false)

	const handleUpdateReservationState = useCallback(
		async (calendarEventID: string, state: RESERVATION_STATE, reason?: string) => {
			try {
				await patchReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}/state',
					{ calendarEventID, salonID },
					{ state, reason },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
				console.log({ state })
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		},
		[salonID]
	)

	if (event.display === 'inverse-background') {
		return <div className={cx('nc-bg-event not-set-availability')} />
	}

	if (event.display === 'background') {
		return (
			<div
				className={cx('nc-bg-event', {
					break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
					timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
				})}
			/>
		)
	}

	console.log(event)

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
				className={cx('nc-day-event', {
					reservation: eventType === CALENDAR_EVENT_TYPE.RESERVATION,
					shift: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
					timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
					break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
					'min-15': Math.abs(diff) <= 15,
					'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 15,
					'multiday-event': isMultiDayEvent,
					'multiday-event-first': isFirstMultiDayEventInCurrentRange,
					'multiday-event-last': isLastMultiDaylEventInCurrentRange,
					focused: isCardPopoverOpen,
					'is-past': isPast,
					'is-online': reservationData?.createSourceType === RESERVATION_SOURCE_TYPE.ONLINE,
					'state-pending': reservationData?.state === RESERVATION_STATE.PENDING,
					'state-approved': reservationData?.state === RESERVATION_STATE.APPROVED,
					'state-done': reservationData?.state === RESERVATION_STATE.REALIZED || reservationData?.state === RESERVATION_STATE.NOT_REALIZED
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
											{eventType !== CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && (
												<span className={'title'}>{extendedProps.employee?.name || extendedProps.employee?.email}</span>
											)}
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
											<span
												className={'icon service'}
												style={{ backgroundImage: extendedProps.service?.icon ? `url("${extendedProps.service?.icon}")` : undefined }}
											/>
										</div>
									</div>
								</>
							)
						}
					}
				})()}
			</div>
		</CalendarEventPopover>
	)
} */

const resourceLabelContent = (data: any) => {
	const { resource } = data || {}
	const extendedProps = resource?.extendedProps
	const color = resource?.eventBackgroundColor

	return (
		<div className={'nc-day-resource-label'}>
			<div className={'image w-6 h-6 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.image}")`, borderColor: color }} />
			<div className={'info flex flex-col justify-start text-xs font-normal min-w-0'}>
				<span className={'name'}>{extendedProps.name}</span>
				<span className={'description'}>{extendedProps.description}</span>
			</div>
			{extendedProps.isTimeOff && (
				<div className={'absence-icon'}>
					<AbsenceIcon />
				</div>
			)}
		</div>
	)
}

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { time } = data || {}

	return <div className={'nc-day-slot-label'}>{dayjs().startOf('day').add(time.milliseconds, 'millisecond').format(CALENDAR_DATE_FORMAT.TIME)}</div>
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarDayView>((props, ref) => {
	const { salonID, selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees, onEditEvent } = props

	const handleDateClick = (arg: DateClickArg) => {}

	const handleSelect = (info: any) => {
		const { start, end, resource = {} } = info
	}

	const handleEventClick = (info: any) => {
		const { start, end, resource } = info
	}

	const hasResources = !!employees.length

	return (
		<FullCalendar
			ref={ref}
			// plugins
			plugins={[interactionPlugin, resourceTimeGridPlugin, scrollGrid]}
			// settings
			schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
			timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
			eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			height='100%'
			headerToolbar={false}
			initialView={'resourceTimeGridDay'}
			initialDate={selectedDate}
			scrollTime={CALENDAR_COMMON_SETTINGS.SCROLL_TIME}
			slotDuration={CALENDAR_COMMON_SETTINGS.SLOT_DURATION}
			slotLabelInterval={CALENDAR_COMMON_SETTINGS.SLOT_LABEL_INTERVAL}
			fixedMirrorParent={CALENDAR_COMMON_SETTINGS.FIXED_MIRROR_PARENT}
			eventConstraint={CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT}
			// je potrebne nechat nastavene na 0, pretoze potom to zle rendruje background eventy, ktore su po 23:45 (snazi sa tam spravit min 15 minutovu vysku aj ked ma event len 1 minutu)
			// pre bezne eventy je potom nastavena min-height cez cssko .nc-day-event
			eventMinHeight={0}
			dayMinWidth={240}
			editable={hasResources}
			selectable={hasResources}
			weekends
			nowIndicator
			allDaySlot={false}
			stickyFooterScrollbar
			// data sources
			events={composeDayViewEvents(selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees)}
			resources={composeDayViewResources(shiftsTimeOffs, employees)}
			// render hooks
			resourceLabelContent={resourceLabelContent}
			eventContent={(data) => <CalendarEvent calendarView={CALENDAR_VIEW.DAY} data={data} salonID={salonID} onEditEvent={onEditEvent} />}
			slotLabelContent={slotLabelContent}
			// handlers
			select={handleSelect}
			dateClick={handleDateClick}
			eventClick={handleEventClick}
		/>
	)
})

export default CalendarDayView
