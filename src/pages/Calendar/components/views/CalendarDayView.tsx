import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// full calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_EVENT_TYPE } from '../../../../utils/enums'

// assets
import { ICalendarView } from '../../../../types/interfaces'

const renderEventContent = (eventInfo: any) => {
	const { event, timeText } = eventInfo || {}
	const { extendedProps } = event || {}

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
		<div className={'noti-fc-event'}>
			<div className={'event-accent'} style={{ background: extendedProps.employee?.accent }} />
			<div className={'flex flex-col gap-1'}>
				{timeText}
				<strong>{event.title}</strong>
				<span className={'desc'}>{extendedProps.description}</span>
			</div>
		</div>
	)
}

const resourceLabelContent = (labelInfo: any) => {
	const employee = labelInfo?.resource.extendedProps.employeeData || {}

	return (
		<div className='noti-fc-resource-label'>
			<div className='image w-6 h-6 bg-notino-gray' style={{ background: `url("${employee.image}")` }} />
			<div>
				{employee.name}
				<br />
				<span className='description'>{labelInfo.resource.extendedProps.description}</span>
			</div>
		</div>
	)
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView: FC<ICalendarDayView> = (props) => {
	const { selectedDate } = props

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

	return (
		<FullCalendar
			// key={selectedDate}
			schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
			timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
			slotLabelFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			plugins={[interactionPlugin, resourceTimeGridPlugin, scrollGrid]}
			height='auto'
			headerToolbar={false}
			initialView={'resourceTimeGridDay'}
			initialDate={selectedDate}
			resourceLabelContent={resourceLabelContent}
			eventContent={renderEventContent}
			editable
			selectable
			weekends
			allDaySlot={false}
			stickyFooterScrollbar
			events={[]}
			resources={[]}
			select={handleSelect}
			dateClick={handleDateClick}
			eventClick={handleEventClick}
		/>
	)
}

export default CalendarDayView
