import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Modal, Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { uniqueId } from 'lodash'
import cx from 'classnames'

// full calendar
import FullCalendar, { FormatterInput } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import daygridPlugin from '@fullcalendar/daygrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_EVENT_TYPE, PERMISSION } from '../../../../utils/enums'
import { withPermissions } from '../../../../utils/Permissions'

// assets
import { RootState } from '../../../../reducers'

const TIME_FORMAT: FormatterInput = {
	hour: '2-digit',
	minute: '2-digit',
	separator: '-',
	hour12: false
}

const MONTH_VIEW = {
	DAY_MAX_EVENTS: 3
}

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

const CalendarDayView = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [range, setRange] = useState({
		start: '2022-10-10T00:00:00',
		end: '2022-10-10T23:59:59'
	})

	const events = useSelector((state: RootState) => state.calendar.events)

	// const [calendarStore, setCalendarStore] = useState<any>(INITIAL_CALENDAR_STATE)
	const [eventModalProps, setEventModalProps] = useState<any>({
		visible: false,
		data: {}
	})

	const handleDateClick = (arg: DateClickArg) => {
		console.log({ arg })
	}

	const handleSelect = (info: any) => {
		const { start, end, resource = {} } = info
		setEventModalProps({
			...eventModalProps,
			visible: true,
			data: {
				id: uniqueId(),
				resourceId: resource.id,
				title: '',
				start,
				end,
				allDay: false,
				description: '',
				accent: resource.extendedProps?.employeeData?.accent,
				avatar: resource.extendedProps?.employeeData?.image
			}
		})
	}

	const handleEventClick = (info: any) => {
		const { start, end, resource } = info

		console.log({ info })
	}

	return (
		<FullCalendar
			schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
			plugins={[daygridPlugin, interactionPlugin, resourceTimeGridPlugin, scrollGrid, resourceTimelinePlugin]}
			timeZone='local'
			slotLabelFormat={TIME_FORMAT}
			eventTimeFormat={TIME_FORMAT}
			height='auto'
			headerToolbar={false}
			initialView={'resourceTimeGridDay'}
			initialDate={range.start}
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

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(CalendarDayView)
