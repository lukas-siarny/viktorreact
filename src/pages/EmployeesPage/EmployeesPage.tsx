import React, { FC, useEffect, useState } from 'react'
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
import EmployeesFilter, { IEmployeesFilter } from './components/EmployeesFilter'
import PopoverList from '../../components/PopoverList'
import TooltipEllipsis from '../../components/TooltipEllipsis'
import UserAvatar from '../../components/AvatarComponents'

// utils
import { ENUMERATIONS_KEYS, FORM, PAGINATION, PERMISSION, SALON_PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../utils/enums'
import { getEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { getEmployees } from '../../reducers/employees/employeesActions'
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'

// assets
import { ReactComponent as CloudOfflineIcon } from '../../assets/icons/cloud-offline.svg'
import { ReactComponent as QuestionIcon } from '../../assets/icons/question.svg'

type Columns = ColumnsType<any>

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const EmployeesPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const employees = useSelector((state: RootState) => state.employees.employees)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})

	const backUrl = getEncodedBackUrl()

	const [query, setQuery] = useQueryParams({
		search: StringParam,
		limit: NumberParam,
		page: withDefault(NumberParam, 1),
		order: withDefault(StringParam, 'createdAt:desc'),
		accountState: StringParam,
		serviceID: NumberParam,
		salonID: NumberParam
	})

	useEffect(() => {
		dispatch(initialize(FORM.EMPLOYEES_FILTER, { search: query.search, serviceID: query.serviceID, accountState: query.accountState }))
		dispatch(
			getEmployees({ page: query.page, limit: query.limit, order: query.order, search: query.search, accountState: query.accountState, serviceID: query.serviceID, salonID })
		)
	}, [dispatch, query.page, query.limit, query.search, query.order, query.accountState, query.serviceID, salonID])

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

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

	const handleSubmit = (values: IEmployeesFilter) => {
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
			key: 'lastName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(query.order, 'lastName'),
			width: '25%',
			render: (_value, record) => (
				<>
					<UserAvatar className='mr-2-5 w-7 h-7' src={record?.image?.resizedImages?.thumbnail} fallBackSrc={record?.image?.original} />
					{record?.firstName || record?.lastName ? `${record?.firstName} ${record?.lastName}`.trim() : '-'}
				</>
			)
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
			render: (value, record) => <>{value && prefixOptions[record?.phonePrefixCountryCode] ? `${prefixOptions[record?.phonePrefixCountryCode]} ${value}` : '-'}</>
		},
		{
			title: t('loc:Služby'),
			dataIndex: 'services',
			key: 'services',
			ellipsis: true,
			render: (value) => {
				return value && value.length ? <PopoverList elements={value.map((service: any) => ({ name: service.category.name }))} /> : '-'
			}
		},
		{
			title: t('loc:Stav konta'),
			dataIndex: 'hasActiveAccount',
			key: 'status',
			ellipsis: true,
			sorter: true,
			width: 90,
			sortOrder: setOrder(query.order, 'status'),
			render: (value, record) => (
				<div className={'flex justify-center'}>
					{value === false && !record?.inviteEmail ? (
						<TooltipEllipsis title={t('loc:Nespárované')}>
							<QuestionIcon width={20} height={20} />
						</TooltipEllipsis>
					) : undefined}
					{value === false && record?.inviteEmail ? (
						<TooltipEllipsis title={t('loc:Čakajúce')}>
							<CloudOfflineIcon width={20} height={20} />
						</TooltipEllipsis>
					) : undefined}
				</div>
			)
		}
	]

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zamestnancov')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Permissions
							allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<EmployeesFilter
									createEmployee={() => {
										if (hasPermission) {
											history.push(`${parentPath + t('paths:employees/create')}?backUrl=${backUrl}`)
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
							dataSource={employees?.data?.employees}
							rowClassName={'clickable-row'}
							loading={employees?.isLoading}
							twoToneRows
							scroll={{ x: 800 }}
							onRow={(record) => ({
								onClick: () => {
									history.push(`${parentPath + t('paths:employees/{{employeeID}}', { employeeID: record.id })}?backUrl=${backUrl}`)
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
								pageSize: employees?.data?.pagination?.limit,
								showSizeChanger: true,
								total: employees?.data?.pagination?.totalCount,
								current: employees?.data?.pagination?.page
							}}
						/>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(EmployeesPage)
