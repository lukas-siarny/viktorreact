/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import cx from 'classnames'
import dayjs from 'dayjs'

// full calendar
import FullCalendar, { CalendarApi, EventContentArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_EVENT_TYPE, CALENDAR_EVENT_TYPE_FILTER } from '../../../../utils/enums'
import { composeWeekResources, composeWeekViewEvents, getCustomerName, getHoursMinutesFromMinutes, getWeekViewIntialdDate } from '../../calendarHelpers'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon-16.svg'

/* const employees = [
	{
		id: '111_27604557-0508-4f54-babf-9e8ce281d4a7',
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
		title: 'event title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: 'cffc1c98-3601-405e-92e7-a2f1093e9145',
		resourceId: `emp_1_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T09:30:00.000Z',
		end: '2022-11-07T10:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		title: 'event title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: 'aeaca15c-e18c-40cb-929c-97f0ca8fa082',
		resourceId: `emp_1_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T14:00:00.000Z',
		end: '2022-11-07T17:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		title: 'event title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: '5b03c371-23df-461a-add1-17318c58637e',
		resourceId: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T08:15:00.000Z',
		end: '2022-11-07T09:45:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		title: 'event title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: '2bad91ce-ac50-4689-8c8b-8cd4d04803ba',
		resourceId: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T09:45:00.000Z',
		end: '2022-11-07T11:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		title: 'event title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: '1fe2c840-08af-4239-b3b2-3f07cb2407e5',
		resourceId: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T13:00:00.000Z',
		end: '2022-11-07T15:00:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		title: 'event title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: `emp_3_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		resourceId: '27604557-0508-4f54-babf-9e8ce281d4a7',
		start: '2022-11-07T08:00:00.000Z',
		end: '2022-11-07T08:15:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		title: 'some title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: '648153e6-38fd-4495-9aaf-ddc9a9aa9877',
		resourceId: `emp_3_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T13:00:00.000Z',
		end: '2022-11-07T16:30:00.000Z',
		eventType: 'RESERVATION',
		allDay: false,
		title: 'event title',
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
		},
		customer: {
			id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
			firstName: 'Skusobny',
			lastName: 'Zakaznik',
			email: 'skusobny.zakaznik@gmail.com',
			phonePrefixCountryCode: 'SK',
			phone: '902111222'
		}
	},
	{
		id: '67',
		resourceId: `emp_1_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T23:06:00.000Z',
		end: '2022-11-07T23:15:00.000Z',
		allDay: false,
		employee: '27604557-0508-4f54-babf-9e8ce281d4a7',
		display: 'inverse-background'
	},
	{
		id: '68',
		resourceId: `emp_2_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T10:00:00.000Z',
		end: '2022-11-070T18:00:01.000Z',
		allDay: false,
		employee: '8b85a04d-bf48-4bea-9bee-71c81d506c0f',
		display: 'inverse-background'
	},
	{
		id: '69',
		resourceId: `emp_3_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T09:00:00.000Z',
		end: '2022-11-07T23:12:00.000Z',
		allDay: false,
		employee: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
		display: 'inverse-background'
	},
	{
		id: '69',
		resourceId: `emp_3_${dayjs().format(CALENDAR_DATE_FORMAT.QUERY)}`,
		start: '2022-11-07T09:00:00.000Z',
		end: '2022-11-07T23:12:00.000Z',
		allDay: false,
		employee: 'b699c13e-4f46-4166-a5b4-82e606eb6291',
		display: 'background'
	}
] */

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
			const { extendedProps } = resource || {}
			const employee = extendedProps.employee || {}

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

const renderEventContent = (data: EventContentArg, eventType: CALENDAR_EVENT_TYPE_FILTER) => {
	const { event, timeText } = data || {}
	const { extendedProps } = event || {}

	if (event.display === 'inverse-background') {
		return <div className={cx('nc-bg-event not-set-availability')} />
	}

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
		<div
			className={cx('nc-week-event', {
				reservation: extendedProps.eventType === CALENDAR_EVENT_TYPE.RESERVATION,
				shift: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				timeoff: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				break: extendedProps.eventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				'min-15': Math.abs(diff) <= 15,
				'min-45': Math.abs(diff) <= 45 && Math.abs(diff) > 15
			})}
		>
			{(() => {
				if (eventType === CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF) {
					return (
						<div className={'event-content'}>
							<div className={'flex gap-1 justify-between min-w-0'}>
								<div className={'flex gap-1 min-w-0'}>
									<div className={'avatar w-4 h-4 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.employee?.image}")` }} />
									<span className={'title'}>{extendedProps.employee?.name || extendedProps.employee?.email}</span>
								</div>
								<span className={'duration'}>{getHoursMinutesFromMinutes(diff)}</span>
							</div>
							<span className={'time'}>{timeText}</span>
						</div>
					)
				}

				if (eventType === CALENDAR_EVENT_TYPE_FILTER.RESERVATION) {
					const customerName = getCustomerName(extendedProps.customer)
					return (
						<>
							<div className={'event-accent'} style={{ backgroundColor: extendedProps.employee?.color }} />
							<div className={'event-background'} style={{ backgroundColor: extendedProps.employee?.color }} />
							<div className={'event-content'}>
								{customerName && <span className={'title'}>{customerName}</span>}
								{extendedProps.service?.name && <span className={'desc'}>{extendedProps.service.name}</span>}
							</div>
						</>
					)
				}

				return null
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
	const { selectedDate, calendarApi, eventType, shiftsTimeOffs, reservations, employees } = props

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
				slotMinWidth={30}
				resourceAreaWidth={200}
				headerToolbar={false}
				initialView='resourceTimelineDay'
				initialDate={getWeekViewIntialdDate(selectedDate)}
				weekends={true}
				editable
				selectable
				stickyFooterScrollbar
				nowIndicator
				// data sources
				events={composeWeekViewEvents(selectedDate, eventType, reservations, shiftsTimeOffs, employees)}
				resources={composeWeekResources(selectedDate, shiftsTimeOffs, employees)}
				resourceAreaColumns={resourceAreaColumns}
				// render hooks
				slotLabelContent={slotLabelContent}
				eventContent={(args) => renderEventContent(args, eventType)}
				// handlers
				select={handleSelect}
				dateClick={handleDateClick}
				eventClick={handleEventClick}
			/>
		</div>
	)
})

export default CalendarWeekView
