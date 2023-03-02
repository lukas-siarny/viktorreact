import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Layout from 'antd/lib/layout/layout'
import { message } from 'antd'
import dayjs from 'dayjs'
import { includes, isArray, isEmpty, omit } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { destroy, initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import Scroll from 'react-scroll'
import { useNavigate } from 'react-router-dom'

// utils
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_INIT_TIME,
	CALENDAR_VIEW,
	CONFIRM_MODAL_DATA_TYPE,
	DAY,
	EVERY_REPEAT,
	FORM,
	NOTIFICATION_TYPE,
	PERMISSION,
	REFRESH_CALENDAR_INTERVAL,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_STATE,
	CALENDAR_UPDATE_SIZE_DELAY_AFTER_SIDER_CHANGE,
	ADMIN_PERMISSIONS,
	CALENDAR_DAY_EVENTS_LIMIT,
	MONTHLY_RESERVATIONS_KEY,
	CALENDAR_UPDATE_SIZE_DELAY
} from '../../utils/enums'
import { checkPermissions, withPermissions } from '../../utils/Permissions'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { cancelEventsRequestOnDemand, getSelectedDateForCalendar, getSelectedDateRange, getTimeScrollId, isDateInRange, scrollToSelectedDate } from './calendarHelpers'

// reducers
import {
	getCalendarEventDetail,
	getCalendarMonthlyViewReservations,
	getCalendarReservations,
	getCalendarShiftsTimeoff,
	refreshEvents
} from '../../reducers/calendar/calendarActions'
import { RootState } from '../../reducers'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'
import { clearEvent } from '../../reducers/virtualEvent/virtualEventActions'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// components
import CalendarContent, { CalendarRefs } from './components/layout/CalendarContent'
import CalendarHeader from './components/layout/Header'
import SiderEventManagement, { SiderEventManagementRefs } from './components/layout/SiderEventManagement'
import SiderFilter from './components/layout/SiderFilter'
import CalendarEventsListPopover from './components/popovers/CalendarEventsListPopover'
import CalendarEmployeeTooltipPopover from './components/popovers/CalendarEmployeeTooltipPopover'
import CalendarReservationPopover from './components/popovers/CalendarReservationPopover'
import CalendarConfirmModal from './components/CalendarConfirmModal'

// types
import {
	ConfirmModalData,
	ICalendarEventForm,
	ICalendarFilter,
	ICalendarReservationForm,
	IEmployeesPayload,
	INewCalendarEvent,
	ReservationPopoverData,
	PopoverTriggerPosition,
	SalonSubPageProps,
	EmployeeTooltipPopoverData
} from '../../types/interfaces'

// hooks
import useQueryParams, { ArrayParam, StringParam } from '../../hooks/useQueryParams'

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
	return isArray(ids) && ids?.length
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
	const navigate = useNavigate()
	/**
	 * referencie na jednotlivé inštancie Fullcalendar-a - pre každé view sa používa zvlášť inštancia (denné, týždenné, mesačné) - viď CalendarContent.tsx
	 * každá inštancia má dostupné metódy render() a getCalendarApi(), napr. calendarRefs.current.DAY.getCalendarApi()
	 * render() - umožňuje programovo vyrendrovať kalendár - https://fullcalendar.io/docs/render
	 * getCalendarApi() - umožňuje programovo volať ďalšie FC metódy napr. calendarRefs.current.DAY.getCalendarApi().updateSize() - viď dokumentácia https://fullcalendar.io/docs
	 * */
	const calendarRefs = useRef<CalendarRefs>(null)
	const siderEventManagementRefs = useRef<SiderEventManagementRefs>(null)
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
		view: StringParam(CALENDAR_VIEW.DAY),
		date: StringParam(dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
		eventsViewType: StringParam(CALENDAR_EVENTS_VIEW_TYPE.RESERVATION),
		employeeIDs: ArrayParam(),
		categoryIDs: ArrayParam(),
		sidebarView: StringParam(),
		eventId: StringParam()
	})

	const validSelectedDate = useMemo(
		() => (dayjs(query.date).isValid() ? dayjs(query.date).format(CALENDAR_DATE_FORMAT.QUERY) : dayjs().format(CALENDAR_DATE_FORMAT.QUERY)),
		[query.date]
	)
	const validCalendarView = useMemo(() => (CALENDAR_VIEWS.includes(query.view) ? query.view : CALENDAR_VIEW.DAY), [query.view]) as CALENDAR_VIEW
	const validEventsViewType = useMemo(
		() => (CALENDAR_EVENTS_VIEW_TYPES.includes(query.eventsViewType) ? query.eventsViewType : CALENDAR_EVENTS_VIEW_TYPE.RESERVATION),
		[query.eventsViewType]
	) as CALENDAR_EVENTS_VIEW_TYPE

	/**
	 * okrem aktuálne zvoleného dátumu (query.date resp. validSelectedDate) si udržujeme aj aktuálne zvolený range napr. currentRange = { view: DAY, start: 2023-01-22 end: 2023-01-29 }
	 * hlavne kvoli týždennému a mesačnému, kde sa vždy na základe zvoleného dátumu (validSelectedDate) dopočíta celý range, na základe ktorého sa potom dotiahnu data z BE
	 */
	const [currentRange, setCurrentRange] = useState(getSelectedDateRange(validCalendarView, validSelectedDate))
	/**
	 * tento state je relevantny len pre mesacne view
	 * obsahuje informacie o celom rangi v mesacnom view - teda aj datumy z minuleho a dalsieho mesiaca, ktore doplnaju cely grid 7x6
	 */
	const [monthlyViewFullRange, setMonthlyViewFullRange] = useState(getSelectedDateRange(validCalendarView, validSelectedDate, true))

	const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData>(null)

	const clearConfirmModal = () => setConfirmModalData(null)

	const calendarEmployees = useSelector((state: RootState) => state.calendarEmployees.calendarEmployees || {})
	const employeesLoading = useSelector((state: RootState) => state.employees.employees.isLoading)
	const services = useSelector((state: RootState) => state.service.services)
	const reservations = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.RESERVATIONS])
	const monthlyReservations = useSelector((state: RootState) => state.calendar[MONTHLY_RESERVATIONS_KEY])
	const shiftsTimeOffs = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS])
	const isRefreshingEvents = useSelector((state: RootState) => state.calendar.isRefreshingEvents)
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)
	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)

	const currentUser = useSelector((state: RootState) => state.user.authUser.data)
	const authUserPermissions = currentUser?.uniqPermissions

	const [siderFilterCollapsed, setSiderFilterCollapsed] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState(false)
	const [isUpdatingEvent, setIsUpdatingEvent] = useState(false)

	const [reservationPopover, setReservationPopover] = useState<{ isOpen: boolean; data: ReservationPopoverData | null; position: PopoverTriggerPosition | null }>({
		isOpen: false,
		data: null,
		position: null
	})
	/**
	 * eventsListPopover by mal byt vzdy nizzsie ako reservationPopover
	 * je potrebne ho preto predrendrovat (cez z-indexy to v tomto pripade nejde, pretoze antd ich cez portaly dynamicky injectuje do DOMka, navyse bez classnamu)
	 * ak je isHidden = true, znamena, ze existuje v DOMku ale ma nulovu velkost
	 */
	const [eventsListPopover, setEventsListPopover] = useState<{
		isOpen: boolean
		isHidden: boolean
		date: string | null
		position: PopoverTriggerPosition | null
		isReservationsView?: boolean
	}>({
		isOpen: true,
		isHidden: true,
		date: null,
		position: null,
		isReservationsView: false
	})

	const [employeeTooltipPopover, setEmployeeTooltipPopover] = useState<{
		isOpen: boolean
		data: EmployeeTooltipPopoverData | null
		position: PopoverTriggerPosition | null
	}>({
		isOpen: false,
		data: null,
		position: null
	})

	const fetchInterval = useRef<number | undefined>()

	/**
	 * pri praci s kalendarom pouzivame tuto kolekciu zamesnancov, ktora zohladnuje filtre aplikovane uzivatelom
	 */
	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return calendarEmployees?.data?.filter((employee: any) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query?.employeeIDs === null ? [] : calendarEmployees?.data
	}, [calendarEmployees?.data, query.employeeIDs])

	/**
	 * tzv. background load eventov - keďže nepoužívame Websockety, na pozadí sa v pravidelnom intervale obnovujú eventy v kalendári, aby bola aspoň takto zaistená ich aktuálnosť
	 */
	const clearFetchInterval = () => window.clearInterval(fetchInterval.current)

	const restartFetchInterval = async () => {
		if (fetchInterval.current) {
			clearFetchInterval()
		}

		const interval = window.setInterval(async () => {
			const messageExists = document.querySelector('.nc-calendar-msg-refresh')
			if (!messageExists) {
				message.open({
					type: 'loading',
					className: 'nc-calendar-msg-refresh',
					content: t('loc:Kalendár sa aktualizuje'),
					duration: 0
				})
			}
			await dispatch(refreshEvents(validEventsViewType, validCalendarView === CALENDAR_VIEW.MONTH))
			message.destroy()
		}, REFRESH_CALENDAR_INTERVAL)

		fetchInterval.current = interval
	}

	const loadingData = employeesLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading || monthlyReservations?.isLoading || isUpdatingEvent
	const isLoading = isRefreshingEvents ? false : loadingData

	/**
	 * initialScroll = pomocna premenna pre tyzdenne view
	 * v tyzdennom view sa po zmene datumu zascrolluje zobrazenie na novy datum - mozu nastat 2 situacie:
	 * 1/ novo zvoleny datum sa nachadza v aktualnom rangi - teda mam vybraty tyzden 2 - 8.1.2023 a novy datum bude napr. 5.1.2023:
	 * v takom pripade nepotrebujeme nacitavat nove data a v aktualnom zobrazeni sa len zaskroluje na zvoleny datum
	 * 2/ novy datum sa nenachadza v aktualnom rangi:
	 * v takom pripade potrebujeme pockat na nacitanie novych eventov z BE a vykreslenie Fullcalendara a az tak zascrollovat na danu poziciu (vyska tyzdenneho nie je fixna ale meni sa v zavislosti na rozlozeni eventov)
	 * ak je intialScroll.current = true, tak vieme, ze sa jedna o druhy pripad
	 */
	const initialScroll = useRef(false)
	const scrollToDateTimeout = useRef<any>(null)

	const setRangeInformationForMonthlyView = (date: string) => {
		setMonthlyViewFullRange(getSelectedDateRange(CALENDAR_VIEW.MONTH, date, true))
	}

	/**
	 * nastavi novy datum do query, novy current range a tiez datum pre aktualne zobrazenu instanciu Fullcalendara
	 */
	const setNewSelectedDate = (newDate: string, monthViewFullRange = false) => {
		// query sa nastavi vzdy ked sa zmeni datum
		setQuery({ ...query, date: newDate })

		const newCalendarDate = getSelectedDateForCalendar(validCalendarView, newDate)

		// datum vo Fullcalendari a current range sa nastavi len vtedy, ked sa novy datum nenachadza v aktualne zvolenom rangi (currentRange state alebo monthlyViewFullRange)
		if (!isDateInRange(monthViewFullRange ? monthlyViewFullRange.start : currentRange.start, monthViewFullRange ? monthlyViewFullRange.end : currentRange.end, newDate)) {
			setCurrentRange(getSelectedDateRange(validCalendarView, newDate))

			if (validCalendarView === CALENDAR_VIEW.MONTH) {
				setRangeInformationForMonthlyView(newDate)
			}

			if (!dayjs(newCalendarDate).isSame(calendarRefs?.current?.[validCalendarView]?.getApi()?.getDate())) {
				calendarRefs?.current?.[validCalendarView]?.getApi()?.gotoDate(newCalendarDate)
			}

			/**
			 * meni sa range, pre tyzdenne view je potrebne si to poznacit do pomocnej premennej, aby sa nasledne spustil useEffect nizzsie
			 * ten sa postara o scroll az po tom co sa dotiahnu nove data
			 * */
			initialScroll.current = false
			return
		}

		/**
		 * ak sa novy datum nachadza v rovnakom rangi ako predtym, tak sa v tyzdennom view len zascrolluje na jeho poziciu
		 * nenacitavaju nove data a teda netreba cakat na opatovne vykreslenie Fullcalendara
		 */
		if (validCalendarView === CALENDAR_VIEW.WEEK) {
			scrollToSelectedDate(newDate, { smooth: true, duration: 300 })
		}
	}

	useEffect(() => {
		/**
		 * plati len pre tyzdenne view
		 * zmenil sa range, je potrebne pockat na nacitanie novych dat a opatovne vykrelsenie Fullcalendara a az tak zascrollovat na datum
		 *  */
		if (validCalendarView === CALENDAR_VIEW.WEEK && !loadingData && !initialScroll.current) {
			scrollToDateTimeout.current = setTimeout(() => {
				scrollToSelectedDate(validSelectedDate, { smooth: true, duration: 300 })
				initialScroll.current = true
			}, CALENDAR_INIT_TIME)
		}

		return () => clearTimeout(scrollToDateTimeout.current)
	}, [loadingData, validSelectedDate, query.view, currentRange.start, currentRange.end, validCalendarView])

	/**
	 * pri prepnuti zobrazenia (denne / tyzdenne / mesacne) je potrebne zmenit aj zvoleny range
	 */
	const setNewCalendarView = (newView: CALENDAR_VIEW) => {
		setQuery({ ...query, view: newView })
		setCurrentRange(getSelectedDateRange(newView, validSelectedDate))
		if (newView === CALENDAR_VIEW.MONTH) {
			setRangeInformationForMonthlyView(validSelectedDate)
		}
	}

	const setNewEventsViewType = (newEventsViewType: CALENDAR_EVENTS_VIEW_TYPE) => {
		// NOTE: Ak je otvoreny CREATE / EDIT sidebar tak pri prepnuti filtra ho zrusit + zmaze virtual event
		if (virtualEvent) {
			dispatch(clearEvent())
		}
		/**
		 * ak by uzivatel rychlo preklikol medzi tabom rezervacie / zmeny tak to zrusi predosli request
		 */
		cancelEventsRequestOnDemand()
		setQuery({ ...query, eventsViewType: newEventsViewType, sidebarView: undefined, eventId: undefined })
	}

	/**
	 * obcasne je potrebne programovo updatenut velkost, pretoze Fullcalednar sam nezaregistruje zmenu, ktora bola vyvolana niekde z vyssieho kontaineru
	 * napr. ked sa zatvori bocny filter alebo sidebar na upravu eventu
	 */
	const updateCalendarSize = useRef(() => calendarRefs?.current?.[validCalendarView]?.getApi()?.updateSize())

	// fetch new events
	const fetchEvents: any = useCallback(
		async (clearVirtualEvent?: boolean) => {
			// restartuje sa interval pre background load
			restartFetchInterval()

			let eventsDayLimit = 0
			let startQueryParam = currentRange.start
			let endQueryParam = currentRange.end

			if (validCalendarView === CALENDAR_VIEW.MONTH) {
				// v mesacnom view je potrebne vyplnit cely kalendar - 7 x 6 buniek (od PO - NE) = 42
				eventsDayLimit = CALENDAR_DAY_EVENTS_LIMIT
				startQueryParam = dayjs(startQueryParam).startOf('week').format(CALENDAR_DATE_FORMAT.QUERY)
				endQueryParam = dayjs(startQueryParam).add(41, 'days').format(CALENDAR_DATE_FORMAT.QUERY)
			}

			const dispatchGetShiftsTimeOff = getCalendarShiftsTimeoff(
				{ salonID, start: startQueryParam, end: endQueryParam, employeeIDs: query.employeeIDs },
				validCalendarView !== CALENDAR_VIEW.MONTH,
				clearVirtualEvent,
				true,
				eventsDayLimit
			)

			if (validEventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
				const reservationsQueryparams = {
					salonID,
					start: startQueryParam,
					end: endQueryParam,
					employeeIDs: query.employeeIDs,
					categoryIDs: getFullCategoryIdsFromUrl(query?.categoryIDs)
				}
				const dispatchGetReservations = getCalendarReservations(reservationsQueryparams, validCalendarView !== CALENDAR_VIEW.MONTH, clearVirtualEvent, true, eventsDayLimit)

				if (validCalendarView === CALENDAR_VIEW.MONTH) {
					await dispatch(getCalendarMonthlyViewReservations(reservationsQueryparams, clearVirtualEvent, true))
				} else {
					await Promise.all([dispatch(dispatchGetReservations), dispatch(dispatchGetShiftsTimeOff)])
				}
			} else if (validEventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
				await dispatch(dispatchGetShiftsTimeOff)
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dispatch, salonID, currentRange.start, currentRange.end, query.employeeIDs, query.categoryIDs, validEventsViewType, validCalendarView]
	)

	// scroll to time after initialization
	useEffect(() => {
		const scrollToTime = (hour: number) => {
			// scrollID je hodina, na ktoru chceme zascrollovat
			// od nej sa este odrataju 2 hodiny, aby bolo vidiet aj co sa deje pred tymto casom
			const scrollTimeId = getTimeScrollId(Math.max(hour - 2, 0))
			if (validCalendarView === CALENDAR_VIEW.DAY) {
				// v dennom view sa pouziva custom logika, pretoze interny scroll nefunguje ak sa vo Fullcalendari pozuva height='auto'
				Scroll.scroller.scrollTo(scrollTimeId, {
					containerId: 'nc-calendar-day-wrapper',
					offset: -80 // - hlavicka
				})
			} else {
				// v tyzdennom view sa pouzije interny scroll, pretoze sa scrolluje v x-ovej osi a aj v pripade height='auto' je to funkcne
				calendarRefs?.current?.[validCalendarView]?.getApi().scrollToTime(scrollTimeId)
			}
		}

		/**
		 * je potrebne trochu pockat, kym sa kalendar vyinicializuje a az tak zavolaz scrollToTime
		 */
		setTimeout(() => scrollToTime(dayjs().hour()), CALENDAR_INIT_TIME)
	}, [validCalendarView])

	useEffect(() => {
		dispatch(getServices({ salonID }))
	}, [dispatch, salonID])

	useEffect(() => {
		// NOT-3601: docasna implementacia, po rozhodnuti o zmene, treba prejst vsetky commenty s tymto oznacenim a revertnut
		const loadSalonDetail = async () => {
			const salonRes = await dispatch(selectSalon(salonID))

			const salonPermissions = salonRes?.data?.uniqPermissions || []
			const userPermissions = [...(authUserPermissions || []), ...salonPermissions]

			const canVisitThisPage =
				checkPermissions(userPermissions, [PERMISSION.NOTINO]) ||
				(checkPermissions(userPermissions, [PERMISSION.PARTNER], ADMIN_PERMISSIONS) && salonRes?.data?.settings?.enabledReservations)
			if (!canVisitThisPage) {
				navigate('/404')
			}
		}

		loadSalonDetail()
	}, [authUserPermissions, dispatch, salonID])

	useEffect(() => {
		;(async () => {
			/**
			 * v reduxe sa do eventov sa mapuju zamestnanci, preto sa musia dotiahnut predtym nez sa dotiahnu eventy
			 * ked uz su v reduxe prebehol mapping zamestnancov (calendarEmployees.areLoaded), avsak pole ma nulovu dlzku, je zbytocne robit dalsi request
			 * ak uzivatel odksrtne vsetkych zamestancov alebo kategorie, zobrazi sa empty state a nie je potrebne dotahovat nove data
			 */

			if ((calendarEmployees.areLoaded && !calendarEmployees.options?.length) || query?.employeeIDs === null || query?.categoryIDs === null) {
				return
			}
			// fetch new events
			fetchEvents(false)
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, query.employeeIDs, query.categoryIDs, fetchEvents])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventsViewType: validEventsViewType,
				categoryIDs: query?.categoryIDs === undefined ? getCategoryIDs(services?.categoriesOptions) : getFullCategoryIdsFromUrl(query?.categoryIDs),
				employeeIDs: query?.employeeIDs === undefined ? getEmployeeIDs(calendarEmployees?.options) : query?.employeeIDs
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, calendarEmployees?.options, services?.categoriesOptions, query?.categoryIDs, query?.employeeIDs, validEventsViewType])

	useEffect(() => {
		// update calendar size when main layout sider change
		// wait for the end of sider menu animation and then update size of the calendar
		const timeout = setTimeout(updateCalendarSize.current, CALENDAR_UPDATE_SIZE_DELAY_AFTER_SIDER_CHANGE)
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

			setTimeout(updateCalendarSize.current, CALENDAR_UPDATE_SIZE_DELAY)
		},
		[query, setQuery]
	)

	useEffect(() => {
		// clear on unmount
		return () => {
			if (fetchInterval.current) {
				clearFetchInterval()
				message.destroy()
			}
			dispatch(clearEvent())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const closeSiderForm = useCallback(() => {
		dispatch(clearEvent())
		setEventManagement(undefined)
	}, [dispatch, setEventManagement])

	const handleSubmitFilter = (values: ICalendarFilter) => {
		// pri prepnuti filtra sa zavrie sidebar ak existuje virtualny event, tak sa zmaze
		if (virtualEvent) {
			dispatch(clearEvent())
		}

		setQuery({
			...query,
			...values,
			// ak su vybrati vsetci zamestnanci alebo vsetky kategorie, tak je zbytocne posielat na BE vsetky IDcka
			// BE vrati rovnake zaznamy ako ked sa tam neposle nic
			employeeIDs: values?.employeeIDs?.length === calendarEmployees?.options?.length ? undefined : values.employeeIDs,
			categoryIDs: values?.categoryIDs?.length === services?.categoriesOptions?.length ? undefined : getShortCategoryIdsForUrl(values.categoryIDs),
			eventId: undefined,
			sidebarView: undefined
		})
	}

	const handleAddEvent = (initialData?: INewCalendarEvent, fromAddButton?: boolean) => {
		/**
		 * Ak kliknem hore v hlavicke na Pridat a akutalne uz mam otvoreny sidebar a vytvaram novy event
		 * nebude sa vyinicializovavat formular, aby sme neprepisali uz uzivatelom naklikane data
		 */
		if (fromAddButton && query.sidebarView && !query.eventId) {
			return
		}

		// NOTE: ak je filter eventType na rezervacii nastav rezervaciu ako eventType pre form, v opacnom pripade nastav pracovnu zmenu
		if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
			setEventManagement(CALENDAR_EVENT_TYPE.RESERVATION, undefined)
			siderEventManagementRefs?.current?.initCreateEventForm(CALENDAR_EVENT_TYPE.RESERVATION, initialData)
		} else {
			setEventManagement(CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT, undefined)
			siderEventManagementRefs?.current?.initCreateEventForm(CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT, initialData)
		}
	}

	const handleSubmitReservation = useCallback(
		async (values: ICalendarReservationForm, eventId?: string) => {
			if (!values) {
				return
			}

			const { revertEvent } = values

			try {
				cancelEventsRequestOnDemand()
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
				cancelEventsRequestOnDemand()
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
					employeeID: values.employee?.key as string,
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
							omit(reqDataUpdate, 'repeatEvent'),
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
				cancelEventsRequestOnDemand()
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
				cancelEventsRequestOnDemand()
				await patchReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}/state',
					{ calendarEventID, salonID },
					{ state, reason, paymentMethod },
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
				if (state === RESERVATION_STATE.CANCEL_BY_SALON) {
					closeSiderForm()
				}
				fetchEvents()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				setReservationPopover((prevProps) => ({ ...prevProps, isOpen: false, position: null }))
				clearConfirmModal()
			}
		},
		[fetchEvents, salonID, closeSiderForm]
	)

	const initSubmitReservationData = (values: ICalendarReservationForm) => setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.RESERVATION, values })

	const initSubmitEventData = (values: ICalendarEventForm) => setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.EVENT, values })

	const initDeleteEventData = (eventId: string, calendarBulkEventID?: string, eventType?: CALENDAR_EVENT_TYPE) =>
		setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.DELETE_EVENT, eventId, calendarBulkEventID, eventType })

	const initUpdateReservationStateData = (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) =>
		setConfirmModalData({ key: CONFIRM_MODAL_DATA_TYPE.UPDATE_RESERVATION_STATE, calendarEventID, state, reason, paymentMethod })

	const onEditEvent = (eventType: CALENDAR_EVENT_TYPE, eventId: string) => {
		setQuery({
			...query,
			eventId,
			sidebarView: eventType
		})

		setTimeout(updateCalendarSize.current, CALENDAR_UPDATE_SIZE_DELAY)
	}

	const onReservationClick = (data?: ReservationPopoverData, position?: PopoverTriggerPosition) => {
		setReservationPopover({
			isOpen: true,
			data: data || null,
			position: position || null
		})
	}

	const onMonthlyReservationClick = (data: EmployeeTooltipPopoverData, position?: PopoverTriggerPosition) => {
		setEmployeeTooltipPopover({
			isOpen: true,
			data,
			position: position || null
		})
	}

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

	const popovers = (
		<>
			<CalendarEventsListPopover
				date={eventsListPopover.date}
				position={eventsListPopover.position}
				isOpen={eventsListPopover.isOpen}
				isReservationsView={eventsListPopover.isReservationsView}
				setIsOpen={(isOpen: boolean) => setEventsListPopover((prevState) => ({ ...prevState, isOpen }))}
				onEditEvent={onEditEvent}
				onReservationClick={onReservationClick}
				onMonthlyReservationClick={onMonthlyReservationClick}
				isHidden={eventsListPopover.isHidden}
				isLoading={isLoading}
				isUpdatingEvent={isUpdatingEvent}
			/>
			<CalendarReservationPopover
				data={reservationPopover.data}
				position={reservationPopover.position}
				isOpen={reservationPopover.isOpen}
				setIsOpen={(isOpen: boolean) => setReservationPopover((prevState) => ({ ...prevState, isOpen }))}
				handleUpdateReservationState={initUpdateReservationStateData}
				onEditEvent={onEditEvent}
				placement={validCalendarView === CALENDAR_VIEW.WEEK ? 'bottom' : 'left'}
			/>
			<CalendarEmployeeTooltipPopover
				data={employeeTooltipPopover.data}
				position={employeeTooltipPopover.position}
				isOpen={employeeTooltipPopover.isOpen}
				setIsOpen={(isOpen: boolean) => setEmployeeTooltipPopover((prevState) => ({ ...prevState, isOpen }))}
				parentPath={parentPath}
				query={query}
			/>
		</>
	)

	return (
		<>
			{modals}
			{popovers}
			<Layout className='noti-calendar-layout'>
				<CalendarHeader
					enabledSalonReservations={selectedSalon?.settings?.enabledReservations}
					selectedDate={validSelectedDate}
					eventsViewType={validEventsViewType}
					calendarView={validCalendarView}
					siderFilterCollapsed={siderFilterCollapsed}
					setCalendarView={setNewCalendarView}
					setEventsViewType={setNewEventsViewType}
					setSelectedDate={setNewSelectedDate}
					setSiderFilterCollapsed={() => {
						setSiderFilterCollapsed(!siderFilterCollapsed)
						setTimeout(updateCalendarSize.current, CALENDAR_UPDATE_SIZE_DELAY)
					}}
					onAddEvent={handleAddEvent}
					selectedMonth={monthlyViewFullRange.selectedMonth}
				/>
				<Layout hasSider className={'noti-calendar-main-section'}>
					<SiderFilter
						collapsed={siderFilterCollapsed}
						handleSubmit={handleSubmitFilter}
						parentPath={parentPath}
						eventsViewType={validEventsViewType}
						employeesOptions={calendarEmployees.options}
						employeesLoading={employeesLoading}
					/>
					<CalendarContent
						salonID={salonID}
						enabledSalonReservations={selectedSalon?.settings?.enabledReservations}
						ref={calendarRefs}
						selectedDate={validSelectedDate}
						view={validCalendarView}
						monthlyReservations={monthlyReservations?.data || {}}
						reservations={reservations?.data || []}
						shiftsTimeOffs={shiftsTimeOffs?.data || []}
						loading={isLoading}
						eventsViewType={validEventsViewType}
						employees={(filteredEmployees() as any) || []}
						parentPath={parentPath}
						query={query}
						setQuery={setQuery}
						onEditEvent={onEditEvent}
						onReservationClick={onReservationClick}
						onShowMore={(date: string, position?: PopoverTriggerPosition, isReservationsView?: boolean) => {
							setEventsListPopover({
								date,
								isHidden: false,
								isOpen: true,
								position: position || null,
								isReservationsView
							})
						}}
						onMonthlyReservationClick={onMonthlyReservationClick}
						handleSubmitReservation={initSubmitReservationData}
						handleSubmitEvent={initSubmitEventData}
						onAddEvent={handleAddEvent}
						clearFetchInterval={clearFetchInterval}
						restartFetchInterval={restartFetchInterval}
					/>
					{selectedSalon?.settings?.enabledReservations && (
						<SiderEventManagement
							ref={siderEventManagementRefs}
							phonePrefix={selectedSalon.address?.countryCode || selectedSalon.companyInvoiceAddress?.countryCode}
							salonID={salonID}
							selectedDate={validSelectedDate}
							eventsViewType={validEventsViewType}
							eventId={query.eventId}
							handleDeleteEvent={initDeleteEventData}
							sidebarView={query.sidebarView as CALENDAR_EVENT_TYPE}
							onCloseSider={closeSiderForm}
							handleSubmitReservation={initSubmitReservationData}
							handleSubmitEvent={initSubmitEventData}
							calendarApi={calendarRefs?.current?.[validCalendarView]?.getApi()}
							changeCalendarDate={setNewSelectedDate}
							query={query}
							setQuery={setQuery}
							areEmployeesLoaded={calendarEmployees.areLoaded}
						/>
					)}
				</Layout>
			</Layout>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(Calendar)
