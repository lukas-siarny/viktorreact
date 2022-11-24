import React, { FC, useCallback } from 'react'
import Sider from 'antd/lib/layout/Sider'
import { map } from 'lodash'

// enums
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { CALENDAR_EVENT_TYPE, CALENDAR_EVENTS_VIEW_TYPE, STRINGS } from '../../../../utils/enums'

// types
import { ICalendarEventForm, ICalendarReservationForm } from '../../../../types/interfaces'

// components
import ReservationForm from '../forms/ReservationForm'
import ShiftForm from '../forms/ShiftForm'
import TimeOffForm from '../forms/TimeOffForm'
import BreakForm from '../forms/BreakForm'

// utils
import { getReq } from '../../../../utils/request'
import { formatLongQueryString, getAssignedUserLabel, translateEventName } from '../../../../utils/helper'
import EventTypeFilterForm from '../forms/EventTypeFilterForm'
import DeleteButton from '../../../../components/DeleteButton'
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'

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
	const [t] = useTranslation()

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
				return <ReservationForm salonID={salonID} eventId={eventId} searchEmployes={searchEmployes} onSubmit={handleSubmitReservation} />
			case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
				return <ShiftForm searchEmployes={searchEmployes} eventId={eventId} onSubmit={handleSubmitEvent} />
			case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
				return <TimeOffForm searchEmployes={searchEmployes} eventId={eventId} onSubmit={handleSubmitEvent} />
			case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
				return <BreakForm searchEmployes={searchEmployes} eventId={eventId} onSubmit={handleSubmitEvent} />
			default:
				return null
		}
	}

	return (
		<Sider className='nc-sider-event-management' collapsed={!sidebarView} width={240} collapsedWidth={0}>
			<div className={'nc-sider-event-management-header justify-between'}>
				<div className={'font-semibold'}>{eventId ? STRINGS(t).edit(translateEventName(sidebarView)) : STRINGS(t).createRecord(translateEventName(sidebarView))}</div>
				<div className={'flex-center'}>
					{eventId && (
						<DeleteButton
							placement={'bottom'}
							entityName={t('loc:prestávku')}
							className={'bg-transparent mr-4'}
							onConfirm={handleDeleteEvent}
							onlyIcon
							smallIcon
							size={'small'}
						/>
					)}
					<Button
						className='button-transparent'
						onClick={() => {
							setCollapsed(undefined)
						}}
					>
						<CloseIcon />
					</Button>
				</div>
			</div>
			{!eventId && (
				<div className={'p-4'}>
					<EventTypeFilterForm eventsViewType={eventsViewType} onChangeEventType={onChangeEventType} />
				</div>
			)}
			{getSiderContent()}
		</Sider>
	)
}

export default SiderEventManagement
