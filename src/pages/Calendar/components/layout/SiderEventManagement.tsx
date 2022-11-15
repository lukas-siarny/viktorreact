import React, { FC, useCallback } from 'react'
import Sider from 'antd/lib/layout/Sider'

// enums
import { map } from 'lodash'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW } from '../../../../utils/enums'

// types
import { ICalendarEventForm, ICalendarReservationForm } from '../../../../types/interfaces'

// components
import ReservationForm from '../forms/ReservationForm'
import ShiftForm from '../forms/ShiftForm'
import TimeOffForm from '../forms/TimeOffForm'
import BreakForm from '../forms/BreakForm'
import { getReq } from '../../../../utils/request'
import { formatLongQueryString, getAssignedUserLabel } from '../../../../utils/helper'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	onChangeEventType: (type: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => any
	handleDeleteEvent: () => any
	eventId?: string | null
}

const SiderEventManagement: FC<Props> = (props) => {
	const { setCollapsed, handleSubmitReservation, handleSubmitEvent, salonID, onChangeEventType, sidebarView, handleDeleteEvent, eventId } = props
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
					thumbNail: employee.image.resizedImages.thumbnail
					// TODO: Available / Non Available hodnoty ak pribudne logika na BE tak doplnit ako extraContent
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
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.RESERVATION:
				return (
					<ReservationForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						salonID={salonID}
						searchEmployes={searchEmployes}
						onSubmit={handleSubmitReservation}
					/>
				)
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.SHIFT:
				return (
					<ShiftForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						searchEmployes={searchEmployes}
						eventId={eventId}
						onSubmit={handleSubmitEvent}
					/>
				)
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.TIME_OFF:
				return (
					<TimeOffForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						searchEmployes={searchEmployes}
						eventId={eventId}
						onSubmit={handleSubmitEvent}
					/>
				)
			case CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.BREAK:
				return (
					<BreakForm
						onChangeEventType={onChangeEventType}
						handleDeleteEvent={handleDeleteEvent}
						setCollapsed={setCollapsed}
						searchEmployes={searchEmployes}
						eventId={eventId}
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
