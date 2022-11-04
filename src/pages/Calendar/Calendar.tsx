import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout from 'antd/lib/layout/layout'
import { ArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'
import { debounce } from 'lodash'
import { change, initialize } from 'redux-form'

// utils
import {
	CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW,
	CALENDAR_DATE_FORMAT,
	CALENDAR_SET_NEW_DATE,
	CALENDAR_VIEW,
	PERMISSION,
	CALENDAR_EVENT_TYPE_FILTER,
	FORM,
	NOTIFICATION_TYPE
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { getFirstDayOfMonth, getFirstDayOfWeek } from '../../utils/helper'

// reducers
import { getCalendarEvents } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { getEmployees, IEmployeesPayload } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'

// components
import CalendarHeader from './components/layout/Header'
import SiderFilter from './components/layout/SiderFilter'
import SiderEventManagement from './components/layout/SiderEventManagement'
import CalendarContent from './components/layout/Content'

// types
import { ICalendarBreakForm, ICalendarFilter, ICalendarReservationForm, ICalendarShiftForm, ICalendarTimeOffForm, SalonSubPageProps } from '../../types/interfaces'
import { postReq } from '../../utils/request'

const getServiceIDs = (data: IServicesPayload['options']) => {
	return data?.map((service) => service.value) as string[]
}

const getEmployeeIDs = (data: IEmployeesPayload['options']) => {
	return data?.map((employee) => employee.value)
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
	const events = useSelector((state: RootState) => state.calendar.events)

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	// NOTE: default je COLLAPSED, RESERVATION je len pre develeporske ucely teraz
	const [siderEventManagement, setSiderEventManagement] = useState<CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW>(
		/* CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED */ CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION
	)

	const loadingData = employees?.isLoading || services?.isLoading || events?.isLoading

	useEffect(() => {
		const fetchData = async () => {
			const employeesData = await dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
			const servicesData = await dispatch(getServices({ salonID }))

			dispatch(
				initialize(FORM.CALENDAR_FILTER, {
					eventType: CALENDAR_EVENT_TYPE_FILTER.RESERVATION,
					categoryIDs: getServiceIDs(servicesData.options),
					employeeIDs: getEmployeeIDs(employeesData.options)
				})
			)
		}

		fetchData()
	}, [dispatch, salonID])

	useEffect(() => {
		dispatch(
			getCalendarEvents(
				{ salonID, date: query.date, eventType: query.eventType as CALENDAR_EVENT_TYPE_FILTER, employeeIDs: query.employeeIDs, categoryIDs: query.categoryIDs },
				query.view as CALENDAR_VIEW
			)
		)
	}, [dispatch, salonID, query.date, query.view, query.eventType, query.categoryIDs, query.employeeIDs])

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
			dispatch(change(FORM.CALENDAR_FILTER, 'eventType', newEventType))
		}
	}

	const handleSubmitReservation = async (values: ICalendarReservationForm) => {
		// TODO: rezervacia
		console.log('reservation form values', values)
		// damske kadernictvo: "00000000-0000-0000-0000-000000000001"
		// sluzba: "00000000-0000-0000-0000-000000000068"
		try {
			const reqData = {
				start: {
					date: values.date,
					time: values.timeFrom
				},
				end: {
					date: values.date,
					time: values.timeTo
				},
				note: values.note,
				customerID: values.customer.key as string,
				employeeID: values.employee.key as string,
				serviceID: '88e6e81b-48df-4df0-a79c-35762514a1cc',
				serviceCategoryParameterValueID: '00000000-0000-0000-0000-000000000069'
			}

			await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/reservations/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
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
				setCalendarView={setNewCalendarView}
				setSelectedDate={setNewSelectedDate}
				setSiderFilterCollapsed={() => setSiderFilterCollapsed(!siderFilterCollapsed)}
				setSiderEventManagement={setEventManagement}
			/>
			<Layout hasSider className={'noti-calendar-main-section'}>
				<SiderFilter collapsed={siderFilterCollapsed} handleSubmit={handleSubmitFilter} parentPath={parentPath} />
				<CalendarContent selectedDate={query.date} view={query.view as CALENDAR_VIEW} loading={loadingData} />
				<SiderEventManagement
					salonID={salonID}
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
