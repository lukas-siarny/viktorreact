import React, { FC } from 'react'
import Sider from 'antd/lib/layout/Sider'

// enums
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW } from '../../../../utils/enums'

// types
import { ICalendarBreakForm, ICalendarReservationForm, ICalendarShiftForm, ICalendarTimeOffForm } from '../../../../types/interfaces'

// components
import ReservationForm from '../forms/ReservationForm'
import ShiftForm from '../forms/ShiftForm'
import TimeOffForm from '../forms/TimeOffForm'
import BreakForm from '../forms/BreakForm'

type Props = {
	salonID: string
	view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitShift: (values?: ICalendarShiftForm) => void
	handleSubmitTimeOff: (values?: ICalendarTimeOffForm) => void
	handleSubmitBreak: (values?: ICalendarBreakForm) => void
}

const SiderEventManagement: FC<Props> = (props) => {
	const { view, setCollapsed, handleSubmitReservation, handleSubmitTimeOff, handleSubmitShift, handleSubmitBreak, salonID } = props

	const getSiderContent = () => {
		switch (view) {
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION:
				return <ReservationForm setCollapsed={setCollapsed} salonID={salonID} onSubmit={handleSubmitReservation} />
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT:
				return <ShiftForm setCollapsed={setCollapsed} salonID={salonID} onSubmit={handleSubmitShift} />
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIMEOFF:
				return <TimeOffForm setCollapsed={setCollapsed} onSubmit={handleSubmitTimeOff} />
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK:
				return <BreakForm setCollapsed={setCollapsed} onSubmit={handleSubmitBreak} />
			default:
				return null
		}
	}

	return (
		<Sider className='nc-sider-event-management' collapsed={view === CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED} width={240} collapsedWidth={0}>
			{getSiderContent()}
		</Sider>
	)
}

export default SiderEventManagement
