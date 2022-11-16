import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout from 'antd/lib/layout/layout'
import { DelimitedArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'
import { debounce, includes, isEmpty } from 'lodash'
import { initialize } from 'redux-form'

// utils
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
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
import { computeUntilDate, getAssignedUserLabel } from '../../utils/helper'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { isRangeAleardySelected } from './calendarHelpers'

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
		sidebarView: withDefault(StringParam, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED),
		eventId: StringParam,
		eventsViewType: withDefault(StringParam, CALENDAR_EVENTS_VIEW_TYPE.RESERVATION)
	})

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const reservations = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.RESERVATIONS])
	const shiftsTimeOffs = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS])

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState(false)

	const loadingData = employees?.isLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)

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
					sidebarView: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED
				})
			} else {
				const newEventType =
					newView === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION ? CALENDAR_EVENTS_VIEW_TYPE.RESERVATION : CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF

				setQuery({
					...query,
					eventsViewType: newEventType, // Filter v kalendari je bud rezervaci alebo volno
					sidebarView: newView // siderbar view je rezervacia / volno / prestavka / pracovna zmena
				})
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
					dispatch(initialize(FORM.CALENDAR_SHIFT_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
					dispatch(initialize(FORM.CALENDAR_TIME_OFF_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					dispatch(initialize(FORM.CALENDAR_BREAK_FORM, initData))
					break
				default:
					dispatch(initialize(FORM.CALENDAR_RESERVATION_FORM, initData))
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
				break
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_SHIFT_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT)
				break
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIME_OFF:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_TIME_OFF_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIME_OFF)
				break
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_BREAK_FORM, CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK)
				break
			default:
				break
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
				serviceID: 'd9274f67-6d27-47f4-bdb5-6a3c8a91b907' // TODO:
				// serviceCategoryParameterValueID: '00000000-0000-0000-0000-000000000001' // TODO:
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
				eventsViewType={query.eventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
				calendarView={query.view as CALENDAR_VIEW}
				siderFilterCollapsed={siderFilterCollapsed}
				setCalendarView={setNewCalendarView}
				setSelectedDate={setNewSelectedDate}
				setSiderFilterCollapsed={() => setSiderFilterCollapsed(!siderFilterCollapsed)}
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
					onChangeEventType={onChangeEventType}
					salonID={salonID}
					eventsViewType={query.eventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
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
