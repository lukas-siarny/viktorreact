import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import React, { useEffect } from 'react'
import { ArrayParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Progress, Row } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { initialize } from 'redux-form'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonsFilter, { ISalonsFilter } from './components/SalonsFilter'

// utils
import { checkPermissions, withPermissions } from '../../utils/Permissions'
import { FORM, MSG_TYPE, NOTIFICATION_TYPE, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT, SALON_STATUSES } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import showNotifications from '../../utils/tsxHelpers'

// reducers
import { getSalons } from '../../reducers/salons/salonsActions'
import { RootState } from '../../reducers'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IBreadcrumbs } from '../../types/interfaces'

// assets
import { ReactComponent as CircleCheckIcon } from '../../assets/icons/check-circle-icon.svg'
import { ReactComponent as CircleCloseIcon } from '../../assets/icons/close-circle-icon.svg'

type Columns = ColumnsType<any>

const editPermissions: PERMISSION[] = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.PARTNER, PERMISSION.SALON_EDIT]

const SalonsPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const salons = useSelector((state: RootState) => state.salons.salons)

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		categoryFirstLevelIDs: ArrayParam,
		statuses: withDefault(ArrayParam, [SALON_STATUSES.ALL]),
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'createdAt:DESC')
	})

	useEffect(() => {
		dispatch(initialize(FORM.SALONS_FILTER, { search: query.search, statuses: query.statuses, categoryFirstLevelIDs: query.categoryFirstLevelIDs }))
		dispatch(getSalons(query.page, query.limit, query.order, query.search, query.categoryFirstLevelIDs, query.statuses))
	}, [dispatch, query.page, query.limit, query.search, query.order, query.categoryFirstLevelIDs, query.statuses])

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

	const handleSubmit = (values: ISalonsFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}

	const columns: Columns = [
		{
			title: t('loc:Názov'),
			dataIndex: 'name',
			key: 'name',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'name')
		},
		{
			title: t('loc:Adresa'),
			dataIndex: 'address',
			key: 'address',
			ellipsis: true,
			sorter: false,
			render: (value) => <>{`${value?.city}, ${value?.street}`}</>
		},
		{
			title: t('loc:Kategórie'),
			dataIndex: 'categories',
			key: 'categories',
			ellipsis: true,
			sorter: false,
			render: (value) => <>{value.map((category: any, index: number) => (index === value.length - 1 ? category?.name : `${category?.name}, `))} </>
		},
		{
			title: t('loc:Publikované'),
			dataIndex: 'isPublished',
			key: 'isPublished',
			ellipsis: true,
			sorter: false,
			width: '8%',
			render: (value) => (
				<div className={'flex justify-start'}>{value ? <CircleCheckIcon color={'$textColor-green-600'} /> : <CircleCloseIcon color={'$textColor-green-600'} />}</div>
			)
		},
		{
			title: t('loc:Viditeľné'),
			dataIndex: 'isVisible',
			key: 'isVisible',
			ellipsis: true,
			sorter: false,
			width: '8%',
			render: (value) => <div className={'flex justify-start'}>{value ? <CircleCheckIcon /> : <CircleCloseIcon />}</div>
		},
		{
			title: t('loc:Vyplnenia profilu'),
			dataIndex: 'fillingProgress',
			key: 'fillingProgress',
			ellipsis: true,
			sorter: false,
			render: (value) => <Progress percent={value} steps={5} />
		},
		{
			title: t('loc:Vytvorené'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'createdAt')
		}
	]

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam salónov')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:home')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<SalonsFilter
							createSalon={() => {
								if (checkPermissions(editPermissions)) {
									history.push(t('paths:salon/create'))
								} else {
									showNotifications([{ type: MSG_TYPE.ERROR, message: t('loc:Pre túto akciu nemáte dostatočné oprávnenia!') }], NOTIFICATION_TYPE.NOTIFICATION)
								}
							}}
							onSubmit={handleSubmit}
						/>
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={salons?.data?.salons}
							rowClassName={'clickable-row'}
							loading={salons?.isLoading}
							twoToneRows
							onRow={(record) => ({
								onClick: () => {
									if (checkPermissions(editPermissions)) {
										history.push(t('paths:salon/{{salonID}}', { salonID: record.id }))
									} else {
										showNotifications(
											[{ type: MSG_TYPE.ERROR, message: t('loc:Pre túto akciu nemáte dostatočné oprávnenia!') }],
											NOTIFICATION_TYPE.NOTIFICATION
										)
									}
								}
							})}
							pagination={{
								showTotal: (total, [from, to]) =>
									t('loc:{{from}} - {{to}} z {{total}} záznamov', {
										total,
										from,
										to
									}),
								defaultPageSize: PAGINATION.defaultPageSize,
								pageSizeOptions: PAGINATION.pageSizeOptions,
								pageSize: salons?.data?.pagination?.limit,
								showSizeChanger: true,
								total: salons?.data?.pagination?.totalPages,
								current: salons?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING, PERMISSION.PARTNER]))(SalonsPage)
