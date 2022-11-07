import React, { useImperativeHandle, useRef } from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'
import FullCalendar, { CalendarApi } from '@fullcalendar/react'

// enums
import { CALENDAR_EVENT_TYPE_FILTER, CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
import CalendarMonthView from '../views/CalendarMonthView'

// reducers
import { ICalendarEventsPayload } from '../../../../reducers/calendar/calendarActions'
import { Employees } from '../../../../types/interfaces'

type Props = {
	view: CALENDAR_VIEW
	selectedDate: string
	eventType: CALENDAR_EVENT_TYPE_FILTER
	loading: boolean
	reservations: ICalendarEventsPayload['data']
	shiftsTimeOffs: ICalendarEventsPayload['data']
	employees: Employees
	onShowAllEmployees: () => void
}

export type CalendarApiRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof CalendarApi>
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof CalendarApi>
	[CALENDAR_VIEW.MONTH]?: InstanceType<typeof CalendarApi>
}

const CalendarContent = React.forwardRef<CalendarApiRefs, Props>((props, ref) => {
	const { view, selectedDate, eventType, loading, reservations, shiftsTimeOffs, employees, onShowAllEmployees } = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	const monthView = useRef<InstanceType<typeof FullCalendar>>(null)

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current?.getApi(),
		[CALENDAR_VIEW.WEEK]: weekView?.current?.getApi(),
		[CALENDAR_VIEW.MONTH]: monthView?.current?.getApi()
	}))

	const getView = () => {
		if (view === CALENDAR_VIEW.MONTH) {
			return (
				<CalendarMonthView
					ref={monthView}
					selectedDate={selectedDate}
					reservations={reservations}
					shiftsTimeOffs={shiftsTimeOffs}
					employees={employees}
					eventType={eventType}
				/>
			)
		}

		if (view === CALENDAR_VIEW.WEEK) {
			return (
				<CalendarWeekView
					calendarApi={weekView?.current?.getApi()}
					ref={weekView}
					selectedDate={selectedDate}
					reservations={reservations}
					shiftsTimeOffs={shiftsTimeOffs}
					employees={employees}
					eventType={eventType}
				/>
			)
		}

		return (
			<CalendarDayView
				ref={dayView}
				selectedDate={selectedDate}
				reservations={reservations}
				shiftsTimeOffs={shiftsTimeOffs}
				employees={employees}
				eventType={eventType}
				onShowAllEmployees={onShowAllEmployees}
			/>
		)
	}

	return (
		<Content className={'nc-content'}>
			<Spin spinning={loading}>
				<div className={'nc-content-animate'} key={`${selectedDate} ${view} ${eventType}`}>
					{getView()}
				</div>
			</Spin>
		</Content>
	)
})

export default CalendarContent
