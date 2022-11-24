import React, { FC, useCallback, useEffect } from 'react'
import Sider from 'antd/lib/layout/Sider'
import { map, omit } from 'lodash'
import cx from 'classnames'

// enums
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { getFormValues, initialize } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { StringParam, useQueryParams } from 'use-query-params'
import { CALENDAR_EVENT_TYPE, CALENDAR_EVENTS_VIEW_TYPE, DEFAULT_DATE_INIT_FORMAT, DEFAULT_TIME_FORMAT, EVENT_NAMES, FORM, STRINGS } from '../../../../utils/enums'

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
import EventTypeFilterForm from '../forms/EventTypeFilterForm'
import DeleteButton from '../../../../components/DeleteButton'
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { RootState } from '../../../../reducers'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_TYPE
	setCollapsed: (view: CALENDAR_EVENT_TYPE | undefined) => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	handleDeleteEvent: () => any
	eventId?: string | null
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
}

const SiderEventManagement: FC<Props> = (props) => {
	const { setCollapsed, handleSubmitReservation, handleSubmitEvent, salonID, sidebarView, handleDeleteEvent, eventId, eventsViewType } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [query, setQuery] = useQueryParams({
		sidebarView: StringParam
	})

	const breakFormValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_EMPLOYEE_BREAK_FORM)(state))
	const timeOffFormValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM)(state))
	const shiftFormValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_EMPLOYEE_SHIFT_FORM)(state))
	const reservationFormValues: Partial<ICalendarReservationForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_RESERVATION_FORM)(state))

	const initCreateEventForm = (eventForm: FORM, eventType: CALENDAR_EVENT_TYPE) => {
		const prevEventType = sidebarView
		// Mergnut predchadzajuce data ktore boli vybrane pred zmenou eventTypu
		let prevInitData: any = {}
		if (prevEventType === CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT) {
			prevInitData = shiftFormValues
		} else if (prevEventType === CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK) {
			prevInitData = breakFormValues
		} else if (prevEventType === CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF) {
			prevInitData = timeOffFormValues
		} else {
			prevInitData = reservationFormValues
		}
		// Nastavi sa aktualny event Type zo selectu
		setQuery({
			...query,
			sidebarView: eventType
		})
		// Initne sa event / reservation formular
		const initData = {
			date: dayjs().format(DEFAULT_DATE_INIT_FORMAT),
			timeFrom: dayjs().format(DEFAULT_TIME_FORMAT),
			...omit(prevInitData, 'eventType'),
			eventType
		}
		dispatch(initialize(FORM.EVENT_TYPE_FILTER_FORM, { eventType }))
		dispatch(initialize(eventForm, initData))
	}

	// Zmena selectu event type v draweri
	const onChangeEventType = (type: CALENDAR_EVENT_TYPE) => {
		initCreateEventForm(`CALENDAR_${type}_FORM` as FORM, type)
	}

	useEffect(() => {
		// zmena sideBar view
		if (sidebarView !== undefined) {
			// initnutie defaultu sidebaru pri nacitani bude COLLAPSED a ak bude existovat typ formu tak sa initne dany FORM (pri skopirovani URL na druhy tab)
			onChangeEventType(sidebarView as CALENDAR_EVENT_TYPE)
		}
	}, [sidebarView])

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
		<Sider className={cx('nc-sider-event-management', { edit: eventId })} collapsed={!sidebarView} width={240} collapsedWidth={0}>
			<div className={'nc-sider-event-management-header justify-between'}>
				<div className={'font-semibold'}>{eventId ? STRINGS(t).edit(EVENT_NAMES(sidebarView)) : STRINGS(t).createRecord(EVENT_NAMES(sidebarView))}</div>
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
