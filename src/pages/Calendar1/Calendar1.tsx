import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Modal, Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { uniqueId } from 'lodash'

// full calendar
import FullCalendar, { FormatterInput } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import daygridPlugin from '@fullcalendar/daygrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import dayjs from 'dayjs'
import { PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// assets
import Avatar from '../../assets/images/avatar.png'
import { getCalendarEmployees, getCalendarEvents, getCalendarServices } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { composeEvents } from './helpers'

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

	console.log({ eventInfo })

	return event.display === 'background' ? null : (
		<div className={'noti-fc-event'}>
			<div className={'event-accent'} style={{ background: extendedProps.accent }} />
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
			<div className='w-6 h-6 bg-notino-gray' style={{ background: `url("${employee.image}")`, flex: '0 0 auto' }} />
			<div>
				{employee.name}
				<br />
				{employee.times}
			</div>
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

const EMPLOYEES = [
	{
		id: '1',
		name: 'Tadej Pogacar',
		times: '9:00 - 17:00',
		image: Avatar,
		color: '#2EAF00'
	},
	{
		id: '2',
		name: 'Primoz Roglic',
		times: '8:00 - 11:00, 12:00 - 18:00',
		image: Avatar,
		color: '#4656E6'
	},
	{
		id: '3',
		name: 'Egan Bernal',
		times: '9:00 - 17:00',
		image: Avatar,
		color: '#DC7C0C'
	},
	{
		id: '4',
		name: 'Remco Evenpoel',
		times: '8:00 - 12:00, 13:00 - 16:00',
		image: Avatar,
		color: '#FF5353'
	},
	{
		id: '5',
		name: 'Alechandro Valverde',
		times: 'Time off',
		image: Avatar,
		color: '#000'
	}
]

const INITIAL_CALENDAR_STATE = {
	events: [
		// normal events
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Janice Runolfsson',
			start: '2022-10-04T09:00:00',
			end: '2022-10-04T11:00:00',
			allDay: false,
			description: 'Woman’s cut + Styling',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Vincent Oberbrunner',
			start: '2022-10-04T12:00:00',
			end: '2022-10-04T13:00:00',
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[0].id,
			title: 'Dianna Harris',
			start: '2022-10-04T13:00:00',
			end: '2022-10-04T17:00:00',
			allDay: false,
			description: 'Woman’s cut + Balayage',
			accent: EMPLOYEES[0].color,
			avatar: EMPLOYEES[0].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: '2022-10-04T08:00:00',
			end: '2022-10-04T09:00:00',
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Albert Emmerich',
			start: '2022-10-04T09:00:00',
			end: '2022-10-04T10:00:00',
			allDay: false,
			description: 'Man’s cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Luther Skiles',
			start: '2022-10-04T14:00:00',
			end: '2022-10-04T15:00:00',
			allDay: false,
			description: 'Man’s cut with washing and styling',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: '2022-10-04T15:00:00',
			end: '2022-10-04T16:30:00',
			allDay: false,
			description: 'Man’s clipper cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		{
			id: uniqueId(),
			resourceId: EMPLOYEES[1].id,
			title: 'Anthony Terry',
			start: '2022-10-04T15:15:00',
			end: '2022-10-04T18:30:00',
			allDay: false,
			description: 'Man’s clipper cut',
			accent: EMPLOYEES[1].color,
			avatar: EMPLOYEES[1].image
		},
		// backgroundEvents - shifts
		{
			resourceId: EMPLOYEES[0].id,
			start: '2022-10-04T09:00:00',
			end: '2022-10-04T10:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[0].id,
			start: '2022-10-04T10:00:00',
			end: '2022-10-04T11:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[0].id,
			start: '2022-10-04T11:00:00',
			end: '2022-10-04T12:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[1].id,
			start: '2022-10-04T08:00:00',
			end: '2022-10-04T11:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		{
			resourceId: EMPLOYEES[1].id,
			start: '2022-10-04T12:00:00',
			end: '2022-10-04T18:00:00',
			backgroundColor: '#000',
			display: 'background'
		},
		// backgroundEvents - timeOff
		{
			resourceId: EMPLOYEES[2].id,
			start: '2022-10-04T00:00:00',
			end: '2022-10-04T24:00:00',
			backgroundColor: '#DC0069',
			display: 'background'
		}
	],
	resources: [
		{ id: EMPLOYEES[0].id, employeeData: EMPLOYEES[0] },
		{ id: EMPLOYEES[1].id, employeeData: EMPLOYEES[1] },
		{ id: EMPLOYEES[2].id, employeeData: EMPLOYEES[2] },
		{ id: EMPLOYEES[3].id, employeeData: EMPLOYEES[3] },
		{ id: EMPLOYEES[4].id, employeeData: EMPLOYEES[4] }
	]
}

const Calendar1 = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const employees = useSelector((state: RootState) => state.calendar.employees)
	const services = useSelector((state: RootState) => state.calendar.services)
	const events = useSelector((state: RootState) => state.calendar.events)
	const shifts = useSelector((state: RootState) => state.calendar.shifts)
	const timeOff = useSelector((state: RootState) => state.calendar.timeOff)

	const loadingData = employees?.isLoading || services?.isLoading || events?.isLoading || shifts?.isLoading || timeOff?.isLoading

	const composedEvents = composeEvents({ employees: employees?.data, services: services?.data, events: events?.data })

	const [calendarStore, setCalendarStore] = useState<any>(INITIAL_CALENDAR_STATE)
	const [eventModalProps, setEventModalProps] = useState<any>({
		visible: false,
		data: {}
	})

	const handleDateClick = (arg: DateClickArg) => {
		console.log({ arg })
	}

	const onDidMount = (arg: any) => console.log({ arg, onDidMount: 'its on did mount' })

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

	useEffect(() => {
		dispatch(getCalendarEmployees())
		dispatch(getCalendarServices())
		dispatch(getCalendarEvents({ start: '2022-10-12T00:00:00', end: '2022-10-12T23:59:59' }))
	}, [dispatch])

	return (
		<div className='bg-notino-white'>
			<Spin spinning={loadingData}>
				<FullCalendar
					schedulerLicenseKey='CC-Attribution-NonCommercial-NoDerivatives'
					plugins={[daygridPlugin, interactionPlugin, resourceTimeGridPlugin, scrollGrid]}
					timeZone='local'
					slotLabelFormat={TIME_FORMAT}
					eventTimeFormat={TIME_FORMAT}
					height='auto'
					headerToolbar={{
						left: 'title prev,today,next',
						right: 'resourceTimeGridDay,timeGridWeek,dayGridMonth'
					}}
					initialView='resourceTimeGridDay'
					// customize view
					views={{
						resourceTimeGridDay: {
							duration: { days: 1 },
							buttonText: 'Day',
							resourceLabelContent,
							eventContent: renderEventContent,
							dayMinWidth: 200,
							editable: true,
							selectable: true
						},
						timeGridWeek: {
							buttonText: 'Week',
							eventContent: renderEventContent,
							dayHeaderContent: dayHeaderContentWeek,
							dayMinWidth: 130
						},
						dayGridMonth: {
							buttonText: 'Month',
							eventContent: renderEventContent,
							dayHeaderContent: dayHeaderContentMonth,
							dayMaxEvents: 3,
							moreLinkContent: renderMoreLinkMonth,
							dayMinWidth: 130
						}
					}}
					weekends
					allDaySlot={false}
					stickyFooterScrollbar
					select={handleSelect}
					events={composedEvents}
					resources={calendarStore.resources}
					dateClick={handleDateClick}
					eventClick={handleEventClick}
					// eventMinHeight={52}
					// eventContent={renderEventContent}
					// eventDidMount={onDidMount}
				/>
			</Spin>
			<Modal visible={eventModalProps.visible} onCancel={() => setEventModalProps((prevState: any) => ({ ...prevState, visible: false }))} title={'Add Event'} footer={null}>
				<div className='flex flex-col gap-2'>
					<div>
						<strong>Zadajte nazov:</strong>
						<Input
							type='text'
							value={eventModalProps?.data?.title}
							onChange={(value) => {
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
							setCalendarStore((prevState: any) => ({
								...prevState,
								events: [
									...prevState.events,
									{
										...eventModalProps.data
									}
								]
							}))
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

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar1)
