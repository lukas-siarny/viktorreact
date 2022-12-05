import React, { FC, useCallback, useEffect } from 'react'
import Sider from 'antd/lib/layout/Sider'
import { compact, map, omit } from 'lodash'
import cx from 'classnames'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { getFormValues, initialize } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { StringParam, useQueryParams } from 'use-query-params'
import { CalendarApi, EventInput } from '@fullcalendar/react'

// types
import { ICalendarEventForm, ICalendarReservationForm, INewCalendarEvent } from '../../../../types/interfaces'

// components
import ReservationForm from '../forms/ReservationForm'
import ShiftForm from '../forms/ShiftForm'
import TimeOffForm from '../forms/TimeOffForm'
import BreakForm from '../forms/BreakForm'
import EventTypeFilterForm from '../forms/EventTypeFilterForm'
import DeleteButton from '../../../../components/DeleteButton'

// utils
import { getReq } from '../../../../utils/request'
import { computeEndDate, formatLongQueryString, getAssignedUserLabel } from '../../../../utils/helper'
import {
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT,
	EVENT_NAMES,
	FORM,
	STRINGS,
	CALENDAR_COMMON_SETTINGS,
	EVERY_REPEAT,
	DELETE_EVENT_PERMISSIONS,
	DAY
} from '../../../../utils/enums'
import Permissions from '../../../../utils/Permissions'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'

// redux
import { RootState } from '../../../../reducers'
import { getCalendarEventDetail } from '../../../../reducers/calendar/calendarActions'
import { setCalendarApi, clearEvent } from '../../../../reducers/virtualEvent/virtualEventActions'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_TYPE
	selectedDate: string
	setCollapsed: (view: CALENDAR_EVENT_TYPE | undefined) => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	handleDeleteEvent: () => any
	newEventData?: INewCalendarEvent | null
	eventId?: string | null
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	calendarApi?: CalendarApi
}

const SiderEventManagement: FC<Props> = (props) => {
	const { setCollapsed, handleSubmitReservation, handleSubmitEvent, salonID, sidebarView, handleDeleteEvent, eventId, eventsViewType, newEventData, calendarApi } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [query, setQuery] = useQueryParams({
		sidebarView: StringParam,
		eventId: StringParam,
		date: StringParam
	})

	const breakFormValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_EMPLOYEE_BREAK_FORM)(state))
	const timeOffFormValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM)(state))
	const shiftFormValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_EMPLOYEE_SHIFT_FORM)(state))
	const reservationFormValues: Partial<ICalendarReservationForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_RESERVATION_FORM)(state))

	useEffect(() => {
		// initVirtualHandler(dispatch, calendarApi)
		setCalendarApi(calendarApi)

		return () => {
			// initVirtualHandler(dispatch)
			setCalendarApi()
		}
	}, [calendarApi])

	const initUpdateEventForm = async () => {
		try {
			const { data } = await dispatch(getCalendarEventDetail(salonID, query.eventId as string))

			if (!data) {
				// NOTE: ak by bolo zle ID (zmazane alebo nenajdene) tak zatvorit drawer + zmaz eventId
				setCollapsed(undefined)
				return
			}

			const repeatOptions: Pick<ICalendarEventForm, 'recurring' | 'repeatOn' | 'every' | 'end'> = data.calendarBulkEvent?.repeatOptions
				? {
						recurring: true,
						repeatOn: compact(map(data.calendarBulkEvent.repeatOptions?.days as any, (item, index) => (item ? index : undefined))) as DAY[],
						every: data.calendarBulkEvent.repeatOptions.week === 1 ? EVERY_REPEAT.ONE_WEEK : EVERY_REPEAT.TWO_WEEKS,
						end: computeEndDate(data?.start.date, data?.calendarBulkEvent?.repeatOptions.untilDate)
				  }
				: {}

			const initData: ICalendarEventForm = {
				eventId: data.id,
				date: data.start.date,
				timeFrom: data.start.time,
				timeTo: data.end.time,
				note: data.note,
				eventType: data.eventType as CALENDAR_EVENT_TYPE,
				calendarBulkEventID: data.calendarBulkEvent?.id,
				allDay: data.start.time === CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT.startTime && data.end.time === CALENDAR_COMMON_SETTINGS.EVENT_CONSTRAINT.endTime,
				employee: {
					value: data.employee.id,
					key: data.employee.id,
					label: getAssignedUserLabel({
						id: data.employee.id as string,
						firstName: data.employee.firstName,
						lastName: data.employee.lastName,
						email: data.employee.email
					})
				},
				...repeatOptions
			}

			switch (data.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
					dispatch(initialize(FORM.CALENDAR_EMPLOYEE_SHIFT_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
					dispatch(initialize(FORM.CALENDAR_EMPLOYEE_TIME_OFF_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					dispatch(initialize(FORM.CALENDAR_EMPLOYEE_BREAK_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.RESERVATION:
					dispatch(
						initialize(FORM.CALENDAR_RESERVATION_FORM, {
							...initData,
							service: {
								id: data?.service?.id,
								key: data?.service?.id,
								value: data?.service?.name
							},
							customer: {
								value: data?.customer?.id,
								key: data?.customer?.id,
								label: getAssignedUserLabel({
									id: data?.customer?.id as string,
									firstName: data?.customer?.firstName,
									lastName: data?.customer?.lastName,
									email: data?.customer?.email
								})
							}
						})
					)
					break
				default:
					break
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	useEffect(() => {
		// init pre UPDATE form ak eventId existuje
		if (query.eventId) {
			initUpdateEventForm()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.eventId, query.sidebarView])

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
		const initData: Partial<ICalendarEventForm> = {
			date: newEventData?.date || query.date || dayjs().format(DEFAULT_DATE_INIT_FORMAT),
			timeFrom: newEventData?.timeFrom ?? dayjs().format(DEFAULT_TIME_FORMAT),
			timeTo: newEventData?.timeTo,
			employee: newEventData?.employee,
			eventId: query.eventId,
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
						<Permissions
							allowed={DELETE_EVENT_PERMISSIONS}
							render={(hasPermission, { openForbiddenModal }) => (
								<DeleteButton
									placement={'bottom'}
									entityName={t('loc:prestávku')}
									className={'bg-transparent mr-4'}
									onConfirm={() => {
										if (hasPermission) {
											handleDeleteEvent()
										} else {
											openForbiddenModal()
										}
									}}
									onlyIcon
									smallIcon
									size={'small'}
								/>
							)}
						/>
					)}
					<Button
						className='button-transparent'
						onClick={() => {
							setCollapsed(undefined)
							dispatch(clearEvent())
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
