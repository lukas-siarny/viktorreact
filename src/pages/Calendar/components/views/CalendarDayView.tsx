import React from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import FullCalendar, { EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE } from '../../../../utils/enums'
import { composeDayViewResources, composeDayViewEvents, getHoursMinutesFromMinutes } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'
import { ReactComponent as BreakIcon } from '../../../../assets/icons/break-icon-16.svg'

// utils
import { getAssignedUserLabel } from '../../../../utils/helper'

const renderEventContent = (data: EventContentArg) => {
	const { event, backgroundColor } = data || {}
	const { extendedProps } = event || {}
	const { eventType } = extendedProps || {}

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

	const diff = dayjs(event.end).diff(event.start, 'minutes')
	const timeText = `${dayjs(event.start).format(CALENDAR_DATE_FORMAT.TIME)}-${dayjs(event.end).format(CALENDAR_DATE_FORMAT.TIME)}`

	return (
		<div
			className={cx('nc-day-event', {
				reservation: eventType === CALENDAR_EVENT_TYPE.RESERVATION,
				shift: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				'min-15': Math.abs(diff) <= 15,
				'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 15
			})}
			// NOTE: len docasne, viac sa mi to
			style={eventType === CALENDAR_EVENT_TYPE.RESERVATION ? { outlineColor: backgroundColor } : undefined}
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
											style={{ backgroundImage: extendedProps.customer?.image ? `url("${extendedProps.customer?.image}")` : undefined }}
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
	)
}

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

interface ICalendarDayView extends ICalendarView {
	onShowAllEmployees: () => void
}

const CalendarDayView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarDayView>((props, ref) => {
	const { selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees } = props

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
			eventContent={renderEventContent}
			slotLabelContent={slotLabelContent}
			// handlers
			select={handleSelect}
			dateClick={handleDateClick}
			eventClick={handleEventClick}
		/>
	)
})

export default CalendarDayView
