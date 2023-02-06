import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomersFilter from './components/CustomersFilter'
import UserAvatar from '../../components/AvatarComponents'

// utils
import { FORM, PERMISSION, SALON_PERMISSION, ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder, formatDateByLocale, getLinkWithEncodedBackUrl, normalizeSearchQueryParams } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { getCustomers } from '../../reducers/customers/customerActions'

// types
import { IBreadcrumbs, ISearchFilter, SalonSubPageProps, Columns } from '../../types/interfaces'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const CustomersPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const customers = useSelector((state: RootState) => state.customers.customers)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})

	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		limit: '',
		page: '1',
		order: 'lastName:ASC'
	})

	const searchParamsObj = Object.fromEntries(searchParams)

	useEffect(() => {
		dispatch(initialize(FORM.CUSTOMERS_FILTER, { search: searchParams.get('search') }))
		dispatch(getCustomers({ page: searchParams.get('page'), limit: searchParams.get('limit'), order: searchParams.get('order'), search: searchParams.get('search'), salonID }))
	}, [dispatch, searchParams, salonID])

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

		phonePrefixes.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes])

	const onChangeTable = (_pagination: TablePaginationConfig, _filters: Record<string, (string | number | boolean)[] | null>, sorter: SorterResult<any> | SorterResult<any>[]) => {
		if (!(sorter instanceof Array)) {
			const order = `${sorter.columnKey}:${normalizeDirectionKeys(sorter.order)}`
			const newQuery = {
				...searchParamsObj,
				order
			}
			setSearchParams(newQuery)
		}
	}

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...searchParamsObj,
			limit: String(limit),
			page: String(page)
		}
		setSearchParams(newQuery)
	}

	const handleSubmit = (values: ISearchFilter) => {
		const newQuery = {
			...searchParamsObj,
			search: values.search,
			page: 1
		}
		setSearchParams(normalizeSearchQueryParams(newQuery))
	}

	const columns: Columns = [
		{
			title: t('loc:Meno'),
			dataIndex: 'lastlName',
			key: 'lastName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(searchParams.get('order'), 'lastName'),
			render: (value, record) => (
				<>
					<UserAvatar className={'mr-1'} src={record.profileImage?.resizedImages?.thumbnail} fallBackSrc={record.profileImage?.original} size={'small'} />
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
		},
		{
			title: t('loc:Vytvorené'),
			dataIndex: 'createdAt',
			key: 'createdAt',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(searchParams.get('order'), 'createdAt'),
			render: (value) => formatDateByLocale(value) ?? '-'
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
						<Spin spinning={customers?.isLoading}>
							<Permissions
								allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CUSTOMER_CREATE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<CustomersFilter
										onSubmit={handleSubmit}
										total={customers?.data?.pagination?.totalCount}
										createCustomer={() => {
											if (!hasPermission) {
												openForbiddenModal()
											} else {
												navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:customers/create')))
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
								twoToneRows
								rowKey='id'
								scroll={{ x: 800 }}
								onRow={(record) => ({
									onClick: () => {
										navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:customers/{{customerID}}', { customerID: record.id })))
									}
								})}
								useCustomPagination
								pagination={{
									pageSize: customers?.data?.pagination?.limit,
									total: customers?.data?.pagination?.totalCount,
									current: customers?.data?.pagination?.page,
									disabled: customers?.isLoading,
									onChange: onChangePagination
								}}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(CustomersPage)
