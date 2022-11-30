import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import Layout from 'antd/lib/layout/layout'
import dayjs from 'dayjs'
import { includes, isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { getFormValues, initialize, submit, destroy } from 'redux-form'
import { DelimitedArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'

// utils
import cx from 'classnames'
import { useTranslation } from 'react-i18next'

// utils
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	CONFIRM_BULK,
	DAY,
	ENDS_EVENT,
	EVERY_REPEAT,
	FORM,
	NOTIFICATION_TYPE,
	PERMISSION,
	REQUEST_TYPE,
	STRINGS
} from '../../utils/enums'
import { computeUntilDate } from '../../utils/helper'
import { withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { getWeekDays, getWeekViewSelectedDate } from './calendarHelpers'

// reducers
import { RootState } from '../../reducers'
import {
	clearCalendarReservations,
	clearCalendarShiftsTimeoffs,
	getCalendarEventDetail,
	getCalendarReservations,
	getCalendarShiftsTimeoff
} from '../../reducers/calendar/calendarActions'
import { getEmployees } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'

// components
import ConfirmBulkForm from './components/forms/ConfirmBulkForm'
import CalendarContent, { CalendarRefs } from './components/layout/CalendarContent'
import CalendarHeader from './components/layout/Header'
import SiderEventManagement from './components/layout/SiderEventManagement'
import SiderFilter from './components/layout/SiderFilter'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-2.svg'

// types
import { IBulkConfirmForm, ICalendarEventForm, ICalendarFilter, ICalendarReservationForm, IEmployeesPayload, SalonSubPageProps, INewCalendarEvent } from '../../types/interfaces'

// atoms
import ConfirmModal from '../../atoms/ConfirmModal'

const getCategoryIDs = (data: IServicesPayload['categoriesOptions']) => {
	return data?.map((service) => service.value) as string[]
}

const getEmployeeIDs = (data: IEmployeesPayload['options']) => {
	return data?.map((employee) => employee.value) as string[]
}

const Calendar: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath = '' } = props
	const calendarRefs = useRef<CalendarRefs>(null)
	const [t] = useTranslation()
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
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [visibleBulkModal, setVisibleBulkModal] = useState<{ requestType: REQUEST_TYPE; eventType?: CALENDAR_EVENT_TYPE; revertEvent?: () => void } | null>(null)
	const [isRemoving, setIsRemoving] = useState(false)
	const [isUpdatingEvent, setIsUpdatingEvent] = useState(false)
	const [tempValues, setTempValues] = useState<ICalendarEventForm | null>(null)
	const [newEventData, setNewEventData] = useState<INewCalendarEvent | null | undefined>(null)

	const loadingData = employees?.isLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading || isUpdatingEvent

	const formValuesBulkForm: Partial<IBulkConfirmForm> = useSelector((state: RootState) => getFormValues(FORM.CONFIRM_BULK_FORM)(state))
	const formValuesDetailEvent: Partial<ICalendarEventForm & ICalendarReservationForm> = useSelector((state: RootState) =>
		getFormValues(`CALENDAR_${query.sidebarView}_FORM`)(state)
	)

	/*
	const [loadInBackground, setLoadInBackground] = useState<boolean>(false)
	const fetchInterval = useRef<number | undefined>()

	const restartFetchInterval = async () => {
		if (fetchInterval.current) {
			window.clearInterval(fetchInterval.current)
		}

		const interval = window.setInterval(async () => {
			setLoadInBackground(true)
			message.open({
				type: 'loading',
				content: t('loc:Kalendár sa aktualizuje'),
				duration: 0
			})
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			await fetchEvents(false)
			setLoadInBackground(false)
			message.destroy()
		}, REFRESH_CALENDAR_INTERVAL)

		fetchInterval.current = interval
	}

	useEffect(() => {
		// clear on unmount
		return () => {
			if (fetchInterval.current) {
				window.clearInterval(fetchInterval.current)
				message.destroy()
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	*/

	// fetch new events
	const fetchEvents: any = useCallback(
		async (restartInterval = true) => {
			if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
				await Promise.all([
					dispatch(
						getCalendarReservations({ salonID, date: query.date, employeeIDs: query.employeeIDs, categoryIDs: query.categoryIDs }, query.view as CALENDAR_VIEW, true)
					),
					dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW, true))
				])
			} else {
				await dispatch(getCalendarShiftsTimeoff({ salonID, date: query.date, employeeIDs: query.employeeIDs }, query.view as CALENDAR_VIEW, true))
			}

			// if (restartInterval) {
			// 	restartFetchInterval()
			// }
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dispatch, salonID, query.date, query.employeeIDs, query.categoryIDs, query.view, query.eventsViewType]
	)

	const setNewSelectedDate = (newDate: string) => {
		setQuery({ ...query, date: newDate })
		let newCalendarDate = newDate
		if (query.view === CALENDAR_VIEW.WEEK) {
			// v tyzdenom view je potrebne skontrolovat, ci sa vramci novo nastaveneho tyzdnoveho rangu nachadza dnesok
			// ak ano, je potrebne ho nastavit ako aktualny den do kalendara, aby sa ukazal now indicator
			// kedze realne sa na tyzdenne view pouziva denne view
			const weekDays = getWeekDays(newDate)
			newCalendarDate = getWeekViewSelectedDate(newDate, weekDays)
		}
		calendarRefs?.current?.[query.view as CALENDAR_VIEW]?.getApi()?.gotoDate(newCalendarDate)
	}

	const updateCalendarSize = useRef(() => calendarRefs?.current?.[query.view as CALENDAR_VIEW]?.getApi()?.updateSize())

	useEffect(() => {
		dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID])

	useEffect(() => {
		;(async () => {
			// clear previous events
			await dispatch(clearCalendarReservations())
			await dispatch(clearCalendarShiftsTimeoffs())

			// if user uncheck all values from one of the filters => don't fetch new events => just clear store
			if (query?.categoryIDs === null || query?.employeeIDs === null) {
				return
			}
			// fetch new events
			fetchEvents()
		})()
	}, [dispatch, query.employeeIDs, query.categoryIDs, query.date, query.eventsViewType, fetchEvents])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventsViewType: query.eventsViewType,
				categoryIDs: query?.categoryIDs === undefined ? getCategoryIDs(services?.categoriesOptions) : query?.categoryIDs,
				employeeIDs: query?.employeeIDs === undefined ? getEmployeeIDs(employees?.options) : query?.employeeIDs
			})
		)
	}, [dispatch, employees?.options, services?.categoriesOptions, query.categoryIDs, query.employeeIDs, query.eventsViewType])

	useEffect(() => {
		// update calendar size when main layout sider change
		// wait for the end of sider menu animation and then update size of the calendar
		const timeout = setTimeout(updateCalendarSize.current, 300)
		return () => clearTimeout(timeout)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMainLayoutSiderCollapsed])

	const setEventManagement = useCallback(
		(newView: CALENDAR_EVENT_TYPE | undefined, eventId?: string) => {
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
					eventId,
					eventsViewType: newEventType, // Filter v kalendari je bud rezervaci alebo volno
					sidebarView: newView // siderbar view je rezervacia / volno / prestavka / pracovna zmena
				})
			}
			if (query.view === CALENDAR_VIEW.DAY) {
				setTimeout(updateCalendarSize.current, 0)
			}
		},
		[query, setQuery]
	)

	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return employees?.data?.employees.filter((employee: any) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query?.employeeIDs === null ? [] : employees?.data?.employees
	}, [employees?.data?.employees, query.employeeIDs])

	const handleSubmitFilter = (values: ICalendarFilter) => {
		setQuery({
			...query,
			...values,
			eventId: undefined,
			sidebarView: undefined
		})
	}
	const deleteEventWrapper = useCallback(async () => {
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
			} else if (eventDetail.data?.calendarBulkEvent?.id && formValuesBulkForm.actionType === CONFIRM_BULK.BULK) {
				await deleteReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/bulk/{calendarBulkEventID}',
					{ salonID, calendarBulkEventID: formValuesDetailEvent?.calendarBulkEventID as string },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
			} else {
				// DELETE single event
				await deleteReq('/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}', { salonID, calendarEventID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			}

			setEventManagement(undefined)
			fetchEvents()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}, [
		eventDetail?.data?.calendarBulkEvent?.id,
		fetchEvents,
		formValuesBulkForm?.actionType,
		formValuesDetailEvent?.calendarBulkEventID,
		isRemoving,
		query?.eventId,
		query?.sidebarView,
		salonID,
		setEventManagement
	])

	const handleDeleteEvent = async () => {
		// Ak existuje bulkID otvorit modal pre dodatocne potvrdenie zmazanie medzi BULK / SINGLE
		if (formValuesDetailEvent?.calendarBulkEventID) {
			dispatch(initialize(FORM.CONFIRM_BULK_FORM, { actionType: CONFIRM_BULK.BULK }))
			setVisibleBulkModal({ requestType: REQUEST_TYPE.DELETE })
		} else {
			deleteEventWrapper()
		}
	}

	const handleSubmitReservation = useCallback(
		async (values: ICalendarReservationForm, revertEvent?: () => void) => {
			// NOTE: ak je eventID z values tak sa funkcia vola z drag and drop / resize ak ide z query tak je otvoreny detail cez URL / kliknutim na bunku
			const eventId = values.eventId ? values.eventId : query.eventId

			try {
				setIsUpdatingEvent(true)
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
				fetchEvents()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
				// ak neprejde request, tak sa event v kalendari vráti na pôvodne miesto
				if (revertEvent) {
					revertEvent()
				}
			} finally {
				setIsUpdatingEvent(false)
			}
		},
		[query.eventId, salonID, setEventManagement, fetchEvents]
	)

	const handleSubmitEvent = useCallback(
		async (values: ICalendarEventForm, revertEvent?: () => void) => {
			const eventId = query.eventId || values.eventId // ak je z query ide sa detail drawer ak je values ide sa cez drag and drop alebo resize
			// NOTE: ak existuje actionType tak sa klikl v modali na moznost bulk / single a uz bol modal submitnuty
			if (values.calendarBulkEventID && !formValuesBulkForm?.actionType) {
				setTempValues(values)
				dispatch(initialize(FORM.CONFIRM_BULK_FORM, { actionType: CONFIRM_BULK.BULK }))
				setVisibleBulkModal({ requestType: REQUEST_TYPE.PATCH, eventType: values.eventType, revertEvent })
				return
			}
			setTempValues(null)
			try {
				// NOTE: ak je zapnute opakovanie treba poslat ktore dni a konecny datum opakovania
				setIsUpdatingEvent(true)
				let repeatEvent
				if (values.customRepeatOptions) {
					repeatEvent = values.customRepeatOptions
				} else {
					repeatEvent = values.recurring
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
				}
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
				fetchEvents()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
				// ak neprejde request, tak sa event v kalendari vráti na pôvodne miesto
				if (revertEvent) {
					revertEvent()
				}
			} finally {
				setIsUpdatingEvent(false)
			}
		},
		[dispatch, fetchEvents, formValuesBulkForm?.actionType, query.eventId, salonID, setEventManagement]
	)

	const handleSubmitConfirmModal = async (values: IBulkConfirmForm) => {
		// EDIT
		if (visibleBulkModal?.requestType === REQUEST_TYPE.PATCH) {
			// NOTE: Uprava detailu cez form
			if (query.sidebarView) {
				switch (visibleBulkModal.eventType) {
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
				// Uprava detailu cez drag and drop / resize
			} else if (values.actionType === CONFIRM_BULK.BULK && !query.sidebarView) {
				const event = await dispatch(getCalendarEventDetail(salonID, tempValues?.eventId as string))
				// event repeat + values
				const customRepeatOptions = event.data?.calendarBulkEvent?.repeatOptions
				const data = {
					...tempValues,
					customRepeatOptions
				}
				await handleSubmitEvent(data as ICalendarEventForm, visibleBulkModal.revertEvent)
			} else {
				// SINGLE edit - tempvalues z drag and drop / resize
				await handleSubmitEvent(tempValues as ICalendarEventForm, visibleBulkModal.revertEvent)
			}
			// DELETE
		} else {
			deleteEventWrapper()
		}
		setVisibleBulkModal(null)
	}

	const handleAddEvent = (initialData?: INewCalendarEvent) => {
		setNewEventData(initialData)

		if (query.eventId) {
			setEventManagement(undefined)
		}
		// NOTE: ak je filter eventType na rezervacii nastav rezervaciu ako eventType pre form, v opacnom pripade nastv pracovnu zmenu
		if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
			dispatch(destroy(FORM.CALENDAR_RESERVATION_FORM))
			setEventManagement(CALENDAR_EVENT_TYPE.RESERVATION)
		} else {
			dispatch(destroy(FORM.CALENDAR_EMPLOYEE_SHIFT_FORM))
			dispatch(destroy(FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM))
			dispatch(destroy(FORM.CALENDAR_EMPLOYEE_BREAK_FORM))
			setEventManagement(CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT)
		}
	}

	const modals = (
		<>
			<ConfirmModal
				title={visibleBulkModal?.requestType === REQUEST_TYPE.PATCH ? STRINGS(t).edit(t('loc:záznam')) : STRINGS(t).delete(t('loc:záznam'))}
				visible={!!visibleBulkModal?.requestType}
				onCancel={() => {
					if (visibleBulkModal?.revertEvent) {
						// ak uzivatel zrusi vykonanie akcie, tak sa event v kalendari vrati na pôvodne miesto
						visibleBulkModal.revertEvent()
					}
					setVisibleBulkModal(null)
				}}
				onOk={() => dispatch(submit(FORM.CONFIRM_BULK_FORM))}
				loading={loadingData}
				disabled={loadingData}
				closeIcon={<CloseIcon />}
				destroyOnClose
			>
				<ConfirmBulkForm requestType={visibleBulkModal?.requestType as REQUEST_TYPE} onSubmit={handleSubmitConfirmModal} />
			</ConfirmModal>
		</>
	)

	return (
		<>
			{modals}
			<div role={'button'} onClick={() => setEventManagement(undefined)} id={'overlay'} className={cx({ block: query.sidebarView, hidden: !query.sidebarView })} />
			<Layout className='noti-calendar-layout'>
				<CalendarHeader
					selectedDate={query.date}
					calendarView={query.view as CALENDAR_VIEW}
					siderFilterCollapsed={siderFilterCollapsed}
					setCalendarView={(newView) => {
						setQuery({ ...query, view: newView })
					}}
					setSelectedDate={setNewSelectedDate}
					setSiderFilterCollapsed={() => {
						setSiderFilterCollapsed(!siderFilterCollapsed)
						if (query.view === CALENDAR_VIEW.DAY) {
							setTimeout(updateCalendarSize.current, 0)
						}
					}}
					onAddEvent={handleAddEvent}
				/>
				<Layout hasSider className={'noti-calendar-main-section'}>
					<SiderFilter
						collapsed={siderFilterCollapsed}
						handleSubmit={handleSubmitFilter}
						parentPath={parentPath}
						eventsViewType={query.eventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
					/>
					<CalendarContent
						salonID={salonID}
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
						onEditEvent={(eventType: CALENDAR_EVENT_TYPE, eventId: string) => {
							setQuery({
								...query,
								eventId,
								sidebarView: eventType
							})
							if (query.view === CALENDAR_VIEW.DAY) {
								setTimeout(updateCalendarSize.current, 0)
							}
						}}
						refetchData={fetchEvents}
						handleSubmitReservation={handleSubmitReservation}
						handleSubmitEvent={handleSubmitEvent}
						onAddEvent={handleAddEvent}
					/>
					<SiderEventManagement
						salonID={salonID}
						selectedDate={query.date}
						eventsViewType={query.eventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
						eventId={query.eventId}
						handleDeleteEvent={handleDeleteEvent}
						sidebarView={query.sidebarView as CALENDAR_EVENT_TYPE}
						setCollapsed={setEventManagement}
						handleSubmitReservation={handleSubmitReservation}
						handleSubmitEvent={handleSubmitEvent}
						newEventData={newEventData}
						calendarApi={calendarRefs?.current?.[query.view as CALENDAR_VIEW]?.getApi()}
					/>
				</Layout>
			</Layout>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
