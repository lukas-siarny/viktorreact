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
import { computeUntilDate, getAssignedUserLabel, getFirstDayOfMonth, getFirstDayOfWeek } from '../../utils/helper'
import { deleteReq, patchReq, postReq } from '../../utils/request'

// reducers
import { getCalendarEventDetail, getCalendarReservations, getCalendarShiftsTimeoff } from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { getEmployees, IEmployeesPayload } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'

// components
import CalendarHeader from './components/layout/Header'
import SiderFilter from './components/layout/SiderFilter'
import SiderEventManagement from './components/layout/SiderEventManagement'
import CalendarContent, { CalendarRefs } from './components/layout/Content'

// types
import { ICalendarEventForm, ICalendarFilter, ICalendarReservationForm, SalonSubPageProps } from '../../types/interfaces'

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
		sidebarView: withDefault(StringParam, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED),
		eventId: StringParam
	})

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const events = useSelector((state: RootState) => state.calendar.events)

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState(false)

	const loadingData = employees?.isLoading || services?.isLoading || events?.isLoading
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.settings.isSiderCollapsed)

	const initCreateEventForm = (eventForm: FORM, eventType: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => {
		const initData = {
			date: dayjs().format(DEFAULT_DATE_INIT_FORMAT),
			eventType
		}
		dispatch(initialize(eventForm, initData))
	}

	const setEventManagement = useCallback(
		(newView: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => {
			// NOTE: ak je collapsed tak nastavit sidebarView na COLLAPSED a vynulovat eventId
			if (newView === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED) {
				setQuery({
					...query,
					eventId: undefined,
					sidebarView: newView // COLLAPSED
				})
			} else {
				const newEventType =
					newView === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION ? CALENDAR_EVENT_TYPE_FILTER.RESERVATION : CALENDAR_EVENT_TYPE_FILTER.EMPLOYEE_SHIFT_TIME_OFF

				setQuery({
					...query,
					eventType: newEventType, // Filter v kalendari je bud rezervaci alebo volno
					sidebarView: newView // siderbar view je rezervacia / volno / prestavka / pracovna zmena
				})
				dispatch(change(FORM.CALENDAR_FILTER, 'eventType', newEventType))
			}
		},
		[dispatch, query, setQuery]
	)

	const initUpdateEventForm = async () => {
		try {
			const { data } = await dispatch(getCalendarEventDetail(salonID, query.eventId as string))
			const initData = {
				date: data?.start.date,
				timeFrom: data?.start.time,
				timeTo: data?.end.time,
				note: data?.note,
				employee: {
					value: data?.employee.id,
					key: data?.employee.id,
					label: getAssignedUserLabel({
						id: data?.employee.id as string,
						firstName: data?.employee.firstName,
						lastName: data?.employee.lastName,
						email: data?.employee.email
					})
				}
			}
			if (!data) {
				// NOTE: ak by bolo zle ID (zmazane alebo nenajdene) tak zatvorit drawer + zmaz eventId
				setEventManagement(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)
				return
			}
			switch (data.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					// eslint-disable-next-line consistent-return
					return dispatch(initialize(FORM.CALENDAR_SHIFT_FORM, initData))
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
					// eslint-disable-next-line consistent-return
					return dispatch(initialize(FORM.CALENDAR_TIME_OFF_FORM, initData))
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					// eslint-disable-next-line consistent-return
					return dispatch(initialize(FORM.CALENDAR_BREAK_FORM, initData))
				default:
					// eslint-disable-next-line consistent-return
					return dispatch(initialize(FORM.CALENDAR_RESERVATION_FORM, initData))
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return employees?.data?.employees.filter((employee) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query?.employeeIDs === null ? [] : employees?.data?.employees
	}, [employees?.data?.employees, query.employeeIDs])

	// Zmena selectu event type v draweri
	const onChangeEventType = (type: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => {
		switch (type) {
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_RESERVATION_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION)
				return true
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_SHIFT_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT)
				return true
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIME_OFF:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_TIME_OFF_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIME_OFF)
				return true
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_BREAK_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK)
				return true
			default:
				return ''
		}
	}

	useEffect(() => {
		// init pre UPDATE form ak eventId existuje
		if (query.eventId) {
			initUpdateEventForm()
		}
		// zmena sideBar view
		if (query.sidebarView !== CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED) {
			// initnutie defaultu sidebaru pri nacitani bude COLLAPSED a ak bude existovat typ formu tak sa initne dany FORM (pri skopirovani URL na druhy tab)
			onChangeEventType(query.sidebarView as CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.eventId, query.sidebarView])

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

	const handleDeleteEvent = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			const calendarEventID = query.eventId as string
			await deleteReq('/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}', { salonID, calendarEventID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			setEventManagement(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const handleSubmitReservation = async (values: ICalendarReservationForm) => {
		// TODO: rezervacia - NOT-2815
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
				serviceID: 'd9274f67-6d27-47f4-bdb5-6a3c8a91b907', // TODO:
				serviceCategoryParameterValueID: '00000000-0000-0000-0000-000000000001' // TODO:
			}

			await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/reservations/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const handleSubmitEvent = useCallback(
		async (values: ICalendarEventForm) => {
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
							},
							week: values.every || undefined
					  }
					: undefined
				const reqData = {
					eventType: `EMPLOYEE_${values.eventType}` as any,
					start: {
						date: values.date,
						time: values.timeFrom
					},
					end: {
						date: values.date,
						time: values.timeTo
					},
					employeeID: values.employee.key as string,
					repeatEvent,
					note: values.note
				}
				// UPDATE event shift
				if (query.eventId) {
					const reqDataUpdate = {
						start: {
							date: values.date,
							time: values.timeFrom
						},
						end: {
							date: values.date,
							time: values.timeTo
						},
						note: values.note
					}
					// NOTE: ak existuje eventId je otvoreny detail a bude sa patchovat
					await patchReq(
						'/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}',
						{ salonID, calendarEventID: query.eventId },
						reqDataUpdate,
						undefined,
						NOTIFICATION_TYPE.NOTIFICATION,
						true
					)
					setEventManagement(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)
				} else {
					// CREATE event shift
					const { data } = await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
					// TODO: ked bude detail z kalendara tak toto ZMAZAT!!! - detail sa bude initovat len z bunky kalendara alebo efektu pri skopirovania URL
					const calendarEventId = data.calendarEvents[0].id
					setQuery({
						...query,
						eventId: calendarEventId
					})
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		},
		[query, salonID, setEventManagement, setQuery]
	)

	return (
		<Layout className='noti-calendar-layout'>
			<CalendarHeader
				setCollapsed={setEventManagement}
				selectedDate={query.date}
				eventType={query.eventType as CALENDAR_EVENT_TYPE_FILTER}
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
					eventType={query.eventType as CALENDAR_EVENT_TYPE_FILTER}
					eventId={query.eventId}
					handleDeleteEvent={handleDeleteEvent}
					sidebarView={query.sidebarView as CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW}
					setCollapsed={setEventManagement}
					handleSubmitReservation={handleSubmitReservation}
					handleSubmitEvent={handleSubmitEvent}
				/>
			</Layout>
		</Layout>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
