import React, { useImperativeHandle, useRef } from 'react'
import { Content } from 'antd/lib/layout/layout'
import { Spin } from 'antd'
import FullCalendar from '@fullcalendar/react'

// enums
import { CALENDAR_EVENT_TYPE_FILTER, CALENDAR_VIEW } from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
import CalendarMonthView from '../views/CalendarMonthView'

// types
import { Employees } from '../../../../types/interfaces'
import CalendarEmptyState from '../CalendarEmptyState'

type Props = {
	view: CALENDAR_VIEW
	selectedDate: string
	loading: boolean
	eventType: CALENDAR_EVENT_TYPE_FILTER
	employees: Employees
	onShowAllEmployees: () => void
	firstLoadDone: boolean
}

export type CalendarRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.MONTH]?: InstanceType<typeof FullCalendar> | null
}

const CalendarContent = React.forwardRef<CalendarRefs, Props>((props, ref) => {
	const { view, selectedDate, loading, eventType, employees, onShowAllEmployees, firstLoadDone } = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	const monthView = useRef<InstanceType<typeof FullCalendar>>(null)

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current,
		[CALENDAR_VIEW.WEEK]: weekView?.current,
		[CALENDAR_VIEW.MONTH]: monthView?.current
	}))

	const getView = () => {
		if (firstLoadDone && !employees?.length) {
			return <CalendarEmptyState onButtonClick={onShowAllEmployees} />
		}

		if (view === CALENDAR_VIEW.MONTH) {
			return <CalendarMonthView ref={monthView} selectedDate={selectedDate} />
		}

		if (view === CALENDAR_VIEW.WEEK) {
			return <CalendarWeekView ref={weekView} selectedDate={selectedDate} />
		}

		return <CalendarDayView ref={dayView} selectedDate={selectedDate} />
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
