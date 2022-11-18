/* eslint-disable import/no-extraneous-dependencies */
import React, { useMemo } from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import FullCalendar, { CalendarApi, EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE } from '../../../../utils/enums'
import { composeWeekResources, composeWeekViewEvents, getHoursMinutesFromMinutes, getWeekDays, getWeekViewSelectedDate } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'
import { ReactComponent as BreakIcon } from '../../../../assets/icons/break-icon-16.svg'
import { getAssignedUserLabel } from '../../../../utils/helper'

const resourceAreaColumns = [
	{
		group: true,
		field: 'day',
		headerContent: null,
		width: 55,
		cellContent: (args: any) => {
			const { groupValue, fieldValue } = args || {}

			// ked je len jeden zamestnanec tak to posiela fieldValue, ak viacero tak groupValue
			const date = groupValue || fieldValue

			const dayName = dayjs(date).format('ddd')
			const dayNumber = dayjs(date).format('D')
			const isToday = dayjs(date).isToday()

			return (
				<div className={cx('nc-week-label-day', { 'is-today': isToday })}>
					<span>{dayName}</span>
					{dayNumber}
				</div>
			)
		}
	},
	{
		field: 'employee',
		headerContent: null,
		width: 145,
		cellContent: (args: any) => {
			const { resource } = args || {}
			const { extendedProps, eventBackgroundColor } = resource || {}
			const employee = extendedProps.employee || {}

			return (
				<div className={'nc-week-label-resource'}>
					<div className={'image'} style={{ backgroundImage: `url("${employee.image}")`, borderColor: eventBackgroundColor }} />
					<span className={'info block text-xs font-normal min-w-0 truncate max-w-full'}>{employee.name}</span>
					{employee.isTimeOff && (
						<div className={'absence-icon'}>
							<AbsenceIcon />
						</div>
					)}
				</div>
			)
		}
	}
]

const renderEventContent = (data: EventContentArg) => {
	const { event, backgroundColor } = data || {}
	const { extendedProps } = event || {}
	const { eventType, isMultiDayEvent, isLastMultiDaylEventInCurrentRange, isFirstMultiDayEventInCurrentRange } = extendedProps || {}

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
			className={cx('nc-week-event fc-event-title-container', {
				reservation: eventType === CALENDAR_EVENT_TYPE.RESERVATION,
				shift: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				timeoff: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				break: eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				'min-15': Math.abs(diff) <= 15,
				'min-30': Math.abs(diff) <= 30 && Math.abs(diff) > 15,
				'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 30,
				'min-75': Math.abs(diff) <= 75 && Math.abs(diff) > 45,
				'multiday-event': isMultiDayEvent,
				'multiday-event-first': isFirstMultiDayEventInCurrentRange,
				'multiday-event-last': isLastMultiDaylEventInCurrentRange
			})}
			// NOTE: len docasne, viac sa mi to ak paci
			style={eventType === CALENDAR_EVENT_TYPE.RESERVATION ? { outlineColor: backgroundColor } : undefined}
		>
			{(() => {
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
			})()}
		</div>
	)
}

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { date } = data || {}

	return <div className={'nc-week-slot-label'}>{dayjs(date).format('HH:mm')}</div>
}

interface ICalendarWeekView extends ICalendarView {
	calendarApi?: InstanceType<typeof CalendarApi>
}

const CalendarWeekView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarWeekView>((props, ref) => {
	const { selectedDate, calendarApi, eventsViewType, shiftsTimeOffs, reservations, employees } = props

	const handleDateClick = (arg: DateClickArg) => {
		console.log({ arg })
	}

	const handleSelect = (info: any) => {
		const { start, end, resource = {} } = info
	}

	const handleEventClick = (info: any) => {
		const { start, end, resource } = info
	}

	const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])
	const weekViewSelectedDate = getWeekViewSelectedDate(selectedDate, weekDays)

	return (
		<div className={'nc-calendar-week-wrapper'}>
			<FullCalendar
				ref={ref}
				// plugins
				plugins={[interactionPlugin, scrollGrid, resourceTimelinePlugin]}
				// settings
				schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
				timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
				slotLabelFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				scrollTime={CALENDAR_COMMON_SETTINGS.SCROLL_TIME}
				slotDuration={CALENDAR_COMMON_SETTINGS.SLOT_DURATION}
				slotLabelInterval={CALENDAR_COMMON_SETTINGS.SLOT_LABEL_INTERVAL}
				fixedMirrorParent={CALENDAR_COMMON_SETTINGS.FIXED_MIRROR_PARENT}
				eventConstraint={CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT}
				height='auto'
				slotMinWidth={25} // ak sa zmeni tato hodnota, je potrebne upravit min-width v _calendar.sass => .nc-week-event
				eventMinWidth={25}
				resourceAreaWidth={200}
				headerToolbar={false}
				initialView='resourceTimelineDay'
				initialDate={weekViewSelectedDate}
				weekends={true}
				editable
				selectable
				stickyFooterScrollbar
				nowIndicator
				// data sources
				events={composeWeekViewEvents(weekViewSelectedDate, weekDays, eventsViewType, reservations, shiftsTimeOffs, employees)}
				resources={composeWeekResources(weekDays, shiftsTimeOffs, employees)}
				resourceAreaColumns={resourceAreaColumns}
				// render hooks
				slotLabelContent={slotLabelContent}
				eventContent={renderEventContent}
				// handlers
				select={handleSelect}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
			/>
		</div>
	)
})

export default CalendarWeekView
