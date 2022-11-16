/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { useTranslation } from 'react-i18next'

// full calendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import scrollGrid from '@fullcalendar/scrollgrid'

// utils
import { CALENDAR_COMMON_SETTINGS } from '../../../../utils/enums'

// types
import { ICalendarView } from '../../../../types/interfaces'

const resourceAreaColumns = [
	{
		group: true,
		field: 'day',
		headerContent: 'Day',
		width: 54,
		cellContent: (args: any) => {
			return <div>Cell content</div>
		}
	},
	{
		field: 'employee',
		headerContent: 'Employee',
		width: 150,
		employee: { name: 'Lukas' },
		cellContent: (args: any) => {
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
			ref={ref}
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
			selectable
			stickyFooterScrollbar={false}
			events={[]}
			resources={resources3}
			resourceAreaColumns={resourceAreaColumns}
			resourceAreaWidth={150}
			select={handleSelect}
			dateClick={handleDateClick}
			eventClick={handleEventClick}
		/>
	)
})

export default CalendarWeekView
