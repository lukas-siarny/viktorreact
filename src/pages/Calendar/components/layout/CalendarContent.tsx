import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { notification, Spin } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { change } from 'redux-form'
import { isEqual, startsWith } from 'lodash'
import { DelimitedArrayParam, useQueryParams } from 'use-query-params'

// fullcalendar
import { EventResizeDoneArg, EventResizeStartArg, EventResizeStopArg } from '@fullcalendar/interaction'
import FullCalendar, { EventDropArg } from '@fullcalendar/react'

// enums
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	EVENT_NAMES,
	FORM,
	NEW_ID_PREFIX,
	UPDATE_EVENT_PERMISSIONS
} from '../../../../utils/enums'

// components
import CalendarDayView from '../views/CalendarDayView'
import CalendarWeekView from '../views/CalendarWeekView'
// import CalendarMonthView from '../views/CalendarMonthView'
import CalendarEmptyState from '../CalendarEmptyState'

// types
import {
	ICalendarEventForm,
	ICalendarReservationForm,
	ICalendarView,
	IDayViewResourceExtenedProps,
	IEventExtenedProps,
	IWeekViewResourceExtenedProps
} from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'

// utils
import { ForbiddenModal, permitted } from '../../../../utils/Permissions'
import { getSelectedDateForCalendar, getWeekDays } from '../../calendarHelpers'
import { history } from '../../../../utils/history'
import { cancelGetTokens } from '../../../../utils/request'
import { getCalendarEventsCancelTokenKey } from '../../../../reducers/calendar/calendarActions'
import { EVENTS, SET_IS_REFRESHING_EVENTS } from '../../../../reducers/calendar/calendarTypes'

type ComparsionEventInfo = {
	offsetTop: number | null
	offsetTopRow: number | null
	offsetLeft: number | null
	height: number | null
	width: number | null
}

const COMPARSION_INFO_DEFAULT = {
	offsetTop: null,
	offsetTopRow: null,
	offsetLeft: null,
	height: null,
	width: null
}

const getEventForComparsion = (calendarView: CALENDAR_VIEW, element?: HTMLElement) => {
	let offsetTop = null
	let offsetLeft = null
	let offsetTopRow = null // relevant only for the week view
	const clientRect = element?.getBoundingClientRect()
	const height = clientRect?.height || null
	const width = clientRect?.width || null
	const parentWrapper = element?.parentElement

	switch (calendarView) {
		case CALENDAR_VIEW.DAY:
			// offset of toptier parent card wrapper (.fc-timegrid-event-harness) from parent column (.fc-timegrid-col-events)
			offsetTop = parentWrapper?.offsetTop ?? null
			// offset of toptier parent col element (.fc-timegrid-col) from whole table
			offsetLeft = parentWrapper?.parentElement?.parentElement?.parentElement?.offsetLeft ?? null
			break
		case CALENDAR_VIEW.WEEK: {
			// offset of toptier parent card wrapper (.fc-timeline-event-harness) from parent timeline line (.fc-timeline-lane)
			offsetTop = parentWrapper?.offsetTop ?? null
			// offset of parent tr element from whole table
			// it's neccessary to check this as well, becouse offsetTop is only relative to parentLine, not the whole table
			offsetTopRow = parentWrapper?.parentElement?.parentElement?.parentElement?.parentElement?.offsetTop ?? null
			offsetLeft = parentWrapper?.offsetLeft ?? null
			break
		}
		default:
			break
	}

	return { offsetTop, offsetTopRow, offsetLeft, width, height }
}

const GET_RESERVATIONS_CANCEL_TOKEN_KEY = getCalendarEventsCancelTokenKey(CALENDAR_EVENTS_KEYS.RESERVATIONS)
const GET_SHIFTS_TIME_OFFS_CANCEL_TOKEN_KEY = getCalendarEventsCancelTokenKey(CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS)

type Props = {
	view: CALENDAR_VIEW
	loading: boolean
	handleSubmitReservation: (values: ICalendarReservationForm, onError?: () => void) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	setEventManagement: (newView: CALENDAR_EVENT_TYPE | undefined, eventId?: string | undefined) => void
	enabledSalonReservations?: boolean
	parentPath: string
} & Omit<ICalendarView, 'onEventChange' | 'onEventChangeStart' | 'onEventChangeStop'>

export type CalendarRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof FullCalendar> | null
	/* [CALENDAR_VIEW.MONTH]?: InstanceType<typeof FullCalendar> | null */
}

const CalendarContent = React.forwardRef<CalendarRefs, Props>((props, ref) => {
	const {
		view,
		loading,
		reservations,
		shiftsTimeOffs,
		handleSubmitReservation,
		handleSubmitEvent,
		selectedDate,
		setEventManagement,
		enabledSalonReservations,
		salonID,
		eventsViewType,
		employees,
		onAddEvent,
		onEditEvent,
		onReservationClick,
		clearRestartInterval,
		parentPath
	} = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	// const monthView = useRef<InstanceType<typeof FullCalendar>>(null)
	const [t] = useTranslation()

	const employeesOptions = useSelector((state: RootState) => state.employees.employees?.options)
	const isRefreshingEvents = useSelector((state: RootState) => state.calendar.isRefreshingEvents)

	// query
	const [query, setQuery] = useQueryParams({
		employeeIDs: DelimitedArrayParam,
		categoryIDs: DelimitedArrayParam
	})

	const [disableRender, setDisableRender] = useState(false)

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current,
		[CALENDAR_VIEW.WEEK]: weekView?.current
		/* [CALENDAR_VIEW.MONTH]: monthView?.current */
	}))

	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const selectedSalonuniqPermissions = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.uniqPermissions)
	const [visibleForbiddenModal, setVisibleForbiddenModal] = useState(false)
	const prevEvent = useRef<ComparsionEventInfo>(COMPARSION_INFO_DEFAULT)

	const sources = useMemo(() => {
		// eventy, ktore sa posielaju o uroven nizsie do View, sa v pripade, ze existuje virtualEvent odfiltruju
		const allSources = {
			reservations,
			shiftsTimeOffs,
			virtualEvent: virtualEvent?.event
		}

		if (virtualEvent?.id && !virtualEvent?.isNew) {
			if (virtualEvent.type === CALENDAR_EVENT_TYPE.RESERVATION) {
				allSources.reservations = reservations?.filter((item) => item.id !== virtualEvent.id) ?? []
			} else {
				allSources.shiftsTimeOffs = shiftsTimeOffs?.filter((item) => item.id !== virtualEvent.id) ?? []
			}
		}

		return allSources
	}, [reservations, shiftsTimeOffs, virtualEvent])

	const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])
	/**
	 * calendarSelectedDate = datum, ktory ma nastaveny Fullcalendar
	 * v tyzdennom view sa casto lisi od datumu, ktory je v URLcke, viac v komentari vo funkcii getSelectedDateForCalendar()
	 */
	const calendarSelectedDate = getSelectedDateForCalendar(view, selectedDate)

	const dispatch = useDispatch()

	/**
	 * onEventChangeStart()
	 * táto funkcia sa zavolá vždy na začiatku resizovania alebo drag'n'dropovania eventu
	 * kvoli background loadu (vysvetlené v komponetne Calendar.tsx - hľadaj "background load") je potrebné v určitých prípadoch zamedziť tomu, aby sa počas dnd alebo resizu eventu mohol Fullcalendar prerendrovať, inak môžu vznikať duplicitné eventy
	 * problém súvisí s tým, ako Fullcalendar funguje - pri dnd alebo resize eventu Fullcalendar skryje originálny event a vytvorý v DOMku nový "placeholder", ktorý ho nahradí počas celej doby, ako s ním užívateľ manipuluje - čiže od momentu, kedy sa zavolá onEventChangeStart() až po onEventChange() / onEventChangeStop()
	 * ak by sa počas toho, ako úživateľ mení event cez dnd alebo resize dotiahli nové data na pozadí, ktoré by boli odlišné od predošlých, dôdje k prerendrovaniu kalendára a zduplikovaniu eventov
	 * a to tak, že v novo dotiahnutej kolekcii by sa totiž stále nachádzal event, ktorý užívateľ začal meniť a zároveň by druhý krát existoval ako placeholder v jeho "ruke" (a to aj potom, čo by ho "pustil z ruky" naspäť do kalendára)
	 * clearRestartInterval(), ktorý sa zavolá na začiatku zmeny eventu zčasti tento problém rieši, ak začnem meniť event a aktuálne na pozadí neprebieha background load, tak táto funkcia zastaví ďalšie aktualizovanie až dovtedy, pokiaľ s resizom alebo dnd neprestanem - až potom sa opäť spustí restartFetchInterval()
	 * kritickejší je prípad, kedy začnem meniť event počas toho, ako background load prebieha (vtedy mi clearRestartInterval() zruší až ďalšiu aktualizáciu, no nie tu prebiehajúcu)
	 * aby sme v takom prípade predišli problému s duplicitou, ktorý sa spomína vyššie (zmenená kolekcia z aktualizácie prerendruje kalenár), tak potrebujeme zamedziť, aby sa počas dnd alebo resizu mohol kalendár prerendrovávať a povoliť to až potom, čo s tým užívateľ skončí
	 * pozor! Fullcalendar ponúka dva callbacky, ktoré sa zavolajú po zmene eventu onEventChange() a onEventChangeStop() a musíme rozlišovať, ktorý na čo použijeme
	 *
	 * onEventChange()
	 * obsahuje informácie ako o novej polohe eventu, tak aj o pôvodnej polohe - a tiež funkciu revert(), ktorá ho do pôvodnej polohy ľahko vráti - to je užitočné v prípade, že neprejde request alebo sa užívateľ rozhodne nepotvrdiť zmenu eventu v confirm modale
	 * ciže z toho CB sa potom robia volania na BE pre update eventu a následné dotiahnutie aktualizovaných dát
	 * pozor! v tomto CB chceme opätovne povoliť prerendrovanie kalendára, avšak v prípade, že sa robí request na BE, tak to musíme spraviť až po tom, čo sa updatne event a dotiahne sa aktualizovaná kolekcia eventov
	 * ak by sme to povolili hneď po tom, čo skončí dnd alebo resize, tak sa može stať, že
	 * zavolá sa však len vtedy, keď došlo k nejakej zmene eventu po resize alebo dnd, teda ak som zobral event do ruky, ale vrátim ho na pôvodne miesto, tak sa nezavolá
	 * a nezavolá sa ani v prípade, že mam vo Fullcalendari aplikované nejaké obmedzenia cez eventAllow, kedže tie mi event tiež vrátia na pôvodné miesto
	 * čo je bohužiaľ veľká nevýhoda, pretože ako sa spomína vyššie, po zmene eventu je potrebné opätovne povoliť prerendrovanie a pri onEventChangeStart() sa vypne vždy, bezohľadu nato, či ho používateľ vráti na pôvodne miesto alebo nie
	 * teda musíme si pomôcť ďalším CB onEventChangeStop(), ktorý sa zavolá vždy, aj v prípade, že k zmene pozície eventu nedošlo
	 *
	 * onEventChangeStop()
	 * zavolá sa síce vždy, aj keď je event vrátený na rovnaké miesto - poskytuje však informácie len o pôvodnej polohe eventu, čo je zasa jeho veľka nevýhoda
	 */

	const onEventChangeStart = useCallback(
		(arg: EventDropArg | EventResizeStartArg) => {
			clearRestartInterval()
			// disable render on resize or drop start
			// setDisableRender(true)

			if (typeof cancelGetTokens[GET_SHIFTS_TIME_OFFS_CANCEL_TOKEN_KEY] !== typeof undefined) {
				console.log('aaa')
				cancelGetTokens[GET_SHIFTS_TIME_OFFS_CANCEL_TOKEN_KEY].cancel('stop loading')
				// dispatch({ type: EVENTS.EVENTS_LOAD_FAIL, enumType: CALENDAR_EVENTS_KEYS.SHIFTS_TIME_OFFS })
			}
			if (eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION && typeof cancelGetTokens[GET_RESERVATIONS_CANCEL_TOKEN_KEY] !== typeof undefined) {
				console.log('bbbb')
				cancelGetTokens[GET_RESERVATIONS_CANCEL_TOKEN_KEY].cancel('stop loading')
				// dispatch({ type: EVENTS.EVENTS_LOAD_FAIL, enumType: CALENDAR_EVENTS_KEYS.RESERVATIONS })
			}
			// dispatch({ type: SET_IS_REFRESHING_EVENTS, payload: false })

			// prevEvent.current = getEventForComparsion(view, arg.el)
		},
		[clearRestartInterval, dispatch, eventsViewType, isRefreshingEvents]
	)

	const onEventChange = (arg: EventDropArg | EventResizeDoneArg) => {
		const hasPermissions = permitted(authUserPermissions || [], selectedSalonuniqPermissions, UPDATE_EVENT_PERMISSIONS)

		const revertEvent = () => {
			setDisableRender(false)
			arg.revert()
		}

		if (!hasPermissions) {
			setVisibleForbiddenModal(true)
			revertEvent()
			return
		}

		const { event } = arg
		const { start, end } = event
		const { newResource } = arg as EventDropArg
		const newResourceExtendedProps = newResource?.extendedProps as IWeekViewResourceExtenedProps | IDayViewResourceExtenedProps
		const eventExtenedProps = (event.extendedProps as IEventExtenedProps) || {}
		const eventData = eventExtenedProps?.eventData
		const eventId = eventData?.id
		const calendarBulkEventID = eventData?.calendarBulkEvent?.id

		const newEmployeeId = newResourceExtendedProps?.employee?.id || eventExtenedProps?.eventData?.employee?.id
		const currentEmployeeId = eventExtenedProps?.eventData?.employee?.id

		// NOTE: miesto eventAllow sa bude vyhodnocovat, ci sa dany event moze upravit tu
		if (/* view !== CALENDAR_VIEW.MONTH && */ eventData?.eventType !== CALENDAR_EVENT_TYPE.RESERVATION && !startsWith(event.id, NEW_ID_PREFIX)) {
			if (newEmployeeId !== currentEmployeeId) {
				notification.warning({
					message: t('loc:Upozornenie'),
					description: t('loc:{{ eventType }} nie je možné preradiť na iného zamestnanca.', {
						eventType: EVENT_NAMES(eventData?.eventType as CALENDAR_EVENT_TYPE, true)
					})
				})
				revertEvent()
				return
			}
		}

		// zatial predpokladame, ze nebudu viacdnove eventy - takze start a end date by mal byt rovnaky
		const startDajys = dayjs(start)
		const timeFrom = startDajys.format(CALENDAR_DATE_FORMAT.TIME)
		const timeTo = dayjs(end).format(CALENDAR_DATE_FORMAT.TIME)

		let date = startDajys.format(CALENDAR_DATE_FORMAT.QUERY)

		if (view === CALENDAR_VIEW.WEEK) {
			// v pripadne tyzdnoveho view je potrebne ziskat datum z resource (kedze realne sa vyuziva denne view a jednotlive dni su resrouces)
			// (to sa bude diat len pri drope)
			const resource = event.getResources()[0]
			date = newResource ? (newResourceExtendedProps as IWeekViewResourceExtenedProps)?.day : resource?.extendedProps?.day
		}

		// ak sa zmenil resource, tak updatenut resource (to sa bude diat len pri drope)
		const employee = newResource ? newResourceExtendedProps?.employee : eventData?.employee

		const values = {
			date,
			timeFrom,
			timeTo,
			eventType: eventData?.eventType,
			employee: {
				key: employee?.id
			},
			eventId,
			revertEvent,
			// if the event has changed, it is necessary to enable rendering again.. however, only after completing the request for current data... otherwise, duplicate events may be created in the calendar
			// if someone in another session changes the event and I start changing the same event during the nearest background load, this event would be duplicated with the rendering enabled
			enableCalendarRender: () => setDisableRender(false),
			updateFromCalendar: true
		}

		if (!employee?.id) {
			// ak nahodou nemam employeeId tak to vrati na povodne miesto
			revertEvent()
			return
		}
		// Ak existuje virualny event a isPlaceholder z eventu je true tak sa jedna o virtualny even a bude sa rovbit change nad formularmi a nezavola sa request na BE
		if (virtualEvent && startsWith(event.id, NEW_ID_PREFIX)) {
			const formName = eventData?.eventType === CALENDAR_EVENT_TYPE.RESERVATION ? FORM.CALENDAR_RESERVATION_FORM : FORM.CALENDAR_EVENT_FORM
			batch(() => {
				dispatch(change(formName, 'date', date))
				dispatch(change(formName, 'timeFrom', timeFrom))
				dispatch(change(formName, 'timeTo', timeTo))
				dispatch(
					change(formName, 'employee', {
						value: employee?.id as string,
						key: employee?.id as string,
						label: newResource ? newResourceExtendedProps?.employee?.name : eventData?.employee.email
					})
				)
			})
			setDisableRender(false)
			return
		}

		if (eventData?.eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
			const customerId = eventData.customer?.id
			const serviceId = eventData.service?.id

			handleSubmitReservation({ ...values, customer: { key: customerId }, service: { key: serviceId } } as any)
			return
		}
		handleSubmitEvent({ ...values, calendarBulkEventID } as ICalendarEventForm)
	}

	const onEventChangeStop = (arg: EventDropArg | EventResizeStopArg) => {
		// FC uses a "fake" element in the DOM for drag and resize
		// it is therefore necessary to wait until the original DOM event is updated after the change and then find out its new coordinates
		setTimeout(() => {
			const dropEventInfo = getEventForComparsion(view, arg.el)
			// if the old and new coordinates are the same, then onEventChange CB is not called (which would enable render again) and it is necessary to enable render here
			if (isEqual(dropEventInfo, prevEvent.current)) {
				setDisableRender(false)
			}
			prevEvent.current = COMPARSION_INFO_DEFAULT
		}, 500)
	}

	const getView = () => {
		if (!employeesOptions?.length) {
			return (
				<CalendarEmptyState
					title={t('loc:Pre prácu s kalendárom je potrebné pridať do salónu aspoň jedného zamestnanca')}
					onButtonClick={() => history.push(`${parentPath}${t('paths:employees')}`)}
					buttonLabel={t('loc:Pridať zamestnancov')}
				/>
			)
		}

		if (query?.categoryIDs === null && query?.employeeIDs === null) {
			return (
				<CalendarEmptyState
					title={t('loc:Nie je vybratý zamestnanec ani služba')}
					onButtonClick={() =>
						setQuery({
							...query,
							employeeIDs: undefined, // undefined znamena ze sa setnu vsetky hodnoty do filtra
							categoryIDs: undefined
						})
					}
					buttonLabel={t('loc:Vybrať všetko')}
				/>
			)
		}
		if (query?.employeeIDs === null) {
			return (
				<CalendarEmptyState
					title={t('loc:Nie je vybratý zamestnanec')}
					onButtonClick={() =>
						setQuery({
							...query,
							employeeIDs: undefined
						})
					}
				/>
			)
		}
		if (query.categoryIDs === null) {
			return (
				<CalendarEmptyState
					title={t('loc:Nie je vybratá služba')}
					onButtonClick={() =>
						setQuery({
							...query,
							categoryIDs: undefined
						})
					}
					buttonLabel={t('loc:Vybrať všetky')}
				/>
			)
		}

		/* if (view === CALENDAR_VIEW.MONTH) {
			return (
				<CalendarMonthView
					ref={monthView}
					selectedDate={selectedDate}
					reservations={reservations}
					shiftsTimeOffs={shiftsTimeOffs}
					employees={employees}
					eventsViewType={eventsViewType}
					salonID={salonID}
					onEditEvent={onEditEvent}
				/>
			)
		} */

		if (view === CALENDAR_VIEW.WEEK) {
			return (
				<CalendarWeekView
					ref={weekView}
					enabledSalonReservations={enabledSalonReservations}
					setEventManagement={setEventManagement}
					disableRender={disableRender}
					reservations={sources.reservations}
					shiftsTimeOffs={sources.shiftsTimeOffs}
					virtualEvent={sources.virtualEvent}
					employees={employees}
					weekDays={weekDays}
					selectedDate={calendarSelectedDate}
					salonID={salonID}
					eventsViewType={eventsViewType}
					onEditEvent={onEditEvent}
					onReservationClick={onReservationClick}
					onAddEvent={onAddEvent}
					clearRestartInterval={clearRestartInterval}
					onEventChange={onEventChange}
					onEventChangeStart={onEventChangeStart}
					onEventChangeStop={onEventChangeStop}
					updateCalendarSize={() => weekView?.current?.getApi().updateSize()}
				/>
			)
		}

		return (
			<CalendarDayView
				enabledSalonReservations={enabledSalonReservations}
				setEventManagement={setEventManagement}
				ref={dayView}
				// disableRender={disableRender}
				reservations={sources.reservations}
				shiftsTimeOffs={sources.shiftsTimeOffs}
				virtualEvent={sources.virtualEvent}
				selectedDate={calendarSelectedDate}
				employees={employees}
				salonID={salonID}
				eventsViewType={eventsViewType}
				onAddEvent={onAddEvent}
				onEditEvent={onEditEvent}
				onReservationClick={onReservationClick}
				clearRestartInterval={clearRestartInterval}
				onEventChange={onEventChange}
				onEventChangeStart={onEventChangeStart}
				onEventChangeStop={onEventChangeStop}
			/>
		)
	}

	return (
		<Content className={'nc-content'}>
			<Spin spinning={loading}>
				<div id={'nc-content-overlay'} />
				{getView()}
			</Spin>
			<ForbiddenModal visible={visibleForbiddenModal} onCancel={() => setVisibleForbiddenModal(false)} />
		</Content>
	)
})

export default CalendarContent
