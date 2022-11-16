import React, { FC, useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout from 'antd/lib/layout/layout'
import { DelimitedArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
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
	CALENDAR_EVENTS_VIEW_TYPE,
	FORM,
	CALENDAR_EVENTS_KEYS
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { isRangeAleardySelected } from './calendarHelpers'

// reducers
import { getCalendarReservations, getCalendarShiftsTimeoff } from '../../reducers/calendar/calendarActions'
import { getEmployees, IEmployeesPayload } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'

// components
import CalendarHeader from './components/layout/Header'
import SiderFilter from './components/layout/SiderFilter'
import SiderEventManagement from './components/layout/SiderEventManagement'
import CalendarContent, { CalendarRefs } from './components/layout/Content'

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

	/*
		NOTE:
		* undefined queryParam value means there is no filter applied (e.g query = { view: 'DAY', employeeIDs: undefined, date: '2022-11-03' }, url: &view=DAY&date=2022-11-03)
		* we would set default value for employees in this case (all employes)
		* null queryParam value means empty filter (e.g query = { view: 'DAY', employeeIDs: null, date: '2022-11-03' } => url: &view=DAY&employeeIDS&date=2022-11-03)
		* we would set no emoployees in this case
		* this is usefull, becouse when we first initialize page, we want to set default value (if there are no employeeIDs in the URL)
		* but when user unchecks all employeeIDs options in the filter, we want to show no employees
	*/
	const [query, setQuery] = useQueryParams({
		// view: withDefault(StringParam, CALENDAR_VIEW.DAY),
		view: withDefault(StringParam, CALENDAR_VIEW.WEEK),
		date: withDefault(StringParam, dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
		employeeIDs: DelimitedArrayParam,
		categoryIDs: DelimitedArrayParam,
		eventsViewType: withDefault(StringParam, CALENDAR_EVENTS_VIEW_TYPE.RESERVATION)
	})

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const reservations = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.RESERVATIONS])
	const shiftsTimeOffs = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS])

	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)

	const calendarRefs = useRef<CalendarRefs>(null)

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [siderEventManagement, setSiderEventManagement] = useState<CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW>(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)

	const loadingData = employees?.isLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading

	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return employees?.data?.employees.filter((employee) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query?.employeeIDs === null ? [] : employees?.data?.employees
	}, [employees?.data?.employees, query.employeeIDs])

	useEffect(() => {
		dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID])

	useEffect(() => {
		;(async () => {
			// clear previous events
			await dispatch(getCalendarShiftsTimeoff())
			await dispatch(getCalendarReservations())

			// if user uncheck all values from one of the filters => don't fetch new events => just clear store
			if (query?.categoryIDs === null || query?.employeeIDs === null) {
				return
			}
			// fetch new events
			if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
				Promise.all([
					dispatch(getCalendarReservations({ salonID, date: query.date, employeeIDs: query.employeeIDs, categoryIDs: query.categoryIDs }, query.view as CALENDAR_VIEW)),
					dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW))
				])
			} else if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
				dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW))
			}
		})()
	}, [dispatch, salonID, query.date, query.view, query.eventsViewType, query.employeeIDs, query.categoryIDs])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventsViewType: query.eventsViewType,
				categoryIDs: query?.categoryIDs === undefined ? getCategoryIDs(services?.categoriesOptions) : query?.categoryIDs,
				employeeIDs: query?.employeeIDs === undefined ? getEmployeeIDs(employees?.options) : query?.employeeIDs
			})
		)
	}, [dispatch, query.eventsViewType, query?.categoryIDs, query?.employeeIDs, services?.categoriesOptions, employees?.options])

	useEffect(() => {
		// update calendar size when main layout sider change
		// wait for the end of sider menu animation and then update size of the calendar
		const timeout = setTimeout(() => calendarRefs?.current?.[query.view as CALENDAR_VIEW]?.getApi()?.updateSize(), 300)
		return () => clearTimeout(timeout)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMainLayoutSiderCollapsed])

	const setNewSelectedDate = debounce((newDate: string | dayjs.Dayjs, type: CALENDAR_SET_NEW_DATE = CALENDAR_SET_NEW_DATE.DEFAULT) => {
		let newQueryDate: string | dayjs.Dayjs = newDate

		switch (type) {
			case CALENDAR_SET_NEW_DATE.FIND_START_ADD:
				newQueryDate = dayjs(newDate)
					.startOf(query.view.toLowerCase() as dayjs.OpUnitType)
					.add(1, query.view.toLowerCase() as dayjs.OpUnitType)
				break
			case CALENDAR_SET_NEW_DATE.FIND_START_SUBSTRACT:
				newQueryDate = dayjs(newDate)
					.startOf(query.view.toLowerCase() as dayjs.OpUnitType)
					.subtract(1, query.view.toLowerCase() as dayjs.OpUnitType)
				break
			case CALENDAR_SET_NEW_DATE.FIND_START:
				newQueryDate = dayjs(newDate).startOf(query.view.toLowerCase() as dayjs.OpUnitType)
				break
			default:
				break
		}

		if (isRangeAleardySelected(query.view as CALENDAR_VIEW, query.date, newQueryDate)) {
			return
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
			const newEventsViewType =
				newView === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION ? CALENDAR_EVENTS_VIEW_TYPE.RESERVATION : CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF

			setQuery({
				...query,
				eventsViewType: newEventsViewType
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
					eventsViewType={query.eventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
				/>
				<CalendarContent
					ref={calendarRefs}
					selectedDate={query.date}
					view={query.view as CALENDAR_VIEW}
					reservations={reservations?.data || []}
					shiftsTimeOffs={shiftsTimeOffs?.data || []}
					loading={loadingData}
					eventsViewType={query.eventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
					employees={filteredEmployees() || []}
					showEmptyState={query?.employeeIDs === null}
					onShowAllEmployees={() => {
						setQuery({
							...query,
							employeeIDs: getEmployeeIDs(employees?.options)
						})
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
