import React, { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params'
import { Col, Row, Spin } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { find } from 'lodash'
import { useNavigate, useSearchParams } from 'react-router-dom'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import EmployeesFilter, { IEmployeesFilter } from './components/EmployeesFilter'
import PopoverList from '../../components/PopoverList'
import TooltipEllipsis from '../../components/TooltipEllipsis'
import UserAvatar from '../../components/AvatarComponents'

// utils
import { ENUMERATIONS_KEYS, FORM, PERMISSION, SALON_PERMISSION, ROW_GUTTER_X_DEFAULT, NOTIFICATION_TYPE } from '../../utils/enums'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys, normalizeSearchQueryParams, setOrder } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { getEmployees } from '../../reducers/employees/employeesActions'
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { IBreadcrumbs, SalonSubPageProps, Columns } from '../../types/interfaces'

// assets
import { ReactComponent as CloudOfflineIcon } from '../../assets/icons/cloud-offline.svg'
import { ReactComponent as QuestionIcon } from '../../assets/icons/question.svg'
import { patchReq } from '../../utils/request'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const EmployeesPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { salonID, parentPath } = props
	const employees = useSelector((state: RootState) => state.employees.employees)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})

	// const [query, setQuery] = useQueryParams({
	// 	search: StringParam,
	// 	limit: NumberParam,
	// 	page: withDefault(NumberParam, 1),
	// 	order: withDefault(StringParam, 'orderIndex:asc'),
	// 	accountState: StringParam,
	// 	serviceID: StringParam,
	// 	salonID: StringParam
	// })

	const [searchParams, setSearchParams] = useSearchParams({
		search: '',
		limit: '',
		page: '1',
		order: 'orderIndex:ASC',
		accountState: '',
		serviceID: '',
		salonID: ''
	})

	const searchParamsObj = Object.fromEntries(searchParams)

	useEffect(() => {
		dispatch(
			initialize(FORM.EMPLOYEES_FILTER, { search: searchParams.get('search'), serviceID: searchParams.get('serviceID'), accountState: searchParams.get('accountState') })
		)
		dispatch(
			getEmployees({
				page: searchParams.get('page'),
				limit: searchParams.get('limit'),
				order: searchParams.get('order'),
				search: searchParams.get('search'),
				accountState: searchParams.get('accountState'),
				serviceID: searchParams.get('serviceID'),
				salonID
			})
		)
	}, [dispatch, searchParams, salonID])

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

		phonePrefixes.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes, dispatch])

	useEffect(() => {
		dispatch(getServices({ salonID }))
	}, [salonID, dispatch])

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

	const handleSubmit = (values: IEmployeesFilter) => {
		const newQuery = {
			...searchParamsObj,
			...values,
			page: 1
		}
		setSearchParams(normalizeSearchQueryParams(newQuery))
	}

	const columns: Columns = [
		{
			title: t('loc:Meno'),
			dataIndex: 'fullName',
			key: 'lastName',
			ellipsis: true,
			sorter: true,
			sortOrder: setOrder(searchParams.get('order'), 'lastName'),
			width: '25%',
			render: (_value, record) => {
				return (
					<>
						<UserAvatar className='mr-2-5 w-7 h-7' src={record?.image?.resizedImages?.thumbnail} fallBackSrc={record?.image?.original} />
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
		},
		{
			title: t('loc:Stav konta'),
			dataIndex: 'hasActiveAccount',
			key: 'status',
			ellipsis: true,
			sorter: true,
			width: 90,
			sortOrder: setOrder(searchParams.get('order'), 'status'),
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

	const handleDrop = useCallback(
		async (oldIndex: number, newIndex: number) => {
			try {
				const employee = find(employees?.data?.employees, { orderIndex: oldIndex + 1 })
				if (employee?.id && oldIndex !== newIndex) {
					await patchReq(
						`/api/b2b/admin/employees/{employeeID}/reorder`,
						{ employeeID: employee?.id },
						{ orderIndex: newIndex + 1 },
						undefined,
						NOTIFICATION_TYPE.NOTIFICATION,
						true
					)
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				// NOTE: V pripade ak BE reorder zlyha pouzi povodne radenie
				dispatch(
					getEmployees({
						page: searchParams.get('page'),
						limit: searchParams.get('limit'),
						order: searchParams.get('order'),
						search: searchParams.get('search'),
						accountState: searchParams.get('accountState'),
						serviceID: searchParams.get('serviceID'),
						salonID
					})
				)
			}
		},
		[dispatch, employees?.data?.employees, searchParams, salonID]
	)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={employees?.isLoading}>
							<Permissions
								allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_CREATE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<EmployeesFilter
										createEmployee={() => {
											if (hasPermission) {
												navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/create')))
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
								rowKey='orderIndex'
								dndEnabled
								dndDrop={handleDrop}
								twoToneRows
								scroll={{ x: 800 }}
								onRow={(record) => ({
									onClick: () => {
										navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/{{employeeID}}', { employeeID: record.id })))
									}
								})}
								useCustomPagination
								pagination={{
									pageSize: employees?.data?.pagination?.limit,
									total: employees?.data?.pagination?.totalCount,
									current: employees?.data?.pagination?.page,
									onChange: onChangePagination,
									disabled: employees?.isLoading
								}}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions(permissions))(EmployeesPage)
