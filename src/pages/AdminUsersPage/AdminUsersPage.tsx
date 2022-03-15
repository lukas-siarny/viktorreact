import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Row, Tooltip } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { PAGINATION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { getPath, history } from '../../utils/history'
import { getUsers } from '../../reducers/users/userActions'
import { RootState } from '../../reducers'
import AdminUsersFilter from './components/AdminUsersFilter'

// types
import { IBreadcrumbs } from '../../types/interfaces'

type Props = {}

type Columns = ColumnsType<any>

interface IAdminUsersFilter {
	search: string
}

const AdminUsersPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const users = useSelector((state: RootState) => state.user.users)

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'fullName:ASC')
	})

	useEffect(() => {
		dispatch(getUsers(query.page, query.limit, query.order, query.search))
	}, [dispatch, query.page, query.limit, query.search, query.order])

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
		setQuery(newQuery)
	}

	const columns: Columns = [
		{
			title: t('loc:Meno'),
			dataIndex: 'fullName',
			key: 'fullName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'fullName'),
			render: (value, record) => (
				<>
					{record?.firstName} {record?.lastName}
				</>
			)
		},
		{
			title: t('loc:Email'),
			dataIndex: 'email',
			key: 'email',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'email')
		},
		{
			title: t('loc:Telefón'),
			dataIndex: 'phone',
			key: 'phone',
			ellipsis: true,
			sorter: false,
			render: (value, record) => (
				<>
					{record?.phonePrefixCountryCode} {value}
				</>
			)
		},
		{
			title: t('loc:Rola'),
			dataIndex: 'roles',
			key: 'roles',
			ellipsis: {
				showTitle: false
			},
			render(value) {
				return <Tooltip title={value}>{value}</Tooltip>
			}
		},
		{
			title: t('loc:Spoločnosť'),
			dataIndex: 'companyName',
			key: 'companyName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'companyName'),
			render: (value, record) => {
				return <>{record?.company?.companyName}</>
			}
		}
	]

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam používateľov')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={getPath(t('paths:home'))} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<AdminUsersFilter createUser={() => history.push(getPath(t('paths:user/create')))} onSubmit={handleSubmit} />
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={users?.data?.users}
							rowClassName={(record) => cx('clickable-row', { 'deleted-table-item': record.deletedAt })}
							loading={users?.isLoading}
							twoToneRows
							onRow={(record) => ({
								onClick: () => {
									history.push(getPath(t('paths:user-detail/{{userID}}', { userID: record.id })))
								}
							})}
							pagination={{
								showTotal: (total, [from, to]) => t('loc:{{from}} - {{to}} z {{total}} záznamov', { total, from, to }),
								defaultPageSize: PAGINATION.defaultPageSize,
								pageSizeOptions: PAGINATION.pageSizeOptions,
								pageSize: users?.data?.pagination?.limit,
								showSizeChanger: true,
								total: users?.data?.pagination?.totalPages,
								current: users?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default AdminUsersPage
