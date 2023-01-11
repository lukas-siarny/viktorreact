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
import { CalendarApi } from '@fullcalendar/react'

// types
import { ICalendarEventForm, ICalendarReservationForm, INewCalendarEvent } from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'

// utils
import { getReq } from '../../../../utils/request'
import { formatLongQueryString, getAssignedUserLabel, initializeLabelInValueSelect } from '../../../../utils/helper'
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	DAY,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT,
	DELETE_EVENT_PERMISSIONS,
	EVENT_NAMES,
	EVERY_REPEAT,
	FORM,
	STRINGS
} from '../../../../utils/enums'
import Permissions from '../../../../utils/Permissions'

// redux
import { getCalendarEventDetail } from '../../../../reducers/calendar/calendarActions'
import { setCalendarApi, setCalendarDateHandler } from '../../../../reducers/virtualEvent/virtualEventActions'

// components
import ReservationForm from '../forms/ReservationForm'
import EventForm from '../forms/EventForm'

import DeleteButton from '../../../../components/DeleteButton'
import TabsComponent from '../../../../components/TabsComponent'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'

// hooks
import useKeyUp from '../../../../hooks/useKeyUp'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_TYPE
	selectedDate: string
	onCloseSider: () => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	handleDeleteEvent: (calendarEventId: string, calendarEventBulkId?: string, eventType?: CALENDAR_EVENT_TYPE) => any
	newEventData?: INewCalendarEvent | null
	eventId?: string | null
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	calendarApi?: CalendarApi
	changeCalendarDate: (newDate: string) => void
	phonePrefix?: string
}

const SiderEventManagement: FC<Props> = (props) => {
	const {
		onCloseSider,
		handleSubmitReservation,
		handleSubmitEvent,
		salonID,
		sidebarView,
		handleDeleteEvent,
		eventId,
		eventsViewType,
		calendarApi,
		newEventData,
		changeCalendarDate,
		phonePrefix
	} = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [query, setQuery] = useQueryParams({
		sidebarView: StringParam,
		eventId: StringParam,
		date: StringParam
	})
	const eventFormValues: Partial<ICalendarEventForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_EVENT_FORM)(state))
	const reservationFormValues: Partial<ICalendarReservationForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_RESERVATION_FORM)(state))

	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)

	useEffect(() => {
		// nastavuje referenciu na CalendarApi, musi sa update-ovat, ked sa meni View, aby bola aktualna vo virtalEventActions
		setCalendarApi(calendarApi)
		// handler pre prepnutie datumu
		setCalendarDateHandler(changeCalendarDate)

		return () => {
			setCalendarApi()
		}
	}, [calendarApi, changeCalendarDate])

	const initUpdateEventForm = async () => {
		try {
			const { data } = await dispatch(getCalendarEventDetail(salonID, query.eventId as string))

			if (!data) {
				// NOTE: ak by bolo zle ID (zmazane alebo nenajdene) tak zatvorit drawer + zmaz eventId
				onCloseSider()
				return
			}

			const repeatOptions: Pick<ICalendarEventForm, 'recurring' | 'repeatOn' | 'every' | 'end'> = data.calendarBulkEvent?.repeatOptions
				? {
						recurring: true,
						repeatOn: compact(map(data.calendarBulkEvent.repeatOptions?.days as any, (item, index) => (item ? index : undefined))) as DAY[],
						every: data.calendarBulkEvent.repeatOptions.week === 1 ? EVERY_REPEAT.ONE_WEEK : EVERY_REPEAT.TWO_WEEKS,
						end: data?.calendarBulkEvent?.repeatOptions.untilDate
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
				employee: initializeLabelInValueSelect(
					data.employee.id,
					getAssignedUserLabel({
						id: data.employee.id as string,
						firstName: data.employee.firstName,
						lastName: data.employee.lastName,
						email: data.employee.email
					}),
					{
						employeeData: data?.employee
					}
				),
				...repeatOptions
			}

			switch (data.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					dispatch(initialize(FORM.CALENDAR_EVENT_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.RESERVATION:
					dispatch(
						initialize(FORM.CALENDAR_RESERVATION_FORM, {
							...initData,
							service: initializeLabelInValueSelect(data?.service?.id as string, data?.service?.name as string, {
								serviceData: data?.service
							}),
							customer: initializeLabelInValueSelect(
								data?.customer?.id as string,
								getAssignedUserLabel({
									id: data?.customer?.id as string,
									firstName: data?.customer?.firstName,
									lastName: data?.customer?.lastName,
									email: data?.customer?.email
								}),
								{
									customerData: data?.customer
								}
							),
							note: data?.note,
							noteFromB2CCustomer: data?.noteFromB2CCustomer,
							reservationData: data?.reservationData
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

	const initCreateEventForm = (eventType: CALENDAR_EVENT_TYPE) => {
		const prevEventType = sidebarView
		// Mergnut predchadzajuce data ktore boli vybrane pred zmenou eventTypu
		let prevInitData: Partial<ICalendarEventForm | ICalendarReservationForm> = {}
		if (prevEventType === CALENDAR_EVENT_TYPE.RESERVATION) {
			prevInitData = reservationFormValues
			// CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT || CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK || CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
		} else {
			prevInitData = eventFormValues
		}
		// Nastavi sa aktualny event Type zo selectu
		setQuery({
			...query,
			sidebarView: eventType
		})

		let timeTo: string | undefined
		if (newEventData?.timeTo) {
			// use 23:59 instead of 00:00 as end of day
			timeTo = newEventData.timeTo === '00:00' ? '23:59' : newEventData.timeTo
		}

		// Initne sa event / reservation formular
		const initData: Partial<ICalendarEventForm | ICalendarReservationForm> = {
			date: newEventData?.date || query.date || dayjs().format(DEFAULT_DATE_INIT_FORMAT),
			timeFrom: newEventData?.timeFrom ?? dayjs().format(DEFAULT_TIME_FORMAT),
			timeTo,
			employee: newEventData?.employee,
			eventId: query.eventId,
			...omit(prevInitData, 'eventType'),
			eventType
		}
		if (eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
			dispatch(initialize(FORM.CALENDAR_RESERVATION_FORM, initData))
		} else {
			// CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT || CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK || CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
			dispatch(initialize(FORM.CALENDAR_EVENT_FORM, initData))
		}
	}

	// Zmena selectu event type v draweri
	const onChangeEventType = (type: string) => {
		initCreateEventForm(type as CALENDAR_EVENT_TYPE)
	}

	useEffect(() => {
		// zmena sideBar view
		if (sidebarView !== undefined) {
			// initnutie defaultu sidebaru pri nacitani bude COLLAPSED a ak bude existovat typ formu tak sa initne dany FORM (pri skopirovani URL na druhy tab)
			onChangeEventType(sidebarView as CALENDAR_EVENT_TYPE)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sidebarView])

	useKeyUp(
		'Escape',
		query.sidebarView
			? () => {
					onCloseSider()
					const highlight = document.getElementsByClassName('fc-highlight')[0]
					if (highlight) highlight.remove()
			  }
			: undefined
	)

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

	const getCalendarForm = () => {
		switch (sidebarView) {
			case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
			case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
			case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
				return <EventForm searchEmployes={searchEmployes} eventId={eventId} onSubmit={handleSubmitEvent} />
			case CALENDAR_EVENT_TYPE.RESERVATION:
			default:
				return <ReservationForm salonID={salonID} eventId={eventId} phonePrefix={phonePrefix} searchEmployes={searchEmployes} onSubmit={handleSubmitReservation} />
		}
	}

	const getTabContent = () => {
		const tabs = {
			[CALENDAR_EVENT_TYPE.RESERVATION]: {
				tabKey: CALENDAR_EVENT_TYPE.RESERVATION,
				tab: <>{t('loc:Rezervácia')}</>,
				tabPaneContent: null
			},
			[CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT]: {
				tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				tab: <>{t('loc:Shift')}</>,
				tabPaneContent: null
			},
			[CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF]: {
				tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				tab: <>{t('loc:Voľno')}</>,
				tabPaneContent: null
			},
			[CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK]: {
				tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				tab: <>{t('loc:Prestávka')}</>,
				tabPaneContent: null
			}
		}

		if (eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) {
			return [tabs[CALENDAR_EVENT_TYPE.RESERVATION], tabs[CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK]]
		}

		return [tabs[CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT], tabs[CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF], tabs[CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK]]
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
									noConfirm
									onClick={() => {
										if (hasPermission) {
											if (eventDetail.data?.id) {
												handleDeleteEvent(
													eventDetail.data?.id,
													eventDetail.data?.calendarBulkEvent?.id,
													eventDetail?.data?.eventType as CALENDAR_EVENT_TYPE
												)
											}
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
					<Button className='button-transparent' onClick={onCloseSider}>
						<CloseIcon />
					</Button>
				</div>
			</div>
			{!eventId && (
				<TabsComponent
					className={'nc-sider-event-management-tabs'}
					activeKey={sidebarView}
					onChange={onChangeEventType}
					tabsContent={getTabContent()}
					destroyInactiveTabPane
				/>
			)}
			{getCalendarForm()}
		</Sider>
	)
}

export default SiderEventManagement