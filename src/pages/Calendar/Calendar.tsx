import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import Layout from 'antd/lib/layout/layout'
import { message } from 'antd'
import dayjs from 'dayjs'
import { includes, isArray, isEmpty, omit } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { destroy, initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import Scroll from 'react-scroll'

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
	CALENDAR_DAY_EVENTS_LIMIT,
	MONTHLY_RESERVATIONS_KEY,
	CALENDAR_UPDATE_SIZE_DELAY
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
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

// components
import CalendarContent, { CalendarRefs } from './components/layout/CalendarContent'
import CalendarHeader from './components/layout/Header'
import SiderEventManagement, { SiderEventManagementRefs } from './components/layout/SiderEventManagement'
import SiderFilter from './components/layout/SiderFilter'
import CalendarEventsListPopover from './components/popovers/CalendarEventsListPopover'
import CalendarReservationPopover from './components/popovers/CalendarReservationPopover'
import CalendarConfirmModal from './components/CalendarConfirmModal'

// types
import {
	ConfirmModalData,
	ICalendarFilter,
	INewCalendarEvent,
	ReservationPopoverData,
	PopoverTriggerPosition,
	SalonSubPageProps,
	ICalendarEmployeeOptionItem
} from '../../types/interfaces'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { ICalendarEventForm } from '../../schemas/event'
import { /* ICalendarImportedReservationForm, */ ICalendarReservationForm } from '../../schemas/reservation'
import { calendarPageURLQueryParams, ICalendarPageURLQueryParams } from '../../schemas/queryParams'

const getCategoryIDs = (data: IServicesPayload['categoriesOptions']) => {
	return data?.map((service) => service.value) as string[]
}

/**
 * default value for employees are all employees that are not deleted
 */
const getNotDeletedEmployeeIDs = (data: ICalendarEmployeeOptionItem[]) => {
	return data?.reduce((acc, employee) => {
		if (employee.extra?.employeeData.isDeleted) {
			return acc
		}
		return [...acc, employee.value as string]
	}, [] as string[])
}

/**
 * NOTE: v URL sa pouzivaju skratene ID kategorii, pretoze ich moze byt dost vela a original IDcka su dost dhle
 * tak aby sa nahodu nestalo ze sa tam nevojdu v niektorom z prehliadacov
 */
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

const Calendar: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath = '' } = props

	const [t] = useTranslation()
	const dispatch = useDispatch()

	/**
	 * employeeIDs: undefined means there is no such query parameter in the URL (e.g query = { view: 'DAY', employeeIDs: undefined, date: '2022-11-03' }, url: &view=DAY&date=2022-11-03)
	 * we would set default value for employees in this case (all employes that are not deleted)
	 * null queryParam value means empty filter (e.g query = { view: 'DAY', employeeIDs: null, date: '2022-11-03' } => url: &view=DAY&employeeIDS&date=2022-11-03)
	 * we would set no emoployees in this case
	 * this is usefull, because when we first initialize page, we want to set default value (if there are no employeeIDs in the URL)
	 * but when user unchecks all employeeIDs options in the filter, we want to show no employees
	 */
	const [query, setQuery] = useQueryParams(calendarPageURLQueryParams, {
		view: CALENDAR_VIEW.DAY,
		date: dayjs().format(CALENDAR_DATE_FORMAT.QUERY),
		eventsViewType: CALENDAR_EVENTS_VIEW_TYPE.RESERVATION
	})

	/**
	 * referencie na jednotlivé inštancie Fullcalendar-a - pre každé view sa používa zvlášť inštancia (denné, týždenné, mesačné) - viď CalendarContent.tsx
	 * každá inštancia má dostupné metódy render() a getCalendarApi(), napr. calendarRefs.current.DAY.getCalendarApi()
	 * render() - umožňuje programovo vyrendrovať kalendár - https://fullcalendar.io/docs/render
	 * getCalendarApi() - umožňuje programovo volať ďalšie FC metódy napr. calendarRefs.current.DAY.getCalendarApi().updateSize() - viď dokumentácia https://fullcalendar.io/docs
	 * */
	const calendarRefs = useRef<CalendarRefs>(null)

	const siderEventManagementRefs = useRef<SiderEventManagementRefs>(null)
	const fetchInterval = useRef<number | undefined>()
	const initialCalendarEmployeesLoad = useRef(true)

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

	/**
	 * obcasne je potrebne programovo updatenut velkost, pretoze Fullcalednar sam nezaregistruje zmenu, ktora bola vyvolana niekde z vyssieho kontaineru
	 * napr. ked sa zatvori bocny filter alebo sidebar na upravu eventu
	 */
	const updateCalendarSize = useRef(() => calendarRefs?.current?.[query.view]?.getApi()?.updateSize())

	const calendarEmployees = useSelector((state: RootState) => state.calendarEmployees.calendarEmployees || {})
	const services = useSelector((state: RootState) => state.service.services)
	const reservations = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.RESERVATIONS])
	const monthlyReservations = useSelector((state: RootState) => state.calendar[MONTHLY_RESERVATIONS_KEY])
	const shiftsTimeOffs = useSelector((state: RootState) => state.calendar[CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS])
	const isRefreshingEvents = useSelector((state: RootState) => state.calendar.isRefreshingEvents)
	const isMainLayoutSiderCollapsed = useSelector((state: RootState) => state.helperSettings.isSiderCollapsed)
	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)

	/**
	 * okrem aktuálne zvoleného dátumu (query.date resp. query.date) si udržujeme aj aktuálne zvolený range napr. currentRange = { view: DAY, start: 2023-01-22 end: 2023-01-29 }
	 * hlavne kvoli týždennému a mesačnému, kde sa vždy na základe zvoleného dátumu (query.date) dopočíta celý range, na základe ktorého sa potom dotiahnu data z BE
	 */
	const [currentRange, setCurrentRange] = useState(getSelectedDateRange(query.view, query.date))
	/**
	 * tento state je relevantny len pre mesacne view
	 * obsahuje informacie o celom rangi v mesacnom view - teda aj datumy z minuleho a dalsieho mesiaca, ktore doplnaju cely grid 7x6
	 */
	const [monthlyViewFullRange, setMonthlyViewFullRange] = useState(getSelectedDateRange(query.view, query.date, true))

	const [confirmModalData, setConfirmModalData] = useState<ConfirmModalData>(null)

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
		employeeID?: string
	}>({
		isOpen: true,
		isHidden: true,
		date: null,
		position: null,
		isReservationsView: false
	})

	const clearConfirmModal = () => setConfirmModalData(null)

	/**
	 * pri praci s kalendarom pouzivame tuto kolekciu zamesnancov, ktora zohladnuje filtre aplikovane uzivatelom
	 */
	const filteredEmployees = useCallback(() => {
		// filter employees based on employeeIDs in the url queryParams (if there are any)
		if (!isEmpty(query.employeeIDs)) {
			return calendarEmployees?.data?.filter((employee) => query.employeeIDs?.includes(employee.id))
		}

		// null means empty filter otherwise return all employes as default value
		return query.employeeIDs === null ? [] : calendarEmployees?.data?.filter((employee) => !employee.isDeleted)
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
			await dispatch(refreshEvents(query.eventsViewType, query.view === CALENDAR_VIEW.MONTH))
			message.destroy()
		}, REFRESH_CALENDAR_INTERVAL)

		fetchInterval.current = interval
	}

	const employeesLoading = initialCalendarEmployeesLoad.current && (reservations?.isLoading || shiftsTimeOffs?.isLoading)
	const loadingData = employeesLoading || services?.isLoading || reservations?.isLoading || shiftsTimeOffs?.isLoading || monthlyReservations?.isLoading || isUpdatingEvent
	const isLoading = isRefreshingEvents ? false : loadingData

	const setRangeInformationForMonthlyView = (date: string) => {
		setMonthlyViewFullRange(getSelectedDateRange(CALENDAR_VIEW.MONTH, date, true))
	}

	/**
	 * nastavi novy datum do query, novy current range a tiez datum pre aktualne zobrazenu instanciu Fullcalendara
	 */
	const setNewSelectedDate = (newDate: string, monthViewFullRange = false) => {
		// query sa nastavi vzdy ked sa zmeni datum
		setQuery({ ...query, date: newDate })

		const newCalendarDate = getSelectedDateForCalendar(query.view, newDate)

		// datum vo Fullcalendari a current range sa nastavi len vtedy, ked sa novy datum nenachadza v aktualne zvolenom rangi (currentRange state alebo monthlyViewFullRange)
		if (!isDateInRange(monthViewFullRange ? monthlyViewFullRange.start : currentRange.start, monthViewFullRange ? monthlyViewFullRange.end : currentRange.end, newDate)) {
			setCurrentRange(getSelectedDateRange(query.view, newDate))

			if (query.view === CALENDAR_VIEW.MONTH) {
				setRangeInformationForMonthlyView(newDate)
			}

			if (!dayjs(newCalendarDate).isSame(calendarRefs?.current?.[query.view]?.getApi()?.getDate())) {
				calendarRefs?.current?.[query.view]?.getApi()?.gotoDate(newCalendarDate)
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
		if (query.view === CALENDAR_VIEW.WEEK) {
			scrollToSelectedDate(newDate, { smooth: true, duration: 300 })
		}
	}

	useEffect(() => {
		/**
		 * plati len pre tyzdenne view
		 * zmenil sa range, je potrebne pockat na nacitanie novych dat a opatovne vykrelsenie Fullcalendara a az tak zascrollovat na datum
		 *  */
		if (query.view === CALENDAR_VIEW.WEEK && !loadingData && !initialScroll.current) {
			scrollToDateTimeout.current = setTimeout(() => {
				scrollToSelectedDate(query.date, { smooth: true, duration: 300 })
				initialScroll.current = true
			}, CALENDAR_INIT_TIME)
		}

		return () => clearTimeout(scrollToDateTimeout.current)
	}, [loadingData, query.date, currentRange.start, currentRange.end, query.view])

	/**
	 * pri prepnuti zobrazenia (denne / tyzdenne / mesacne) je potrebne zmenit aj zvoleny range
	 */
	const setNewCalendarView = (newView: CALENDAR_VIEW) => {
		setQuery({ ...query, view: newView })
		setCurrentRange(getSelectedDateRange(newView, query.date))
		if (newView === CALENDAR_VIEW.MONTH) {
			setRangeInformationForMonthlyView(query.date)
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
		setTimeout(updateCalendarSize.current, CALENDAR_UPDATE_SIZE_DELAY_AFTER_SIDER_CHANGE)
	}

	// fetch new events
	const fetchEvents: any = useCallback(
		async (clearVirtualEvent?: boolean) => {
			// restartuje sa interval pre background load
			restartFetchInterval()

			let eventsDayLimit = 0
			let startQueryParam = currentRange.start
			let endQueryParam = currentRange.end

			if (query.view === CALENDAR_VIEW.MONTH) {
				// v mesacnom view je potrebne vyplnit cely kalendar - 7 x 6 buniek (od PO - NE) = 42
				eventsDayLimit = CALENDAR_DAY_EVENTS_LIMIT
				startQueryParam = dayjs(startQueryParam).startOf('week').format(CALENDAR_DATE_FORMAT.QUERY)
				endQueryParam = dayjs(startQueryParam).add(41, 'days').format(CALENDAR_DATE_FORMAT.QUERY)
			}

			const dispatchGetShiftsTimeOff = getCalendarShiftsTimeoff(
				{ salonID, start: startQueryParam, end: endQueryParam, employeeIDs: query.employeeIDs },
				query.view !== CALENDAR_VIEW.MONTH,
				clearVirtualEvent,
				true,
				eventsDayLimit
			)

			if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
				const reservationsQueryparams = {
					salonID,
					start: startQueryParam,
					end: endQueryParam,
					employeeIDs: query.employeeIDs,
					categoryIDs: getFullCategoryIdsFromUrl(query.categoryIDs)
				}
				const dispatchGetReservations = getCalendarReservations(reservationsQueryparams, query.view !== CALENDAR_VIEW.MONTH, clearVirtualEvent, true, eventsDayLimit)

				if (query.view === CALENDAR_VIEW.MONTH) {
					await dispatch(getCalendarMonthlyViewReservations(reservationsQueryparams, clearVirtualEvent, true))
				} else {
					await Promise.all([dispatch(dispatchGetReservations), dispatch(dispatchGetShiftsTimeOff)])
				}
			} else if (query.eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.EMPLOYEE_SHIFT_TIME_OFF) {
				await dispatch(dispatchGetShiftsTimeOff)
			}

			if (initialCalendarEmployeesLoad.current) {
				initialCalendarEmployeesLoad.current = false
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dispatch, salonID, currentRange.start, currentRange.end, query.employeeIDs, query.categoryIDs, query.eventsViewType, query.view]
	)

	// scroll to time after initialization
	useEffect(() => {
		const scrollToTime = (hour: number) => {
			// scrollID je hodina, na ktoru chceme zascrollovat
			// od nej sa este odrataju 2 hodiny, aby bolo vidiet aj co sa deje pred tymto casom
			const scrollTimeId = getTimeScrollId(Math.max(hour - 2, 0))
			if (query.view === CALENDAR_VIEW.DAY) {
				// v dennom view sa pouziva custom logika, pretoze interny scroll nefunguje ak sa vo Fullcalendari pozuva height='auto'
				Scroll.scroller.scrollTo(scrollTimeId, {
					containerId: 'nc-calendar-day-wrapper',
					offset: -80 // - hlavicka
				})
			} else {
				// v tyzdennom view sa pouzije interny scroll, pretoze sa scrolluje v x-ovej osi a aj v pripade height='auto' je to funkcne
				calendarRefs?.current?.[query.view]?.getApi().scrollToTime(scrollTimeId)
			}
		}

		/**
		 * je potrebne trochu pockat, kym sa kalendar vyinicializuje a az tak zavolaz scrollToTime
		 */
		setTimeout(() => scrollToTime(dayjs().hour()), CALENDAR_INIT_TIME)
	}, [query.view])

	useEffect(() => {
		dispatch(getServices({ salonID }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, salonID])

	useEffect(() => {
		/**
		 * ak uzivatel odksrtne vsetkych zamestancov alebo kategorie, zobrazi sa empty state a nie je potrebne dotahovat nove data
		 */

		if ((!initialCalendarEmployeesLoad.current && query.employeeIDs === null) || query.categoryIDs === null) {
			return
		}
		// fetch new events
		fetchEvents(false)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, query.employeeIDs, query.categoryIDs, fetchEvents])

	useEffect(() => {
		dispatch(
			initialize(FORM.CALENDAR_FILTER, {
				eventsViewType: query.eventsViewType,
				categoryIDs: query.categoryIDs === undefined ? getCategoryIDs(services?.categoriesOptions) : getFullCategoryIdsFromUrl(query.categoryIDs),
				employeeIDs: query.employeeIDs === undefined ? getNotDeletedEmployeeIDs(calendarEmployees?.options) : query.employeeIDs
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, calendarEmployees?.options, services?.categoriesOptions, query.categoryIDs, query.employeeIDs, query.eventsViewType])

	useEffect(() => {
		// update calendar size when main layout sider change
		// wait for the end of sider menu animation and then update size of the calendar
		const timeout = setTimeout(updateCalendarSize.current, CALENDAR_UPDATE_SIZE_DELAY_AFTER_SIDER_CHANGE)
		return () => clearTimeout(timeout)
	}, [isMainLayoutSiderCollapsed])

	const setEventManagement = useCallback(
		(newView: ICalendarPageURLQueryParams['sidebarView'], eventId?: ICalendarPageURLQueryParams['eventId']) => {
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
			employeeIDs: values.employeeIDs,
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
					fetchEvents(false) // Po PATCHi ponechat virtualny event ak bol vytvoreny
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

	// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
	/* const handleSubmitImportedReservation = useCallback(
		async (values: ICalendarImportedReservationForm) => {
			const eventId = values?.updateFromCalendar ? values.eventId : query.eventId

			if (!values || !eventId) {
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
					note: values.note
				}

				await patchReq(
					'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}/imported-reservation',
					{ salonID, calendarEventID: eventId },
					reqData,
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
				fetchEvents(false) // Po PATCHi ponechat virtualny event ak bol vytvoreny

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
			}
		},
		[closeSiderForm, fetchEvents, salonID, query.eventId]
	) */

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
					fetchEvents(false) // Po PATCHi ponechat virtualny event ak bol vytvoreny
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
		[fetchEvents, isRemoving, query.sidebarView, salonID, closeSiderForm]
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
				employeeID={eventsListPopover.employeeID}
				setIsOpen={(isOpen: boolean) => setEventsListPopover((prevState) => ({ ...prevState, isOpen }))}
				onEditEvent={onEditEvent}
				onReservationClick={onReservationClick}
				isHidden={eventsListPopover.isHidden}
				isLoading={isLoading}
				isUpdatingEvent={isUpdatingEvent}
				query={query}
				parentPath={parentPath}
			/>
			<CalendarReservationPopover
				data={reservationPopover.data}
				position={reservationPopover.position}
				isOpen={reservationPopover.isOpen}
				setIsOpen={(isOpen: boolean) => setReservationPopover((prevState) => ({ ...prevState, isOpen }))}
				handleUpdateReservationState={initUpdateReservationStateData}
				onEditEvent={onEditEvent}
				placement={query.view === CALENDAR_VIEW.WEEK ? 'bottom' : 'left'}
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
					selectedDate={query.date}
					eventsViewType={query.eventsViewType}
					calendarView={query.view}
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
						eventsViewType={query.eventsViewType}
						employeesOptions={calendarEmployees.options}
						employeesLoading={employeesLoading}
					/>
					<CalendarContent
						salonID={salonID}
						enabledSalonReservations={selectedSalon?.settings?.enabledReservations}
						ref={calendarRefs}
						selectedDate={query.date}
						view={query.view}
						monthlyReservations={monthlyReservations?.data || {}}
						reservations={reservations?.data || []}
						shiftsTimeOffs={shiftsTimeOffs?.data || []}
						loading={isLoading}
						eventsViewType={query.eventsViewType}
						employees={filteredEmployees() || []}
						parentPath={parentPath}
						query={query}
						setQuery={setQuery}
						onEditEvent={onEditEvent}
						onReservationClick={onReservationClick}
						onShowEventsListPopover={(date: string, position?: PopoverTriggerPosition, isReservationsView?: boolean, employeeID?: string) => {
							setEventsListPopover({
								date,
								isHidden: false,
								isOpen: true,
								position: position || null,
								isReservationsView,
								employeeID
							})
						}}
						handleSubmitReservation={initSubmitReservationData}
						handleSubmitEvent={initSubmitEventData}
						// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
						// handleSubmitImportedReservation={handleSubmitImportedReservation}
						onAddEvent={handleAddEvent}
						clearFetchInterval={clearFetchInterval}
						restartFetchInterval={restartFetchInterval}
					/>
					{selectedSalon?.settings?.enabledReservations && (
						<SiderEventManagement
							ref={siderEventManagementRefs}
							phonePrefix={selectedSalon.address?.countryCode || selectedSalon.companyInvoiceAddress?.countryCode}
							salonID={salonID}
							selectedDate={query.date}
							eventsViewType={query.eventsViewType}
							eventId={query.eventId}
							handleDeleteEvent={initDeleteEventData}
							sidebarView={query.sidebarView as CALENDAR_EVENT_TYPE}
							onCloseSider={closeSiderForm}
							handleSubmitReservation={initSubmitReservationData}
							handleSubmitEvent={initSubmitEventData}
							// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
							// handleSubmitImportedReservation={handleSubmitImportedReservation}
							calendarApi={calendarRefs?.current?.[query.view]?.getApi()}
							changeCalendarDate={setNewSelectedDate}
							query={query}
							setQuery={setQuery}
							employeesLoading={employeesLoading}
							calendarEmployees={calendarEmployees}
						/>
					)}
				</Layout>
			</Layout>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(Calendar)
