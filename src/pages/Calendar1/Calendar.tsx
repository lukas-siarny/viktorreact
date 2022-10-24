import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout, { Content } from 'antd/lib/layout/layout'
import { ArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'

// full calendar
import { FormatterInput } from '@fullcalendar/react' // must go before plugins

// utils
import { CALENDAR_VIEW, PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getCalendarEmployees, getCalendarEvents, getCalendarServices } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'

// components
import CalendarLayoutHeader from './layout/Header'
import SiderFilter from './layout/SiderFilter'
import SiderEventManagement from './layout/SiderEventManagement'

const TIME_FORMAT: FormatterInput = {
	hour: '2-digit',
	minute: '2-digit',
	separator: '-',
	hour12: false
}

const Calendar = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [query, setQuery] = useQueryParams({
		view: withDefault(StringParam, CALENDAR_VIEW.DAY),
		date: withDefault(StringParam, dayjs().format('YYYY-MM-DD')),
		serviceID: ArrayParam,
		employeeID: ArrayParam,
		eventType: StringParam
	})

	/* const [range, setRange] = useState({
		start: '2022-10-10T00:00:00',
		end: '2022-10-10T23:59:59'
	}) */
	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState(false)
	const [siderEventManagementCollapsed, setSiderEventManagementCollapsed] = useState(false)

	const employees = useSelector((state: RootState) => state.calendar.employees)
	const services = useSelector((state: RootState) => state.calendar.services)
	const events = useSelector((state: RootState) => state.calendar.events)

	const loadingData = employees?.isLoading || services?.isLoading || events?.isLoading

	useEffect(() => {
		dispatch(getCalendarEmployees())
		dispatch(getCalendarServices())
	}, [dispatch])

	useEffect(() => {
		// dispatch(getCalendarEvents({ start: range.start, end: range.end }))
		dispatch(getCalendarEvents())
	}, [dispatch])

	return (
		<Layout className='noti-calendar-layout'>
			<CalendarLayoutHeader
				calendarView={query.view as CALENDAR_VIEW}
				setCalendarView={(newCalendarView) => setQuery({ ...query, view: newCalendarView })}
				setSiderFilterCollapsed={() => setSiderFilterCollapsed(!siderFilterCollapsed)}
			/>
			<Layout hasSider>
				<SiderFilter collapsed={siderFilterCollapsed} />
				<Content className='nc-content'>{'content'}</Content>
				<SiderEventManagement />
			</Layout>
		</Layout>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
