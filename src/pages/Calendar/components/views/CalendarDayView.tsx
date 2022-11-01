import React, { FC, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_EVENT_TYPE } from '../../../../utils/enums'
import { composeDayEventResources, composeDayViewEvents } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

const renderEventContent = (data: any) => {
	const { event, timeText } = data || {}
	const { extendedProps } = event || {}

	console.log({ event, timeText, extendedProps })

	if (event.display === 'background') {
		return (
			<div
				className={cx('noti-fc-bg-event', {
					shift: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
					timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
				})}
			/>
		)
	}

	return (
		<div className={'nc-day-event'}>
			<div className={'event-accent'} style={{ backgroundImage: extendedProps.employee?.accent }} />
			<div className={'event-background'}>
				<div className={'flex flex-col gap-1'}>
					{timeText}
					<strong>{event.title}</strong>
					<span className={'desc'}>{extendedProps.description}</span>
				</div>
			</div>
		</div>
	)
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

const slotLabelContent = (data: any) => {
	const { time } = data || {}

	return <div className={'nc-day-slot-label'}>{dayjs().startOf('day').add(time.milliseconds, 'millisecond').format('HH:mm')}</div>
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView: FC<ICalendarDayView> = (props) => {
	const { selectedDate, events, employees } = props

	const [t] = useTranslation()

	const handleDateClick = (arg: DateClickArg) => {
		console.log({ arg })
	}

	const handleSelect = (info: any) => {
		const { start, end, resource = {} } = info
	}

	const handleEventClick = (info: any) => {
		const { start, end, resource } = info
	}

	const calendarRef = useRef<any>()

	/* useEffect(() => {
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
			scrollTime={'08:00:00'}
			slotDuration={'00:15:00'}
			slotLabelInterval={'01:00:00'}
			dayMinWidth={200}
			editable
			selectable
			weekends
			allDaySlot={false}
			stickyFooterScrollbar
			events={composeDayViewEvents(events?.data, employees)}
			resources={composeDayEventResources(events?.data, employees)}
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
}

export default CalendarDayView
