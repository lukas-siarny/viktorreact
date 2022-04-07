import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Row } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import ServicesFilter from './components/ServicesFilter'

// utils
import { FORM, MSG_TYPE, NOTIFICATION_TYPE, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder, normalizeQueryParams } from '../../utils/helper'
// import { history } from '../../utils/history'
import { checkPermissions, withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import showNotifications from '../../utils/tsxHelpers'

type Columns = ColumnsType<any>

interface IAdminUsersFilter {
	search: string
}

const ServicesPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const services = useSelector((state: RootState) => state.service.services)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		categoryID: NumberParam,
		employeeID: NumberParam,
		salonID: NumberParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'name:ASC')
	})

	useEffect(() => {
		dispatch(initialize(FORM.SERVICES_FILTER, { search: query.search, categoryID: query.categoryID, employeeID: query.employeeID, salonID: query.salonID }))
		dispatch(getServices(query.page, query.limit, query.order, { search: query.search, categoryID: query.categoryID, employeeID: query.employeeID, salonID: query.salonID }))
	}, [dispatch, query.page, query.limit, query.search, query.order, query.categoryID, query.employeeID, query.salonID])

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

	const handleSubmit = (values: IAdminUsersFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(normalizeQueryParams(newQuery))
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
			title: t('loc:Zamestnanec'),
			dataIndex: 'employees',
			key: 'employees',
			ellipsis: true,
			render: (value) => <span className='whitespace-pre'>{value}</span>
		},
		{
			title: t('loc:Trvanie'),
			dataIndex: 'duration',
			key: 'duration',
			ellipsis: true
		},
		{
			title: t('loc:Cena'),
			dataIndex: 'price',
			key: 'price',
			ellipsis: true
		},
		{
			title: t('loc:Kategória'),
			dataIndex: 'category',
			key: 'category',
			ellipsis: true
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam služieb')
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
						<ServicesFilter onSubmit={handleSubmit} total={services?.originalData?.pagination?.totalPages} />
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={services?.tableData}
							rowClassName={'clickable-row'}
							loading={services?.isLoading}
							twoToneRows
							onRow={(record) => ({
								onClick: () => {
									if (checkPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_EDIT, PERMISSION.PARTNER])) {
										// TODO add route
										// history.push(t('paths:users/{{userID}}', { userID: record.id }))
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
								showSizeChanger: true,
								pageSize: services?.originalData?.pagination?.limit,
								total: services?.originalData?.pagination?.totalPages,
								current: services?.originalData?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_BROWSING, PERMISSION.PARTNER]))(ServicesPage)
