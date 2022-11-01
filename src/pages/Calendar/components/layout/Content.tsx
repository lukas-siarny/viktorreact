import React, { FC } from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'

// enums
import { CALENDAR_VIEW } from '../../../../utils/enums'

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
	loading: boolean
	events: ICalendarEventsPayload
	employees?: Employees
}

const CalendarContent: FC<Props> = (props) => {
	const { view, selectedDate, loading, events, employees } = props

	const getView = () => {
		if (view === CALENDAR_VIEW.MONTH) {
			return <CalendarMonthView selectedDate={selectedDate} events={events} employees={employees} />
		}

		if (view === CALENDAR_VIEW.WEEK) {
			return <CalendarWeekView selectedDate={selectedDate} events={events} employees={employees} />
		}

		return <CalendarDayView selectedDate={selectedDate} events={events} employees={employees} />
	}

	return (
		<Content className={'nc-content'}>
			<Spin spinning={loading}>
				<div className={'nc-content-animate'} key={`${selectedDate} ${view}`}>
					{getView()}
				</div>
			</Spin>
		</Content>
	)
}

export default CalendarContent
