import React, { useEffect, useState } from 'react'
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
import AdminUsersFilter, { IUsersFilter } from './components/AdminUsersFilter'

// utils
import { FORM, MSG_TYPE, NOTIFICATION_TYPE, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import { checkPermissions, withPermissions } from '../../utils/Permissions'

// reducers
import { getUsers } from '../../reducers/users/userActions'
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import showNotifications from '../../utils/tsxHelpers'

type Columns = ColumnsType<any>

const AdminUsersPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const users = useSelector((state: RootState) => state.user.users)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'fullName:ASC')
	})

	useEffect(() => {
		dispatch(initialize(FORM.ADMIN_USERS_FILTER, { search: query.search }))
		dispatch(getUsers(query.page, query.limit, query.order, query.search))
	}, [dispatch, query.page, query.limit, query.search, query.order])

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

		phonePrefixes.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes])

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

	const handleSubmit = (values: IUsersFilter) => {
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
					{prefixOptions[record?.phonePrefixCountryCode]} {value}
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
				return value.map((role: any) => {
					return role?.name
				})
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:home')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<AdminUsersFilter
							createUser={() => {
								if (checkPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_CREATE])) {
									history.push(t('paths:users/create'))
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
							dataSource={users?.data?.users}
							rowClassName={'clickable-row'}
							loading={users?.isLoading}
							twoToneRows
							onRow={(record) => ({
								onClick: () => {
									if (checkPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_EDIT])) {
										history.push(t('paths:users/{{userID}}', { userID: record.id }))
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

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.USER_BROWSING]))(AdminUsersPage)
