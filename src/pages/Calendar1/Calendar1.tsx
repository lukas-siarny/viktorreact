import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Input, Modal, Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { uniqueId } from 'lodash'

// full calendar
import FullCalendar, { DatesSetArg, FormatterInput } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import daygridPlugin from '@fullcalendar/daygrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import dayjs from 'dayjs'
import { CALENDAR_VIEW, PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// assets
import { getCalendarEmployees, getCalendarEvents, getCalendarServices } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { composeEvents, composeResources } from './helpers'

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

	// console.log({ eventInfo })

	return event.display === 'background' ? null : (
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

const Calendar1 = () => {
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

	console.log({ composedEvents, composedResources })

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
					initialDate={range.start}
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
					editable
					allDaySlot={false}
					stickyFooterScrollbar
					events={composedEvents}
					resources={composedResources}
					select={handleSelect}
					dateClick={handleDateClick}
					eventClick={handleEventClick}
					datesSet={handleDateSet}
					// eventMinHeight={52}
					// eventContent={renderEventContent}
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

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar1)
