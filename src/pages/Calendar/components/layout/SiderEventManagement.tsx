import React, { FC, useCallback, useEffect } from 'react'
import Sider from 'antd/lib/layout/Sider'
import { compact, map } from 'lodash'
import cx from 'classnames'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { initialize } from 'redux-form'
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
	eventId?: string | null
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	calendarApi?: CalendarApi
	changeCalendarDate: (newDate: string) => void
	phonePrefix?: string
	initCreateEventForm: (eventType: CALENDAR_EVENT_TYPE, newEventData?: INewCalendarEvent, forceDestroy?: boolean) => void
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
		changeCalendarDate,
		phonePrefix,
		initCreateEventForm
	} = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const [query] = useQueryParams({
		sidebarView: StringParam,
		eventId: StringParam,
		date: StringParam
	})

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
					})
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
							service: initializeLabelInValueSelect(data?.service?.id as string, data?.service?.name as string),
							customer: initializeLabelInValueSelect(
								data?.customer?.id as string,
								getAssignedUserLabel({
									id: data?.customer?.id as string,
									firstName: data?.customer?.firstName,
									lastName: data?.customer?.lastName,
									email: data?.customer?.email
								})
							)
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

	useEffect(() => {
		// zmena sideBar view
		if (sidebarView !== undefined) {
			// initnutie defaultu sidebaru pri nacitani bude COLLAPSED a ak bude existovat typ formu tak sa initne dany FORM (pri skopirovani URL na druhy tab)
			initCreateEventForm(sidebarView as CALENDAR_EVENT_TYPE)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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

	const showTabs = !(eventId || eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION)

	return (
		<Sider className={cx('nc-sider-event-management', { 'without-tabs': !showTabs })} collapsed={!sidebarView} width={240} collapsedWidth={0}>
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
			{showTabs && (
				<TabsComponent
					className={'nc-sider-event-management-tabs'}
					activeKey={sidebarView}
					onChange={(type: string) => initCreateEventForm(type as CALENDAR_EVENT_TYPE)}
					tabsContent={[
						{
							tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
							tab: <>{t('loc:Shift')}</>,
							tabPaneContent: null
						},
						{
							tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
							tab: <>{t('loc:Voľno')}</>,
							tabPaneContent: null
						},
						{
							tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
							tab: <>{t('loc:Prestávka')}</>,
							tabPaneContent: null
						}
					]}
					destroyInactiveTabPane
				/>
			)}
			{getCalendarForm()}
		</Sider>
	)
}

export default SiderEventManagement
