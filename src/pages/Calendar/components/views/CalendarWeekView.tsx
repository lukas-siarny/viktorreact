/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import FullCalendar, { CalendarApi, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE } from '../../../../utils/enums'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon-16.svg'

const employees = [
	{
		id: '27604557-0508-4f54-babf-9e8ce281d4a7',
		name: 'lukas.siarny@gmail.com',
		image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/default_avatar-thumbnail.png',
		isTimeOff: true
	},
	{
		id: '8b85a04d-bf48-4bea-9bee-71c81d506c0f',
		name: 'lukas.siarny@goodrequest.com',
		image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/default_avatar-thumbnail.png',
		isTimeOff: false
	},
	{
		id: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
		name: 'Partner User',
		image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/603b0c9d-22aa-4c6f-89e2-b714198d2943_NdtrLNijKPdzHIHjcFiOYiMHrDmrEJ3eqbdJZWaeofE-2048x1536-thumbnail.jpg',
		isTimeOff: false
	}
]

const events = [
	{
		id: 'e17c0f52-f17f-43df-a6ed-5bca16cdc0e5',
		resourceId: `emp_1_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T07:30:00.000Z',
		end: '2022-11-07T09:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
			firstName: 'Partner',
			lastName: 'User',
			email: 'test.confirmed_partneruser@goodrequest.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/603b0c9d-22aa-4c6f-89e2-b714198d2943_NdtrLNijKPdzHIHjcFiOYiMHrDmrEJ3eqbdJZWaeofE-2048x1536.jpg'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: 'b8eea2de-89c8-4739-b315-24e7ea3a31a5',
			name: 'Blow-dry',
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: 'cffc1c98-3601-405e-92e7-a2f1093e9145',
		resourceId: `emp_1_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T09:30:00.000Z',
		end: '2022-11-07T10:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
			firstName: 'Partner',
			lastName: 'User',
			email: 'test.confirmed_partneruser@goodrequest.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/603b0c9d-22aa-4c6f-89e2-b714198d2943_NdtrLNijKPdzHIHjcFiOYiMHrDmrEJ3eqbdJZWaeofE-2048x1536.jpg'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: 'b8eea2de-89c8-4739-b315-24e7ea3a31a5',
			name: 'Blow-dry',
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: 'aeaca15c-e18c-40cb-929c-97f0ca8fa082',
		resourceId: `emp_1_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T14:00:00.000Z',
		end: '2022-11-07T17:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
			firstName: 'Partner',
			lastName: 'User',
			email: 'test.confirmed_partneruser@goodrequest.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/603b0c9d-22aa-4c6f-89e2-b714198d2943_NdtrLNijKPdzHIHjcFiOYiMHrDmrEJ3eqbdJZWaeofE-2048x1536.jpg'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: 'b8eea2de-89c8-4739-b315-24e7ea3a31a5',
			name: 'Blow-dry',
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: '5b03c371-23df-461a-add1-17318c58637e',
		resourceId: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T08:15:00.000Z',
		end: '2022-11-07T09:45:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: '8b85a04d-bf48-4bea-9bee-71c81d506c0f',
			email: 'lukas.siarny@goodrequest.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/default_avatar.png'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: 'b8eea2de-89c8-4739-b315-24e7ea3a31a5',
			name: 'Blow-dry',
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: '2bad91ce-ac50-4689-8c8b-8cd4d04803ba',
		resourceId: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T09:45:00.000Z',
		end: '2022-11-07T11:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: '8b85a04d-bf48-4bea-9bee-71c81d506c0f',
			email: 'lukas.siarny@goodrequest.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/default_avatar.png'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: 'b8a48686-3535-49ff-bdcd-8e2636ef3096',
			name: "Women's cut",
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: '1fe2c840-08af-4239-b3b2-3f07cb2407e5',
		resourceId: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T13:00:00.000Z',
		end: '2022-11-07T15:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: '8b85a04d-bf48-4bea-9bee-71c81d506c0f',
			email: 'lukas.siarny@goodrequest.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/default_avatar.png'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: 'b8a48686-3535-49ff-bdcd-8e2636ef3096',
			name: "Women's cut",
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: `emp_3_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		resourceId: '27604557-0508-4f54-babf-9e8ce281d4a7',
		start: '2022-11-07T08:00:00.000Z',
		end: '2022-11-07T08:15:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: '27604557-0508-4f54-babf-9e8ce281d4a7',
			email: 'lukas.siarny@gmail.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/default_avatar.png'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: '7af75117-e782-46fd-bff2-04cb08c74199',
			name: 'Blow-dry with waves',
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: '648153e6-38fd-4495-9aaf-ddc9a9aa9877',
		resourceId: `emp_3_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T13:00:00.000Z',
		end: '2022-11-07T16:30:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		employee: {
			id: '27604557-0508-4f54-babf-9e8ce281d4a7',
			email: 'lukas.siarny@gmail.com',
			color: '#32a852',
			image: 'https://d1pfrdq2i86yn4.cloudfront.net/employees/default_avatar.png'
		},
		reservationData: {
			state: 'APPROVED',
			createSourceType: 'OFFLINE'
		},
		service: {
			id: '7af75117-e782-46fd-bff2-04cb08c74199',
			name: 'Blow-dry with waves',
			icon: 'https://d1pfrdq2i86yn4.cloudfront.net/categories/placeholder.png'
		}
	},
	{
		id: '67',
		resourceId: '27604557-0508-4f54-babf-9e8ce281d4a7',
		start: '2022-10-30T23:00:00.000Z',
		end: '2022-10-30T23:00:01.000Z',
		allDay: false,
		employee: '27604557-0508-4f54-babf-9e8ce281d4a7',
		display: 'inverse-background'
	},
	{
		id: '68',
		resourceId: '8b85a04d-bf48-4bea-9bee-71c81d506c0f',
		start: '2022-10-30T23:00:00.000Z',
		end: '2022-10-30T23:00:01.000Z',
		allDay: false,
		employee: '8b85a04d-bf48-4bea-9bee-71c81d506c0f',
		display: 'inverse-background'
	},
	{
		id: '69',
		resourceId: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
		start: '2022-10-30T23:00:00.000Z',
		end: '2022-10-30T23:00:01.000Z',
		allDay: false,
		employee: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
		display: 'inverse-background'
	}
]

const resourceAreaColumns = [
	{
		group: true,
		field: 'day',
		headerContent: null,
		width: 55,
		cellContent: (args: any) => {
			const { groupValue: date } = args || {}

			const dayName = dayjs(date).format('ddd')
			const dayNumber = dayjs(date).format('D')
			const isToday = dayjs().startOf('day').isSame(dayjs(date).startOf('day'))

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
			const { extendedProps, day } = resource || {}
			const employee = extendedProps.employee || {}

			console.log(employee)

			return (
				<div className={'nc-week-label-resource'}>
					<div className={'image'} style={{ backgroundImage: `url("${employee.image}")` }} />
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

const resources3 = [
	{ id: `emp_1_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`, day: dayjs().format(CALENDAR_DATE_FORMAT.QUERY), employee: employees[0] },
	{ id: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`, day: dayjs().format(CALENDAR_DATE_FORMAT.QUERY), employee: employees[1] },
	{ id: `emp_3_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`, day: dayjs().format(CALENDAR_DATE_FORMAT.QUERY), employee: employees[2] },
	{
		id: `emp_1_${dayjs().add(1, 'day').format(CALENDAR_DATE_FORMAT.QUERY)}`,
		day: dayjs().add(1, 'day').format(CALENDAR_DATE_FORMAT.QUERY),
		employee: employees[0]
	},
	{ id: `emp_2_${dayjs().add(1, 'day').format(CALENDAR_DATE_FORMAT.QUERY)}`, day: dayjs().add(1, 'day').format(CALENDAR_DATE_FORMAT.QUERY), employee: employees[1] },
	{ id: `emp_3_${dayjs().add(1, 'day').format(CALENDAR_DATE_FORMAT.QUERY)}`, day: dayjs().add(1, 'day').format(CALENDAR_DATE_FORMAT.QUERY), employee: employees[2] }
]

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { date } = data || {}

	return <div className={'nc-week-slot-label'}>{dayjs(date).format('HH:mm')}</div>
}

interface ICalendarWeekView extends ICalendarView {
	calendarApi?: InstanceType<typeof CalendarApi>
}

const CalendarWeekView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarWeekView>((props, ref) => {
	const { selectedDate, calendarApi } = props

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
		<div className={'nc-calendar-week-wrapper'}>
			<div style={{ position: 'fixed', left: 10, top: 200, background: 'pink', zIndex: 999 }}>{'fixed div'}</div>
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
				height='auto'
				slotMinWidth={20}
				resourceAreaWidth={200}
				headerToolbar={false}
				initialView='resourceTimelineDay'
				initialDate={selectedDate}
				weekends={true}
				editable
				selectable
				stickyFooterScrollbar={false}
				nowIndicator
				// data sources
				events={events}
				resources={resources3}
				resourceAreaColumns={resourceAreaColumns}
				// render hooks
				slotLabelContent={slotLabelContent}
				// handlers
				select={handleSelect}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
				/* eventDrop={() => {
					console.log('aaaa', calendarApi)
					calendarApi?.updateSize()
				}} */
			/>
		</div>
	)
})

export default CalendarWeekView
