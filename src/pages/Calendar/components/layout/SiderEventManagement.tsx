import React, { FC, useCallback } from 'react'
import Sider from 'antd/lib/layout/Sider'
import { map } from 'lodash'

// enums
import { CALENDAR_EVENT_TYPE, CALENDAR_EVENTS_VIEW_TYPE } from '../../../../utils/enums'

// types
import { ICalendarEventForm, ICalendarReservationForm } from '../../../../types/interfaces'

// components
import ReservationForm from '../forms/ReservationForm'
import ShiftForm from '../forms/ShiftForm'
import TimeOffForm from '../forms/TimeOffForm'
import BreakForm from '../forms/BreakForm'

// utils
import { getReq } from '../../../../utils/request'
import { formatLongQueryString, getAssignedUserLabel } from '../../../../utils/helper'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_TYPE
	setCollapsed: (view: CALENDAR_EVENT_TYPE | undefined) => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	onChangeEventType: (type: CALENDAR_EVENT_TYPE) => any
	handleDeleteEvent: () => any
	eventId?: string | null
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
}

const SiderEventManagement: FC<Props> = (props) => {
	const { setCollapsed, handleSubmitReservation, handleSubmitEvent, salonID, onChangeEventType, sidebarView, handleDeleteEvent, eventId, eventsViewType } = props
	const searchEmployes = useCallback(
		async (search: string, page: number) => {
			try {
				const { data } = await getReq('/api/b2b/admin/employees/', {
					search: formatLongQueryString(search),
					page,
					salonID
				})
				const selectOptions = map(data.employees, (employee) => ({
					value: employee.id,
					key: employee.id,
					label: getAssignedUserLabel({
						id: employee.id,
						firstName: employee.firstName,
						lastName: employee.lastName,
						email: employee.email
					}),
					borderColor: employee.color,
					thumbNail: employee.image.resizedImages.thumbnail
				}))
				return { pagination: data.pagination, data: selectOptions }
			} catch (e) {
				return { pagination: null, data: [] }
			}
		},
		[salonID]
	)

	const getSiderContent = () => {
		switch (sidebarView) {
			case CALENDAR_EVENT_TYPE.RESERVATION:
				return (
					<ReservationForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						salonID={salonID}
						eventId={eventId}
						searchEmployes={searchEmployes}
						onSubmit={handleSubmitReservation}
						eventsViewType={eventsViewType}
					/>
				)
			case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
				return (
					<ShiftForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						searchEmployes={searchEmployes}
						eventId={eventId}
						onSubmit={handleSubmitEvent}
						eventsViewType={eventsViewType}
					/>
				)
			case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
				return (
					<TimeOffForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						searchEmployes={searchEmployes}
						eventId={eventId}
						onSubmit={handleSubmitEvent}
						eventsViewType={eventsViewType}
					/>
				)
			case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
				return (
					<BreakForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						searchEmployes={searchEmployes}
						eventId={eventId}
						onSubmit={handleSubmitEvent}
						eventsViewType={eventsViewType}
					/>
				)
			default:
				return null
		}
	}

	return (
		<Sider className='nc-sider-event-management' collapsed={!sidebarView} width={240} collapsedWidth={0}>
			{getSiderContent()}
		</Sider>
	)
}

export default SiderEventManagement
