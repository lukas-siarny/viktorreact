import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout from 'antd/lib/layout/layout'
import { DelimitedArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'
import { compact, debounce, includes, isEmpty, map } from 'lodash'
import { getFormValues, initialize, submit } from 'redux-form'
import { Modal } from 'antd'

// utils
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_SET_NEW_DATE,
	CALENDAR_VIEW,
	CONFIRM_BULK,
	DAY,
	DEFAULT_DATE_INIT_FORMAT,
	ENDS_EVENT,
	EVERY_REPEAT,
	FORM,
	NOTIFICATION_TYPE,
	PERMISSION,
	REQUEST_TYPE
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { computeEndDate, computeUntilDate, getAssignedUserLabel } from '../../utils/helper'
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
import ConfirmBulkForm from './components/forms/ConfirmBulkForm'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-2.svg'

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
		sidebarView: StringParam,
		eventId: StringParam,
		eventsViewType: withDefault(StringParam, CALENDAR_EVENTS_VIEW_TYPE.RESERVATION)
	})

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const reservations = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.RESERVATIONS])
	const shiftsTimeOffs = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS])

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState(false)
	const [visibleBulkModal, setVisibleBulkModal] = useState<REQUEST_TYPE | null>(null)

	const loadingData = employees?.isLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)

	const formValuesBulkForm: any = useSelector((state: RootState) => getFormValues(FORM.CONFIRM_BULK_FORM)(state))
	const formValuesDetailEvent: any = useSelector((state: RootState) => getFormValues(`CALENDAR_${query.sidebarView}_FORM`)(state))

	const initCreateEventForm = (eventForm: FORM, eventType: CALENDAR_EVENT_TYPE) => {
		const initData = {
			date: dayjs().format(DEFAULT_DATE_INIT_FORMAT),
			eventType
		}
		dispatch(initialize(eventForm, initData))
	}

	const setEventManagement = useCallback(
		(newView: CALENDAR_EVENT_TYPE | undefined) => {
			// NOTE: ak je collapsed (newView je undefined) tak nastavit sidebarView na COLLAPSED a vynulovat eventId
			if (!newView) {
				setQuery({
					...query,
					eventId: undefined,
					sidebarView: undefined
				})
			} else {
				const newEventType = newView === CALENDAR_EVENT_TYPE.RESERVATION ? CALENDAR_EVENTS_VIEW_TYPE.RESERVATION : CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF

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
			const repeatOptions = data?.calendarBulkEvent?.repeatOptions
				? {
						recurring: true,
						repeatOn: compact(map(data?.calendarBulkEvent?.repeatOptions?.days as any, (item, index) => (item ? index : undefined))),
						every: data.calendarBulkEvent.repeatOptions.week === 1 ? EVERY_REPEAT.ONE_WEEK : EVERY_REPEAT.TWO_WEEKS,
						end: computeEndDate(data?.start.date, data?.calendarBulkEvent?.repeatOptions.untilDate)
				  }
				: undefined
			const initData = {
				date: data?.start.date,
				timeFrom: data?.start.time,
				timeTo: data?.end.time,
				note: data?.note,
				calendarBulkEventID: data?.calendarBulkEvent?.id,
				employee: {
					value: data?.employee.id,
					key: data?.employee.id,
					label: getAssignedUserLabel({
						id: data?.employee.id as string,
						firstName: data?.employee.firstName,
						lastName: data?.employee.lastName,
						email: data?.employee.email
					})
				},
				...repeatOptions
			}
			if (!data) {
				// NOTE: ak by bolo zle ID (zmazane alebo nenajdene) tak zatvorit drawer + zmaz eventId
				setEventManagement(undefined)
				return
			}
			switch (data.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					dispatch(initialize(FORM.CALENDAR_EMPLOYEE_SHIFT_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
					dispatch(initialize(FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					dispatch(initialize(FORM.CALENDAR_EMPLOYEE_BREAK_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.RESERVATION:
					dispatch(
						initialize(FORM.CALENDAR_RESERVATION_FORM, {
							...initData,
							service: {
								id: data?.service?.id,
								key: data?.service?.id,
								value: data?.service?.name
							},
							customer: {
								value: data?.customer?.id,
								key: data?.customer?.id,
								label: getAssignedUserLabel({
									id: data?.customer?.id as string,
									firstName: data?.customer?.firstName,
									lastName: data?.customer?.lastName,
									email: data?.customer?.email
								})
							}
						})
					)
					break
				default:
					break
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
	const onChangeEventType = (type: CALENDAR_EVENT_TYPE) => {
		switch (type) {
			case CALENDAR_EVENT_TYPE.RESERVATION:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_RESERVATION_FORM, CALENDAR_EVENT_TYPE.RESERVATION)
				break
			case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_EMPLOYEE_SHIFT_FORM, CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT)
				break
			case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM, CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF)
				break
			case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
				setQuery({
					...query,
					sidebarView: type
				})
				initCreateEventForm(FORM.CALENDAR_EMPLOYEE_BREAK_FORM, CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK)
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
		if (query.sidebarView !== undefined) {
			// initnutie defaultu sidebaru pri nacitani bude COLLAPSED a ak bude existovat typ formu tak sa initne dany FORM (pri skopirovani URL na druhy tab)
			onChangeEventType(query.sidebarView as CALENDAR_EVENT_TYPE)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.eventId, query.sidebarView])

	useEffect(() => {
		dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID])

	const refreshEvents = () => {
		// fetch new events
		if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
			Promise.all([
				dispatch(getCalendarReservations({ salonID, date: query.date, employeeIDs: query.employeeIDs, categoryIDs: query.categoryIDs }, query.view as CALENDAR_VIEW)),
				dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW))
			])
		} else if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
			dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW))
		}
	}

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
			refreshEvents()
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
	const deleteEventWrapper = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			const calendarEventID = query.eventId as string
			// DELETE reservation
			if (query.sidebarView === CALENDAR_EVENT_TYPE.RESERVATION) {
				await deleteReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}',
					{ salonID, calendarEventID },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
				// DELETE BULK event
			} else if (eventDetail.data?.calendarBulkEvent?.id && formValuesBulkForm?.actionType === CONFIRM_BULK.BULK) {
				await deleteReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/bulk/{calendarBulkEventID}',
					{ salonID, calendarBulkEventID: formValuesDetailEvent?.calendarBulkEventID },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
			} else {
				// DELETE single event
				await deleteReq('/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}', { salonID, calendarEventID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			}

			setEventManagement(undefined)
			refreshEvents()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const handleDeleteEvent = async () => {
		// Ak existuje bulkID otvorit modal pre dodatocne potvrdenie zmazanie medzi BULK / SINGLE
		if (formValuesDetailEvent?.calendarBulkEventID) {
			dispatch(initialize(FORM.CONFIRM_BULK_FORM, { actionType: CONFIRM_BULK.BULK }))
			setVisibleBulkModal(REQUEST_TYPE.DELETE)
		} else {
			deleteEventWrapper()
		}
	}

	const handleSubmitReservation = async (values: ICalendarReservationForm) => {
		// NOTE: ak je eventID z values tak sa funkcia vola z drag and drop / resize ak ide z query tak je otvoreny detail cez URL / kliknutim na bunku
		const eventId = values.eventId ? values.eventId : query.eventId
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
				serviceID: values.service.key as string
			}
			if (eventId) {
				// UPDATE
				await patchReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}',
					{ salonID, calendarEventID: eventId },
					reqData,
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
			} else {
				// CREATE
				await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/reservations/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			}
			// Po CREATE / UPDATE rezervacie dotiahnut eventy + zatvorit drawer
			setEventManagement(undefined)
			refreshEvents()
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const handleSubmitEvent = useCallback(
		async (values: ICalendarEventForm) => {
			const eventId = query.eventId || values.eventId // ak je z query ide sa detail drawer ak je values ide sa cez drag and drop alebo resize

			// NOTE: ak existuje actionType tak sa klikl v modali na moznost bulk / single a uz bol modal submitnuty
			if (values.calendarBulkEventID && !formValuesBulkForm?.actionType) {
				dispatch(initialize(FORM.CONFIRM_BULK_FORM, { actionType: CONFIRM_BULK.BULK }))
				setVisibleBulkModal(REQUEST_TYPE.EDIT)
				return
			}

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
							week: values.every === EVERY_REPEAT.TWO_WEEKS ? 2 : (1 as 1 | 2 | undefined)
					  }
					: undefined
				const reqData = {
					eventType: values.eventType as any,
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
				if (eventId) {
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
					if (formValuesBulkForm?.actionType === CONFIRM_BULK.BULK && values.calendarBulkEventID) {
						// BULK UPDATE
						await patchReq(
							'/api/b2b/admin/salons/{salonID}/calendar-events/bulk/{calendarBulkEventID}',
							{ salonID, calendarBulkEventID: values.calendarBulkEventID },
							{ ...reqDataUpdate, repeatEvent: repeatEvent as any },
							undefined,
							NOTIFICATION_TYPE.NOTIFICATION,
							true
						)
					} else {
						// SINGLE RECORD UPDATE
						// NOTE: ak existuje eventId je otvoreny detail a bude sa patchovat
						await patchReq(
							'/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}',
							{ salonID, calendarEventID: eventId },
							reqDataUpdate,
							undefined,
							NOTIFICATION_TYPE.NOTIFICATION,
							true
						)
					}
				} else {
					// CREATE event shift
					await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
				}
				// Po CREATE / UPDATE eventu dotiahnut eventy + zatvorit drawer
				setEventManagement(undefined)
				refreshEvents()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		},
		[formValuesBulkForm?.actionType, query.eventId, salonID, setEventManagement]
	)

	const handleSubmitConfirmModal = () => {
		// EDIT
		if (visibleBulkModal === REQUEST_TYPE.EDIT) {
			switch (query.sidebarView) {
				case CALENDAR_EVENT_TYPE.RESERVATION:
					dispatch(submit(FORM.CALENDAR_RESERVATION_FORM))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					dispatch(submit(FORM.CALENDAR_EMPLOYEE_BREAK_FORM))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
					dispatch(submit(FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					dispatch(submit(FORM.CALENDAR_EMPLOYEE_SHIFT_FORM))
					break
				default:
					break
			}
			// DELETE
		} else {
			deleteEventWrapper()
		}
		setVisibleBulkModal(null)
	}

	const modals = (
		<>
			<Modal
				title={'Edit shift'}
				visible={!!visibleBulkModal}
				onCancel={() => setVisibleBulkModal(null)}
				onOk={() => dispatch(submit(FORM.CONFIRM_BULK_FORM))}
				closeIcon={<CloseIcon />}
				destroyOnClose
			>
				<ConfirmBulkForm onSubmit={handleSubmitConfirmModal} />
			</Modal>
		</>
	)

	return (
		<>
			{modals}
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
						sidebarView={query.sidebarView as CALENDAR_EVENT_TYPE}
						setCollapsed={setEventManagement}
						handleSubmitReservation={handleSubmitReservation}
						handleSubmitEvent={handleSubmitEvent}
					/>
				</Layout>
			</Layout>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
