import React, { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import FullCalendar, { EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_EVENT_TYPE, CALENDAR_EVENT_TYPE_FILTER } from '../../../../utils/enums'
import { composeDayEventResources, composeDayViewEvents } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

const renderEventContent = (data: EventContentArg, eventType: CALENDAR_EVENT_TYPE_FILTER) => {
	const { event, timeText } = data || {}
	const { extendedProps } = event || {}

	console.log({ event, timeText, extendedProps })

	if (event.display === 'inverse-background') {
		return <div className={cx('nc-bg-event not-set-availability')} />
	}

	switch (eventType) {
		case CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF:
			return (
				<div
					className={cx('nc-day-event', {
						shift: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
						timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
						break: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK
					})}
				>
					<div className={'flex flex-col gap-1'}>
						<div className={'flex gap-1 items-center'}>
							<div className={'image w-4 h-4 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.employee?.image}")` }} />
							<span className={'title'}>{extendedProps.employee?.name || extendedProps.employee?.email}</span>
						</div>
						<span className={'time'}>{timeText}</span>
					</div>
				</div>
			)
		case CALENDAR_EVENT_TYPE_FILTER.RESERVATION:
		default: {
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

			const diff = dayjs(event.end).diff(event.start, 'minutes')

			return (
				<div className={'nc-day-event reservation'}>
					<div className={'event-accent'} style={{ backgroundColor: extendedProps.employee?.color }} />
					<div className={'event-background'} style={{ backgroundColor: extendedProps.employee?.color }} />
					<div className={'event-content'}>
						<div className={'flex flex-col gap-1'}>
							<span className={cx('time', { hidden: Math.abs(diff) < 45 })}>{timeText}</span>
							<span className={'title'}>{extendedProps.customer?.name}</span>
							<span className={'desc'}>{extendedProps.service?.name}</span>
						</div>
					</div>
				</div>
			)
		}
	}
}

const resourceLabelContent = (data: any) => {
	const extendedProps = data?.resource.extendedProps || {}

	return (
		<div className={'nc-day-resource-label'}>
			<div className={'image w-6 h-6 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.image}")` }} />
			<div className={'info flex flex-col justify-start text-xs font-normal min-w-0'}>
				<span className={'name'}>{extendedProps.name}</span>
				<span className={'description'}>{extendedProps.description}</span>
			</div>
		</div>
	)
}

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { time } = data || {}

	return <div className={'nc-day-slot-label'}>{dayjs().startOf('day').add(time.milliseconds, 'millisecond').format('HH:mm')}</div>
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView: FC<ICalendarDayView> = (props) => {
	const { selectedDate, eventType, events, employees } = props

	const [t] = useTranslation()

	const handleDateClick = (arg: DateClickArg) => {
		// console.log({ arg })
	}

	const handleSelect = (info: any) => {
		const { start, end, resource = {} } = info
	}

	const handleEventClick = (info: any) => {
		const { start, end, resource } = info
	}

	/* const calendarRef = useRef<any>()

	useEffect(() => {
		const calendarApi = calendarRef.current.getApi()
		calendarApi.scrollToTime({
			milliseconds: 28800000
		})
	}, []) */

	return (
		<FullCalendar
			// settings
			schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
			timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
			// slotLabelFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
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
			editable
			selectable
			weekends
			nowIndicator
			allDaySlot={false}
			stickyFooterScrollbar
			events={composeDayViewEvents(selectedDate, eventType, events?.data, employees)}
			resources={composeDayEventResources(events?.data, employees)}
			// render hooks
			resourceLabelContent={resourceLabelContent}
			eventContent={(args) => renderEventContent(args, eventType)}
			slotLabelContent={slotLabelContent}
			// handlers
			select={handleSelect}
			dateClick={handleDateClick}
			eventClick={handleEventClick}
		/>
	)
}

export default CalendarDayView
