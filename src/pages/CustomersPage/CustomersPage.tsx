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
import CustomersFilter from './components/CustomersFilter'

// utils
import { FORM, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder, normalizeQueryParams } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getCustomers } from '../../reducers/customers/customerActions'

// types
import { IBreadcrumbs, ISearchFilter } from '../../types/interfaces'

type Columns = ColumnsType<any>

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const CustomersPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const customers = useSelector((state: RootState) => state.customers.customers)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'lastName:ASC')
	})

	useEffect(() => {
		dispatch(initialize(FORM.CUSTOMERS_FILTER, { search: query.search }))
		dispatch(getCustomers({ page: query.page, limit: query.limit, order: query.order, search: query.search }))
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

	const handleSubmit = (values: ISearchFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(normalizeQueryParams(newQuery))
	}

	const columns: Columns = [
		{
			title: t('loc:Meno'),
			dataIndex: 'lastlName',
			key: 'lastName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'lastName'),
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
			sorter: false
		},
		{
			title: t('loc:Telefón'),
			dataIndex: 'phone',
			key: 'phone',
			ellipsis: true,
			sorter: false,
			render: (value, record) => {
				return (
					<>
						{prefixOptions[record?.phonePrefixCountryCode]} {value}
					</>
				)
			}
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov')
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
							allowed={[...permissions, PERMISSION.PARTNER_ADMIN, PERMISSION.CUSTOMER_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<CustomersFilter
									onSubmit={handleSubmit}
									total={customers?.data?.pagination?.totalCount}
									createCustomer={() => {
										if (!hasPermission) {
											openForbiddenModal()
										} else {
											history.push(t('paths:customers/create'))
										}
									}}
								/>
							)}
						/>
						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={customers?.data?.customers}
							rowClassName={'clickable-row'}
							loading={customers?.isLoading}
							twoToneRows
							onRow={(record) => ({
								onClick: () => {
									history.push(t('paths:customers/{{customerID}}', { customerID: record.id }))
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
								pageSize: customers?.data?.pagination?.limit,
								total: customers?.data?.pagination?.totalCount,
								current: customers?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(CustomersPage)
