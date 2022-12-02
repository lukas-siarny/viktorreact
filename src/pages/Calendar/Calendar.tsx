import React, { FC, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import Layout from 'antd/lib/layout/layout'
import { DelimitedArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import dayjs from 'dayjs'
import { compact, includes, isEmpty, map } from 'lodash'
import { getFormValues, initialize, submit } from 'redux-form'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Scroll from 'react-scroll'

// utils
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
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
import { withPermissions } from '../../utils/Permissions'
import { computeEndDate, computeUntilDate, getAssignedUserLabel } from '../../utils/helper'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { getSelectedDateForCalendar, getSelectedDateRange, getTimeScrollId, isDateInRange, scrollToSelectedDate } from './calendarHelpers'

// reducers
import {
	clearCalendarReservations,
	clearCalendarShiftsTimeoffs,
	getCalendarEventDetail,
	getCalendarReservations,
	getCalendarShiftsTimeoff
} from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { getEmployees } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'

// components
import CalendarHeader from './components/layout/Header'
import SiderFilter from './components/layout/SiderFilter'
import SiderEventManagement from './components/layout/SiderEventManagement'
import CalendarContent, { CalendarRefs } from './components/layout/Content'
import ConfirmBulkForm from './components/forms/ConfirmBulkForm'
import ConfirmModal from '../../atoms/ConfirmModal'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-2.svg'

// types
import { IBulkConfirmForm, ICalendarEventForm, ICalendarFilter, ICalendarReservationForm, IEmployeesPayload, SalonSubPageProps } from '../../types/interfaces'

const getCategoryIDs = (data: IServicesPayload['categoriesOptions']) => {
	return data?.map((service) => service.value) as string[]
}

const getEmployeeIDs = (data: IEmployeesPayload['options']) => {
	return data?.map((employee) => employee.value) as string[]
}

// NOTE: v URL sa pouzivaju skratene ID kategorii, pretoze ich moze byt dost vela a original IDcka su dost dhle
// tak aby sa nahodu nestalo ze sa tam nevojdu v niektorom z prehliadacov
const getFullCategoryIdsFromUrl = (ids?: (string | null)[] | null) => {
	return ids?.reduce((cv, id) => (id ? [...cv, `00000000-0000-0000-0000-${id}`] : cv), [] as string[])
}

const getShortCategoryIdsForUrl = (ids?: (string | null)[] | null) => {
	return ids?.reduce((cv, id) => {
		if (id) {
			const splittedId = id.split('-')
			return [...cv, splittedId[splittedId.length - 1]]
		}
		return cv
	}, [] as string[])
}

const CALENDAR_VIEWS = Object.keys(CALENDAR_VIEW)
const CALENDAR_EVENTS_VIEW_TYPES = Object.keys(CALENDAR_EVENTS_VIEW_TYPE)

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

	const validSelectedDate = useMemo(() => (dayjs(query.date).isValid() ? query.date : dayjs().format(CALENDAR_DATE_FORMAT.QUERY)), [query.date])
	const validCalendarView = useMemo(() => (CALENDAR_VIEWS.includes(query.view) ? query.view : CALENDAR_VIEW.DAY), [query.view])
	const validEventsViewType = useMemo(
		() => (CALENDAR_EVENTS_VIEW_TYPES.includes(query.eventsViewType) ? query.eventsViewType : CALENDAR_EVENTS_VIEW_TYPE.RESERVATION),
		[query.eventsViewType]
	)

	const [currentRange, setCurrentRange] = useState(getSelectedDateRange(validCalendarView as CALENDAR_VIEW, validSelectedDate))

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

	const loadingData = employees?.isLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading || isUpdatingEvent

	const formValuesBulkForm: Partial<IBulkConfirmForm> = useSelector((state: RootState) => getFormValues(FORM.CONFIRM_BULK_FORM)(state))
	const formValuesDetailEvent: Partial<ICalendarEventForm & ICalendarReservationForm> = useSelector((state: RootState) =>
		getFormValues(`CALENDAR_${query.sidebarView}_FORM`)(state)
	)

	const [t] = useTranslation()

	const setNewSelectedDate = (newDate: string) => {
		// query sa nastavi vzdy ked sa zmeni datum
		setQuery({ ...query, date: newDate })

		// datum v kalendari a current range sa nastavi len vtedy, ked sa novy datum nenachadza v aktualnom rangi
		// zabrani sa tym zbytocnym prendrovaniam, hlavne v tyzdenom view, kde je tych eventov vela
		if (!isDateInRange(currentRange.start, currentRange.end, newDate)) {
			setCurrentRange(getSelectedDateRange(validCalendarView as CALENDAR_VIEW, newDate))
			const newCalendarDate = getSelectedDateForCalendar(validCalendarView as CALENDAR_VIEW, newDate)
			calendarRefs?.current?.[validCalendarView as CALENDAR_VIEW]?.getApi()?.gotoDate(newCalendarDate)
			return
		}

		// ak sa novy datum nachadza v rovnakom rangi ako predtym, tak sa v tyzdenom view len zascrolluje na jeho poziciu
		/* if (query.view === CALENDAR_VIEW.WEEK) {
			scrollToSelectedDate(newDate /* , { smooth: true })
		} */
	}

	const scrollToDateTimeout = useRef<any>(null)

	useEffect(() => {
		if (!loadingData && query.view === CALENDAR_VIEW.WEEK) {
			clearTimeout(scrollToDateTimeout.current)

			scrollToDateTimeout.current = setTimeout(() => {
				scrollToSelectedDate(validSelectedDate)
			}, 500)
		}
		return () => clearTimeout(scrollToDateTimeout.current)
	}, [loadingData, validSelectedDate, validEventsViewType, query.view])

	const updateCalendarSize = useRef(() => calendarRefs?.current?.[validCalendarView as CALENDAR_VIEW]?.getApi()?.updateSize())

	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return employees?.data?.employees.filter((employee: any) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query?.employeeIDs === null ? [] : employees?.data?.employees
	}, [employees?.data?.employees, query.employeeIDs])

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
			if (validCalendarView === CALENDAR_VIEW.DAY) {
				setTimeout(updateCalendarSize.current, 0)
			}
		},
		[query, setQuery]
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
				eventType: data?.eventType,
				calendarBulkEventID: data?.calendarBulkEvent?.id,
				allDay: data?.start.time === CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT.startTime && data?.end.time === CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT.endTime,
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

	const scrollToTime = useCallback(
		(hour: number) => {
			const scrollTimeId = getTimeScrollId(Math.max(hour - 2, 0))
			if (validCalendarView === CALENDAR_VIEW.DAY) {
				Scroll.scroller.scrollTo(scrollTimeId, {
					containerId: 'nc-calendar-day-wrapper',
					offset: -80 // - hlavicka
				})
			} else {
				calendarRefs?.current?.[validCalendarView as CALENDAR_VIEW]?.getApi().scrollToTime(scrollTimeId)
			}
		},
		[validCalendarView]
	)

	// scroll to time after initialization
	useEffect(() => {
		scrollToTime(dayjs().hour())
	}, [scrollToTime])

	useEffect(() => {
		// init pre UPDATE form ak eventId existuje
		if (query.eventId) {
			initUpdateEventForm()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.eventId, query.sidebarView])

	useEffect(() => {
		dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const fetchEvents = () => {
		// fetch new events
		if (validEventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
			Promise.all([
				dispatch(
					getCalendarReservations(
						{ salonID, start: currentRange.start, end: currentRange.end, employeeIDs: query.employeeIDs, categoryIDs: getFullCategoryIdsFromUrl(query?.categoryIDs) },
						validCalendarView as CALENDAR_VIEW,
						true
					)
				),
				dispatch(
					getCalendarShiftsTimeoff(
						{ salonID, start: currentRange.start, end: currentRange.end, employeeIDs: query.employeeIDs },
						validCalendarView as CALENDAR_VIEW,
						true
					)
				)
			])
		} else if (validEventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
			dispatch(
				getCalendarShiftsTimeoff({ salonID, start: currentRange.start, end: currentRange.end, employeeIDs: query.employeeIDs }, validCalendarView as CALENDAR_VIEW, true)
			)
		}
	}

	useEffect(() => {
		;(async () => {
			// clear previous events
			// await dispatch(clearCalendarReservations())
			// await dispatch(clearCalendarShiftsTimeoffs())

			// console.log({ dontFetchNewData: dontFetchNewData.current })

			// if user uncheck all values from one of the filters => don't fetch new events => just clear store
			if (query?.categoryIDs === null || query?.employeeIDs === null) {
				return
			}
			// fetch new events
			fetchEvents()
		})()
	}, [dispatch, salonID, validCalendarView, validEventsViewType, query.employeeIDs, query.categoryIDs, currentRange.start])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventsViewType: query.eventsViewType,
				categoryIDs: query?.categoryIDs === undefined ? getCategoryIDs(services?.categoriesOptions) : query?.categoryIDs,
				employeeIDs: query?.employeeIDs === undefined ? getEmployeeIDs(employees?.options) : query?.employeeIDs
			})
		)
	}, [dispatch, employees?.options, services?.categoriesOptions, query.categoryIDs, query.employeeIDs])

	useEffect(() => {
		// update calendar size when main layout sider change
		// wait for the end of sider menu animation and then update size of the calendar
		const timeout = setTimeout(updateCalendarSize.current, 300)
		return () => clearTimeout(timeout)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMainLayoutSiderCollapsed])

	const handleSubmitFilter = (values: ICalendarFilter) => {
		setQuery({
			...query,
			...values,
			// ak su vybrati vsetci zamestnanci alebo vsetky kategorie, tak je zbytocne posielat na BE vsetky IDcka
			// BE vrati rovnake zaznamy ako ked sa tam neposle nic
			employeeIDs: values?.employeeIDs?.length === employees?.options?.length ? undefined : values.employeeIDs,
			categoryIDs: values?.categoryIDs?.length === services?.categoriesOptions?.length ? undefined : getShortCategoryIdsForUrl(values.categoryIDs),
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
		[query.eventId, salonID, setEventManagement]
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
					setCollapsed={setEventManagement}
					selectedDate={validSelectedDate}
					eventsViewType={validEventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
					calendarView={validCalendarView as CALENDAR_VIEW}
					siderFilterCollapsed={siderFilterCollapsed}
					setCalendarView={(newView) => {
						setQuery({ ...query, view: newView })
					}}
					setEventsViewType={(eventsViewType: CALENDAR_EVENTS_VIEW_TYPE) => setQuery({ ...query, eventsViewType })}
					setSelectedDate={setNewSelectedDate}
					setSiderFilterCollapsed={() => {
						setSiderFilterCollapsed(!siderFilterCollapsed)
						if (validCalendarView === CALENDAR_VIEW.DAY) {
							setTimeout(updateCalendarSize.current, 0)
						}
					}}
				/>
				<Layout hasSider className={'noti-calendar-main-section'}>
					<SiderFilter
						collapsed={siderFilterCollapsed}
						handleSubmit={handleSubmitFilter}
						parentPath={parentPath}
						eventsViewType={validEventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
					/>
					<CalendarContent
						salonID={salonID}
						ref={calendarRefs}
						selectedDate={validSelectedDate}
						view={validCalendarView as CALENDAR_VIEW}
						reservations={reservations?.data || []}
						shiftsTimeOffs={shiftsTimeOffs?.data || []}
						loading={loadingData}
						eventsViewType={validEventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
						employees={filteredEmployees() || []}
						showEmptyState={query?.employeeIDs === null}
						onShowAllEmployees={() => {
							setQuery({
								...query,
								employeeIDs: undefined
							})
						}}
						onEditEvent={(eventType: CALENDAR_EVENT_TYPE, eventId: string) => {
							setQuery({
								...query,
								eventId,
								sidebarView: eventType
							})
							if (validCalendarView === CALENDAR_VIEW.DAY) {
								setTimeout(updateCalendarSize.current, 0)
							}
						}}
						refetchData={fetchEvents}
						handleSubmitReservation={handleSubmitReservation}
						handleSubmitEvent={handleSubmitEvent}
					/>
					<SiderEventManagement
						salonID={salonID}
						selectedDate={validSelectedDate}
						eventsViewType={validEventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
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
