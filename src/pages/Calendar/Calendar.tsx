import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout, { Content } from 'antd/lib/layout/layout'
import { ArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'

// full calendar
import { FormatterInput } from '@fullcalendar/react' // must go before plugins

// utils
import { initialize } from 'redux-form'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, CALENDAR_DATE_FORMAT, CALENDAR_SET_NEW_DATE, CALENDAR_VIEW, PERMISSION, CALENDAR_EVENT_TYPE_FILTER, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { getFirstDayOfMonth, getFirstDayOfWeek } from '../../utils/helper'

// reducers
import { getCalendarEvents } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { getEmployees } from '../../reducers/employees/employeesActions'
import { getServices } from '../../reducers/services/serviceActions'

// components
import CalendarLayoutHeader from './components/layout/Header'
import SiderFilter from './components/layout/SiderFilter'
import SiderEventManagement from './components/layout/SiderEventManagement'
import CalendarDayView from './components/views/CalendarDayView'
import CalendarWeekView from './components/views/CalendarWeekView'

// types
import { ICalendarFilter, SalonSubPageProps } from '../../types/interfaces'

const TIME_FORMAT: FormatterInput = {
	hour: '2-digit',
	minute: '2-digit',
	separator: '-',
	hour12: false
}

const Calendar: FC<SalonSubPageProps> = (props) => {
	const { salonID } = props

	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [query, setQuery] = useQueryParams({
		view: withDefault(StringParam, CALENDAR_VIEW.DAY),
		date: withDefault(StringParam, dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
		serviceID: ArrayParam,
		employeeID: ArrayParam,
		eventType: withDefault(StringParam, CALENDAR_EVENT_TYPE_FILTER.RESERVATION)
	})

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [siderEventManagementCollapsed, setSiderEventManagementCollapsed] = useState<CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW>(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const events = useSelector((state: RootState) => state.calendar.events)

	const loadingData = employees?.isLoading || services?.isLoading || events?.isLoading

	useEffect(() => {
		dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID])

	useEffect(() => {
		dispatch(getCalendarEvents({ salonID, date: query.date }, query.view as CALENDAR_VIEW))

		dispatch(
			initialize(FORM.SALONS_FILTER_DELETED, {
				eventType: query.eventType
			})
		)
	}, [dispatch, salonID, query.date, query.view, query.eventType])

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

	const handleSubmitFilter = (values: ICalendarFilter) => {
		setQuery({
			...query,
			...values
		})
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
			<Layout hasSider className={'noti-calendar-main-section'}>
				<SiderFilter collapsed={siderFilterCollapsed} handleSubmit={handleSubmitFilter} />
				<Content className='nc-content'>
					{query.view === CALENDAR_VIEW.DAY && <CalendarDayView />}
					{query.view === CALENDAR_VIEW.WEEK && <CalendarWeekView />}
				</Content>
				<SiderEventManagement view={siderEventManagementCollapsed} setCollapsed={setSiderEventManagementCollapsed} />
			</Layout>
		</Layout>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
