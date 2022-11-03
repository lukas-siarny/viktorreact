import React, { FC } from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'

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
}

const CalendarContent: FC<Props> = (props) => {
	const { view, selectedDate, eventType, loading, reservations, shiftsTimeOffs, employees } = props

	const getView = () => {
		if (view === CALENDAR_VIEW.MONTH) {
			return <CalendarMonthView selectedDate={selectedDate} reservations={reservations} shiftsTimeOffs={shiftsTimeOffs} employees={employees} eventType={eventType} />
		}

		if (view === CALENDAR_VIEW.WEEK) {
			return <CalendarWeekView selectedDate={selectedDate} reservations={reservations} shiftsTimeOffs={shiftsTimeOffs} employees={employees} eventType={eventType} />
		}

		return <CalendarDayView selectedDate={selectedDate} reservations={reservations} shiftsTimeOffs={shiftsTimeOffs} employees={employees} eventType={eventType} />
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
}

export default CalendarContent
