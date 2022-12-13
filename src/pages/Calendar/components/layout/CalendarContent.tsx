import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { Spin } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'

// fullcalendar
import { EventResizeDoneArg } from '@fullcalendar/interaction'
import FullCalendar, { EventDropArg } from '@fullcalendar/react'

// enums
import { change } from 'redux-form'
import { startsWith } from 'lodash'
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE, CALENDAR_VIEW, NEW_ID_PREFIX, UPDATE_EVENT_PERMISSIONS } from '../../../../utils/enums'

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

type Props = {
	view: CALENDAR_VIEW
	loading: boolean
	onShowAllEmployees: () => void
	showEmptyState: boolean
	handleSubmitReservation: (values: ICalendarReservationForm, onError?: () => void) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	refetchData: () => void
	setEventManagement: (newView: CALENDAR_EVENT_TYPE | undefined, eventId?: string | undefined) => void
} & ICalendarView

export type CalendarRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof FullCalendar> | null
	/* [CALENDAR_VIEW.MONTH]?: InstanceType<typeof FullCalendar> | null */
}

const CalendarContent = React.forwardRef<CalendarRefs, Props>((props, ref) => {
	const { view, loading, reservations, shiftsTimeOffs, onShowAllEmployees, showEmptyState, handleSubmitReservation, handleSubmitEvent, selectedDate, setEventManagement } = props

	const dispatch = useDispatch()
	const dayView = useRef<InstanceType<typeof FullCalendar>>(null)
	const weekView = useRef<InstanceType<typeof FullCalendar>>(null)
	// const monthView = useRef<InstanceType<typeof FullCalendar>>(null)

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

	const onEventChange = (calendarView: CALENDAR_VIEW, arg: EventDropArg | EventResizeDoneArg) => {
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
		const eventExtenedProps = (event.extendedProps as IEventExtenedProps) || {}
		const eventData = eventExtenedProps?.eventData
		const newResourceExtendedProps = newResource?.extendedProps as IWeekViewResourceExtenedProps | IDayViewResourceExtenedProps
		const eventId = eventData?.id
		const calendarBulkEventID = eventData?.calendarBulkEvent?.id || eventData?.calendarBulkEvent

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
		console.log('employee', employee)
		const values = {
			date,
			timeFrom,
			timeTo,
			eventType: eventData?.eventType,
			employee: {
				key: employee?.id
			},
			eventId,
			revertEvent
		}

		if (!employee?.id) {
			// ak nahodou nemam employeeId tak to vrati na povodne miesto
			revertEvent()
			return
		}
		// Ak existuje virualny event a isPlaceholder z eventu je true tak sa jedna o virtualny even a bude sa rovbit change nad formularmi a nezavola sa request na BE
		if (virtualEvent && startsWith(event.id, NEW_ID_PREFIX)) {
			const formName = `CALENDAR_${eventData?.eventType}_FORM` // TODO: ked sa spravi refacor bude len RESERVATION a EVENT forms
			// TODO: ked budu dva formy tak spravit cez init s tym ze sa budu predchadzajuce data zistovat a tie sa mergnu s novymi prevetne sa voci zbytocnemu volaniu change - ked sa spravi NOT-3624
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
	const getView = () => {
		if (showEmptyState) {
			return <CalendarEmptyState onButtonClick={onShowAllEmployees} />
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
					{...props}
					ref={weekView}
					setEventManagement={setEventManagement}
					reservations={sources.reservations}
					shiftsTimeOffs={sources.shiftsTimeOffs}
					virtualEvent={sources.virtualEvent}
					onEventChange={onEventChange}
					weekDays={weekDays}
					selectedDate={calendarSelectedDate}
					updateCalendarSize={() => weekView?.current?.getApi().updateSize()}
				/>
			)
		}

		return (
			<CalendarDayView
				{...props}
				setEventManagement={setEventManagement}
				ref={dayView}
				reservations={sources.reservations}
				shiftsTimeOffs={sources.shiftsTimeOffs}
				virtualEvent={sources.virtualEvent}
				selectedDate={calendarSelectedDate}
				onEventChange={onEventChange}
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
