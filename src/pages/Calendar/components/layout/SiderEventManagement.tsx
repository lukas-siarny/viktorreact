import React, { FC, useCallback, useEffect } from 'react'
import Sider from 'antd/lib/layout/Sider'
import { map, omit } from 'lodash'
import cx from 'classnames'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { getFormValues, initialize } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { StringParam, useQueryParams } from 'use-query-params'

// enums
import {
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_TIME_FORMAT,
	EVENT_NAMES,
	FORM,
	STRINGS,
	DELETE_EVENT_PERMISSIONS
} from '../../../../utils/enums'

// types
import { ICalendarEventForm, ICalendarReservationForm } from '../../../../types/interfaces'
import { RootState } from '../../../../reducers'

// components
import ReservationForm from '../forms/ReservationForm'
import ShiftForm from '../forms/ShiftForm'
import TimeOffForm from '../forms/TimeOffForm'
import BreakForm from '../forms/BreakForm'
import TabsComponent from '../../../../components/TabsComponent'

// utils
import { getReq } from '../../../../utils/request'
import { formatLongQueryString, getAssignedUserLabel } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'

// components
import DeleteButton from '../../../../components/DeleteButton'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'

// hooks
import useKeyUp from '../../../../hooks/useKeyUp'

type Props = {
	salonID: string
	sidebarView: CALENDAR_EVENT_TYPE
	selectedDate: string
	setCollapsed: (view: CALENDAR_EVENT_TYPE | undefined) => void
	handleSubmitReservation: (values: ICalendarReservationForm) => void
	handleSubmitEvent: (values: ICalendarEventForm) => void
	handleDeleteEvent: () => any
	eventId?: string | null
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
}

const SiderEventManagement: FC<Props> = (props) => {
	const { setCollapsed, handleSubmitReservation, handleSubmitEvent, salonID, sidebarView, handleDeleteEvent, eventId, eventsViewType, selectedDate } = props
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
			date: dayjs(selectedDate).format(DEFAULT_DATE_INIT_FORMAT),
			timeFrom: dayjs().format(DEFAULT_TIME_FORMAT),
			...omit(prevInitData, 'eventType'),
			eventType
		}
		dispatch(initialize(FORM.EVENT_TYPE_FILTER_FORM, { eventType }))
		dispatch(initialize(eventForm, initData))
	}

	// Zmena selectu event type v draweri
	const onChangeEventType = (type: string) => {
		initCreateEventForm(`CALENDAR_${type}_FORM` as FORM, type as CALENDAR_EVENT_TYPE)
	}

	useEffect(() => {
		// zmena sideBar view
		if (sidebarView !== undefined) {
			// initnutie defaultu sidebaru pri nacitani bude COLLAPSED a ak bude existovat typ formu tak sa initne dany FORM (pri skopirovani URL na druhy tab)
			onChangeEventType(sidebarView as CALENDAR_EVENT_TYPE)
		}
	}, [sidebarView])

	const handleCloseSider = () => {
		setCollapsed(undefined)
	}

	useKeyUp('Escape', handleCloseSider)

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

	const forms = {
		[CALENDAR_EVENT_TYPE.RESERVATION]: <ReservationForm salonID={salonID} eventId={eventId} searchEmployes={searchEmployes} onSubmit={handleSubmitReservation} />,
		[CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT]: <ShiftForm searchEmployes={searchEmployes} eventId={eventId} onSubmit={handleSubmitEvent} />,
		[CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF]: <TimeOffForm searchEmployes={searchEmployes} eventId={eventId} onSubmit={handleSubmitEvent} />,
		[CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK]: <BreakForm searchEmployes={searchEmployes} eventId={eventId} onSubmit={handleSubmitEvent} />
	}

	const getTabContent = () => {
		const tabs = {
			[CALENDAR_EVENT_TYPE.RESERVATION]: {
				tabKey: CALENDAR_EVENT_TYPE.RESERVATION,
				tab: <>{t('loc:Rezervácia')}</>,
				tabPaneContent: forms[CALENDAR_EVENT_TYPE.RESERVATION]
			},
			[CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT]: {
				tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT,
				tab: <>{t('loc:Zmena')}</>,
				tabPaneContent: forms[CALENDAR_EVENT_TYPE.EMPLOYEE_SHIFT]
			},
			[CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF]: {
				tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF,
				tab: <>{t('loc:Voľno')}</>,
				tabPaneContent: forms[CALENDAR_EVENT_TYPE.EMPLOYEE_TIME_OFF]
			},
			[CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK]: {
				tabKey: CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK,
				tab: <>{t('loc:Prestávka')}</>,
				tabPaneContent: forms[CALENDAR_EVENT_TYPE.EMPLOYEE_BREAK]
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
					<Button className='button-transparent' onClick={handleCloseSider}>
						<CloseIcon />
					</Button>
				</div>
			</div>
			{eventId ? (
				forms[sidebarView]
			) : (
				<TabsComponent
					className={'nc-sider-event-management-tabs'}
					activeKey={sidebarView}
					onChange={onChangeEventType}
					tabsContent={getTabContent()}
					destroyInactiveTabPane
				/>
			)}
		</Sider>
	)
}

export default SiderEventManagement
