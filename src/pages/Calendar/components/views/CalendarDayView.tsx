import dayjs from 'dayjs'
import React, { FC, useMemo } from 'react'

// full calendar
import FullCalendar, { DateSelectArg, SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW, DEFAULT_DATE_INIT_FORMAT, DEFAULT_DATE_INPUT_FORMAT, DEFAULT_TIME_FORMAT } from '../../../../utils/enums'
import { composeDayViewEvents, composeDayViewResources, eventAllow } from '../../calendarHelpers'

// types
import { ICalendarView, IDayViewResourceExtenedProps } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'

// components
import CalendarEvent from '../CalendarEvent'

interface IResourceLabel {
	image?: string
	color?: string
	name?: string
	description?: string
	isTimeOff?: boolean
}

const ResourceLabel: FC<IResourceLabel> = React.memo((props) => {
	const { image, color, name, description, isTimeOff } = props
	return (
		<div className={'nc-day-resource-label'}>
			<div className={'image w-6 h-6 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${image}")`, borderColor: color }} />
			<div className={'info flex flex-col justify-start text-xs font-normal min-w-0'}>
				<span className={'name'}>{name}</span>
				<span className={'description'}>{description}</span>
			</div>
			{isTimeOff && (
				<div className={'absence-icon'}>
					<AbsenceIcon />
				</div>
			)}
		</div>
	)
})

const resourceLabelContent = (data: any) => {
	const { resource } = data || {}
	const extendedProps = resource?.extendedProps as IDayViewResourceExtenedProps
	const { employee } = extendedProps || {}
	const color = resource?.eventBackgroundColor

	return <ResourceLabel image={employee?.image} color={color} isTimeOff={employee?.isTimeOff} name={employee?.name} description={employee?.description} />
}

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { time } = data || {}

	return <div className={'nc-day-slot-label'}>{dayjs().startOf('day').add(time.milliseconds, 'millisecond').format(CALENDAR_DATE_FORMAT.TIME)}</div>
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarDayView>((props, ref) => {
	const { salonID, selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees, onEditEvent, onEventChange, onAddEvent } = props

	const events = useMemo(
		() => [
			composeDayViewEvents(selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees),
			[
				{
					start: '2022-11-29T19:30:00.000Z',
					end: '2022-11-29T21:45:00.000Z',
					allDay: false,
					resourceId: '6e93336d-624e-4fcb-9726-d9ba396db64c',
					extendedProps: {
						eventData: {
							eventType: 'RESERVATION'
						}
					}
				},
				{
					start: '2022-11-29T07:15:00.000Z',
					end: '2022-11-29T10:30:00.000Z',
					allDay: false,
					resourceId: '70b4c2aa-9c5f-4d8f-8663-c002d00de1bb',
					extendedProps: {
						eventData: {
							eventType: 'RESERVATION'
						}
					}
				},
				{
					start: '2022-11-29T07:45:00.000Z',
					end: '2022-11-29T10:15:00.000Z',
					allDay: false,
					resourceId: '212a96c5-d012-4f13-bcb8-d5ab923e83c4',
					extendedProps: {
						eventData: {
							eventType: 'RESERVATION'
						}
					}
				}
			]
		],
		[selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees]
	)

	const resources = useMemo(() => composeDayViewResources(shiftsTimeOffs, employees), [shiftsTimeOffs, employees])

	const handleNewEvent = (event: DateSelectArg) => {
		if (event.resource) {
			// eslint-disable-next-line no-underscore-dangle
			const { employee } = event.resource._resource.extendedProps

			onAddEvent({
				date: dayjs(event.startStr).format(DEFAULT_DATE_INIT_FORMAT),
				timeFrom: dayjs(event.startStr).format(DEFAULT_TIME_FORMAT),
				timeTo: dayjs(event.endStr).format(DEFAULT_TIME_FORMAT),
				employee: {
					value: employee.id,
					key: employee.id,
					label: employee.name
				}
			})
		}
	}

	/*
	const handleDateCellClick = (arg: DateClickArg) => {
		const calnedar = arg.view.calendar

		const newEvent: EventInput = {
			start: arg.date,
			end: dayjs(arg.date).add(60, 'minutes').toISOString(),
			allDay: false,
			resourceId: arg.resource?.id,
			extendedProps: {
				eventData: {
					eventType: CALENDAR_EVENT_TYPE.RESERVATION
				}
			}
		}

		calnedar.addEvent(newEvent)
	}

	const handleDateSelect = (arg: DateSelectArg) => {
		const calnedar = arg.view.calendar
		const placeholder = calnedar.getEventById('placeholder')
		const resourceId = arg.resource?.id

		if (resourceId) {
			if (!placeholder) {
				const newEvent: EventInput = {
					id: 'placeholder',
					start: arg.start,
					end: arg.end,
					allDay: false,
					editable: true,
					resourceId,
					extendedProps: {
						eventData: {
							eventType: CALENDAR_EVENT_TYPE.RESERVATION
						}
					}
				}
				calnedar.addEvent(newEvent)
				setQuery({ ...query, sidebarView: CALENDAR_EVENTS_VIEW_TYPE.RESERVATION })
			} else {
				// placeholder.setDates(arg.start, arg.end)
				// placeholder.setResources([resourceId])
				placeholder.remove()
			}
		}
	}
	*/

	return (
		<FullCalendar
			ref={ref}
			// plugins
			plugins={[interactionPlugin, resourceTimeGridPlugin, scrollGrid]}
			// settings
			schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
			timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
			eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			height='100%'
			headerToolbar={false}
			initialView={'resourceTimeGridDay'}
			initialDate={selectedDate}
			scrollTime={CALENDAR_COMMON_SETTINGS.SCROLL_TIME}
			slotDuration={CALENDAR_COMMON_SETTINGS.SLOT_DURATION}
			slotLabelInterval={CALENDAR_COMMON_SETTINGS.SLOT_LABEL_INTERVAL}
			fixedMirrorParent={CALENDAR_COMMON_SETTINGS.FIXED_MIRROR_PARENT}
			eventConstraint={CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT}
			// je potrebne nechat nastavene na 0, pretoze potom to zle rendruje background eventy, ktore su po 23:45 (snazi sa tam spravit min 15 minutovu vysku aj ked ma event len 1 minutu)
			// pre bezne eventy je potom nastavena min-height cez cssko .nc-day-event
			eventMinHeight={0}
			dayMinWidth={120}
			editable
			weekends
			nowIndicator
			allDaySlot={false}
			stickyFooterScrollbar
			// data sources
			// events={events}
			eventSources={events}
			resources={resources}
			// render hooks
			resourceLabelContent={resourceLabelContent}
			eventContent={(data) => <CalendarEvent calendarView={CALENDAR_VIEW.DAY} data={data} salonID={salonID} onEditEvent={onEditEvent} />}
			slotLabelContent={slotLabelContent}
			// handlers
			eventAllow={eventAllow}
			eventDrop={(arg) => onEventChange && onEventChange(CALENDAR_VIEW.DAY, arg)}
			eventResize={(arg) => onEventChange && onEventChange(CALENDAR_VIEW.DAY, arg)}
			// select
			selectable
			select={handleNewEvent}
		/>
	)
})

export default React.memo(CalendarDayView, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
