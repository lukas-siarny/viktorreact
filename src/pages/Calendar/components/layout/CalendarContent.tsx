import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { notification, Spin } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { change } from 'redux-form'
import { startsWith } from 'lodash'
import { DelimitedArrayParam, useQueryParams } from 'use-query-params'

// fullcalendar
import { EventResizeDoneArg } from '@fullcalendar/interaction'
import FullCalendar, { EventDropArg } from '@fullcalendar/react'

// enums
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENTS_KEYS,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_EVENT_TYPE,
	CALENDAR_VIEW,
	CANEL_TOKEN_MESSAGES,
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
	clearFetchInterval: () => void
	restartFetchInterval: () => void
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
		clearFetchInterval,
		restartFetchInterval,
		parentPath
	} = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	// const monthView = useRef<InstanceType<typeof FullCalendar>>(null)
	const [t] = useTranslation()

	const employeesOptions = useSelector((state: RootState) => state.employees.employees?.options)

	// query
	const [query, setQuery] = useQueryParams({
		employeeIDs: DelimitedArrayParam,
		categoryIDs: DelimitedArrayParam
	})

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current,
		[CALENDAR_VIEW.WEEK]: weekView?.current
		/* [CALENDAR_VIEW.MONTH]: monthView?.current */
	}))

	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const selectedSalonuniqPermissions = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.uniqPermissions)
	const [visibleForbiddenModal, setVisibleForbiddenModal] = useState(false)

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
	 * počas práce s eventom je potrebné zamedziť tomu, aby sa spúštala aktualizácia kalendára na pozadí (tvz. "background load" - vysvetlené v komponetne Calendar.tsx), pretože môžu vznikať duplicitné eventy
	 * problém súvisí s tým, ako Fullcalendar funguje - pri dnd alebo resize eventu Fullcalendar skryje originálny event a vytvorý v DOMku nový "placeholder", ktorý ho nahradí počas celej doby, ako s ním užívateľ manipuluje - čiže od momentu, kedy sa zavolá onEventChangeStart() až po onEventChange() / onEventChangeStop()
	 * ak by sa počas toho, ako úživateľ mení event cez dnd alebo resize dotiahli nové data na pozadí, ktoré by boli odlišné od predošlých (napr. by iný užívateľ v inom sessions zmenil niektorý z eventov), dôdje k prerendrovaniu kalendára a zduplikovaniu eventov
	 * a to tak, že v novo dotiahnutej kolekcii sa bude stále nachádzať event, ktorý užívateľ začal meniť a zároveň by druhý krát existoval ako placeholder v jeho "ruke" (a to aj potom, čo by ho "pustil z ruky" naspäť do kalendára)
	 * clearInterval(), ktorý sa zavolá na začiatku zmeny eventu zčasti tento problém rieši, ak začnem meniť event a aktuálne na pozadí neprebieha background load, tak táto funkcia zastaví ďalšie aktualizovanie až dovtedy, pokiaľ s resizom alebo dnd neprestanem - až potom sa opäť spustí restartFetchInterval()
	 * môže ešte nastať prípad, kedy začnem meniť event počas toho, ako background load prebieha (vtedy mi clearInterval() zruší až ďalšiu aktualizáciu, no nie tu prebiehajúcu)
	 * tento prípad riešia cancel tokeny, ktoré aktuálne prebiehajúci request zrušia
	 *
	 * onEventChange()
	 * obsahuje informácie ako o novej polohe eventu, tak aj o pôvodnej polohe - a tiež funkciu revert(), ktorá ho do pôvodnej polohy ľahko vráti - to je užitočné v prípade, že neprejde request alebo sa užívateľ rozhodne nepotvrdiť zmenu eventu v confirm modale
	 * v tomto CB sa vyhodnocuje, či užívateľ môže spraviť úpravu a ak áno, odosielajú sa ďalej data na BE
	 * zavolá sa však len vtedy, keď reálne došlo k nejakej zmene eventu, teda ak som zobral event do ruky, ale vrátim ho na pôvodne miesto, tak bude odignorovaný
	 * to je problém, pretože po dokončení resizu alebo dnd potrebujeme opätovne povoliť "background load" aj v prípade, že k žiadnej zmene nedošlo
	 * musíme si pomôcť ďalším CB onEventChangeStop(), ktorý sa zavolá vždy
	 *
	 * onEventChangeStop()
	 * zavolá vždy po dokončení dnd alebo resizu, aj v prípade, že k zmene pozície eventu nedošlo
	 * preto v tomto CB opatovne povoľujeme aktualizáciu dát - restartFetchInterval()
	 * poskytuje však informácie len o pôvodnom evente, neposkytuje informácie o novej polohe, resoruce, ani revert() funkciu, preto ho nemôžeme použit univerzálne miesto onEventChange()
	 */

	const onEventChangeStart = useCallback(() => {
		clearFetchInterval()

		if (typeof cancelGetTokens[GET_SHIFTS_TIME_OFFS_CANCEL_TOKEN_KEY] !== typeof undefined) {
			cancelGetTokens[GET_SHIFTS_TIME_OFFS_CANCEL_TOKEN_KEY].cancel(CANEL_TOKEN_MESSAGES.CANCELED_ON_DEMAND)
		}
		if (eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION && typeof cancelGetTokens[GET_RESERVATIONS_CANCEL_TOKEN_KEY] !== typeof undefined) {
			cancelGetTokens[GET_RESERVATIONS_CANCEL_TOKEN_KEY].cancel(CANEL_TOKEN_MESSAGES.CANCELED_ON_DEMAND)
		}
	}, [clearFetchInterval, eventsViewType])

	const onEventChange = (arg: EventDropArg | EventResizeDoneArg) => {
		const hasPermissions = permitted(authUserPermissions || [], selectedSalonuniqPermissions, UPDATE_EVENT_PERMISSIONS)

		const revertEvent = () => {
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

		/**
		 * vyhodnotí sa nová pozícia eventu - v prípade, že užívateľ nemá právo vykonať danú akciu, tak sa event vráti na pôvodne miesto
		 * editácia eventu - rezervácia sa môže ľubovoľne presúvať medzi zamestnancami.. zmena, voľno a prestávka je možné presúvať len vrámci zamestnanca
		 * vytváranie eventu - nie su žiadne reštrikcie
		 * eventy v mesačnom view nie sú rozdelné podľa resouruces, čiže je to tiež bez reštrikcií
		 */
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
			// v pripadne tyzdnoveho view je potrebne ziskat datum z resource (kedze realne sa vyuziva denne view a jednotlive dni su resrouces - pozri komenty v CalendarWeekView pre upresnenie)
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
			updateFromCalendar: true
		}

		if (!employee?.id) {
			// ak nahodou nemam employeeId tak to vrati na povodne miesto
			revertEvent()
			return
		}
		// Ak existuje virualny event a isPlaceholder z eventu je true tak sa jedna o virtualny even a bude sa robit change nad formularmi a nezavola sa request na BE
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

	const onEventChangeStop = () => {
		restartFetchInterval()
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
