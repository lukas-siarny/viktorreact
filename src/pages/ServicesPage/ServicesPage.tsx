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
import { AvatarGroup } from '../../components/AvatarComponents'

// utils
import { FORM, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { formatDateByLocale, normalizeDirectionKeys, normalizeQueryParams, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { IBreadcrumbs, IUserAvatar, SalonSubPageProps } from '../../types/interfaces'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

type Columns = ColumnsType<any>

interface IAdminUsersFilter {
	search: string
}

const ServicesPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const services = useSelector((state: RootState) => state.service.services)
	const { salonID } = props

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
		dispatch(initialize(FORM.SERVICES_FILTER, { search: query.search, categoryID: query.categoryID, employeeID: query.employeeID }))
		dispatch(
			getServices({
				page: query.page,
				limit: query.limit,
				order: query.order,
				search: query.search,
				categoryID: query.categoryID,
				employeeID: query.employeeID,
				salonID
			})
		)
	}, [dispatch, query.page, query.limit, query.search, query.order, query.categoryID, query.employeeID, salonID])

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
			title: t('loc:Salón'),
			dataIndex: 'salon',
			key: 'salon',
			ellipsis: true
		},
		{
			title: t('loc:Zamestnanec'),
			dataIndex: 'employees',
			key: 'employees',
			render: (value: IUserAvatar[]) => (value ? <AvatarGroup maxCount={3} avatars={value} maxPopoverPlacement={'right'} /> : null)
		},
		{
			title: t('loc:Trvanie (min)'),
			dataIndex: 'duration',
			key: 'duration',
			ellipsis: true
		},
		{
			title: t('loc:Cena (€)'),
			dataIndex: 'price',
			key: 'price',
			ellipsis: true
		},
		{
			title: t('loc:Kategória'),
			dataIndex: 'category',
			key: 'category',
			ellipsis: true
		},
		{
			title: t('loc:Vytvorené'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'createdAt'),
			render: (value) => formatDateByLocale(value)
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Permissions
							allowed={[...permissions, PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<ServicesFilter
									createService={() => {
										if (hasPermission) {
											history.push(t('paths:salons/{{salonID}}/services/create', { salonID }))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmit}
									total={services?.data?.pagination?.totalCount}
								/>
							)}
						/>
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
									history.push(t('paths:salons/{{salonID}}/services/{{serviceID}}', { salonID, serviceID: record.serviceID }))
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
								pageSize: services?.data?.pagination?.limit,
								total: services?.data?.pagination?.totalCount,
								current: services?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(ServicesPage)
