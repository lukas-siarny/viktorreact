import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout from 'antd/lib/layout/layout'
import { DelimitedArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'
import { debounce, includes, isEmpty } from 'lodash'
import { change, initialize } from 'redux-form'

// utils
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENT_TYPE_FILTER,
	CALENDAR_SET_NEW_DATE,
	CALENDAR_VIEW,
	DAY,
	DEFAULT_DATE_INIT_FORMAT,
	ENDS_EVENT,
	FORM,
	NOTIFICATION_TYPE,
	PERMISSION
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { computeUntilDate, getFirstDayOfMonth, getFirstDayOfWeek } from '../../utils/helper'

// reducers
import { getCalendarReservations, getCalendarShiftsTimeoff } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { getEmployees, IEmployeesPayload } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'

// components
import CalendarHeader from './components/layout/Header'
import SiderFilter from './components/layout/SiderFilter'
import SiderEventManagement from './components/layout/SiderEventManagement'
import CalendarContent, { CalendarRefs } from './components/layout/Content'

// types
import { ICalendarBreakForm, ICalendarFilter, ICalendarReservationForm, ICalendarShiftForm, ICalendarTimeOffForm, SalonSubPageProps } from '../../types/interfaces'
import { postReq } from '../../utils/request'

const getCategoryIDs = (data: IServicesPayload['categoriesOptions']) => {
	return data?.map((service) => service.value) as string[]
}

const getEmployeeIDs = (data: IEmployeesPayload['options']) => {
	return data?.map((employee) => employee.value) as string[]
}

const Calendar: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath = '' } = props
	const calendarRefs = useRef<CalendarRefs>(null)

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
		view: withDefault(StringParam, CALENDAR_VIEW.DAY),
		date: withDefault(StringParam, dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
		employeeIDs: DelimitedArrayParam,
		categoryIDs: DelimitedArrayParam,
		eventType: withDefault(StringParam, CALENDAR_EVENT_TYPE_FILTER.RESERVATION),
		sidebarView: withDefault(StringParam, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)
	})

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const events = useSelector((state: RootState) => state.calendar.events)

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)

	const loadingData = employees?.isLoading || services?.isLoading || events?.isLoading
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.settings.isSiderCollapsed)

	const initEventForm = (eventForm: FORM, eventType: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => {
		const initData = {
			date: dayjs().format(DEFAULT_DATE_INIT_FORMAT),
			eventType
		}
		dispatch(initialize(eventForm, initData))
	}

	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return employees?.data?.employees.filter((employee) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query?.employeeIDs === null ? [] : employees?.data?.employees
	}, [employees?.data?.employees, query.employeeIDs])

	const setEventManagement = (newView: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => {
		// TODO: setnutie new view
		// if (newView !== CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED) {
		//
		// }
		const newEventType =
			newView === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION ? CALENDAR_EVENT_TYPE_FILTER.RESERVATION : CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF

		setQuery({
			...query,
			eventType: newEventType, // Filter v kalendari je bud rezervaci alebo volno
			sidebarView: newView // siderbar view je rezervacia / volno / prestavka / pracovna zmena
		})
		dispatch(change(FORM.CALENDAR_FILTER, 'eventType', newEventType))
	}

	const onChangeEventType = (type: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => {
		switch (type) {
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION:
				setEventManagement(type)
				initEventForm(FORM.CALENDAR_RESERVATION_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION)
				return true
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT:
				setEventManagement(type)
				initEventForm(FORM.CALENDAR_SHIFT_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT)
				return true
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIMEOFF:
				setEventManagement(type)
				initEventForm(FORM.CALENDAR_TIME_OFF_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIMEOFF)
				return true
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK:
				setEventManagement(type)
				initEventForm(FORM.CALENDAR_BREAK_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK)
				return true
			default:
				return ''
		}
	}

	useEffect(() => {
		if (query.sidebarView !== CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED) {
			// initnutie defaultu sidebaru pri nacitani bude COLLAPSED a ak bude existovat typ formu tak sa initne dany FORM (pri skopirovani URL na druhy tab)
			onChangeEventType(query.sidebarView as CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW)
		}
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
			if (query.eventType === CALENDAR_EVENT_TYPE_FILTER.RESERVATION) {
				Promise.all([
					dispatch(getCalendarReservations({ salonID, date: query.date, employeeIDs: query.employeeIDs, categoryIDs: query.categoryIDs }, query.view as CALENDAR_VIEW)),
					dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW))
				])
			} else if (query.eventType === CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF) {
				dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW))
			}
		})()
	}, [dispatch, salonID, query.date, query.view, query.eventType, query.employeeIDs, query.categoryIDs])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventType: query.eventType,
				categoryIDs: query?.categoryIDs === undefined ? getCategoryIDs(services?.categoriesOptions) : query?.categoryIDs,
				employeeIDs: query?.employeeIDs === undefined ? getEmployeeIDs(employees?.options) : query?.employeeIDs
			})
		)
	}, [dispatch, query.eventType, query?.categoryIDs, query?.employeeIDs, services?.categoriesOptions, employees?.options])

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

	const handleSubmitReservation = async (values: ICalendarReservationForm) => {
		// TODO: rezervacia
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
				serviceID: '88e6e81b-48df-4df0-a79c-35762514a1cc', // TODO:
				serviceCategoryParameterValueID: '00000000-0000-0000-0000-000000000069' // TODO:
			}

			await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/reservations/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	const handleSubmitShift = async (values: ICalendarShiftForm) => {
		try {
			// NOTE: ak je zapnute opakovanie treba poslat ktore dni a konecny datum opakovania
			const repeatEvent = values.recurring
				? {
						untilDate: computeUntilDate(values.end as ENDS_EVENT, values.date),
						days: {
							MONDAY: includes(values.repeatOn, DAY.MONDAY),
							TUESDAY: includes(values.repeatOn, DAY.TUESDAY),
							WEDNESDAY: includes(values.repeatOn, DAY.WEDNESDAY),
							THURSDAY: includes(values.repeatOn, DAY.THURSDAY),
							FRIDAY: includes(values.repeatOn, DAY.FRIDAY),
							SATURDAY: includes(values.repeatOn, DAY.SATURDAY),
							SUNDAY: includes(values.repeatOn, DAY.SUNDAY)
						}
				  }
				: undefined
			const reqData = {
				eventType: CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT as CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				start: {
					date: values.date,
					time: values.timeFrom
				},
				end: {
					date: values.date,
					time: values.timeTo
				},
				employeeID: values.employee.key as string,
				repeatEvent
			}
			await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			// TODO: initnut event a skusit UPDATE / DELETE
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const handleSubmitTimeOff = async (values: ICalendarTimeOffForm) => {
		try {
			// NOTE: ak je zapnute opakovanie treba poslat ktore dni a konecny datum opakovania
			const repeatEvent = values.recurring
				? {
						untilDate: computeUntilDate(values.end as ENDS_EVENT, values.date),
						days: {
							MONDAY: includes(values.repeatOn, DAY.MONDAY),
							TUESDAY: includes(values.repeatOn, DAY.TUESDAY),
							WEDNESDAY: includes(values.repeatOn, DAY.WEDNESDAY),
							THURSDAY: includes(values.repeatOn, DAY.THURSDAY),
							FRIDAY: includes(values.repeatOn, DAY.FRIDAY),
							SATURDAY: includes(values.repeatOn, DAY.SATURDAY),
							SUNDAY: includes(values.repeatOn, DAY.SUNDAY)
						}
				  }
				: undefined
			const reqData = {
				eventType: CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF as CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				start: {
					date: values.date,
					time: values.timeFrom
				},
				end: {
					date: values.date,
					time: values.timeTo
				},
				note: values.note,
				employeeID: values.employee.key as string,
				repeatEvent
			}
			await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			// TODO: initnut event a skusit UPDATE / DELETE
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const handleSubmitBreak = async (values: ICalendarBreakForm) => {
		try {
			// NOTE: ak je zapnute opakovanie treba poslat ktore dni a konecny datum opakovania
			const repeatEvent = values.recurring
				? {
						untilDate: computeUntilDate(values.end as ENDS_EVENT, values.date),
						days: {
							MONDAY: includes(values.repeatOn, DAY.MONDAY),
							TUESDAY: includes(values.repeatOn, DAY.TUESDAY),
							WEDNESDAY: includes(values.repeatOn, DAY.WEDNESDAY),
							THURSDAY: includes(values.repeatOn, DAY.THURSDAY),
							FRIDAY: includes(values.repeatOn, DAY.FRIDAY),
							SATURDAY: includes(values.repeatOn, DAY.SATURDAY),
							SUNDAY: includes(values.repeatOn, DAY.SUNDAY)
						}
				  }
				: undefined
			const reqData = {
				eventType: CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK as CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				start: {
					date: values.date,
					time: values.timeFrom
				},
				end: {
					date: values.date,
					time: values.timeTo
				},
				note: values.note,
				employeeID: values.employee.key as string,
				repeatEvent
			}
			await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			// TODO: initnut event a skusit UPDATE / DELETE
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	return (
		<Layout className='noti-calendar-layout'>
			<CalendarHeader
				setCollapsed={setEventManagement}
				selectedDate={query.date}
				calendarView={query.view as CALENDAR_VIEW}
				siderFilterCollapsed={siderFilterCollapsed}
				setCalendarView={setNewCalendarView}
				setSelectedDate={setNewSelectedDate}
				setSiderFilterCollapsed={() => setSiderFilterCollapsed(!siderFilterCollapsed)}
			/>
			<Layout hasSider className={'noti-calendar-main-section'}>
				<SiderFilter collapsed={siderFilterCollapsed} handleSubmit={handleSubmitFilter} parentPath={parentPath} eventType={query.eventType as CALENDAR_EVENT_TYPE_FILTER} />
				<CalendarContent
					ref={calendarRefs}
					selectedDate={query.date}
					view={query.view as CALENDAR_VIEW}
					loading={loadingData}
					eventType={query.eventType as CALENDAR_EVENT_TYPE_FILTER}
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
					onChangeEventType={onChangeEventType}
					salonID={salonID}
					sidebarView={query.sidebarView as any}
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
