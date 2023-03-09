import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'

// utils
import { ENUMERATIONS_KEYS, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../../utils/helper'

// components
import EmployeesFilter, { IEmployeesFilter } from './EmployeesFilter'
import CustomTable from '../../../components/CustomTable'
import UserAvatar from '../../../components/AvatarComponents'
import PopoverList from '../../../components/PopoverList'

// redux
import { RootState } from '../../../reducers'

// assets

// types
import { Columns } from '../../../types/interfaces'
import { IUseQueryParams } from '../../../hooks/useQueryParams'

type Props = {
	parentPath?: string
	query: IUseQueryParams
	setQuery: (newValues: IUseQueryParams) => void
	salonID: string
}

const DeletedEmployeesTable = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { parentPath, query, setQuery } = props
	const navigate = useNavigate()
	const deletedEmployees = useSelector((state: RootState) => state.employees.deletedEmployees)
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

		phonePrefixes.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes, dispatch])
	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page
		}
		setQuery(newQuery)
	}

	const handleSubmitDeleted = (values: IEmployeesFilter) => {
		const newQuery = {
			...query,
			...values,
			page: 1
		}
		setQuery(newQuery)
	}

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

	const columns: Columns = [
		{
			title: t('loc:Meno'),
			dataIndex: 'fullName',
			key: 'lastName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'lastName'),
			width: '25%',
			render: (_value, record) => {
				return (
					<>
						<UserAvatar
							className='mr-2-5 w-7 h-7'
							style={{ filter: 'grayscale(100)' }}
							src={record?.image?.resizedImages?.thumbnail}
							fallBackSrc={record?.image?.original}
						/>
						{record?.firstName || record.lastName ? `${record?.firstName ?? ''} ${record?.lastName ?? ''}`.trim() : '-'}
					</>
				)
			}
		},
		{
			title: t('loc:Email'),
			dataIndex: 'email',
			key: 'email',
			ellipsis: true,
			width: '20%',
			render: (value) => value || '-'
		},
		{
			title: t('loc:Pozvánkový email'),
			dataIndex: 'inviteEmail',
			key: 'inviteEmail',
			ellipsis: true,
			width: '20%',
			render: (value) => value || '-'
		},
		{
			title: t('loc:Telefón'),
			dataIndex: 'phone',
			key: 'phone',
			ellipsis: true,
			sorter: false,
			width: '15%',
			render: (_value, record) => {
				return <>{record?.phone && prefixOptions[record?.phonePrefixCountryCode] ? `${prefixOptions[record?.phonePrefixCountryCode]} ${record.phone}` : '-'}</>
			}
		},
		{
			title: t('loc:Služby'),
			dataIndex: 'services',
			key: 'services',
			ellipsis: true,
			render: (value) => {
				return value && value.length ? <PopoverList elements={value.map((service: any) => ({ name: service.category.name }))} /> : '-'
			}
		}
	]

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<Spin spinning={deletedEmployees?.isLoading}>
						<Permissions
							allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<EmployeesFilter
									hide
									createEmployee={() => {
										if (hasPermission) {
											navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/create')))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmitDeleted}
								/>
							)}
						/>

						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={deletedEmployees?.tableData}
							rowClassName={'clickable-row'}
							twoToneRows
							scroll={{ x: 800 }}
							onRow={(record) => ({
								className: 'noti-table-deleted-columns',
								onClick: () => {
									navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/{{employeeID}}', { employeeID: record.id })))
								}
							})}
							useCustomPagination
							pagination={{
								pageSize: deletedEmployees?.data?.pagination?.limit,
								total: deletedEmployees?.data?.pagination?.totalCount,
								current: deletedEmployees?.data?.pagination?.page,
								onChange: onChangePagination,
								disabled: deletedEmployees?.isLoading
							}}
						/>
					</Spin>
				</div>
			</Col>
		</Row>
	)
}

export default DeletedEmployeesTable
