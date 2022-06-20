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
import { FORM, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { getRoles } from '../../reducers/roles/rolesActions'
import { getUsers } from '../../reducers/users/userActions'
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs } from '../../types/interfaces'

type Columns = ColumnsType<any>

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_BROWSING]

const UsersPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const users = useSelector((state: RootState) => state.user.users)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'fullName:ASC'),
		roleID: withDefault(NumberParam, undefined)
	})

	useEffect(() => {
		dispatch(initialize(FORM.ADMIN_USERS_FILTER, { search: query.search, roleID: query.roleID }))
		dispatch(getUsers(query.page, query.limit, query.order, query.search, query.roleID))
	}, [dispatch, query.page, query.limit, query.search, query.order, query.roleID])

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}
		dispatch(getRoles())

		phonePrefixes.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes, dispatch])

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
			width: '20%',
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
			width: '25%',
			sortOrder: setOrder(query.order, 'email')
		},
		{
			title: t('loc:Telefón'),
			dataIndex: 'phone',
			key: 'phone',
			ellipsis: true,
			sorter: false,
			width: '15%',
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
			width: '15%',
			render(value) {
				return value.map((role: any) => {
					return role?.name
				})
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Permissions
							allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.USER_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<AdminUsersFilter
									createUser={() => {
										if (hasPermission) {
											history.push(t('paths:users/create'))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmit}
								/>
							)}
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
									history.push(t('paths:users/{{userID}}', { userID: record.id }))
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
								total: users?.data?.pagination?.totalCount,
								current: users?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(UsersPage)
