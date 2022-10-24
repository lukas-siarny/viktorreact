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
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, CALENDAR_DATE_FORMAT, CALENDAR_SET_NEW_DATE, CALENDAR_VIEW, PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getCalendarEmployees, getCalendarEvents, getCalendarServices } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'

// components
import CalendarLayoutHeader from './layout/Header'
import SiderFilter from './layout/SiderFilter'
import SiderEventManagement from './layout/SiderEventManagement'
import { getFirstDayOfMonth, getFirstDayOfWeek } from '../../utils/helper'

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
		date: withDefault(StringParam, dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
		serviceID: ArrayParam,
		employeeID: ArrayParam,
		eventType: StringParam
	})

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [siderEventManagementCollapsed, setSiderEventManagementCollapsed] = useState<CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW | true>(true)

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

	const setNewSelectedDate = (newDate: string | dayjs.Dayjs, type: CALENDAR_SET_NEW_DATE = CALENDAR_SET_NEW_DATE.DEFAULT) => {
		let newQueryDate: string | dayjs.Dayjs = newDate

		switch (type) {
			// find start of week / month and add value
			case CALENDAR_SET_NEW_DATE.FIND_START_ADD:
				if (query.view === CALENDAR_VIEW.DAY) {
					// add one day
					newQueryDate = dayjs(newDate).add(1, 'day')
				} else if (query.view === CALENDAR_VIEW.WEEK) {
					// set first day of the next week
					newQueryDate = getFirstDayOfWeek(dayjs(newDate).add(1, 'week'))
				} else if (query.view === CALENDAR_VIEW.MONTH) {
					// set first day of next month
					newQueryDate = getFirstDayOfMonth(dayjs(newDate).add(1, 'month'))
				}
				break
			// find start of week / month and subtract value
			case CALENDAR_SET_NEW_DATE.FIND_START_SUBSTRACT:
				if (query.view === CALENDAR_VIEW.DAY) {
					// subtract one day
					newQueryDate = dayjs(newDate).subtract(1, 'day')
				} else if (query.view === CALENDAR_VIEW.WEEK) {
					// set first day of the previous week
					newQueryDate = getFirstDayOfWeek(dayjs(newDate).subtract(1, 'week'))
				} else if (query.view === CALENDAR_VIEW.MONTH) {
					// set first day of the previous month
					newQueryDate = getFirstDayOfMonth(dayjs(newDate).subtract(1, 'month'))
				}
				break
			// find start of week / month
			// day - use value as it is
			case CALENDAR_SET_NEW_DATE.FIND_START:
				if (query.view === CALENDAR_VIEW.WEEK) {
					// set first day of week
					newQueryDate = getFirstDayOfWeek(newDate)
				} else if (query.view === CALENDAR_VIEW.MONTH) {
					// set first day of month
					newQueryDate = getFirstDayOfMonth(newDate)
				}
				break
			// use value as it is for every view
			default:
				break
		}
		setQuery({ ...query, date: dayjs(newQueryDate).format(CALENDAR_DATE_FORMAT.QUERY) })
	}

	return (
		<Layout className='noti-calendar-layout'>
			<CalendarLayoutHeader
				selectedDate={query.date}
				calendarView={query.view as CALENDAR_VIEW}
				setCalendarView={(newCalendarView) => setQuery({ ...query, view: newCalendarView })}
				setSelectedDate={setNewSelectedDate}
				setSiderFilterCollapsed={() => setSiderFilterCollapsed(!siderFilterCollapsed)}
				setSiderEventManagementCollapsed={setSiderEventManagementCollapsed}
			/>
			<Layout hasSider>
				<SiderFilter collapsed={siderFilterCollapsed} />
				<Content className='nc-content'>{'content'}</Content>
				<SiderEventManagement view={siderEventManagementCollapsed} setCollapsed={setSiderEventManagementCollapsed} />
			</Layout>
		</Layout>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
