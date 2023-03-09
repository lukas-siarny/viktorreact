import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, TabsProps } from 'antd'
import { useDispatch } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { FORM, PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getActiveEmployees, getDeletedEmployees } from '../../reducers/employees/employeesActions'
import { getServices } from '../../reducers/services/serviceActions'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'

// hooks
import useQueryParams, { NumberParam, StringParam } from '../../hooks/useQueryParams'
import TabsComponent from '../../components/TabsComponent'
import EmployeesTable from './components/EmployeesTable'
import DeletedEmployeesTable from './components/DeletedEmployeesTable'

enum TAB_KEYS {
	ACTIVE = 'active',
	DELETED = 'deleted'
}

const EmployeesPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props

	const [tabKey, setTabKey] = useState<TAB_KEYS | undefined>(TAB_KEYS.DELETED)

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
		if (tabKey === TAB_KEYS.ACTIVE) {
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
		} else {
			dispatch(
				getDeletedEmployees({
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
	}, [dispatch, query.accountState, query.limit, query.order, query.page, query.search, query.serviceID, salonID, tabKey])

	useEffect(() => {
		dispatch(getServices({ salonID }))
	}, [salonID, dispatch])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zamestnancov')
			}
		]
	}

	const onTabChange = (key: any) => {
		// NOTE: ak sa zmeni tab a v jednom by ostali query params tak treba premazat kedze to nie je robotene ako osobitne page
		setQuery({
			page: undefined,
			limit: undefined,
			order: undefined,
			search: undefined,
			accountState: undefined,
			serviceID: undefined
		})
		setTabKey(key)
	}
	const tabContent: TabsProps['items'] = [
		{
			key: TAB_KEYS.ACTIVE,
			label: <>{t('loc:Aktívni')}</>,
			children: <EmployeesTable parentPath={parentPath} query={query} setQuery={setQuery} salonID={salonID} />
		},
		{
			key: TAB_KEYS.DELETED,
			label: <>{t('loc:Vymazaní')}</>,
			children: <DeletedEmployeesTable parentPath={parentPath} query={query} setQuery={setQuery} salonID={salonID} />
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
