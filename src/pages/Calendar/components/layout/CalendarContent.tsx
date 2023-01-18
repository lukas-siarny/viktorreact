import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { batch, useDispatch, useSelector } from 'react-redux'
import { notification, Spin } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { change } from 'redux-form'
import { startsWith } from 'lodash'
import { DelimitedArrayParam, useQueryParams } from 'use-query-params'

// fullcalendar
import FullCalendar from '@fullcalendar/react'
import { EventResizeDoneArg } from '@fullcalendar/interaction'
import { EventDropArg } from '@fullcalendar/core'

// enums
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE, CALENDAR_VIEW, EVENT_NAMES, FORM, NEW_ID_PREFIX, UPDATE_EVENT_PERMISSIONS } from '../../../../utils/enums'

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

type Props = {
	view: CALENDAR_VIEW
	loading: boolean
	handleSubmitReservation: (values: ICalendarReservationForm, onError?: () => void) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	setEventManagement: (newView: CALENDAR_EVENT_TYPE | undefined, eventId?: string | undefined) => void
	enabledSalonReservations?: boolean
	parentPath: string
} & ICalendarView

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
	const calendarSelectedDate = getSelectedDateForCalendar(view, selectedDate)
	const dispatch = useDispatch()

	const onEventChange = (calendarView: CALENDAR_VIEW, arg: EventDropArg | EventResizeDoneArg) => {
		console.log('onEventChange')

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
		if (/* calendarView !== CALENDAR_VIEW.MONTH && */ eventData?.eventType !== CALENDAR_EVENT_TYPE.RESERVATION && !startsWith(event.id, NEW_ID_PREFIX)) {
			if (newEmployeeId !== currentEmployeeId) {
				notification.warning({
					message: t('loc:Upozornenie'),
					description: t('loc:{{ eventType }} nie je možné preradiť na iného zamestnanca.', {
						eventType: eventData?.eventType ? EVENT_NAMES(eventData?.eventType as CALENDAR_EVENT_TYPE, true) : t('loc:Udalosť')
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

		if (calendarView === CALENDAR_VIEW.WEEK) {
			// v pripadne tyzdnoveho view je potrebne ziskat datum z resource (kedze realne sa vyuziva denne view a jednotlive dni su resrouces)
			// (to sa bude diat len pri drope)
			const resource = event.getResources()[0]
			date = newResource ? (newResourceExtendedProps as IWeekViewResourceExtenedProps)?.day : resource?.extendedProps?.day
		}

		if (calendarView === CALENDAR_VIEW.WEEK) {
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

	console.log({ disableRender })

	const onEventChangeStart = () => {
		console.log('aaaaaaaaaa')
		// este osetrit ze ked sa nezmeni dlzka eventu, tak aby sa nezapol disabled render
		// respektive v onEventStop by sa to moholo osetrit
		clearRestartInterval()
		setDisableRender(true)
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
					updateCalendarSize={() => weekView?.current?.getApi().updateSize()}
				/>
			)
		}

		return (
			<CalendarDayView
				enabledSalonReservations={enabledSalonReservations}
				setEventManagement={setEventManagement}
				ref={dayView}
				disableRender={disableRender}
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
