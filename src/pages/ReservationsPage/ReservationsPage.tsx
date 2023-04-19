import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row, Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import dayjs from 'dayjs'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useNavigate } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import UserAvatar from '../../components/AvatarComponents'
import ReservationsFilter from './components/ReservationsFilter'

// utils
import {
	ADMIN_PERMISSIONS,
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_VIEW,
	DEFAULT_DATE_INPUT_FORMAT,
	FORM,
	NOTIFICATION_TYPE,
	PERMISSION,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_STATE,
	RESERVATIONS_STATE,
	ROW_GUTTER_X_DEFAULT
} from '../../utils/enums'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { formatObjToQuery, formFieldID, getAssignedUserLabel, normalizeDirectionKeys, translateReservationPaymentMethod, translateReservationState } from '../../utils/helper'
import { patchReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { Columns, IBreadcrumbs, IReservationsFilter, SalonSubPageProps } from '../../types/interfaces'
import { getPaginatedReservations, getPendingReservationsCount } from '../../reducers/calendar/calendarActions'

// hooks
import useQueryParams, { ArrayParam, NumberParam, StringParam } from '../../hooks/useQueryParams'
import TabsComponent from '../../components/TabsComponent'

const APPROVE_RESERVATION_PERMISSIONS = [PERMISSION.CALENDAR_EVENT_UPDATE, PERMISSION.PARTNER_ADMIN]

type Props = SalonSubPageProps

const ReservationsPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const reservations = useSelector((state: RootState) => state.calendar.paginatedReservations)
	const pendingReservationsCount = useSelector((state: RootState) => state.calendar.pendingReservationsCount.count)
	const navigate = useNavigate()
	const getPath = useCallback((pathSuffix: string) => `${parentPath}${pathSuffix}`, [parentPath])
	const count = pendingReservationsCount > 0 ? `(${pendingReservationsCount})` : ''
	const [approvingReservation, setApprovingReservation] = useState(false)

	const [query, setQuery] = useQueryParams({
		dateFrom: StringParam(),
		dateTo: StringParam(),
		createdAtFrom: StringParam(),
		createdAtTo: StringParam(),
		employeeIDs: ArrayParam(),
		categoryIDs: ArrayParam(),
		reservationStates: ArrayParam(),
		reservationCreateSourceType: StringParam(),
		state: StringParam(RESERVATIONS_STATE.ALL),
		reservationPaymentMethods: ArrayParam(),
		limit: NumberParam(),
		page: NumberParam(1)
	})
	const fetchData = useCallback(() => {
		dispatch(
			getPaginatedReservations({
				salonID,
				dateFrom: query.dateFrom,
				dateTo: query.dateTo,
				createdAtFrom: query.createdAtFrom,
				createdAtTo: query.createdAtTo,
				reservationStates: query.reservationStates,
				employeeIDs: query.employeeIDs,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				categoryIDs: query.categoryIDs,
				page: query.page,
				limit: query.limit
			})
		)
	}, [
		dispatch,
		query.categoryIDs,
		query.createdAtFrom,
		query.createdAtTo,
		query.dateFrom,
		query.dateTo,
		query.employeeIDs,
		query.limit,
		query.page,
		query.reservationCreateSourceType,
		query.reservationPaymentMethods,
		query.reservationStates,
		salonID
	])

	useEffect(() => {
		dispatch(
			initialize(FORM.RESERVATIONS_FILTER, {
				reservationStates: query.reservationStates,
				employeeIDs: query.employeeIDs,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				dateFrom: query.dateFrom,
				dateTo: query.dateTo,
				createdAtFrom: query.createdAtFrom,
				createdAtTo: query.createdAtTo,
				categoryIDs: query.categoryIDs
			})
		)
		fetchData()
	}, [
		dispatch,
		fetchData,
		query.categoryIDs,
		query.createdAtFrom,
		query.createdAtTo,
		query.dateFrom,
		query.dateTo,
		query.employeeIDs,
		query.limit,
		query.page,
		query.reservationCreateSourceType,
		query.reservationPaymentMethods,
		query.reservationStates,
		salonID
	])

	useEffect(() => {
		dispatch(getPendingReservationsCount(salonID))
		dispatch(getServices({ salonID }))
	}, [salonID, dispatch])

	const handleSubmit = (values: IReservationsFilter) => {
		const newQuery = {
			...query,
			...values
		}
		setQuery(newQuery)
	}
	const onChangeTable = (pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...query,
				limit: pagination.pageSize,
				page: pagination.current,
				order
			}
			setQuery(newQuery)
		}
	}

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page
		}
		setQuery(newQuery)
	}
	const onApproveReservation = async (calendarEventID: string) => {
		try {
			setApprovingReservation(true)
			await patchReq(
				'/api/b2b/admin/salons/{salonID}/calendar-events/reservations/{calendarEventID}/state',
				{ calendarEventID, salonID },
				{ state: RESERVATION_STATE.APPROVED },
				undefined,
				NOTIFICATION_TYPE.NOTIFICATION,
				true
			)
			fetchData()
			dispatch(getPendingReservationsCount(salonID))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
		setApprovingReservation(false)
	}
	const columns: Columns = [
		{
			title: t('loc:Dátum vytvorenia'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			width: '15%'
		},
		{
			title: t('loc:Dátum rezervácie'),
			dataIndex: 'startDate',
			key: 'startDate',
			ellipsis: true,
			width: '15%'
		},
		{
			title: t('loc:Čas rezervácie'),
			dataIndex: 'time',
			key: 'time',
			ellipsis: true,
			width: '15%'
		},
		{
			title: t('loc:Klient'),
			dataIndex: 'customer',
			key: 'customer',
			ellipsis: true,
			width: '25%',
			render: (value) => {
				return (
					<>
						<UserAvatar className='mr-2-5 w-7 h-7' src={value?.profileImage?.resizedImages?.thumbnail} fallBackSrc={value?.profileImage?.original} />
						{getAssignedUserLabel(value)}
					</>
				)
			}
		},
		{
			title: t('loc:Služba'),
			dataIndex: 'service',
			key: 'service',
			ellipsis: true,
			width: '25%',
			render: (value) => {
				return (
					<>
						<UserAvatar className='mr-2-5 w-7 h-7' src={value?.icon?.resizedImages?.thumbnail} fallBackSrc={value?.icon?.original} />
						{value?.name}
					</>
				)
			}
		},
		{
			title: t('loc:Zamestnanec'),
			dataIndex: 'employee',
			key: 'employee',
			ellipsis: true,
			width: '25%',
			render: (value) => {
				return (
					<div className={'flex items-center'}>
						<UserAvatar
							style={value.deletedAt && { filter: 'grayscale(100)' }}
							className='mr-2-5 w-7 h-7'
							src={value?.image?.resizedImages?.thumbnail}
							fallBackSrc={value?.image?.original}
						/>
						{value.deletedAt ? (
							<Tooltip title={t('loc:Priradený kolega je vymazaný zo salónu')}>
								<div className={'text-trueGray-400'}>{getAssignedUserLabel(value)}</div>
							</Tooltip>
						) : (
							getAssignedUserLabel(value)
						)}
					</div>
				)
			}
		},
		{
			title: t('loc:Vytvoril'),
			dataIndex: 'createSourceType',
			key: 'createSourceType',
			ellipsis: true,
			width: '10%'
		}
	]

	if (query.state === RESERVATIONS_STATE.ALL) {
		columns.push(
			{
				title: t('loc:Stav'),
				dataIndex: 'state',
				key: 'state',
				ellipsis: true,
				width: '15%',
				render: (value) => {
					return (
						<div className={'flex items-center'}>
							<div className={'mr-2 flex items-center w-4 h-4'}>{translateReservationState(value as RESERVATION_STATE).icon}</div>
							<div className={'truncate'}>{translateReservationState(value as RESERVATION_STATE).text}</div>
						</div>
					)
				}
			},
			{
				title: t('loc:Spôsob úhrady'),
				dataIndex: 'paymentMethod',
				key: 'paymentMethod',
				ellipsis: true,
				width: '10%',
				render: (value) => {
					return value ? (
						<div className={'flex items-center'}>
							<div className={'mr-2 flex items-center w-4 h-4'}>{translateReservationPaymentMethod(value as RESERVATION_PAYMENT_METHOD).icon}</div>
							<div className={'truncate'}>{translateReservationPaymentMethod(value as RESERVATION_PAYMENT_METHOD).text}</div>
						</div>
					) : (
						'-'
					)
				}
			}
		)
	}

	if (query.state === RESERVATIONS_STATE.PENDING) {
		columns.push({
			key: 'actions',
			ellipsis: true,
			fixed: 'right',
			className: 'text-right',
			width: 150,
			render: (value, record) => {
				return (
					<Permissions
						allowed={[...ADMIN_PERMISSIONS, ...APPROVE_RESERVATION_PERMISSIONS]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								type={'primary'}
								htmlType={'button'}
								size={'middle'}
								className={'noti-btn h-8 w-32 hover:shadow-none'}
								disabled={approvingReservation}
								onClick={(e) => {
									if (!hasPermission) {
										openForbiddenModal()
									} else {
										e.stopPropagation()
										onApproveReservation(record.id)
									}
								}}
								id={formFieldID('accept_btn', record.id)}
							>
								{t('loc:Potvrdiť')}
							</Button>
						)}
					/>
				)
			}
		})
	}
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam rezervácií')
			}
		]
	}
	const onTabChange = (value: any) => {
		// NOTE: ak su vsetky tak premaz filter reservationStates ktory je by default na RESERVATION_STATE.PENDING + zmaze aktualne query (nerobi sa ...query!!!)
		if (value === RESERVATIONS_STATE.ALL) {
			setQuery({
				state: value,
				reservationStates: []
			})
		} else {
			setQuery({
				state: value,
				reservationStates: [RESERVATION_STATE.PENDING]
			})
		}
	}

	const table = (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<ReservationsFilter reservationState={query.state} onSubmit={handleSubmit} />
					<CustomTable
						className='table-fixed'
						columns={columns}
						onChange={onChangeTable}
						loading={reservations?.isLoading}
						dataSource={reservations?.tableData}
						rowClassName={'clickable-row'}
						onRow={(record) => ({
							onClick: () => {
								const redirectQuery = {
									view: CALENDAR_VIEW.DAY,
									date: dayjs(record.startDate, DEFAULT_DATE_INPUT_FORMAT).format(CALENDAR_DATE_FORMAT.QUERY),
									eventsViewType: CALENDAR_EVENT_TYPE.RESERVATION,
									sidebarView: CALENDAR_EVENTS_VIEW_TYPE.RESERVATION,
									eventId: record.key
								}
								navigate({
									pathname: getPath(t('paths:calendar')),
									search: formatObjToQuery(redirectQuery)
								})
							}
						})}
						twoToneRows
						scroll={{ x: 1200 }}
						useCustomPagination
						pagination={{
							pageSize: reservations.data?.pagination.limit,
							total: reservations.data?.pagination.totalCount,
							current: reservations.data?.pagination.page,
							onChange: onChangePagination,
							disabled: reservations.isLoading
						}}
					/>
				</div>
			</Col>
		</Row>
	)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent
				className={'box-tab'}
				activeKey={query.state || RESERVATIONS_STATE.ALL}
				onChange={onTabChange}
				items={[
					{
						key: RESERVATIONS_STATE.PENDING,
						label: t('loc:Čakajúce na schválenie {{ pendingReservationsCount }}', { pendingReservationsCount: count }),
						children: table
					},
					{
						key: RESERVATIONS_STATE.ALL,
						label: t('loc:Všetky'),
						children: table
					}
				]}
			/>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ReservationsPage)
