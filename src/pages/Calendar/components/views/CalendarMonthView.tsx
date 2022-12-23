import React from 'react'

// full calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import scrollGrid from '@fullcalendar/scrollgrid'

// types
import { ICalendarView } from '../../../../types/interfaces'

// enums
import { CALENDAR_COMMON_SETTINGS } from '../../../../utils/enums'

interface ICalendarMonthView extends ICalendarView {}

const CalendarMonthView = React.forwardRef<InstanceType<typeof FullCalendar>, ICalendarMonthView>((props, ref) => {
	const { selectedDate } = props

	return (
		<FullCalendar
			ref={ref}
			// settings
			schedulerLicenseKey={CALENDAR_COMMON_SETTINGS.LICENSE_KEY}
			timeZone={CALENDAR_COMMON_SETTINGS.TIME_ZONE}
			slotLabelFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			eventTimeFormat={CALENDAR_COMMON_SETTINGS.TIME_FORMAT}
			plugins={[interactionPlugin, scrollGrid, dayGridPlugin]}
			height='100%'
			headerToolbar={false}
			initialView={'dayGridMonth'}
			initialDate={selectedDate}
			editable
			selectable
			weekends
			stickyFooterScrollbar
			events={[]}
			showNonCurrentDates
			firstDay={1}
		/>
	)
})

export default CalendarMonthView
