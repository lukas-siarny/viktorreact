import React, { FC, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import Layout from 'antd/lib/layout/layout'
import { message } from 'antd'
import dayjs from 'dayjs'
import { includes, isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize, destroy } from 'redux-form'
import { DelimitedArrayParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { useTranslation } from 'react-i18next'
import Scroll from 'react-scroll'

// utils
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	DAY,
	EVERY_REPEAT,
	FORM,
	NOTIFICATION_TYPE,
	PERMISSION,
	CALENDAR_INIT_TIME,
	RESERVATION_STATE,
	RESERVATION_PAYMENT_METHOD,
	REFRESH_CALENDAR_INTERVAL,
	CONFIRM_MODAL_DATA_TYPE
} from '../../utils/enums'
import { withPermissions, isAdmin, checkPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { getSelectedDateForCalendar, getSelectedDateRange, getTimeScrollId, isDateInRange, scrollToSelectedDate } from './calendarHelpers'
import { history } from '../../utils/history'

// reducers
import {
	clearCalendarEvents,
	clearCalendarReservations,
	clearCalendarShiftsTimeoffs,
	getCalendarEventDetail,
	getCalendarReservations,
	getCalendarShiftsTimeoff,
	refreshEvents
} from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { getEmployees } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'
import { clearEvent } from '../../reducers/virtualEvent/virtualEventActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// components
import CalendarContent, { CalendarRefs } from './components/layout/CalendarContent'
import CalendarHeader from './components/layout/Header'
import SiderEventManagement from './components/layout/SiderEventManagement'
import SiderFilter from './components/layout/SiderFilter'

// types
import {
	ICalendarEventForm,
	ICalendarFilter,
	ICalendarReservationForm,
	IEmployeesPayload,
	SalonSubPageProps,
	INewCalendarEvent,
	ReservationPopoverData,
	ReservationPopoverPosition,
	ConfirmModalData
} from '../../types/interfaces'

// atoms
import CalendarReservationPopover from './components/CalendarReservationPopover'
import CalendarConfirmModal from './components/CalendarConfirmModal'

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
	return ids?.length
		? ids?.reduce((cv, id) => {
				if (id) {
					const splittedId = id.split('-')
					return [...cv, splittedId[splittedId.length - 1]]
				}
				return cv
		  }, [] as string[])
		: null
}

const CALENDAR_VIEWS = Object.keys(CALENDAR_VIEW)
const CALENDAR_EVENTS_VIEW_TYPES = Object.keys(CALENDAR_EVENTS_VIEW_TYPE)

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

	const validSelectedDate = useMemo(() => (dayjs(query.date).isValid() ? query.date : dayjs().format(CALENDAR_DATE_FORMAT.QUERY)), [query.date])
	const validCalendarView = useMemo(() => (CALENDAR_VIEWS.includes(query.view) ? query.view : CALENDAR_VIEW.DAY), [query.view]) as CALENDAR_VIEW
	const validEventsViewType = useMemo(
		() => (CALENDAR_EVENTS_VIEW_TYPES.includes(query.eventsViewType) ? query.eventsViewType : CALENDAR_EVENTS_VIEW_TYPE.RESERVATION),
		[query.eventsViewType]
	) as CALENDAR_EVENTS_VIEW_TYPE

	const [currentRange, setCurrentRange] = useState(getSelectedDateRange(validCalendarView, validSelectedDate))
	const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData>(null)

	const clearConfirmModal = () => setConfirmModalData(null)

	const employees = useSelector((state: RootState) => state.employees.employees)
	const services = useSelector((state: RootState) => state.service.services)
	const reservations = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.RESERVATIONS])
	const shiftsTimeOffs = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS])
	const isRefreshingEvents = useSelector((state: RootState) => state.calendar.isRefreshingEvents)
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)
	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const enabledSalonReservations = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.settings?.enabledReservations)

	const currentUser = useSelector((state: RootState) => state.user.authUser.data)
	const authUserPermissions = currentUser?.uniqPermissions

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState(false)
	const [isUpdatingEvent, setIsUpdatingEvent] = useState(false)
	const [newEventData, setNewEventData] = useState<INewCalendarEvent | null | undefined>(null)
	const [reservationPopover, setReservationPopover] = useState<{ isOpen: boolean; data: ReservationPopoverData | null; position: ReservationPopoverPosition | null }>({
		isOpen: false,
		data: null,
		position: null
	})

	const fetchInterval = useRef<number | undefined>()

	const clearRestartFetchInterval = () => window.clearInterval(fetchInterval.current)

	const restartFetchInterval = async () => {
		if (fetchInterval.current) {
			clearRestartFetchInterval()
		}

		const interval = window.setInterval(async () => {
			message.open({
				type: 'loading',
				content: t('loc:Kalendár sa aktualizuje'),
				duration: 0
			})
			await dispatch(refreshEvents(validEventsViewType))
			message.destroy()
		}, REFRESH_CALENDAR_INTERVAL)

		fetchInterval.current = interval
	}

	const loadingData = employees?.isLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading || isUpdatingEvent

	const initialScroll = useRef(false)
	const scrollToDateTimeout = useRef<any>(null)

	const setNewSelectedDate = (newDate: string) => {
		// query sa nastavi vzdy ked sa zmeni datum
		setQuery({ ...query, date: newDate })

		// datum v kalendari a current range sa nastavi len vtedy, ked sa novy datum nenachadza v aktualnom rangi
		if (!isDateInRange(currentRange.start, currentRange.end, newDate)) {
			setCurrentRange(getSelectedDateRange(validCalendarView, newDate))
			const newCalendarDate = getSelectedDateForCalendar(validCalendarView, newDate)

			if (!dayjs(newCalendarDate).isSame(calendarRefs?.current?.[validCalendarView]?.getApi()?.getDate())) {
				calendarRefs?.current?.[validCalendarView]?.getApi()?.gotoDate(newCalendarDate)
			}

			initialScroll.current = false
			return
		}

		// ak sa novy datum nachadza v rovnakom rangi ako predtym, tak sa v tyzdenom view len zascrolluje na jeho poziciu
		// nenacitavaju nove data a netreba cakat na opatovne vykreslenie kalenadara
		if (validCalendarView === CALENDAR_VIEW.WEEK) {
			scrollToSelectedDate(newDate, { smooth: true, duration: 300 })
		}
	}

	useEffect(() => {
		// zmenil sa range, je potrebne pockat na nacitanie novych dat a opatovne vykrelsenie kalenara a az tak zascrollovat na datum
		if (validCalendarView === CALENDAR_VIEW.WEEK && !loadingData && !initialScroll.current) {
			scrollToDateTimeout.current = setTimeout(() => {
				scrollToSelectedDate(validSelectedDate, { smooth: true, duration: 300 })
				initialScroll.current = true
			}, CALENDAR_INIT_TIME)
		}

		return () => clearTimeout(scrollToDateTimeout.current)
	}, [loadingData, validSelectedDate, query.view, currentRange.start, currentRange.end, validCalendarView])

	const setCalendarView = (newView: CALENDAR_VIEW) => {
		setQuery({ ...query, view: newView })
		setCurrentRange(getSelectedDateRange(newView, query.date))
	}

	const updateCalendarSize = useRef(() => calendarRefs?.current?.[validCalendarView]?.getApi()?.updateSize())

	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return employees?.data?.employees.filter((employee: any) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query?.employeeIDs === null ? [] : employees?.data?.employees
	}, [employees?.data?.employees, query.employeeIDs])

	// fetch new events
	const fetchEvents: any = useCallback(
		async (clearVirtualEvent?: boolean) => {
			if (validEventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
				Promise.all([
					dispatch(
						getCalendarReservations(
							{
								salonID,
								start: currentRange.start,
								end: currentRange.end,
								employeeIDs: query.employeeIDs,
								categoryIDs: getFullCategoryIdsFromUrl(query?.categoryIDs)
							},
							true,
							clearVirtualEvent
						)
					),
					dispatch(getCalendarShiftsTimeoff({ salonID, start: currentRange.start, end: currentRange.end, employeeIDs: query.employeeIDs }, true, clearVirtualEvent))
				])
			} else if (validEventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
				dispatch(getCalendarShiftsTimeoff({ salonID, start: currentRange.start, end: currentRange.end, employeeIDs: query.employeeIDs }, true, clearVirtualEvent))
			}

			await restartFetchInterval()
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dispatch, salonID, currentRange.start, currentRange.end, query.employeeIDs, query.categoryIDs, validEventsViewType]
	)

	const scrollToTime = useCallback(
		(hour: number) => {
			// scrollID je hodina, na ktoru chceme zascrollovat
			// od nej sa este odrataju 2 hodiny, aby bolo vidiet aj co sa deje pred tymto casom
			const scrollTimeId = getTimeScrollId(Math.max(hour - 2, 0))
			if (validCalendarView === CALENDAR_VIEW.DAY) {
				Scroll.scroller.scrollTo(scrollTimeId, {
					containerId: 'nc-calendar-day-wrapper',
					offset: -80 // - hlavicka
				})
			} else {
				calendarRefs?.current?.[validCalendarView]?.getApi().scrollToTime(scrollTimeId)
			}
		},
		[validCalendarView]
	)

	// scroll to time after initialization
	useEffect(() => {
		scrollToTime(dayjs().hour())
	}, [scrollToTime])

	useEffect(() => {
		// NOT-3601: docasna implementacia, po rozhodnuti o zmene, treba prejst vsetky commenty s tymto oznacenim a revertnut
		const loadSalonDetail = async () => {
			const salonRes = await dispatch(selectSalon(salonID))

			const canVisitThisPage = isAdmin(authUserPermissions) || (checkPermissions(authUserPermissions, [PERMISSION.PARTNER]) && salonRes?.data?.settings?.enabledReservations)
			if (!canVisitThisPage) {
				history.push('/404')
			}
		}

		loadSalonDetail()
		dispatch(getEmployees({ salonID, page: 1, limit: 100 }))
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID, authUserPermissions])

	useEffect(() => {
		;(async () => {
			// if user uncheck all values from one of the filters => don't fetch new events
			if (query?.employeeIDs === null || query?.categoryIDs === null) {
				clearRestartFetchInterval()
				dispatch(clearCalendarReservations())
				dispatch(clearCalendarShiftsTimeoffs())
				return
			}

			// fetch new events
			fetchEvents(false)
		})()
	}, [dispatch, query.employeeIDs, query.categoryIDs, fetchEvents])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventsViewType: validEventsViewType,
				categoryIDs: query?.categoryIDs === undefined ? getCategoryIDs(services?.categoriesOptions) : getFullCategoryIdsFromUrl(query?.categoryIDs),
				employeeIDs: query?.employeeIDs === undefined ? getEmployeeIDs(employees?.options) : query?.employeeIDs
			})
		)
	}, [dispatch, employees?.options, services?.categoriesOptions, query.categoryIDs, query.employeeIDs, validEventsViewType])

	useEffect(() => {
		// update calendar size when main layout sider change
		// wait for the end of sider menu animation and then update size of the calendar
		const timeout = setTimeout(updateCalendarSize.current, 300)
		return () => clearTimeout(timeout)
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

	useEffect(() => {
		// clear on unmount
		return () => {
			if (fetchInterval.current) {
				clearRestartFetchInterval()
				message.destroy()
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const closeSiderForm = useCallback(() => {
		dispatch(clearEvent())
		setEventManagement(undefined)
	}, [dispatch, setEventManagement])

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

	const handleAddEvent = (initialData?: INewCalendarEvent) => {
		// NOTE: ak existuje vytvoreny virualny event a pouzivatel vytvori dalsi klikom na tlacidlo Pridat tak ho zmaze a otvori init create form eventu
		if (virtualEvent) {
			dispatch(clearEvent())
			setEventManagement(undefined)
		}

		// Event data ziskane z kalendara, sluzia pre init formularu v SiderEventManagement
		setNewEventData(initialData)

		if (query.eventId) {
			closeSiderForm()
		}
		// NOTE: ak je filter eventType na rezervacii nastav rezervaciu ako eventType pre form, v opacnom pripade nastav pracovnu zmenu
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

	const handleSubmitReservation = useCallback(
		async (values: ICalendarReservationForm, eventId?: string) => {
			if (!values) {
				return
			}

			const { revertEvent } = values

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
					fetchEvents(false) // Po PATCHi vponechat virtualny event ak bol vytvoreny
				} else {
					// CREATE
					await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/reservations/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
					fetchEvents(true) // Po CREATe zmazat virtualny event aby neostali ten tkory sa dotiahne z BE a sucasne aj virualny
					closeSiderForm()
				}

				// Po UPDATE rezervacie dotiahnut eventy + zatvorit drawer, pri CREATE ostane otvoreny sider pocas updatu len
				if (query.eventId) {
					closeSiderForm()
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
				// ak neprejde request, tak sa event v kalendari vráti na pôvodne miesto
				if (revertEvent) {
					revertEvent()
				}
			} finally {
				setIsUpdatingEvent(false)
				clearConfirmModal()
				if (values?.enableCalendarRender) {
					values?.enableCalendarRender()
				}
			}
		},
		[closeSiderForm, fetchEvents, salonID, query.eventId]
	)

	const handleSubmitEvent = useCallback(
		async (values: ICalendarEventForm, calendarEventID?: string, calendarBulkEventID?: string, updateFromCalendar = false) => {
			const { revertEvent } = values

			const repeatEvent = values.recurring
				? {
						untilDate: values.end as string,
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

			try {
				setIsUpdatingEvent(true)
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
					note: values.note,
					repeatEvent
				}
				// UPDATE event
				if (calendarEventID) {
					let reqDataUpdate = {
						start: {
							date: values.date,
							time: values.timeFrom
						},
						end: {
							date: values.date,
							time: values.timeTo
						},
						note: values.note,
						repeatEvent
					}
					if (calendarBulkEventID) {
						// NOTE: ak je zapnute opakovanie treba poslat ktore dni a konecny datum opakovania
						if (updateFromCalendar) {
							// Uprava detailu cez drag and drop / resize
							// Ak sa posielaju data do funkcie z kalendaru, tak tie neobsahuju repeatEvent objekt
							// Je to vsak povinna hodnota a preto je potrebne ho dotiahnut
							const event = await dispatch(getCalendarEventDetail(salonID, calendarEventID))
							reqDataUpdate = {
								...reqDataUpdate,
								repeatEvent: event.data?.calendarBulkEvent?.repeatOptions
							}
						}
						// BULK UPDATE
						await patchReq(
							'/api/b2b/admin/salons/{salonID}/calendar-events/bulk/{calendarBulkEventID}',
							{ salonID, calendarBulkEventID },
							reqDataUpdate as any,
							undefined,
							NOTIFICATION_TYPE.NOTIFICATION,
							true
						)
					} else {
						// SINGLE RECORD UPDATE
						// NOTE: ak existuje eventId je otvoreny detail a bude sa patchovat
						await patchReq(
							'/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}',
							{ salonID, calendarEventID },
							reqDataUpdate,
							undefined,
							NOTIFICATION_TYPE.NOTIFICATION,
							true
						)
					}
					fetchEvents(false) // Po PATCHi vponechat virtualny event ak bol vytvoreny
				} else {
					// CREATE event shift
					await postReq('/api/b2b/admin/salons/{salonID}/calendar-events/', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
					fetchEvents(true) // Po CREATe zmazat virtualny event aby neostali ten tkory sa dotiahne z BE a sucasne aj virualny
					closeSiderForm()
				}
				// Po UPDATE eventu dotiahnut eventy + zatvorit drawer, pri CREATE ostane otvoreny sider pcoas updatu len
				if (query.eventId) {
					closeSiderForm()
				}
				dispatch(destroy(FORM.CONFIRM_BULK_FORM))
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
				// ak neprejde request, tak sa event v kalendari vráti na pôvodne miesto
				if (revertEvent) {
					revertEvent()
				}
			} finally {
				setIsUpdatingEvent(false)
				clearConfirmModal()
				if (values?.enableCalendarRender) {
					values?.enableCalendarRender()
				}
			}
		},
		[dispatch, fetchEvents, closeSiderForm, salonID, query.eventId]
	)

	const handleDeleteEvent = useCallback(
		async (calendarEventID: string, calendarBulkEventID?: string) => {
			if (isRemoving) {
				return
			}
			try {
				setIsRemoving(true)
				if (query.sidebarView === CALENDAR_EVENT_TYPE.RESERVATION) {
					// DELETE reservation
					await deleteReq(
						'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}',
						{ salonID, calendarEventID },
						undefined,
						NOTIFICATION_TYPE.NOTIFICATION,
						true
					)
				} else if (calendarBulkEventID) {
					// DELETE BULK event
					await deleteReq(
						'/api/b2b/admin/salons/{salonID}/calendar-events/bulk/{calendarBulkEventID}',
						{ salonID, calendarBulkEventID },
						undefined,
						NOTIFICATION_TYPE.NOTIFICATION,
						true
					)
				} else {
					// DELETE single event
					await deleteReq(
						'/api/b2b/admin/salons/{salonID}/calendar-events/{calendarEventID}',
						{ salonID, calendarEventID },
						undefined,
						NOTIFICATION_TYPE.NOTIFICATION,
						true
					)
				}

				closeSiderForm()
				fetchEvents()
			} catch (error: any) {
				// eslint-disable-next-line no-console
				console.error(error.message)
			} finally {
				setIsRemoving(false)
				clearConfirmModal()
			}
		},
		[fetchEvents, isRemoving, query?.sidebarView, salonID, closeSiderForm]
	)

	const handleUpdateReservationState = useCallback(
		async (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) => {
			try {
				await patchReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}/state',
					{ calendarEventID, salonID },
					{ state, reason, paymentMethod },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
				fetchEvents()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				setReservationPopover((prevProps) => ({ ...prevProps, isOpen: false, position: null }))
				clearConfirmModal()
			}
		},
		[fetchEvents, salonID]
	)

	const initSubmitReservationData = (values: ICalendarReservationForm) => setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.RESERVATION, values })

	const initSubmitEventData = (values: ICalendarEventForm) => setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.EVENT, values })

	const initDeleteEventData = (eventId: string, calendarBulkEventID?: string, eventType?: CALENDAR_EVENT_TYPE) =>
		setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.DELETE_EVENT, eventId, calendarBulkEventID, eventType })

	const initUpdateReservationStateData = (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) =>
		setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.UPDATE_RESERVATION_STATE, calendarEventID, state, reason, paymentMethod })

	const modals = (
		<CalendarConfirmModal
			data={confirmModalData}
			loadingData={loadingData}
			queryEventId={query.eventId}
			handleSubmitReservation={handleSubmitReservation}
			handleSubmitEvent={handleSubmitEvent}
			handleUpdateReservationState={handleUpdateReservationState}
			handleDeleteEvent={handleDeleteEvent}
			clearConfirmModal={clearConfirmModal}
		/>
	)

	const onEditEvent = (eventType: CALENDAR_EVENT_TYPE, eventId: string) => {
		setQuery({
			...query,
			eventId,
			sidebarView: eventType
		})
		if (validCalendarView === CALENDAR_VIEW.DAY) {
			setTimeout(updateCalendarSize.current, 0)
		}
	}

	return (
		<>
			{modals}
			<Layout className='noti-calendar-layout'>
				<CalendarHeader
					enabledSalonReservations={enabledSalonReservations}
					selectedDate={validSelectedDate}
					eventsViewType={validEventsViewType}
					calendarView={validCalendarView}
					siderFilterCollapsed={siderFilterCollapsed}
					setCalendarView={setCalendarView}
					setEventsViewType={(eventsViewType: CALENDAR_EVENTS_VIEW_TYPE) => {
						// NOTE: Ak je otvoreny CREATE / EDIT sidebar tak pri prepnuti filtra ho zrusit + zmaze virtual event
						dispatch(clearEvent())
						setQuery({ ...query, eventsViewType, sidebarView: undefined })
					}}
					setSelectedDate={setNewSelectedDate}
					setSiderFilterCollapsed={() => {
						setSiderFilterCollapsed(!siderFilterCollapsed)
						if (validCalendarView === CALENDAR_VIEW.DAY) {
							setTimeout(updateCalendarSize.current, 0)
						}
					}}
					onAddEvent={handleAddEvent}
				/>
				<Layout hasSider className={'noti-calendar-main-section'}>
					<SiderFilter collapsed={siderFilterCollapsed} handleSubmit={handleSubmitFilter} parentPath={parentPath} eventsViewType={validEventsViewType} />
					<CalendarContent
						salonID={salonID}
						enabledSalonReservations={enabledSalonReservations}
						setEventManagement={setEventManagement}
						ref={calendarRefs}
						selectedDate={validSelectedDate}
						view={validCalendarView}
						reservations={reservations?.data || []}
						shiftsTimeOffs={shiftsTimeOffs?.data || []}
						loading={isRefreshingEvents ? false : loadingData}
						eventsViewType={validEventsViewType}
						employees={filteredEmployees() || []}
						showEmptyState={query?.employeeIDs === null}
						onShowAllEmployees={() => {
							setQuery({
								...query,
								employeeIDs: undefined
							})
						}}
						onEditEvent={onEditEvent}
						onReservationClick={(data?: ReservationPopoverData, position?: ReservationPopoverPosition) => {
							setReservationPopover({
								isOpen: true,
								data: data || null,
								position: position || null
							})
						}}
						handleSubmitReservation={initSubmitReservationData}
						handleSubmitEvent={initSubmitEventData}
						onAddEvent={handleAddEvent}
						clearRestartInterval={clearRestartFetchInterval}
					/>
					{enabledSalonReservations && (
						<SiderEventManagement
							salonID={salonID}
							selectedDate={validSelectedDate}
							eventsViewType={validEventsViewType as CALENDAR_EVENTS_VIEW_TYPE}
							eventId={query.eventId}
							handleDeleteEvent={initDeleteEventData}
							sidebarView={query.sidebarView as CALENDAR_EVENT_TYPE}
							onCloseSider={closeSiderForm}
							handleSubmitReservation={initSubmitReservationData}
							handleSubmitEvent={initSubmitEventData}
							newEventData={newEventData}
							calendarApi={calendarRefs?.current?.[query.view as CALENDAR_VIEW]?.getApi()}
							changeCalendarDate={setNewSelectedDate}
						/>
					)}
				</Layout>
			</Layout>
			<CalendarReservationPopover
				data={reservationPopover.data}
				position={reservationPopover.position}
				isOpen={reservationPopover.isOpen}
				setIsOpen={(isOpen: boolean) => setReservationPopover((prevState) => ({ ...prevState, isOpen, position: null }))}
				handleUpdateReservationState={initUpdateReservationStateData}
				onEditEvent={onEditEvent}
				placement={validCalendarView === CALENDAR_VIEW.WEEK ? 'bottom' : 'left'}
			/>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]))(Calendar)
