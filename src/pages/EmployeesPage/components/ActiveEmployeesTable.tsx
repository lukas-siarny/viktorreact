import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { arrayMove } from '@dnd-kit/sortable'

// utils
import { NOTIFICATION_TYPE, PERMISSION, ROW_GUTTER_X_DEFAULT } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../../utils/helper'
import { patchReq } from '../../../utils/request'

// components
import EmployeesFilter, { IEmployeesFilter } from './EmployeesFilter'
import CustomTable from '../../../components/CustomTable'
import UserAvatar from '../../../components/AvatarComponents'
import PopoverList from '../../../components/PopoverList'
import TooltipEllipsis from '../../../components/TooltipEllipsis'

// redux
import { RootState } from '../../../reducers'
import { getActiveEmployees, reorderEmployees } from '../../../reducers/employees/employeesActions'

// assets
import { ReactComponent as CloudOfflineIcon } from '../../../assets/icons/cloud-offline-icon.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/icons/question-icon.svg'

// types
import { Columns } from '../../../types/interfaces'
import { IEmployeesPageURLQueryParams } from '../../../schemas/queryParams'

type Props = {
	parentPath?: string
	query: IEmployeesPageURLQueryParams
	setQuery: (newValues: IEmployeesPageURLQueryParams) => void
	salonID: string
	prefixOptions: any
}

const ActiveEmployeesTable = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { parentPath, query, setQuery, salonID, prefixOptions } = props
	const navigate = useNavigate()
	const activeEmployees = useSelector((state: RootState) => state.employees.activeEmployees)

	const onChangePagination = (page: number, limit: number) => {
		const newQuery = {
			...query,
			limit,
			page: limit === activeEmployees?.data?.pagination?.limit ? page : 1
		}
		setQuery(newQuery)
	}

	const handleSubmitActive = (values: IEmployeesFilter) => {
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
			title: <span id={'sortby-account-status'}>{t('loc:Stav konta')}</span>,
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

	const handleDrop = useCallback(
		async (oldID: string, newID?: string) => {
			if (oldID && newID && oldID !== newID) {
				let newOrderIndex: number | undefined
				let newIndex: number | undefined
				let oldIndex: number | undefined

				for (let i = 0; i < activeEmployees?.tableData.length; i += 1) {
					if (newIndex !== undefined && oldIndex !== undefined) {
						break
					}
					if (activeEmployees?.tableData[i].id === oldID) {
						oldIndex = i
					}
					if (activeEmployees?.tableData[i].id === newID) {
						newIndex = i
						newOrderIndex = activeEmployees?.tableData[i].orderIndex
					}
				}
				if (oldIndex !== undefined && newIndex !== undefined && newOrderIndex !== undefined) {
					try {
						const reorderedData = arrayMove(activeEmployees?.tableData, oldIndex, newIndex)
						// Akcia na update data v reduxe
						dispatch(reorderEmployees(reorderedData))
						// Update na BE
						await patchReq(
							`/api/b2b/admin/employees/{employeeID}/reorder`,
							{ employeeID: oldID },
							{ orderIndex: newOrderIndex },
							undefined,
							NOTIFICATION_TYPE.NOTIFICATION,
							true
						)
					} catch (e) {
						// eslint-disable-next-line no-console
						console.error(e)
					} finally {
						// Data treba vzdy updatnut aj po uspesnom alebo neuspesom requeste. Aby sa pri dalsom a dalsom reorderi pracovalo s aktualne updatnutymi datami.
						dispatch(
							getActiveEmployees({
								page: query.page,
								limit: query.limit,
								order: query.order,
								search: query.search,
								accountState: query.accountState,
								serviceID: query.serviceID,
								salonID
							})
						)
					}
				}
			}
		},
		[dispatch, activeEmployees.tableData, query.accountState, query.limit, query.order, query.page, query.search, query.serviceID, salonID]
	)

	return (
		<Row gutter={ROW_GUTTER_X_DEFAULT}>
			<Col span={24}>
				<div className='content-body'>
					<Spin spinning={activeEmployees?.isLoading}>
						<Permissions
							allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<EmployeesFilter
									createEmployee={() => {
										if (hasPermission) {
											navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/create')))
										} else {
											openForbiddenModal()
										}
									}}
									onSubmit={handleSubmitActive}
								/>
							)}
						/>

						<CustomTable
							className='table-fixed'
							onChange={onChangeTable}
							columns={columns}
							dataSource={activeEmployees.tableData}
							rowClassName={'clickable-row'}
							dnd={{ dndDrop: handleDrop }}
							twoToneRows
							scroll={{ x: 800 }}
							onRow={(record) => ({
								onClick: () => {
									navigate(getLinkWithEncodedBackUrl(parentPath + t('paths:employees/{{employeeID}}', { employeeID: record.id })))
								}
							})}
							useCustomPagination
							pagination={{
								pageSize: activeEmployees?.data?.pagination?.limit,
								total: activeEmployees?.data?.pagination?.totalCount,
								current: activeEmployees?.data?.pagination?.page,
								onChange: onChangePagination,
								disabled: activeEmployees?.isLoading
							}}
						/>
					</Spin>
				</div>
			</Col>
		</Row>
	)
}

export default ActiveEmployeesTable
