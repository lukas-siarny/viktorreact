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
import { composeDayEventResources, composeDayViewEvents, getCustomerName, getHoursMinutesFromMinutes } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon-16.svg'
import { ReactComponent as BreakIcon } from '../../../../assets/icons/break-icon-16.svg'

const renderEventContent = (data: EventContentArg) => {
	const { event } = data || {}
	const { extendedProps } = event || {}

	if (event.display === 'inverse-background') {
		return <div className={cx('nc-bg-event not-set-availability')} />
	}

	if (event.display === 'background') {
		return (
			<div
				className={cx('nc-bg-event', {
					break: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
					timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
				})}
			/>
		)
	}

	console.log({ event: extendedProps.eventType === CALENDAR_EVENT_TYPE.RESERVATION ? event : undefined })

	const diff = dayjs(event.end).diff(event.start, 'minutes')
	const timeText = `${dayjs(event.start).format(CALENDAR_DATE_FORMAT.TIME)}-${dayjs(event.end).format(CALENDAR_DATE_FORMAT.TIME)}`

	return (
		<div
			className={cx('nc-day-event', {
				reservation: extendedProps.eventType === CALENDAR_EVENT_TYPE.RESERVATION,
				shift: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				break: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				'min-15': Math.abs(diff) <= 15,
				'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 15
			})}
		>
			{(() => {
				switch (extendedProps.eventType) {
					case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
					case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK: {
						return (
							<div className={'event-content'}>
								<div className={'flex gap-1 justify-between min-w-0'}>
									<div className={'flex items-center gap-1 min-w-0'}>
										<span className={'color'} style={{ backgroundColor: extendedProps.employee?.color }} />
										{extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF && <AbsenceIcon className={'icon'} />}
										{extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK && <BreakIcon className={'icon'} />}
										<span className={'title'}>{extendedProps.employee?.name || extendedProps.employee?.email}</span>
									</div>
									<span className={'duration'}>{getHoursMinutesFromMinutes(diff)}</span>
								</div>
								<span className={'time'}>{timeText}</span>
							</div>
						)
					}
					case CALENDAR_EVENT_TYPE.RESERVATION:
					default: {
						const customerName = getCustomerName(extendedProps.customer)
						return (
							<>
								<div className={'event-accent'} style={{ backgroundColor: extendedProps.employee?.color }} />
								<div className={'event-background'} style={{ backgroundColor: extendedProps.employee?.color }} />
								<div className={'event-content'}>
									<div className={'flex flex-col gap-1'}>
										<span className={'time'}>{timeText}</span>
										{customerName && <span className={'title'}>{customerName}</span>}
										{extendedProps.service?.name && <span className={'desc'}>{extendedProps.service.name}</span>}
									</div>
									<div className={'service-icon'} style={{ backgroundImage: `url("${extendedProps.service?.icon}")` }} />
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
	const extendedProps = data?.resource.extendedProps || {}

	// normal state
	return (
		<div className={'nc-day-resource-label'}>
			<div className={'image w-6 h-6 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.image}")` }} />
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

	const handleDateClick = (arg: DateClickArg) => {
		// console.log({ arg })
	}

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
			// settings
			schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
			timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
			eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			plugins={[interactionPlugin, resourceTimeGridPlugin, scrollGrid]}
			height='100%'
			headerToolbar={false}
			initialView={'resourceTimeGridDay'}
			initialDate={selectedDate}
			scrollTime={CALENDAR_COMMON_SETTINGS.SCROLL_TIME}
			slotDuration={CALENDAR_COMMON_SETTINGS.SLOT_DURATION}
			slotLabelInterval={CALENDAR_COMMON_SETTINGS.SLOT_LABEL_INTERVAL}
			dayMinWidth={200}
			editable={hasResources}
			selectable={hasResources}
			weekends
			nowIndicator
			allDaySlot={false}
			stickyFooterScrollbar
			// data sources
			events={composeDayViewEvents(selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees)}
			resources={composeDayEventResources(shiftsTimeOffs, employees)}
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
