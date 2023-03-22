import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { useNavigate } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomersFilter from './components/CustomersFilter'
import UserAvatar from '../../components/AvatarComponents'
import ImportForm from '../../components/ImportForm'

// utils
import { FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, ENUMERATIONS_KEYS, UPLOAD_STATUS } from '../../utils/enums'
import { normalizeDirectionKeys, setOrder, formatDateByLocale, getLinkWithEncodedBackUrl } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { postReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { getCustomers } from '../../reducers/customers/customerActions'

// types
import { IBreadcrumbs, ISearchFilter, SalonSubPageProps, Columns, IDataUploadForm } from '../../types/interfaces'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'

const CustomersPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const customers = useSelector((state: RootState) => state.customers.customers)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})
	const [uploadStatus, setUploadStatus] = useState<UPLOAD_STATUS | undefined>(undefined)
	const [salonImportsModalVisible, setSalonImportsModalVisible] = useState(false)

	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		limit: NumberParam(),
		page: NumberParam(1),
		order: StringParam('lastName:ASC')
	})

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov')
			}
		]
	}

	useEffect(() => {
		dispatch(initialize(FORM.CUSTOMERS_FILTER, { search: query.search }))
		dispatch(getCustomers({ page: query.page, limit: query.limit, order: query.order, search: query.search, salonID }))
	}, [dispatch, query.limit, query.order, query.page, query.search, salonID])

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
				...query,
				order
			}
			setQuery(newQuery)
		}
	}

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page
		}
		setQuery(newQuery)
	}

	const handleSubmit = (values: ISearchFilter) => {
		const newQuery = {
			...query,
			search: values.search,
			page: 1
		}
		setQuery(newQuery)
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
			sortOrder: setOrder(query.order, 'createdAt'),
			render: (value) => formatDateByLocale(value) ?? '-'
		}
	]

	const clientImportsSubmit = async (values: IDataUploadForm) => {
		setUploadStatus(UPLOAD_STATUS.UPLOADING)

		const formData = new FormData()
		formData.append('file', values?.file)

		try {
			await postReq('/api/b2b/admin/imports/salons/{salonID}/customers', { salonID }, formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})

			setUploadStatus(UPLOAD_STATUS.SUCCESS)
		} catch {
			setUploadStatus(UPLOAD_STATUS.ERROR)
		}
	}

	return (
		<>
			<ImportForm
				setUploadStatus={setUploadStatus}
				uploadStatus={uploadStatus}
				label={t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.csv' })}
				accept={'.csv'}
				title={t('loc:Importovať zákazníkov')}
				visible={salonImportsModalVisible}
				setVisible={setSalonImportsModalVisible}
				onSubmit={clientImportsSubmit}
			/>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={customers?.isLoading}>
							<Permissions
								allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.CUSTOMER_CREATE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<CustomersFilter
										openClientImportsModal={() => setSalonImportsModalVisible(true)}
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

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(CustomersPage)
