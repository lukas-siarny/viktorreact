import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { DelimitedArrayParam, StringParam, useQueryParams, DateParam } from 'use-query-params'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
// types
import { Columns, IBreadcrumbs, IComputedMatch } from '../../types/interfaces'
import { getSalonReservations } from '../../reducers/salons/salonsActions'
import CustomTable from '../../components/CustomTable'
import { RootState } from '../../reducers'
import UserAvatar from '../../components/AvatarComponents'
import { getAssignedUserLabel } from '../../utils/helper'
import ReservationsFilter from './components/ReservationsFilter'

// assets

type Props = {
	computedMatch: IComputedMatch<{ salonID: string }>
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const ReservationsPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { computedMatch } = props
	const { salonID } = computedMatch.params
	const reservations = useSelector((state: RootState) => state.salons.reservations)

	const [query, setQuery] = useQueryParams({
		dateFrom: DateParam,
		dateTo: DateParam,
		eventTypes: DelimitedArrayParam,
		employeeIDs: DelimitedArrayParam,
		categoryIDs: DelimitedArrayParam,
		reservationStates: DelimitedArrayParam,
		reservationCreateSourceType: StringParam,
		reservationPaymentMethods: DelimitedArrayParam
	})

	// TODO: zoznam dotiahnut + init filter
	// useEffect(() => {
	// 	dispatch(initialize(FORM.EMPLOYEES_FILTER, { search: query.search, serviceID: query.serviceID, accountState: query.accountState }))
	// 	dispatch(
	// 		getEmployees({
	// 			page: query.page,
	// 			limit: query.limit,
	// 			order: query.order,
	// 			search: query.search,
	// 			accountState: query.accountState,
	// 			serviceID: query.serviceID,
	// 			salonID
	// 		})
	// 	)
	// }, [dispatch, query.page, query.limit, query.search, query.order, query.accountState, query.serviceID, salonID])

	// TODO: zoznam rezervacii
	useEffect(() => {
		// TODO: posielat z query
		dispatch(getSalonReservations({ salonID, dateFrom: '2021-11-11', dateTo: '2022-12-12' }))
	}, [salonID, dispatch])

	// TODO: submit filtra
	const handleSubmit = (values: any) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}
	// TODO: tabulka
	const columns: Columns = [
		{
			title: t('loc:Dátum'),
			dataIndex: 'date',
			key: 'date',
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
							loading={reservations?.isLoading}
							dataSource={reservations?.tableData}
							rowClassName={'clickable-row'}
							rowKey='id'
							twoToneRows
							// scroll={{ x: 800 }}
							useCustomPagination
							pagination={undefined}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(ReservationsPage)
