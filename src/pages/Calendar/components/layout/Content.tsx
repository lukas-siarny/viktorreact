import React, { FC } from 'react'

// enums
import { CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
import CalendarMonthView from '../views/CalendarMonthView'

type Props = {
	view: CALENDAR_VIEW
	selectedDate: string
}

const CalendarContent: FC<Props> = (props) => {
	const { view, selectedDate } = props

	if (view === CALENDAR_VIEW.MONTH) {
		return <CalendarMonthView selectedDate={selectedDate} />
	}

	if (view === CALENDAR_VIEW.WEEK) {
		return <CalendarWeekView selectedDate={selectedDate} />
	}

	return <CalendarDayView selectedDate={selectedDate} />
}

export default CalendarContent
