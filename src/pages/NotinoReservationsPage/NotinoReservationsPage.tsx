import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Tooltip } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { initialize } from 'redux-form'
import dayjs from 'dayjs'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useNavigate } from 'react-router-dom'
import { ColumnProps } from 'antd/es/table'
import cx from 'classnames'

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
	ROW_GUTTER_X_DEFAULT
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { normalizeDirectionKeys, translateReservationPaymentMethod, translateReservationState } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { setSelectedCountry } from '../../reducers/selectedCountry/selectedCountryActions'
import { getNotinoReservations, INotinoReservationsTableData } from '../../reducers/calendar/calendarActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IBreadcrumbs, INotinoReservationsFilter } from '../../types/interfaces'

// hooks
import useQueryParams, { formatObjToQuery } from '../../hooks/useQueryParamsZod'

// schema
import { notinoReservationsQueryParamsSchema } from '../../schemas/queryParams'

type TableDataItem = NonNullable<INotinoReservationsTableData>

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
		dispatch(getCategories())
	}, [dispatch])

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
				order: 'createdAt:ASC',
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
			...values,
			page: 1
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
			page: limit === notinoReservations?.data?.pagination?.limit ? page : 1
		}
		setQuery(newQuery)
	}

	const columns: ColumnProps<TableDataItem>[] = [
		{
			title: t('loc:ID'),
			dataIndex: 'id',
			key: 'id',
			ellipsis: true,
			width: '8%',
			render: (_value, record) => {
				const firstThree = record.id.substring(0, 3)
				const lastThree = record.id.substring(record.id.length - 3)

				return <Tooltip title={record.id}>{`${firstThree}...${lastThree}`}</Tooltip>
			}
		},
		{
			title: t('loc:Názov salónu'),
			dataIndex: 'salon',
			key: 'salonName',
			ellipsis: true,
			width: '12%',
			render: (_value, record) => {
				return record.salon.deletedAt ? (
					<Tooltip title={t('loc:Salón bol vymazaný')}>
						<div className={'text-notino-gray'}>{record.salon.name}</div>
					</Tooltip>
				) : (
					<div className={'truncate'}>{record.salon.name}</div>
				)
			}
		},
		{
			title: t('loc:Dátum vytvorenia'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			width: '12%'
		},
		{
			title: t('loc:Dátum rezervácie'),
			dataIndex: 'startDate',
			key: 'startDate',
			ellipsis: true,
			width: '8%'
		},

		{
			title: t('loc:Trvanie'),
			dataIndex: 'time',
			key: 'time',
			ellipsis: true,
			width: '8%'
		},
		{
			title: t('loc:Zákazník'),
			dataIndex: 'customer',
			key: 'customer',
			ellipsis: true,
			width: '12%',
			render: (_value, record) => {
				return (
					<div title={record.customer.name} className={'flex items-center'}>
						<UserAvatar
							style={record.customer.deletedAt || record.deletedAt ? { filter: 'grayscale(100)', opacity: 0.75 } : undefined}
							className='mr-2-5 w-7 h-7'
							src={record.customer.thumbnail}
							fallBackSrc={record.customer.originalImage}
						/>
						{/* TODO: lepší preklad */}
						{record.customer.deletedAt ? (
							<Tooltip title={t('loc:Vymazané')}>
								<div className={'text-notino-gray truncate'}>{record.customer.name}</div>
							</Tooltip>
						) : (
							<div className={'truncate'}>{record.customer.name}</div>
						)}
					</div>
				)
			}
		},
		{
			title: t('loc:Služba'),
			dataIndex: 'service',
			key: 'service',
			ellipsis: true,
			width: '12%',
			render: (_value, record) => {
				return (
					<div title={record.service.name} className={'flex items-center'}>
						<UserAvatar
							style={record.service.deletedAt || record.deletedAt ? { filter: 'grayscale(100)', opacity: 0.75 } : undefined}
							className='mr-2-5 w-7 h-7'
							src={record.service.thumbnail}
							fallBackSrc={record.service.originalImage}
						/>
						{/* TODO: lepší preklad */}
						{record.service.deletedAt ? (
							<Tooltip title={t('loc:Vymazané')}>
								<div className={'text-notino-gray truncate'}>{record.service.name}</div>
							</Tooltip>
						) : (
							<div className={'truncate'}>{record.service.name}</div>
						)}
					</div>
				)
			}
		},
		{
			title: t('loc:Zamestnanec'),
			dataIndex: 'employee',
			key: 'employee',
			ellipsis: true,
			width: '12%',
			render: (_value, record) => {
				return (
					<div title={record.employee.name} className={'flex items-center'}>
						<UserAvatar
							style={record.employee.deletedAt || record.deletedAt ? { filter: 'grayscale(100)', opacity: 0.75 } : undefined}
							className='mr-2-5 w-7 h-7'
							src={record.employee.thumbnail}
							fallBackSrc={record.employee.originalImage}
						/>
						{record.employee.deletedAt ? (
							<Tooltip title={t('loc:Priradený kolega je vymazaný zo salónu')}>
								<div className={'text-notino-gray truncate'}>{record.employee.name}</div>
							</Tooltip>
						) : (
							<div className={'truncate'}>{record.employee.name}</div>
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
			width: '8%'
		},
		{
			title: t('loc:Stav'),
			dataIndex: 'state',
			key: 'state',
			ellipsis: true,
			width: '8%',
			render: (_value, record) => {
				if (!record.state) {
					return '-'
				}

				const { icon, text } = translateReservationState(record.state)

				return (
					<div title={text} className={'flex items-center'}>
						<div className={cx('mr-2 flex items-center w-4 h-4', { 'icon-grayslace': record.deletedAt, 'opacity-75': record.deletedAt })}>{icon}</div>
						<div className={'truncate'}>{text}</div>
					</div>
				)
			}
		},
		{
			title: t('loc:Spôsob úhrady'),
			dataIndex: 'paymentMethod',
			key: 'paymentMethod',
			ellipsis: true,
			width: '8%',
			render: (_value, record) => {
				if (!record.paymentMethod) {
					return '-'
				}

				const { icon, text } = translateReservationPaymentMethod(record.paymentMethod)

				return (
					<div title={text} className={'flex items-center'}>
						<div className={cx('mr-2 flex items-center w-4 h-4', { 'icon-grayslace': record.deletedAt, 'opacity-75': record.deletedAt })}>{icon}</div>
						<div className={'truncate'}>{text}</div>
					</div>
				)
			}
		},
		/* TODO: lepší preklad */
		{
			title: t('loc:Vymazané'),
			dataIndex: 'deletedAt',
			key: 'deletedAt',
			ellipsis: true,
			width: '8%',
			render: (value) => value || '-'
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
						<CustomTable<TableDataItem>
							className='table-fixed'
							columns={columns}
							onChange={onChangeTable}
							loading={notinoReservations?.isLoading}
							dataSource={notinoReservations?.tableData}
							rowClassName={(record) => cx({ 'noti-table-row-shadow': record.deletedAt, 'clickable-row': !record.deletedAt && !record.salon.deletedAt })}
							onRow={(record) => ({
								onClick: () => {
									if (!record.deletedAt && !record.salon.deletedAt) {
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
