import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { notification, Spin } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { change } from 'redux-form'
import { useNavigate } from 'react-router-dom'
import { startsWith } from 'lodash'

// fullcalendar
import FullCalendar, { DateSpanApi, EventDropArg } from '@fullcalendar/react'
import { EventResizeDoneArg } from '@fullcalendar/interaction'

// enums
import {
	CALENDAR_DATE_FORMAT,
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
import CalendarMonthView from '../views/CalendarMonthView'
import CalendarEmptyState from '../CalendarEmptyState'

// types
import {
	ICalendarEventForm,
	ICalendarMonthlyReservationsPayload,
	ICalendarReservationForm,
	ICalendarView,
	IDayViewResourceExtenedProps,
	IEventExtenedProps,
	IResourceEmployee,
	IWeekViewResourceExtenedProps,
	PopoverTriggerPosition
} from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'
import { IUseQueryParams } from '../../../../hooks/useQueryParams'

// utils
import { ForbiddenModal, checkPermissions } from '../../../../utils/Permissions'
import { cancelEventsRequestOnDemand, getSelectedDateForCalendar, getWeekDays } from '../../calendarHelpers'

type Props = {
	view: CALENDAR_VIEW
	loading: boolean
	handleSubmitReservation: (values: ICalendarReservationForm, onError?: () => void) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
	// handleSubmitImportedReservation: (values: ICalendarImportedReservationForm) => void
	enabledSalonReservations?: boolean
	parentPath: string
	salonID: string
	onShowEventsListPopover: (date: string, position?: PopoverTriggerPosition, isReservationsView?: boolean, employeeID?: string) => void
	clearFetchInterval: () => void
	restartFetchInterval: () => void
	query: IUseQueryParams
	setQuery: (newValues: IUseQueryParams) => void
	monthlyReservations: ICalendarMonthlyReservationsPayload['data']
} & Omit<ICalendarView, 'onEventChange' | 'onEventChangeStart' | 'onEventChangeStop'>

export type CalendarRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.MONTH]?: InstanceType<typeof FullCalendar> | null
}

const CalendarContent = React.forwardRef<CalendarRefs, Props>((props, ref) => {
	const navigate = useNavigate()

	const {
		view,
		loading,
		reservations,
		monthlyReservations,
		shiftsTimeOffs,
		handleSubmitReservation,
		handleSubmitEvent,
		// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
		// handleSubmitImportedReservation,
		selectedDate,
		enabledSalonReservations,
		salonID,
		eventsViewType,
		employees,
		onAddEvent,
		onEditEvent,
		onReservationClick,
		clearFetchInterval,
		restartFetchInterval,
		onShowEventsListPopover,
		parentPath,
		query,
		setQuery
	} = props

	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	const monthView = useRef<InstanceType<typeof FullCalendar>>(null)

	const [t] = useTranslation()

	const employeesOptions = useSelector((state: RootState) => state.calendarEmployees.calendarEmployees?.options)

	useImperativeHandle(ref, () => ({
		[CALENDAR_VIEW.DAY]: dayView?.current,
		[CALENDAR_VIEW.WEEK]: weekView?.current,
		[CALENDAR_VIEW.MONTH]: monthView?.current
	}))

	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])
	const salonPermissions = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.uniqPermissions || [])
	const [visibleForbiddenModal, setVisibleForbiddenModal] = useState(false)

	const sources = useMemo(() => {
		// eventy, ktore sa posielaju o uroven nizsie do View, sa v pripade, ze existuje virtualEvent odfiltruju
		const allSources = {
			reservations,
			monthlyReservations,
			shiftsTimeOffs,
			virtualEvent: virtualEvent?.event
		}

		if (virtualEvent?.id && !virtualEvent?.isNew) {
			// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
			if (virtualEvent.type === CALENDAR_EVENT_TYPE.RESERVATION /* || virtualEvent.type === CALENDAR_EVENT_TYPE.RESERVATION_FROM_IMPORT */) {
				allSources.reservations = reservations?.filter((item) => item.id !== virtualEvent.id) ?? []
			} else {
				allSources.shiftsTimeOffs = shiftsTimeOffs?.filter((item) => item.id !== virtualEvent.id) ?? []
			}
		}

		return allSources
	}, [reservations, monthlyReservations, shiftsTimeOffs, virtualEvent])

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
	 * zavolá sa vždy po dokončení dnd alebo resizu, aj v prípade, že k zmene pozície eventu nedošlo
	 * preto v tomto CB opatovne povoľujeme aktualizáciu dát - restartFetchInterval()
	 * poskytuje však informácie len o pôvodnom evente, neposkytuje informácie o novej polohe, resoruce, ani revert() funkciu, preto ho nemôžeme použit univerzálne miesto onEventChange() a musíme ich kombinovať
	 */

	const onEventChangeStart = useCallback(() => {
		clearFetchInterval()
		cancelEventsRequestOnDemand()
	}, [clearFetchInterval])

	const onEventChange = (arg: EventDropArg | EventResizeDoneArg) => {
		const hasPermissions = checkPermissions([...authUserPermissions, ...salonPermissions], UPDATE_EVENT_PERMISSIONS)

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
		const { eventData } = eventExtenedProps
		const eventId = eventData?.id
		const calendarBulkEventID = eventData?.calendarBulkEvent?.id
		// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
		// const isImportedEvent = eventData?.isImported

		const newEmployee = newResourceExtendedProps?.employee || eventExtenedProps?.eventData?.employee
		const newEmployeeId = newEmployee?.id
		const currentEmployeeId = eventExtenedProps?.eventData?.employee?.id

		/**
		 * vyhodnotí sa nová pozícia eventu - v prípade, že užívateľ nemá právo vykonať danú akciu, tak sa event vráti na pôvodne miesto
		 * editácia eventu - rezervácia sa môže ľubovoľne presúvať medzi zamestnancami.. zmena, voľno a prestávka je možné presúvať len vrámci zamestnanca
		 * vytváranie eventu - nie su žiadne reštrikcie
		 * eventy v mesačnom view nie sú rozdelné podľa resouruces, čiže je to tiež bez reštrikcií
		 */
		if (view !== CALENDAR_VIEW.MONTH && eventData?.eventType !== CALENDAR_EVENT_TYPE.RESERVATION && !startsWith(event.id, NEW_ID_PREFIX)) {
			if (newEmployeeId !== currentEmployeeId) {
				const eventType = EVENT_NAMES(t, eventData?.eventType as CALENDAR_EVENT_TYPE, true)
				notification.warning({
					message: t('loc:Upozornenie'),
					description: t('loc:{{ eventType }} nie je možné preradiť na iného zamestnanca.', {
						eventType
					})
				})
				revertEvent()
				return
			}
		}

		/**
		 * udalosť nie je možné preradiť na vymazenáho zamestnanca
		 */
		if (newEmployee?.isDeleted) {
			const eventType = EVENT_NAMES(t, eventData?.eventType as CALENDAR_EVENT_TYPE, true)
			notification.warning({
				message: t('loc:Upozornenie'),
				description: t('loc:{{ eventType }} nie je možné preradiť na vymazaného zamestnanca.', {
					eventType
				})
			})
			revertEvent()
			return
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

		// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
		/* if (isImportedEvent && eventId && employee) {
			handleSubmitImportedReservation({
				date,
				timeFrom,
				timeTo,
				eventId,
				revertEvent,
				updateFromCalendar: true,
				employee: {
					key: employee.id
				}
			} as any)
			return
		} */

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

		if (!employee?.id && view !== CALENDAR_VIEW.MONTH) {
			// ak nahodou nemam employeeId tak to vrati na povodne miesto
			// v mesacnom view sa nerzoduluju eventy podla resourcov, ale su vsetky v kopce.. cize v tomto pripade tuto podmineku treba ignorovat
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
				if (view !== CALENDAR_VIEW.MONTH) {
					dispatch(
						change(formName, 'employee', {
							value: employee?.id as string,
							key: employee?.id as string,
							label: newResource ? newResourceExtendedProps?.employee?.name : eventData?.employee.email
						})
					)
				}
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

	const handleSelectAllow = (selectInfo: DateSpanApi) => {
		const employee = selectInfo?.resource?.extendedProps?.employee as IResourceEmployee
		return !employee?.isDeleted
	}

	const getView = () => {
		if (!employeesOptions?.length) {
			return (
				<CalendarEmptyState
					title={t('loc:Pre prácu s kalendárom je potrebné pridať do salónu aspoň jedného zamestnanca')}
					onButtonClick={() => navigate(`${parentPath}${t('paths:employees')}`)}
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

		if (view === CALENDAR_VIEW.MONTH) {
			return (
				<CalendarMonthView
					ref={monthView}
					enabledSalonReservations={enabledSalonReservations}
					selectedDate={calendarSelectedDate}
					monthlyReservations={sources.monthlyReservations}
					employees={employees}
					shiftsTimeOffs={sources.shiftsTimeOffs}
					virtualEvent={eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION ? undefined : sources.virtualEvent}
					eventsViewType={eventsViewType}
					salonID={salonID}
					onEditEvent={onEditEvent}
					onReservationClick={onReservationClick}
					onAddEvent={onAddEvent}
					onEventChange={onEventChange}
					onEventChangeStart={onEventChangeStart}
					onEventChangeStop={onEventChangeStop}
					onShowEventsListPopover={onShowEventsListPopover}
					query={{ categoryIDs: query.categoryIDs }} // posuvame dalej len query, ktore realne potrebujeme, aby sa zabezpecilo zbytocnym prerendrovaniam celeho kalendaru
					parentPath={parentPath}
				/>
			)
		}

		if (view === CALENDAR_VIEW.WEEK) {
			return (
				<CalendarWeekView
					ref={weekView}
					enabledSalonReservations={enabledSalonReservations}
					reservations={sources.reservations}
					shiftsTimeOffs={sources.shiftsTimeOffs}
					virtualEvent={sources.virtualEvent}
					employees={employees}
					weekDays={weekDays}
					selectedDate={calendarSelectedDate}
					eventsViewType={eventsViewType}
					onEditEvent={onEditEvent}
					onReservationClick={onReservationClick}
					onAddEvent={onAddEvent}
					onEventChange={onEventChange}
					onEventChangeStart={onEventChangeStart}
					onEventChangeStop={onEventChangeStop}
					updateCalendarSize={() => weekView?.current?.getApi().updateSize()}
					handleSelectAllow={handleSelectAllow}
				/>
			)
		}

		return (
			<CalendarDayView
				enabledSalonReservations={enabledSalonReservations}
				ref={dayView}
				reservations={sources.reservations}
				shiftsTimeOffs={sources.shiftsTimeOffs}
				virtualEvent={sources.virtualEvent}
				selectedDate={calendarSelectedDate}
				employees={employees}
				eventsViewType={eventsViewType}
				onAddEvent={onAddEvent}
				onEditEvent={onEditEvent}
				onReservationClick={onReservationClick}
				onEventChange={onEventChange}
				onEventChangeStart={onEventChangeStart}
				onEventChangeStop={onEventChangeStop}
				handleSelectAllow={handleSelectAllow}
			/>
		)
	}

	return (
		<Content className={'nc-content'}>
			<Spin spinning={loading}>{getView()}</Spin>
			<ForbiddenModal visible={visibleForbiddenModal} onCancel={() => setVisibleForbiddenModal(false)} />
		</Content>
	)
})

export default CalendarContent
