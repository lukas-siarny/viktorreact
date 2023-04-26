import React, { useEffect, useImperativeHandle, useMemo } from 'react'
import Sider from 'antd/lib/layout/Sider'
import { compact, map } from 'lodash'
import cx from 'classnames'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import { change, initialize } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { CalendarApi } from '@fullcalendar/react'

// types
import { ICalendarEmployeesPayload, INewCalendarEvent } from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'

// schema
import { /* ICalendarImportedReservationForm, */ ICalendarReservationForm } from '../../../../schemas/reservation'
import { ICalendarEventForm } from '../../../../schemas/event'

// utils
import { getAssignedUserLabel, getDateTime } from '../../../../utils/helper'
import {
	CALENDAR_COMMON_SETTINGS,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	DAY,
	DELETE_EVENT_PERMISSIONS,
	EVENT_NAMES,
	EVERY_REPEAT,
	FORM,
	STRINGS,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT,
	CALENDAR_VIEW
} from '../../../../utils/enums'
import Permissions from '../../../../utils/Permissions'

// redux
import { getCalendarEventDetail } from '../../../../reducers/calendar/calendarActions'
import { clearEvent, setCalendarApi, setCalendarDateHandler } from '../../../../reducers/virtualEvent/virtualEventActions'

// components
import ReservationForm from '../forms/ReservationForm'
import EventForm from '../forms/EventForm'
// import ImportedReservationForm from '../forms/ImportedReservationForm'
import DeleteButton from '../../../../components/DeleteButton'
import TabsComponent from '../../../../components/TabsComponent'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { IUseQueryParams } from '../../../../hooks/useQueryParams'
import { initLabelInValueSelect } from '../../../../atoms/SelectField'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_TYPE
	selectedDate: string
	onCloseSider: () => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
	// handleSubmitImportedReservation: (values: ICalendarImportedReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	handleDeleteEvent: (calendarEventId: string, calendarEventBulkId?: string, eventType?: CALENDAR_EVENT_TYPE) => any
	eventId?: string | null
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	calendarApi?: CalendarApi
	changeCalendarDate: (newDate: string) => void
	phonePrefix?: string
	loadingData?: boolean
	query: IUseQueryParams
	setQuery: (newValues: IUseQueryParams) => void
	employeesLoading: boolean
	calendarEmployees: ICalendarEmployeesPayload
	scrollToTime: (hour: number) => void
	initOnDemand?: boolean
}

export type SiderEventManagementRefs = {
	initCreateEventForm: (eventType: CALENDAR_EVENT_TYPE, newEventData?: INewCalendarEvent) => void
}

const SiderEventManagement = React.forwardRef<SiderEventManagementRefs, Props>((props, ref) => {
	const {
		onCloseSider,
		handleSubmitReservation,
		handleSubmitEvent,
		// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
		// handleSubmitImportedReservation,
		salonID,
		sidebarView,
		handleDeleteEvent,
		eventId,
		eventsViewType,
		calendarApi,
		changeCalendarDate,
		phonePrefix,
		loadingData,
		query,
		setQuery,
		employeesLoading,
		calendarEmployees,
		scrollToTime,
		initOnDemand
	} = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)
	const virtualEvent = useSelector((state: RootState) => state.virtualEvent.virtualEvent.data)
	const employeesOptions = useMemo(
		() =>
			calendarEmployees.options.map((option) => ({
				...option,
				disabled: option.extra?.employeeData.isDeleted
			})),
		[calendarEmployees.options]
	)

	useEffect(() => {
		// nastavuje referenciu na CalendarApi, musi sa update-ovat, ked sa meni View, aby bola aktualna vo virtalEventActions
		setCalendarApi(calendarApi)
		// handler pre prepnutie datumu
		setCalendarDateHandler(changeCalendarDate)

		return () => {
			setCalendarApi()
		}
	}, [calendarApi, changeCalendarDate])

	const initCreateEventForm = (eventType: CALENDAR_EVENT_TYPE, newEventData?: INewCalendarEvent) => {
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
			eventType
		}

		if (eventType === CALENDAR_EVENT_TYPE.RESERVATION) {
			dispatch(initialize(FORM.CALENDAR_RESERVATION_FORM, initData))
		} else {
			// CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT || CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK || CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF
			dispatch(initialize(FORM.CALENDAR_EVENT_FORM, initData))
		}
	}

	const initUpdateEventForm = async () => {
		try {
			const { data } = await dispatch(getCalendarEventDetail(salonID, query.eventId as string))
			// pouzijeme zamestnanca z calendarEvents
			const employee = employeesOptions.find((option) => option.value === data?.employee.id)

			if (!data || !employee) {
				return
			}

			// NOTE: event type v query parametroch musi sediet s event typom zobrazeneho detailu, inak sa zobrazi zly formular
			if (data.id === query.eventId && data.eventType !== query.sidebarView) {
				onCloseSider()
				return
			}

			if (!initOnDemand) {
				// Nascroluje na cas a zamestnanca (vyuziva sa v pripade, ze sa otvara detial po skopirovani URLcky)
				scrollToTime(dayjs(getDateTime(data.start.date, data.start.time)).hour())
				if (query.view === CALENDAR_VIEW.DAY) {
					const employeeColumn = document.querySelector(`[data-resource-id="${data.employee.id}"]`)
					const employeeOffset = (employeeColumn as HTMLElement)?.offsetLeft

					if (employeeOffset) {
						const table = document.querySelector('.fc-timegrid > .fc-scrollgrid')
						const theadScrollers = table?.querySelectorAll('.fc-scrollgrid-section-header .fc-scroller')
						const tbodyScrollers = table?.querySelectorAll('.fc-scrollgrid-section-body .fc-scroller')
						const tfootScrollers = table?.querySelectorAll('.fc-scrollgrid-section-footer .fc-scroller')

						if (theadScrollers?.length && tbodyScrollers?.length && tfootScrollers?.length) {
							const headerSroller = theadScrollers[theadScrollers.length - 1]
							const bodyScroller = tbodyScrollers[tbodyScrollers.length - 1]
							const footerSroller = tfootScrollers[tfootScrollers.length - 1]
							headerSroller.scrollLeft = employeeOffset
							bodyScroller.scrollLeft = employeeOffset
							footerSroller.scrollLeft = employeeOffset
						}
					}
				}
			}

			const repeatOptions: Pick<ICalendarEventForm, 'recurring' | 'repeatOn' | 'every' | 'end'> | {} = data.calendarBulkEvent?.repeatOptions
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
				employee,
				...repeatOptions
			}

			switch (data.eventType) {
				case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
				case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
				case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
					dispatch(initialize(FORM.CALENDAR_EVENT_FORM, initData))
					break
				case CALENDAR_EVENT_TYPE.RESERVATION:
					/**
					 * okrem dát, s ktorými sa manipuluje priamo vo formulári, je potrebné vyinicializovať aj všetky potrebné data pre správne zobrazenie virtuálneho eventu v kalendári
					 * zatiaľ sú to reservationData a service icon
					 */
					dispatch(
						initialize(FORM.CALENDAR_RESERVATION_FORM, {
							...initData,
							service: data?.service
								? initLabelInValueSelect({
										key: data.service.id,
										value: data.service.id,
										label: data.service.name || data.service.id,
										extra: {
											serviceData: data?.service
										}
								  })
								: undefined,
							customer: data?.customer
								? initLabelInValueSelect({
										key: data.customer.id,
										value: data.customer.id,
										label: getAssignedUserLabel({
											id: data.customer.id,
											firstName: data.customer.firstName,
											lastName: data.customer.lastName,
											email: data?.customer?.email
										}),
										extra: {
											serviceData: data.customer
										}
								  })
								: undefined,
							noteFromB2CCustomer: data?.noteFromB2CCustomer,
							reservationData: data?.reservationData
						})
					)
					break
				// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
				/* case CALENDAR_EVENT_TYPE.RESERVATION_FROM_IMPORT:
					dispatch(
						initialize(FORM.CALENDAR_RESERVATION_FROM_IMPORT_FORM, {
							eventId: data.id,
							date: data.start.date,
							timeFrom: data.start.time,
							timeTo: data.end.time,
							note: data.note,
							eventType: CALENDAR_EVENT_TYPE.RESERVATION_FROM_IMPORT,
							employee: initData.employee,
							isImported: true
						})
					)
					break */
				default:
					break
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	useEffect(() => {
		// ak je otvoreny sidebar a nemam eventID, tak initneme formular pre vytvorenie
		if (query.sidebarView && !query.eventId) {
			// Po refreshi tabu je potrebne premazat virtualny event
			if (virtualEvent) {
				dispatch(clearEvent())
			}
			initCreateEventForm(query.sidebarView as CALENDAR_EVENT_TYPE)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// ak je otvoreny sidebar a mame eventID, tak znamena, ze pozerame detail existujuceho eventu
		if (query.sidebarView && query.eventId && !employeesLoading && employeesOptions.length) {
			initUpdateEventForm()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query.eventId, query.sidebarView, employeesLoading, employeesOptions.length])

	useImperativeHandle(ref, () => ({
		initCreateEventForm
	}))

	const getCalendarForm = () => {
		switch (sidebarView) {
			case CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT:
			case CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF:
			case CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK:
				return (
					<EventForm
						employeesOptions={employeesOptions}
						eventId={eventId}
						onSubmit={handleSubmitEvent}
						sidebarView={query.sidebarView as CALENDAR_EVENT_TYPE}
						loadingData={loadingData}
						employeesLoading={employeesLoading}
					/>
				)
			// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
			/* case CALENDAR_EVENT_TYPE.RESERVATION_FROM_IMPORT:
				return <ImportedReservationForm eventId={eventId} onSubmit={handleSubmitImportedReservation} loadingData={loadingData} /> */
			case CALENDAR_EVENT_TYPE.RESERVATION:
			default:
				return (
					<ReservationForm
						salonID={salonID}
						eventId={eventId}
						phonePrefix={phonePrefix}
						employeesOptions={employeesOptions}
						onSubmit={handleSubmitReservation}
						loadingData={loadingData}
						sidebarView={query.sidebarView as CALENDAR_EVENT_TYPE}
						employeesLoading={employeesLoading}
					/>
				)
		}
	}

	const showTabs = !(eventId || eventsViewType === CALENDAR_EVENTS_VIEW_TYPE.RESERVATION) && sidebarView
	// NOTE: docasne pozastaveny import eventov, v buducnositi zmena implementacie => nebude existovat virtualny zamestnanec, ale eventy sa naparuju priamo na zamestnancov
	// const sidebarTitle = sidebarView === CALENDAR_EVENT_TYPE.RESERVATION_FROM_IMPORT ? CALENDAR_EVENT_TYPE.RESERVATION : sidebarView
	const sidebarTitle = sidebarView

	return (
		<Sider className={cx('nc-sider-event-management', { 'without-tabs': !showTabs })} collapsed={!sidebarView} width={240} collapsedWidth={0}>
			<div className={'nc-sider-event-management-header justify-between'}>
				<div className={'font-semibold'}>{eventId ? STRINGS(t).edit(EVENT_NAMES(t, sidebarTitle)) : STRINGS(t).createRecord(EVENT_NAMES(t, sidebarTitle))}</div>
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
					className={'nc-sider-event-management-tabs tabs-small'}
					activeKey={sidebarView}
					onChange={(type: string) => {
						setQuery({ ...query, sidebarView: type })
						dispatch(change(FORM.CALENDAR_EVENT_FORM, 'eventType', type))
					}}
					items={[
						{
							key: CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
							label: <>{t('loc:Shift')}</>
						},
						{
							key: CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
							label: <>{t('loc:Voľno')}</>
						},
						{
							key: CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
							label: <>{t('loc:Prestávka')}</>
						}
					]}
					destroyInactiveTabPane
				/>
			)}
			{getCalendarForm()}
		</Sider>
	)
})

export default SiderEventManagement
