import React, { FC, useMemo, useCallback, useEffect } from 'react'
import { Switch, useRouteMatch, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import AuthRoute from './AuthRoute'

// utils
import { PAGE } from '../utils/enums'

// redux
import { selectSalon } from '../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, IComputedMatch, ILoadingAndFailure } from '../types/interfaces'

// layouts
import MainLayout from '../layouts/MainLayout'

// services
import ServicesPage from '../pages/ServicesPage/ServicesPage'
import ServicePage from '../pages/ServicesPage/ServicePage'

// Salons
import SalonsPage from '../pages/SalonsPage/SalonsPage'
import SalonPage from '../pages/SalonsPage/SalonPage'

// Customers
import CustomersPage from '../pages/CustomersPage/CustomersPage'
import CustomerPage from '../pages/CustomersPage/CustomerPage'
import CreateCustomerPage from '../pages/CustomersPage/CreateCustomerPage'

// Employees
import EmployeesPage from '../pages/EmployeesPage/EmployeesPage'
import EmployeePage from '../pages/EmployeesPage/EmployeePage'
import CreateEmployeePage from '../pages/EmployeesPage/CreateEmployeePage'

const SalonSubRoutes: FC = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { path, url, params } = useRouteMatch()
	console.log('🚀 ~ file: SalonSubRoutes.tsx ~ line 43 ~ params', params)
	console.log('🚀 ~ file: SalonSubRoutes.tsx ~ line 43 ~ url', url)
	console.log('🚀 ~ file: SalonSubRoutes.tsx ~ line 43 ~ path', path)
	const { salonID } = params as any

	const getPath = useCallback((pathSuffix: string) => `${path}${pathSuffix}`, [path])

	useEffect(() => {
		dispatch(selectSalon(salonID))
	}, [salonID, dispatch])

	console.log('🚀 ~ file: SalonSubRoutes.tsx ~ line 39 ~ salonID', salonID)

	return (
		<Switch>
			{/* SALON DETAIL */}
			<AuthRoute exact path={path} component={SalonPage} translatePathKey={path} salonID={salonID} layout={MainLayout} page={PAGE.SALONS} />
			{/* CUSTOMERS */}
			<AuthRoute
				exact
				path={getPath(t('paths:customers/create'))}
				component={CreateCustomerPage}
				translatePathKey={getPath(t('paths:customers/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:customers/{{customerID}}', { customerID: ':customerID' }))}
				component={CustomerPage}
				translatePathKey={getPath(t('paths:customers/{{customerID}}', { customerID: ':customerID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:customers'))}
				component={CustomersPage}
				translatePathKey={getPath(t('paths:customers'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
			/>
			{/* SERVICES */}
			<AuthRoute
				exact
				path={getPath(t('paths:services'))}
				component={ServicesPage}
				translatePathKey={getPath(t('paths:services'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:services/create'))}
				component={ServicePage}
				translatePathKey={getPath(t('paths:services/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:services/{{serviceID}}', { serviceID: ':serviceID' }))}
				component={ServicePage}
				translatePathKey={getPath(t('paths:services/{{serviceID}}', { serviceID: ':serviceID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES}
			/>
			{/* EMPLOYEES */}
			<AuthRoute
				exact
				path={getPath(t('paths:employees'))}
				component={EmployeesPage}
				translatePathKey={getPath(t('paths:employees'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:employees/create'))}
				component={CreateEmployeePage}
				translatePathKey={getPath(t('paths:employees/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:employees/{{employeeID}}', { employeeID: ':employeeID' }))}
				component={EmployeePage}
				translatePathKey={getPath(t('paths:employees/{{employeeID}}', { employeeID: ':employeeID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
			/>
		</Switch>
	)
}

export default SalonSubRoutes
