import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import { ArrayParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'

// components
import dayjs from 'dayjs'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import UserAvatar from '../../components/AvatarComponents'
import ReservationsFilter from './components/ReservationsFilter'

// utils
import { DEFAULT_DATE_INIT_FORMAT, FORM, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { getAssignedUserLabel, normalizeDirectionKeys, setOrder } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { Columns, IBreadcrumbs, IComputedMatch, IReservationsFilter } from '../../types/interfaces'
import { getPaginatedReservations } from '../../reducers/calendar/calendarActions'

type Props = {
	computedMatch: IComputedMatch<{ salonID: string }>
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const ReservationsPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { computedMatch } = props
	const { salonID } = computedMatch.params
	const reservations = useSelector((state: RootState) => state.calendar.paginatedReservations)

	const [query, setQuery] = useQueryParams({
		dateFrom: withDefault(StringParam, dayjs().format(DEFAULT_DATE_INIT_FORMAT)),
		employeeIDs: ArrayParam,
		categoryIDs: ArrayParam,
		reservationStates: ArrayParam,
		reservationCreateSourceType: StringParam,
		reservationPaymentMethods: ArrayParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1)
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
	}, [])

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
			width: '20%'
		},
		{
			title: t('loc:Trvanie'),
			dataIndex: 'time',
			key: 'time',
			ellipsis: true,
			width: '20%'
		},
		{
			title: t('loc:Vytvorená v'),
			dataIndex: 'createSourceType',
			key: 'createSourceType',
			ellipsis: true,
			width: '20%'
		},
		{
			title: t('loc:Stav'),
			dataIndex: 'state',
			key: 'state',
			ellipsis: true,
			width: '20%'
		},
		{
			title: t('loc:Spôsob úhrady'),
			dataIndex: 'paymentMethod',
			key: 'paymentMethod',
			ellipsis: true,
			width: '20%',
			render: (value) => value || '-'
		},
		{
			title: t('loc:Zamestnanec'),
			dataIndex: 'employee',
			key: 'employee',
			ellipsis: true,
			width: '20%',
			render: (value) => {
				return (
					<>
						<UserAvatar className='mr-2-5 w-7 h-7' src={value?.image?.resizedImages?.thumbnail} fallBackSrc={value?.image?.original} />
						{getAssignedUserLabel(value)}
					</>
				)
			}
		},
		{
			title: t('loc:Zákazník'),
			dataIndex: 'customer',
			key: 'customer',
			ellipsis: true,
			width: '20%',
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
			width: '20%',
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

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<ReservationsFilter onSubmit={handleSubmit} />
						<CustomTable
							className='table-fixed'
							columns={columns}
							onChange={onChangeTable}
							loading={reservations?.isLoading}
							dataSource={reservations?.tableData}
							twoToneRows
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
		</>
	)
}

export default compose(withPermissions(permissions))(ReservationsPage)
