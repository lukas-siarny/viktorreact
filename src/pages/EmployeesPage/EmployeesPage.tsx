import React, { FC, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin, Tabs, TabsProps } from 'antd'
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'
import { find } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { arrayMove } from '@dnd-kit/sortable'

// components
import CustomTable from '../../components/CustomTable'
import Breadcrumbs from '../../components/Breadcrumbs'
import EmployeesFilter, { IEmployeesFilter } from './components/EmployeesFilter'
import PopoverList from '../../components/PopoverList'
import TooltipEllipsis from '../../components/TooltipEllipsis'
import UserAvatar from '../../components/AvatarComponents'

// utils
import { ENUMERATIONS_KEYS, FORM, PERMISSION, ROW_GUTTER_X_DEFAULT, NOTIFICATION_TYPE } from '../../utils/enums'
import { getLinkWithEncodedBackUrl, normalizeDirectionKeys, setOrder } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'

// reducers
import { getDeletedEmployees, getEmployees, reorderEmployees } from '../../reducers/employees/employeesActions'
import { RootState } from '../../reducers'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { IBreadcrumbs, SalonSubPageProps, Columns } from '../../types/interfaces'

// assets
import { ReactComponent as CloudOfflineIcon } from '../../assets/icons/cloud-offline.svg'
import { ReactComponent as QuestionIcon } from '../../assets/icons/question.svg'
import { patchReq } from '../../utils/request'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'
import TabsComponent from '../../components/TabsComponent'

enum TAB_KEYS {
	ACTIVE = 'active',
	DELETED = 'deleted'
}

const EmployeesPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { salonID, parentPath } = props
	const employees = useSelector((state: RootState) => state.employees.employees)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions
	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})
	const [tabKey, setTabKey] = useState<TAB_KEYS | undefined>()

	const [query, setQuery] = useQueryParams({
		search: StringParam(),
		limit: NumberParam(),
		page: NumberParam(1),
		order: StringParam('orderIndex:asc'),
		accountState: StringParam(),
		serviceID: StringParam(),
		salonID: StringParam()
	})

	useEffect(() => {
		dispatch(initialize(FORM.EMPLOYEES_FILTER, { search: query.search, serviceID: query.serviceID, accountState: query.accountState }))
		dispatch(
			getDeletedEmployees({
				page: query.page,
				limit: 1000, // TODO: ked bude state tak dat 25
				order: query.order,
				search: query.search,
				accountState: query.accountState, // TODO: tu sa bude posielat DELETED state
				serviceID: query.serviceID,
				salonID
			})
		)
		dispatch(
			getEmployees({
				page: query.page,
				limit: query.limit,
				order: query.order,
				search: query.search,
				accountState: query.accountState,
				serviceID: query.serviceID,
				salonID
			})
		)
	}, [dispatch, query.accountState, query.limit, query.order, query.page, query.search, query.serviceID, salonID])

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

	const handleDrop = useCallback(
		async (oldIndex: number, newIndex: number) => {
			try {
				const employee = find(employees?.tableData, { orderIndex: oldIndex })
				// oldIndex je v tomto pripade employee.orderIndex
				if (employee?.id && oldIndex !== newIndex) {
					// ordering v dnd libke je od 0 .. n ale na BE je od 1 ... n
					const reorderedData = arrayMove(employees?.tableData, employee.orderIndex - 1, newIndex - 1)
					// Akcia na update data v reduxe
					dispatch(reorderEmployees(reorderedData))
					// Update na BE
					await patchReq(
						`/api/b2b/admin/employees/{employeeID}/reorder`,
						{ employeeID: employee?.id },
						{ orderIndex: newIndex },
						undefined,
						NOTIFICATION_TYPE.NOTIFICATION,
						true
					)
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				// Data treba vzdy updatnut aj po uspesnom alebo neuspesom requeste. Aby sa pri dalsiom a dalsiom reorderi pracovalo s aktualne updatnutymi datami.
				dispatch(
					getEmployees({
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
		},
		[dispatch, employees.tableData, query.accountState, query.limit, query.order, query.page, query.search, query.serviceID, salonID]
	)
	const onTabChange = (key: any) => {
		setTabKey(key)
	}
	const tabContent: TabsProps['items'] = [
		{
			key: TAB_KEYS.ACTIVE,
			label: <>{t('loc:Aktívni')}</>
			// children: <div>prve</div>
		},
		{
			key: TAB_KEYS.DELETED,
			label: <>{t('loc:Vymazaní')}</>
			// children: <div>druhe</div>
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={tabKey} onChange={onTabChange} destroyInactiveTabPane items={tabContent} />
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(EmployeesPage)
