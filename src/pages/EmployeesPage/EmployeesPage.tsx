import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, TabsProps } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { compose } from 'redux'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import TabsComponent from '../../components/TabsComponent'
import ActiveEmployeesTable from './components/ActiveEmployeesTable'
import DeletedEmployeesTable from './components/DeletedEmployeesTable'

// utils
import { EMPLOYEES_TAB_KEYS, ENUMERATIONS_KEYS, FORM, PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getActiveEmployees, getDeletedEmployees } from '../../reducers/employees/employeesActions'
import { getServices } from '../../reducers/services/serviceActions'
import { RootState } from '../../reducers'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schema
import { employeesPagePageURLQueryParams } from '../../schemas/queryParams'

const EmployeesPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props

	const [query, setQuery] = useQueryParams(employeesPagePageURLQueryParams, {
		page: 1,
		order: 'orderIndex:asc',
		employeeState: EMPLOYEES_TAB_KEYS.ACTIVE
	})

	const [prefixOptions, setPrefixOptions] = useState<{ [key: string]: string }>({})
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX]).enumerationsOptions

	useEffect(() => {
		const prefixes: { [key: string]: string } = {}

		phonePrefixes.forEach((option) => {
			prefixes[option.key] = option.label
		})

		setPrefixOptions(prefixes)
	}, [phonePrefixes, dispatch])

	useEffect(() => {
		dispatch(initialize(FORM.EMPLOYEES_FILTER, { search: query.search, serviceID: query.serviceID, accountState: query.accountState }))
		if (query.employeeState === EMPLOYEES_TAB_KEYS.ACTIVE) {
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
	}, [dispatch, query.accountState, query.limit, query.order, query.page, query.search, query.serviceID, salonID, query.employeeState])

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
		// NOTE: ak sa zmeni tab a v jednom by ostali query params, tak treba premazat kedze to nie je robene ako osobitne routy
		setQuery({
			page: undefined,
			limit: undefined,
			order: undefined,
			search: undefined,
			accountState: undefined,
			serviceID: undefined,
			employeeState: key
		})
	}
	const tabContent: TabsProps['items'] = [
		{
			key: EMPLOYEES_TAB_KEYS.ACTIVE,
			label: <>{t('loc:Aktívni')}</>,
			children: <ActiveEmployeesTable prefixOptions={prefixOptions} parentPath={parentPath} query={query} setQuery={setQuery} salonID={salonID} />
		},
		{
			key: EMPLOYEES_TAB_KEYS.DELETED,
			label: <>{t('loc:Vymazaní')}</>,
			children: <DeletedEmployeesTable prefixOptions={prefixOptions} parentPath={parentPath} query={query} setQuery={setQuery} salonID={salonID} />
		}
	]

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<TabsComponent className={'box-tab'} activeKey={query.employeeState} onChange={onTabChange} destroyInactiveTabPane items={tabContent} />
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(EmployeesPage)
