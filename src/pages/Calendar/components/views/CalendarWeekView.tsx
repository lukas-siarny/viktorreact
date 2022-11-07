/* eslint-disable import/no-extraneous-dependencies */
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// full calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import dayjs from 'dayjs'
import { CALENDAR_COMMON_SETTINGS, CALENDAR_EVENT_TYPE } from '../../../../utils/enums'

// types
import { ICalendarView } from '../../../../types/interfaces'

const resources = [
	{
		id: 'a',
		title: 'Auditorium A'
	},
	{
		id: 'b',
		title: 'Auditorium B',
		eventColor: 'green'
	},
	{
		id: 'c',
		title: 'Auditorium C',
		eventColor: 'orange'
	},
	{
		id: 'd',
		title: 'Auditorium D',
		children: [
			{
				id: 'd1',
				title: 'Room D1'
			},
			{
				id: 'd2',
				title: 'Room D2'
			}
		]
	}
]

const resources2 = [
	{
		id: 'emp_1',
		employeeData: {
			id: 'emp_1',
			name: 'Gayle Green',
			image: 'https://source.unsplash.com/random/24×24',
			accent: '#2EAF00'
		},
		description: '09:00-17:00'
	},
	{
		id: 'emp_2',
		employeeData: {
			id: 'emp_2',
			name: 'Ron Witting',
			image: 'https://source.unsplash.com/random/24×24',
			accent: '#4656E6'
		},
		description: '08:00-11:00, 12:00-18:00'
	},
	{
		id: 'emp_3',
		employeeData: {
			id: 'emp_3',
			name: 'Dana Tromp',
			image: 'https://source.unsplash.com/random/24×24',
			accent: '#DC7C0C'
		},
		description: ''
	},
	{
		id: 'emp_4',
		employeeData: {
			id: 'emp_4',
			name: 'Amelia Kirlin',
			image: 'https://source.unsplash.com/random/24×24',
			accent: '#FF5353'
		},
		description: '08:00-12:00, 13:00-16:00'
	}
]

const resourceAreaColumns = [
	{
		group: true,
		field: 'day',
		headerContent: 'Day',
		width: 54,
		cellContent: (args: any) => {
			console.log(args)
			return <div>Cell content</div>
		}
	},
	{
		field: 'employee',
		headerContent: 'Employee',
		width: 150,
		employee: { name: 'Lukas' },
		cellContent: (args: any) => {
			console.log(args)
			return <div>Employee cell content</div>
		}
	}
]

const resources3 = [
	{ id: 'emp_1_MON', day: 'MONDAY', employee: 'Anna k' },
	{ id: 'emp_2_MON', day: 'MONDAY', employee: 'Anna k' },
	{ id: 'emp_3_MON', day: 'MONDAY', employee: 'Anna k' },
	{ id: 'emp_4_MON', day: 'MONDAY', employee: 'Anna k' },
	{ id: 'emp_1_TUE', day: 'TUESDAY', employee: 'Anna k' },
	{ id: 'emp_2_TUE', day: 'TUESDAY', employee: 'Anna k' },
	{ id: 'emp_3_TUE', day: 'TUESDAY', employee: 'Anna k' },
	{ id: 'emp_4_TUE', day: 'TUESDAY', employee: 'Anna k' }
]

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
			>
				{/* dividers */}
			</div>
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
		<div className='noti-fc-resource-label' style={{ height: 35 }}>
			<div className='image w-6 h-6 bg-notino-gray' style={{ background: `url("${employee.image}")` }} />
			{employee.name}
		</div>
	)
}

const dayHeaderContentWeek = (labelInfo: any) => {
	return (
		<div className=''>
			<span className='block'>{dayjs(labelInfo.date).format('ddd D')}</span>
			{'5 rezervacii'}
		</div>
	)
}

const dayHeaderContentMonth = (labelInfo: any) => {
	return <div className=''>{dayjs(labelInfo.date).format('ddd D')}</div>
}

interface ICalendarWeekView extends ICalendarView {}

const CalendarWeekView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarWeekView>((props, ref) => {
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
			plugins={[interactionPlugin, scrollGrid, resourceTimelinePlugin]}
			height='100%'
			slotMinWidth={40}
			headerToolbar={false}
			initialView='resourceTimelineDay'
			initialDate={selectedDate}
			weekends={true}
			// editable
			selectable
			stickyFooterScrollbar={false}
			events={[]}
			resources={resources3}
			resourceAreaColumns={resourceAreaColumns}
			resourceAreaWidth={150}
			// resourceLabelContent={resourceLabelContent}
			// eventContent={renderEventContent}
			select={handleSelect}
			dateClick={handleDateClick}
			eventClick={handleEventClick}
		/>
	)
})

export default CalendarWeekView
