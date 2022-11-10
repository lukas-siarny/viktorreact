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

export type CalendarApiRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof CalendarApi>
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof CalendarApi>
	[CALENDAR_VIEW.MONTH]?: InstanceType<typeof CalendarApi>
}

const CalendarContent = React.forwardRef<CalendarApiRefs, Props>((props, ref) => {
	const { view, selectedDate, loading, eventType, employees, onShowAllEmployees, firstLoadDone } = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	const monthView = useRef<InstanceType<typeof FullCalendar>>(null)

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current?.getApi(),
		[CALENDAR_VIEW.WEEK]: weekView?.current?.getApi(),
		[CALENDAR_VIEW.MONTH]: monthView?.current?.getApi()
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
