import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import dayjs from 'dayjs'

// fullcalendar
import { EventResizeDoneArg } from '@fullcalendar/interaction'
import FullCalendar, { EventDropArg, DatesSetArg } from '@fullcalendar/react'

// enums
import cx from 'classnames'
import { StringParam, useQueryParams, withDefault } from 'use-query-params'
import { CALENDAR_DATE_FORMAT, CALENDAR_EVENT_TYPE, CALENDAR_VIEW, UPDATE_EVENT_PERMISSIONS } from '../../../../utils/enums'

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
	handleSubmitEvent: (values: ICalendarEventForm, onError?: () => void) => void
	setEventManagement: any
} & ICalendarView

export type CalendarRefs = {
	[CALENDAR_VIEW.DAY]?: InstanceType<typeof FullCalendar> | null
	[CALENDAR_VIEW.WEEK]?: InstanceType<typeof FullCalendar> | null
	/* [CALENDAR_VIEW.MONTH]?: InstanceType<typeof FullCalendar> | null */
}

const CalendarContent = React.forwardRef<CalendarRefs, Props>((props, ref) => {
	const { view, loading, reservations, shiftsTimeOffs, onShowAllEmployees, showEmptyState, handleSubmitReservation, handleSubmitEvent, selectedDate, setEventManagement } = props

	const [query] = useQueryParams({
		sidebarView: StringParam
	})

	// TODO: ked sa bude rusit maska tak tento kod zmazat
	useEffect(() => {
		if (query?.sidebarView) {
			const body = document.getElementsByClassName('fc-timeline-body')[0]
			body.classList.add('active')
		} else {
			const body = document.getElementsByClassName('fc-timeline-body')[0]
			body.classList.remove('active')
		}
	}, [query?.sidebarView])

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

	const onEventChange = useCallback(
		(calendarView: CALENDAR_VIEW, arg: EventDropArg | EventResizeDoneArg) => {
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

			// ak sa zmenil resource, tak updatenut resource (to sa bude diat len pri drope)
			const employeeId = newResource ? newResourceExtendedProps?.employee?.id : eventData?.employee.id

			if (!eventId || !employeeId) {
				// ak nahodou nemam eventID alebo employeeId tak to vrati na povodne miesto
				revertEvent()
				return
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

			const values = {
				date,
				timeFrom,
				timeTo,
				eventType: eventData?.eventType,
				employee: {
					key: employeeId
				},
				eventId
			}

			if (eventData?.eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
				const customerId = eventData.customer?.id
				const serviceId = eventData.service?.id

				handleSubmitReservation({ ...values, customer: { key: customerId }, service: { key: serviceId } } as any, revertEvent)
				return
			}
			handleSubmitEvent({ ...values, calendarBulkEventID } as ICalendarEventForm, revertEvent)
		},
		[handleSubmitReservation, handleSubmitEvent, authUserPermissions, selectedSalonuniqPermissions]
	)

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
					isOpenSidebar={!!query.sidebarView}
					ref={weekView}
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
				isOpenSidebar={!!query.sidebarView}
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
			{/* // TODO: tato maska by sa mohla zrusit uplne */}
			{/* <div role={'button'} onClick={() => setEventManagement(undefined)} id={'overlay'} className={cx({ block: query.sidebarView, hidden: !query.sidebarView })} /> */}
			<Spin spinning={loading}>
				<div id={'nc-content-overlay'} />
				{getView()}
			</Spin>
			<ForbiddenModal visible={visibleForbiddenModal} onCancel={() => setVisibleForbiddenModal(false)} />
		</Content>
	)
})

export default CalendarContent
