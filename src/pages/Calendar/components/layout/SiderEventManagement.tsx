import React, { FC } from 'react'
import Sider from 'antd/lib/layout/Sider'

// enums
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW } from '../../../../utils/enums'

// types
import { ICalendarEventForm, ICalendarReservationForm } from '../../../../types/interfaces'

// components
import ReservationForm from '../forms/ReservationForm'
import ShiftForm from '../forms/ShiftForm'
import TimeOffForm from '../forms/TimeOffForm'
import BreakForm from '../forms/BreakForm'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	// handleSubmitShift: (values: ICalendarShiftForm) => void
	// handleSubmitTimeOff: (values: ICalendarTimeOffForm) => void
	// handleSubmitBreak: (values: ICalendarBreakForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	onChangeEventType: (type: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => any
	handleDeleteEvent: () => any
	eventId?: string | null
}

const SiderEventManagement: FC<Props> = (props) => {
	const { setCollapsed, handleSubmitReservation, handleSubmitEvent, salonID, onChangeEventType, sidebarView, handleDeleteEvent, eventId } = props

	const getSiderContent = () => {
		switch (sidebarView) {
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION:
				return (
					<ReservationForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						salonID={salonID}
						onSubmit={handleSubmitReservation}
					/>
				)
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT:
				return (
					<ShiftForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						salonID={salonID}
						eventId={eventId}
						onSubmit={handleSubmitEvent}
					/>
				)
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIMEOFF:
				return (
					<TimeOffForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						salonID={salonID}
						onSubmit={handleSubmitEvent}
					/>
				)
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK:
				return (
					<BreakForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						salonID={salonID}
						onSubmit={handleSubmitEvent}
					/>
				)
			default:
				return null
		}
	}

	return (
		<Sider className='nc-sider-event-management' collapsed={sidebarView === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED} width={240} collapsedWidth={0}>
			{getSiderContent()}
		</Sider>
	)
}

export default SiderEventManagement
