/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Modal, Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { uniqueId } from 'lodash'
import cx from 'classnames'

// full calendar
import FullCalendar, { DatesSetArg, FormatterInput } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import daygridPlugin from '@fullcalendar/daygrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import dayjs from 'dayjs'
import { CALENDAR_EVENT_TYPE, CALENDAR_VIEW, PERMISSION } from '../../../../utils/enums'
import { withPermissions } from '../../../../utils/Permissions'

// assets
import { getCalendarEmployees, getCalendarEvents, getCalendarServices } from '../../../../reducers/calendar/calendarActions'
import { RootState } from '../../../../reducers'
import { composeEvents, composeResources } from '../../helpers'

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
		/* const startHour = dayjs(event.start).hour()
		const startMinutes = dayjs(event.start).minute()
		const endHour = dayjs(event.end).hour()

		const dividers = []

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < endHour - startHour; i++) {
			let top = i * ROW_HEIGHT + 1
			if (i === 0 && startMinutes) {
				const minutesToPx = (startMinutes / 60) * ROW_HEIGHT
				top += minutesToPx
			}
			dividers.push(<div className={'noti-fc-bg-event-divider'} style={{ top }} />)
		} */

		return (
			<div
				className={cx('noti-fc-bg-event', {
					shift: extendedProps.eventType === CALENDAR_EVENT_TYPE.SHIFT,
					timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.TIMEOFF
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

const renderMoreLinkMonth = (info: any) => {
	return (
		<div className=''>
			{MONTH_VIEW.DAY_MAX_EVENTS + info.num} {'Reservations'}
		</div>
	)
}

const CalendarWeekView = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [calendarView, setCalendarView] = useState(CALENDAR_VIEW.DAY_RESERVATIONS)
	const [range, setRange] = useState({
		start: '2022-10-10T00:00:00',
		end: '2022-10-10T23:59:59'
	})

	const employees = useSelector((state: RootState) => state.calendar.employees)
	const services = useSelector((state: RootState) => state.calendar.services)
	const events = useSelector((state: RootState) => state.calendar.events)

	const loadingData = employees?.isLoading || services?.isLoading || events?.isLoading

	const composedEvents = composeEvents({ employees, services, events }, calendarView)
	const composedResources = composeResources(events, employees)

	console.log(composedResources)

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

	const handleDateSet = (arg: DatesSetArg) => {
		console.log({ dateSetArgs: arg })
		setRange({ ...range, start: arg?.startStr, end: arg?.endStr })
	}

	useEffect(() => {
		dispatch(getCalendarEmployees())
		dispatch(getCalendarServices())
	}, [dispatch])

	useEffect(() => {
		dispatch(getCalendarEvents({ start: range.start, end: range.end }))
	}, [dispatch, range.start, range.end])

	return (
		<div className='bg-notino-white'>
			<Spin spinning={loadingData}>
				<FullCalendar
					schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
					plugins={[daygridPlugin, interactionPlugin, resourceTimeGridPlugin, scrollGrid, resourceTimelinePlugin]}
					timeZone='local'
					slotLabelFormat={TIME_FORMAT}
					eventTimeFormat={TIME_FORMAT}
					height='auto'
					slotMinWidth={40}
					headerToolbar={{
						left: 'title prev,today,next',
						right: 'resourceTimelineDay'
					}}
					initialView='resourceTimelineDay'
					initialDate={range.start}
					weekends={false}
					// editable
					stickyFooterScrollbar
					events={composedEvents}
					resources={resources3}
					resourceAreaColumns={resourceAreaColumns}
					resourceAreaWidth={150}
					// resourceLabelContent={resourceLabelContent}
					// eventContent={renderEventContent}
					select={handleSelect}
					dateClick={handleDateClick}
					eventClick={handleEventClick}
					datesSet={handleDateSet}
				/>
			</Spin>
			<Modal visible={eventModalProps.visible} onCancel={() => setEventModalProps((prevState: any) => ({ ...prevState, visible: false }))} title={'Add Event'} footer={null}>
				<div className='flex flex-col gap-2'>
					<div>
						<strong>Zadajte nazov:</strong>
						<Input
							type='text'
							value={eventModalProps?.data?.title}
							onChange={(value: any) => {
								setEventModalProps({ ...eventModalProps, data: { ...eventModalProps.data, title: value } })
							}}
						/>
					</div>
					<div>
						<strong>Zadajte cas:</strong>
						<span>
							{dayjs(eventModalProps.data.start).format('D.MM - HH:mm')} - {dayjs(eventModalProps.data.end).format('D.MM - HH:mm')}
						</span>
					</div>
					<Button
						type={'primary'}
						onClick={() => {
							/* setCalendarStore((prevState: any) => ({
								...prevState,
								events: [
									...prevState.events,
									{
										...eventModalProps.data
									}
								]
							})) */
							setEventModalProps({
								visible: false,
								data: {}
							})
						}}
					>
						{'Ulozit udalost'}
					</Button>
				</div>
			</Modal>
		</div>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(CalendarWeekView)
