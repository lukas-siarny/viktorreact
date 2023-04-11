import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Tooltip } from 'antd'
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
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_VIEW,
	DASHBOARD_TASB_KEYS,
	DEFAULT_DATE_INIT_FORMAT,
	DEFAULT_DATE_INPUT_FORMAT,
	FORM,
	PERMISSION,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_STATE,
	RESERVATIONS_STATE,
	ROW_GUTTER_X_DEFAULT
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { formatObjToQuery, getAssignedUserLabel, normalizeDirectionKeys, translateReservationPaymentMethod, translateReservationState } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { Columns, IBreadcrumbs, IReservationsFilter, SalonSubPageProps } from '../../types/interfaces'
import { getPaginatedReservations } from '../../reducers/calendar/calendarActions'

// hooks
import useQueryParams, { ArrayParam, NumberParam, StringParam } from '../../hooks/useQueryParams'
import TabsComponent from '../../components/TabsComponent'

type Props = SalonSubPageProps

const ReservationsPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const reservations = useSelector((state: RootState) => state.calendar.paginatedReservations)
	const navigate = useNavigate()
	const getPath = useCallback((pathSuffix: string) => `${parentPath}${pathSuffix}`, [parentPath])

	const [query, setQuery] = useQueryParams({
		dateFrom: StringParam(dayjs().format(DEFAULT_DATE_INIT_FORMAT)),
		employeeIDs: ArrayParam(),
		categoryIDs: ArrayParam(),
		reservationStates: ArrayParam([RESERVATION_STATE.PENDING]),
		reservationCreateSourceType: StringParam(),
		state: StringParam(RESERVATIONS_STATE.PENDING),
		reservationPaymentMethods: ArrayParam(),
		limit: NumberParam(),
		page: NumberParam(1)
	})

	useEffect(() => {
		// NOTE: viac ako 3 mesiace
		dispatch(
			initialize(FORM.RESERVATIONS_FILTER, {
				reservationStates: query.reservationStates,
				employeeIDs: query.employeeIDs,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				dateFrom: query.dateFrom,
				categoryIDs: query.categoryIDs
			})
		)
		dispatch(
			getPaginatedReservations({
				salonID,
				dateFrom: query.dateFrom,
				reservationStates: query.reservationStates,
				employeeIDs: query.employeeIDs,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				categoryIDs: query.categoryIDs,
				page: query.page,
				order: 'startDate:ASC',
				limit: query.limit
			})
		)
	}, [
		dispatch,
		query.categoryIDs,
		query.dateFrom,
		query.employeeIDs,
		query.limit,
		query.page,
		query.reservationCreateSourceType,
		query.reservationPaymentMethods,
		query.reservationStates,
		salonID
	])

	useEffect(() => {
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

	const columns: Columns = [
		{
			title: t('loc:Dátum'),
			dataIndex: 'startDate',
			key: 'startDate',
			ellipsis: true,
			width: '10%'
		},
		{
			title: t('loc:Trvanie'),
			dataIndex: 'time',
			key: 'time',
			ellipsis: true,
			width: '15%'
		},
		{
			title: t('loc:Vytvoril'),
			dataIndex: 'createSourceType',
			key: 'createSourceType',
			ellipsis: true,
			width: '10%'
		},
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
			title: t('loc:Zákazník'),
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
			title: t('loc:Dátum vytvorenia'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			width: '20%'
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam rezervácií')
			}
		]
	}
	const onTabChange = (value: any) => {
		// NOTE: ak su vsetky tak premaz filter reservationStates ktory je by default na RESERVATION_STATE.PENDING
		if (value === RESERVATIONS_STATE.ALL) {
			setQuery({
				...query,
				state: value,
				reservationStates: []
			})
		} else {
			setQuery({
				...query,
				state: value,
				reservationStates: [RESERVATION_STATE.PENDING]
			})
		}
	}

	const pendingCount = 16
	const table = (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<ReservationsFilter state={query.state} onSubmit={handleSubmit} />
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
	const count: any = `(${15})`
	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent
				className={'box-tab'}
				activeKey={query.state || RESERVATIONS_STATE.PENDING}
				onChange={onTabChange}
				items={[
					{
						key: RESERVATIONS_STATE.PENDING,
						label: t('loc:Čakajúce na schválenie {{ count }}', { count }),
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
