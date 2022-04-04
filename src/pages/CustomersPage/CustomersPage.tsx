import React, { useEffect, useCallback, useState } from 'react'
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
import { FORM, MSG_TYPE, NOTIFICATION_TYPE, PAGINATION, PERMISSION, ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder, normalizeQueryParams } from '../../utils/helper'
import { history } from '../../utils/history'
import { checkPermissions, withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getCustomers } from '../../reducers/customers/customerActions'
import { getCountries } from '../../reducers/enumerations/enumerationActions'

// types
import { IBreadcrumbs, ISearchFilter } from '../../types/interfaces'
import showNotifications from '../../utils/tsxHelpers'

type Columns = ColumnsType<any>

const EDIT_PERMISSIONS = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_EDIT, PERMISSION.PARTNER]

const CustomersPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const customers = useSelector((state: RootState) => state.customers.customers)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		salonID: NumberParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'lastName:ASC')
	})

	useEffect(() => {
		dispatch(getCountries())
		dispatch(initialize(FORM.CUSTOMERS_FILTER, { search: query.search, salonID: query.salonID }))
		dispatch(getCustomers(query.page, query.limit, query.order, { search: query.search, salonID: query.salonID }))
	}, [dispatch, query.page, query.limit, query.search, query.order, query.salonID])

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
			dataIndex: 'firstName',
			key: 'firstName',
			ellipsis: true,
			sorter: false
		},
		{
			title: t('loc:Priezvisko'),
			dataIndex: 'lastName',
			key: 'lastName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'lastName')
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
		},
		{
			title: t('loc:Salón'),
			dataIndex: 'salonName',
			key: 'salonName',
			ellipsis: true,
			sorter: false,
			render: (value, record) => {
				return <>{record?.salon?.name}</>
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

	const createCustomer = useCallback(() => {
		if (checkPermissions(EDIT_PERMISSIONS)) {
			history.push(t('paths:customers/create'))
		} else {
			showNotifications([{ type: MSG_TYPE.ERROR, message: t('loc:Pre túto akciu nemáte dostatočné oprávnenia!') }], NOTIFICATION_TYPE.NOTIFICATION)
		}
	}, [t])

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:home')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<CustomersFilter onSubmit={handleSubmit} total={customers?.data?.pagination?.totalCount} createCustomer={createCustomer} />
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
									if (checkPermissions(EDIT_PERMISSIONS)) {
										history.push(t('paths:customers/{{customerID}}', { customerID: record.id }))
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
								pageSize: customers?.data?.pagination?.limit,
								total: customers?.data?.pagination?.totalPages,
								current: customers?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_BROWSING, PERMISSION.PARTNER]))(CustomersPage)
