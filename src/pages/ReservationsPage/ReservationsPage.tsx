import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import dayjs from 'dayjs'
import { StringParam, useQueryParams, ArrayParam } from 'use-query-params'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomTable from '../../components/CustomTable'
import UserAvatar from '../../components/AvatarComponents'
import ReservationsFilter from './components/ReservationsFilter'
import ConfirmModal from '../../atoms/ConfirmModal'

// utils
import { DEFAULT_DATE_INIT_FORMAT, FORM, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { getAssignedUserLabel } from '../../utils/helper'

// reducers
import { getSalonReservations } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { Columns, IBreadcrumbs, IComputedMatch, IReservationsFilter } from '../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-2.svg'

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
	const [visibleModal, setVisibleModal] = useState(false)

	const [query, setQuery] = useQueryParams({
		dateFrom: StringParam,
		dateTo: StringParam,
		employeeIDs: ArrayParam,
		categoryIDs: ArrayParam,
		reservationStates: ArrayParam,
		reservationCreateSourceType: StringParam,
		reservationPaymentMethods: ArrayParam
	})

	useEffect(() => {
		const range = dayjs(query.dateTo).diff(query.dateFrom, 'weeks')
		// NOTE: viac ako 3 mesiace
		if (range > 12) {
			setVisibleModal(true)
			return
		}
		dispatch(
			initialize(FORM.RESERVAtIONS_FILTER, {
				reservationStates: query.reservationStates,
				employeeIDs: query.employeeIDs,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				dateFrom: query.dateFrom || dayjs().subtract(2, 'weeks').format(DEFAULT_DATE_INIT_FORMAT),
				dateTo: query.dateTo || dayjs().add(2, 'weeks').format(DEFAULT_DATE_INIT_FORMAT),
				categoryIDs: query.categoryIDs
			})
		)
		dispatch(
			getSalonReservations({
				salonID,
				dateFrom: query.dateFrom || dayjs().subtract(2, 'weeks').format(DEFAULT_DATE_INIT_FORMAT),
				dateTo: query.dateTo || dayjs().add(2, 'weeks').format(DEFAULT_DATE_INIT_FORMAT),
				reservationStates: query.reservationStates,
				employeeIDs: query.employeeIDs,
				reservationPaymentMethods: query.reservationPaymentMethods,
				reservationCreateSourceType: query.reservationCreateSourceType,
				categoryIDs: query.categoryIDs
			})
		)
	}, [
		dispatch,
		query.categoryIDs,
		query.dateFrom,
		query.dateTo,
		query.employeeIDs,
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
	const modals = (
		<>
			<ConfirmModal
				closeIcon={<CloseIcon />}
				okButtonProps={{
					className: 'hidden'
				}}
				cancelButtonProps={{
					className: 'w-full'
				}}
				onCancel={() => {
					setQuery({
						...query,
						dateFrom: dayjs().subtract(2, 'weeks').format(DEFAULT_DATE_INIT_FORMAT),
						dateTo: dayjs().add(2, 'weeks').format(DEFAULT_DATE_INIT_FORMAT)
					})
					setVisibleModal(false)
				}}
				visible={visibleModal}
				title={t('loc:Chyba rozsahu')}
				destroyOnClose
				zIndex={2000}
			>
				{t('loc:Rozsah, ktorý ste zadali je veľký. Prosím zadajte rozsah menší ako tri mesiace.')}
			</ConfirmModal>
		</>
	)

	return (
		<>
			{modals}
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
