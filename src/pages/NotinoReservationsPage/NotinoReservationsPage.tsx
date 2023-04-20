import React, { useEffect } from 'react'
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
import NotinoReservationsFilter from './components/NotinoReservationsFilter'

// utils
import {
	CALENDAR_DATE_FORMAT,
	CALENDAR_EVENT_TYPE,
	CALENDAR_EVENTS_VIEW_TYPE,
	CALENDAR_VIEW,
	DEFAULT_DATE_INPUT_FORMAT,
	FORM,
	PERMISSION,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_STATE,
	ROW_GUTTER_X_DEFAULT
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { getAssignedUserLabel, normalizeDirectionKeys, translateReservationPaymentMethod, translateReservationState } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'
import { getNotinoReservations } from '../../reducers/calendar/calendarActions'

// types
import { Columns, IBreadcrumbs, INotinoReservationsFilter } from '../../types/interfaces'

// hooks
import useQueryParams, { formatObjToQuery } from '../../hooks/useQueryParamsZod'

// schema
import { notinoReservationsQueryParamsSchema } from '../../schemas/queryParams'

// schema
import { formatObjToQuery } from '../../hooks/useQueryParamsZod'

const NotinoReservationsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const notinoReservations = useSelector((state: RootState) => state.calendar.notinoReservations)
	const navigate = useNavigate()
	const selectedCountry = useSelector((state: RootState) => state.selectedCountry.selectedCountry)

	const [query, setQuery] = useQueryParams(notinoReservationsQueryParamsSchema, {
		page: 1
	})

	useEffect(() => {
		dispatch(
			initialize(FORM.NOTINO_RESERVATIONS_FILTER, {
				dateFrom: query.dateFrom,
				dateTo: query.dateTo,
				createdAtFrom: query.createdAtFrom,
				createdAtTo: query.createdAtTo,
				reservationStates: query.reservationStates,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				search: query.search,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				countryCode: query.countryCode || selectedCountry
			})
		)
		dispatch(
			getNotinoReservations({
				dateFrom: query.dateFrom,
				dateTo: query.dateTo,
				createdAtFrom: query.createdAtFrom,
				createdAtTo: query.createdAtTo,
				reservationStates: query.reservationStates,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				categoryFirstLevelIDs: query.categoryFirstLevelIDs,
				countryCode: query.countryCode || selectedCountry,
				page: query.page,
				order: 'startDate:ASC',
				limit: query.limit,
				search: query.search
			})
		)
	}, [
		dispatch,
		query.categoryFirstLevelIDs,
		query.countryCode,
		query.createdAtFrom,
		query.createdAtTo,
		query.dateFrom,
		query.dateTo,
		query.limit,
		query.page,
		query.reservationCreateSourceType,
		query.reservationPaymentMethods,
		query.reservationStates,
		query.search,
		selectedCountry
	])

	const handleSubmit = (values: INotinoReservationsFilter) => {
		const newQuery = {
			...query,
			...values
		}
		// update selected country globally based on filter
		dispatch(setSelectedCountry(values?.countryCode || undefined))
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
			title: t('loc:ID'),
			dataIndex: 'id',
			key: 'id',
			ellipsis: true,
			width: '15%',
			render: (value) => {
				const firstThree = value?.substring(0, 3)
				const lastThree = value?.substring(value.length - 3)

				return <Tooltip title={value}>{`${firstThree}...${lastThree}`}</Tooltip>
			}
		},
		{
			title: t('loc:Názov salónu'),
			dataIndex: ['salon', 'name'],
			key: 'salonName',
			ellipsis: true,
			width: '20%'
		},
		{
			title: t('loc:Dátum vytvorenia'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			width: '20%'
		},
		{
			title: t('loc:Dátum rezervácie'),
			dataIndex: 'startDate',
			key: 'startDate',
			ellipsis: true,
			width: '20%'
		},

		{
			title: t('loc:Trvanie'),
			dataIndex: 'time',
			key: 'time',
			ellipsis: true,
			width: '15%'
		},
		{
			title: t('loc:Zákazník'),
			dataIndex: 'customer',
			key: 'customer',
			ellipsis: true,
			width: '25%',
			render: (value) => {
				return (
					<div className={'flex items-center'}>
						<UserAvatar className='mr-2-5 w-7 h-7' src={value?.profileImage?.resizedImages?.thumbnail} fallBackSrc={value?.profileImage?.original} />
						<div className={'truncate'}>{getAssignedUserLabel(value)}</div>
					</div>
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
					<div className={'flex items-center'}>
						<UserAvatar className='mr-2-5 w-7 h-7' src={value?.icon?.resizedImages?.thumbnail} fallBackSrc={value?.icon?.original} />
						<div className={'truncate'}>{value?.name}</div>
					</div>
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
							style={value?.deletedAt && { filter: 'grayscale(100)' }}
							className='mr-2-5 w-7 h-7'
							src={value?.image?.resizedImages?.thumbnail}
							fallBackSrc={value?.image?.original}
						/>
						{value?.deletedAt ? (
							<Tooltip title={t('loc:Priradený kolega je vymazaný zo salónu')}>
								<div className={'text-trueGray-400'}>{getAssignedUserLabel(value)}</div>
							</Tooltip>
						) : (
							<div className={'truncate'}>{getAssignedUserLabel(value)}</div>
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
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam rezervácií')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<NotinoReservationsFilter onSubmit={handleSubmit} />
						<CustomTable
							className='table-fixed'
							columns={columns}
							onChange={onChangeTable}
							loading={notinoReservations?.isLoading}
							dataSource={notinoReservations?.tableData}
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
										pathname: t('paths:salons/{{salonID}}/calendar', { salonID: record.salon.id }),
										search: formatObjToQuery(redirectQuery)
									})
								}
							})}
							twoToneRows
							scroll={{ x: 1400 }}
							useCustomPagination
							pagination={{
								pageSize: notinoReservations.data?.pagination.limit,
								total: notinoReservations.data?.pagination.totalCount,
								current: notinoReservations.data?.pagination.page,
								onChange: onChangePagination,
								disabled: notinoReservations.isLoading
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(NotinoReservationsPage)
