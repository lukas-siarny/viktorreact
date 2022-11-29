import React, { useMemo, FC, useEffect } from 'react'
import dayjs from 'dayjs'
import Scroll, { Element } from 'react-scroll'

// full calendar
import FullCalendar, { SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { composeDayViewEvents, composeDayViewResources, eventAllow, getTimeScrollId } from '../../calendarHelpers'
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW } from '../../../../utils/enums'

// types
import { ICalendarView, IDayViewResourceExtenedProps } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'

// components
import CalendarEventContent from '../CalendarEventContent'

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

	const date = dayjs().startOf('day').add(time.milliseconds, 'millisecond')
	const scrollId = getTimeScrollId(date.hour())

	return (
		<Element name={scrollId}>
			<div className={'nc-day-slot-label'}>{date.format(CALENDAR_DATE_FORMAT.TIME)}</div>
		</Element>
	)
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarDayView>((props, ref) => {
	const { salonID, selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees, onEditEvent, onEventChange, refetchData } = props

	const events = useMemo(
		() => composeDayViewEvents(selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees),
		[selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees]
	)
	const resources = useMemo(() => composeDayViewResources(shiftsTimeOffs, employees), [shiftsTimeOffs, employees])

	useEffect(() => {
		Scroll.scroller.scrollTo(getTimeScrollId(8), {
			containerId: 'nc-calendar-day-wrapper',
			offset: -80
		})
	}, [selectedDate])

	return (
		<div className={'nc-calendar-wrapper'} id={'nc-calendar-day-wrapper'}>
			<FullCalendar
				ref={ref}
				// plugins
				plugins={[interactionPlugin, resourceTimeGridPlugin, scrollGrid]}
				// settings
				schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
				timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
				eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
				height='auto'
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
				selectable
				weekends
				nowIndicator
				allDaySlot={false}
				stickyFooterScrollbar
				// data sources
				events={events}
				resources={resources}
				// render hooks
				resourceLabelContent={resourceLabelContent}
				eventContent={(data) => <CalendarEventContent calendarView={CALENDAR_VIEW.DAY} data={data} salonID={salonID} onEditEvent={onEditEvent} refetchData={refetchData} />}
				slotLabelContent={slotLabelContent}
				// handlers
				eventAllow={eventAllow}
				eventDrop={(arg) => onEventChange(CALENDAR_VIEW.DAY, arg)}
				eventResize={(arg) => onEventChange(CALENDAR_VIEW.DAY, arg)}
			/>
		</div>
	)
})

export default React.memo(CalendarDayView, (prevProps, nextProps) => {
	return JSON.stringify(prevProps) === JSON.stringify(nextProps)
})
