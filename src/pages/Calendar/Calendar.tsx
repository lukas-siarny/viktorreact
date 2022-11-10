import React, { FC, useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout from 'antd/lib/layout/layout'
import { ArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'
import { debounce, isEmpty } from 'lodash'
import { initialize } from 'redux-form'

// utils
import {
	CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW,
	CALENDAR_DATE_FORMAT,
	CALENDAR_SET_NEW_DATE,
	CALENDAR_VIEW,
	PERMISSION,
	CALENDAR_EVENT_TYPE_FILTER,
	FORM,
	CALENDAR_COMMON_SETTINGS
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { getFirstDayOfMonth, getFirstDayOfWeek } from '../../utils/helper'

// reducers
import { getCalendarReservations, getCalendarShiftsTimeoff } from '../../reducers/calendar/calendarActions'
import { getEmployees, IEmployeesPayload } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'

// components
import CalendarHeader from './components/layout/Header'
import SiderFilter from './components/layout/SiderFilter'
import SiderEventManagement from './components/layout/SiderEventManagement'
import CalendarContent, { CalendarApiRefs } from './components/layout/Content'

// types
import { ICalendarBreakForm, ICalendarFilter, ICalendarReservationForm, ICalendarShiftForm, ICalendarTimeOffForm, SalonSubPageProps } from '../../types/interfaces'
import { RootState } from '../../reducers'

const getCategoryIDs = (data: IServicesPayload['categoriesOptions']) => {
	return data?.map((service) => service.value) as string[]
}

const getEmployeeIDs = (data: IEmployeesPayload['options']) => {
	return data?.map((employee) => employee.value) as string[]
}

const Calendar: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath = '' } = props

	const dispatch = useDispatch()

	const [query, setQuery] = useQueryParams({
		view: withDefault(StringParam, CALENDAR_VIEW.DAY),
		date: withDefault(StringParam, dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
		employeeIDs: ArrayParam,
		categoryIDs: ArrayParam,
		eventType: withDefault(StringParam, CALENDAR_EVENT_TYPE_FILTER.RESERVATION)
	})

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const reservations = useSelector((state: RootState) => state.calendar.reservations)
	const shiftsTimeOffs = useSelector((state: RootState) => state.calendar.shiftsTimeOffs)

	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.settings.isSiderCollapsed)

	const calendarApiRefs = useRef<CalendarApiRefs>(null)

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [siderEventManagement, setSiderEventManagement] = useState<CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW>(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)

	const loadingData = employees?.isLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading

	const firstLoadDone = useRef(false)

	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return employees?.data?.employees.filter((employee) => query.employeeIDs?.includes(employee.id))
		}
		// when there are no values for employeeIDs in the url queryParams
		// first load - return all employes as default value
		// after first load - return no employees (when user unchecks all options in filter, we don't want to set all employees as in case of initialization)
		return !firstLoadDone.current ? employees?.data?.employees : []
	}, [employees?.data?.employees, query.employeeIDs])

	const clearAllEvents = useCallback(async () => {
		await dispatch(getCalendarShiftsTimeoff())
		await dispatch(getCalendarReservations())
	}, [dispatch])

	const fetchEvents = useCallback(
		async ({ date, employeeIDs, categoryIDs, view, eventType }) => {
			// clear previous events
			await clearAllEvents()
			// fetch new events
			if (eventType === CALENDAR_EVENT_TYPE_FILTER.RESERVATION) {
				Promise.all([
					dispatch(getCalendarReservations({ salonID, date, employeeIDs, categoryIDs }, view as CALENDAR_VIEW)),
					dispatch(getCalendarShiftsTimeoff({ salonID, date, employeeIDs }, view as CALENDAR_VIEW))
				])
			} else if (eventType === CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF) {
				dispatch(getCalendarShiftsTimeoff({ salonID, date, employeeIDs }, view as CALENDAR_VIEW))
			}
		},
		[dispatch, salonID, clearAllEvents]
	)

	// first data load
	useEffect(() => {
		;(async () => {
			fetchEvents({ date: query.date, employeeIDs: query?.employeeIDs, categoryIDs: query?.categoryIDs, view: query.view, eventType: query.eventType })

			const employeesData = await dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
			const servicesData = await dispatch(getServices({ salonID }))

			setQuery({
				...query,
				categoryIDs: query?.categoryIDs || getCategoryIDs(servicesData?.categoriesOptions),
				employeeIDs: query?.employeeIDs || getEmployeeIDs(employeesData?.options)
			})

			firstLoadDone.current = true
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, salonID])

	// data load on change query params after first load
	useEffect(() => {
		if (firstLoadDone.current) {
			if (isEmpty(query?.categoryIDs) || isEmpty(query?.employeeIDs)) {
				// if user uncheck all values from one of the filters => don't fetch new data => just clear store
				clearAllEvents()
				return
			}
			fetchEvents({ date: query.date, employeeIDs: query.employeeIDs, categoryIDs: query.categoryIDs, view: query.view, eventType: query.eventType })
		}
	}, [fetchEvents, clearAllEvents, dispatch, salonID, query.date, query.view, query.eventType, query.employeeIDs, query.categoryIDs])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventType: query.eventType,
				categoryIDs: query?.categoryIDs,
				employeeIDs: query?.employeeIDs
			})
		)
	}, [dispatch, query.eventType, query?.categoryIDs, query?.employeeIDs])

	useEffect(() => {
		// update calendar size when main layout sider change
		// wait for the end of sider menu animation and then update size of the calendar
		const timeout = setTimeout(() => calendarApiRefs?.current?.[query.view as CALENDAR_VIEW]?.updateSize(), 300)
		return () => clearTimeout(timeout)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMainLayoutSiderCollapsed])

	const setNewSelectedDate = debounce((newDate: string | dayjs.Dayjs, type: CALENDAR_SET_NEW_DATE = CALENDAR_SET_NEW_DATE.DEFAULT) => {
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
	}, 300)

	const setNewCalendarView = debounce((newCalendarView: CALENDAR_VIEW) => {
		setQuery({ ...query, view: newCalendarView })
	}, 300)

	const handleSubmitFilter = (values: ICalendarFilter) => {
		setQuery({
			...query,
			...values
		})
	}

	const setEventManagement = (newView: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => {
		setSiderEventManagement(newView)
		if (newView !== CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED) {
			const newEventType =
				newView === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION ? CALENDAR_EVENT_TYPE_FILTER.RESERVATION : CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF

			setQuery({
				...query,
				eventType: newEventType
			})
		}
	}

	const handleSubmitReservation = (values?: ICalendarReservationForm) => {
		console.log(values)
	}

	const handleSubmitShift = (values?: ICalendarShiftForm) => {
		console.log(values)
	}

	const handleSubmitTimeOff = (values?: ICalendarTimeOffForm) => {
		console.log(values)
	}

	const handleSubmitBreak = (values?: ICalendarBreakForm) => {
		console.log(values)
	}

	return (
		<Layout className='noti-calendar-layout'>
			<CalendarHeader
				selectedDate={query.date}
				calendarView={query.view as CALENDAR_VIEW}
				siderFilterCollapsed={siderFilterCollapsed}
				setCalendarView={setNewCalendarView}
				setSelectedDate={setNewSelectedDate}
				setSiderFilterCollapsed={() => setSiderFilterCollapsed(!siderFilterCollapsed)}
				setSiderEventManagement={setEventManagement}
			/>
			<Layout hasSider className={'noti-calendar-main-section'}>
				<SiderFilter
					collapsed={siderFilterCollapsed}
					handleSubmit={handleSubmitFilter}
					parentPath={parentPath}
					eventType={query.eventType as CALENDAR_EVENT_TYPE_FILTER}
					firstLoadDone={firstLoadDone.current}
				/>
				<CalendarContent
					selectedDate={query.date}
					view={query.view as CALENDAR_VIEW}
					loading={loadingData}
					eventType={query.eventType as CALENDAR_EVENT_TYPE_FILTER}
					employees={filteredEmployees() || []}
					firstLoadDone={firstLoadDone.current}
					onShowAllEmployees={() => {
						const employeeIDs = getEmployeeIDs(employees?.options)
						setQuery({
							...query,
							employeeIDs
						})
						calendarApiRefs?.current?.[query.view as CALENDAR_VIEW]?.scrollToTime(CALENDAR_COMMON_SETTINGS.SCROLL_TIME)
					}}
				/>
				<SiderEventManagement
					view={siderEventManagement}
					setCollapsed={setEventManagement}
					handleSubmitReservation={handleSubmitReservation}
					handleSubmitShift={handleSubmitShift}
					handleSubmitTimeOff={handleSubmitTimeOff}
					handleSubmitBreak={handleSubmitBreak}
				/>
			</Layout>
		</Layout>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
