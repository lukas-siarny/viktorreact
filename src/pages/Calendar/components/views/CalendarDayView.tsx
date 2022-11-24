import React from 'react'
import dayjs from 'dayjs'

// full calendar
import FullCalendar, { SlotLabelContentArg } from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { StringParam, useQueryParams } from 'use-query-params'
import { composeDayViewEvents, composeDayViewResources } from '../../calendarHelpers'
import { CALENDAR_COMMON_SETTINGS, CALENDAR_DATE_FORMAT, CALENDAR_VIEW } from '../../../../utils/enums'

// types
import { ICalendarView } from '../../../../types/interfaces'

// assets
import { ReactComponent as AbsenceIcon } from '../../../../assets/icons/absence-icon.svg'

// components
import CalendarEvent from '../CalendarEvent'

const resourceLabelContent = (data: any) => {
	const { resource } = data || {}
	const extendedProps = resource?.extendedProps
	const color = resource?.eventBackgroundColor

	return (
		<div className={'nc-day-resource-label'}>
			<div className={'image w-6 h-6 bg-notino-gray bg-cover'} style={{ backgroundImage: `url("${extendedProps.image}")`, borderColor: color }} />
			<div className={'info flex flex-col justify-start text-xs font-normal min-w-0'}>
				<span className={'name'}>{extendedProps.name}</span>
				<span className={'description'}>{extendedProps.description}</span>
			</div>
			{extendedProps.isTimeOff && (
				<div className={'absence-icon'}>
					<AbsenceIcon />
				</div>
			)}
		</div>
	)
}

const slotLabelContent = (data: SlotLabelContentArg) => {
	const { time } = data || {}

	return <div className={'nc-day-slot-label'}>{dayjs().startOf('day').add(time.milliseconds, 'millisecond').format(CALENDAR_DATE_FORMAT.TIME)}</div>
}

interface ICalendarDayView extends ICalendarView {}

const CalendarDayView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarDayView>((props, ref) => {
	const { salonID, selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees, onEditEvent, eventAllow } = props

	const [_, setQuery] = useQueryParams({
		eventId: StringParam,
		sidebarView: StringParam
	})
	const handleDateClick = (arg: DateClickArg) => {}

	const handleSelect = (info: any) => {
		const { start, end, resource = {} } = info
	}

	const hasResources = !!employees.length

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
			editable={hasResources}
			selectable={hasResources}
			weekends
			nowIndicator
			allDaySlot={false}
			stickyFooterScrollbar
			// data sources
			events={composeDayViewEvents(selectedDate, eventsViewType, reservations, shiftsTimeOffs, employees)}
			resources={composeDayViewResources(shiftsTimeOffs, employees)}
			// render hooks
			resourceLabelContent={resourceLabelContent}
			eventContent={(data) => <CalendarEvent calendarView={CALENDAR_VIEW.DAY} data={data} salonID={salonID} onEditEvent={onEditEvent} />}
			slotLabelContent={slotLabelContent}
			// handlers
			select={handleSelect}
			dateClick={handleDateClick}
			eventAllow={eventAllow}
		/>
	)
})

export default CalendarDayView
