import React, { FC, useCallback, useEffect } from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { includes } from 'lodash'

import AuthRoute from './AuthRoute'

// utils
import { PAGE, PERMISSION } from '../utils/enums'
import { checkPermissions } from '../utils/Permissions'
import { history } from '../utils/history'

// redux
import { RootState } from '../reducers'
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

const redirectoToForbiddenPage = () => {
	history.push('/403')
}

const SalonSubRoutes: FC = () => {
	const { path, url, params } = useRouteMatch()

	const salonID = Number((params as any).salonID)

	if (!salonID || Number.isNaN(salonID)) {
		redirectoToForbiddenPage()
	}

	const [t] = useTranslation()
	const dispatch = useDispatch()

	const currentUser = useSelector((state: RootState) => state.user.authUser)

	const getPath = useCallback((pathSuffix: string) => `${path}${pathSuffix}`, [path])

	useEffect(() => {
		if (currentUser.data) {
			// Only SUPER_ADMIN, ADMIN or PARTNER with assigned salon
			if (
				checkPermissions(currentUser.data.uniqPermissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]) ||
				includes(
					currentUser.data.salons.map((salon) => salon.id),
					salonID
				)
			) {
				dispatch(selectSalon(salonID))
			} else {
				redirectoToForbiddenPage()
			}
		}
	}, [salonID, dispatch, currentUser])

	return (
		<Switch>
			{/* SALON DETAIL */}
			<AuthRoute exact path={path} component={SalonPage} translatePathKey={path} salonID={salonID} layout={MainLayout} page={PAGE.SALONS} />
			{/* CUSTOMERS */}
			<AuthRoute
				exact
				path={getPath(t('paths:customers/create'))}
				component={CreateCustomerPage}
				parentPath={url}
				translatePathKey={getPath(t('paths:customers/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:customers/{{customerID}}', { customerID: ':customerID' }))}
				component={CustomerPage}
				parentPath={url}
				translatePathKey={getPath(t('paths:customers/{{customerID}}', { customerID: ':customerID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:customers'))}
				component={CustomersPage}
				parentPath={url}
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
				parentPath={url}
				translatePathKey={getPath(t('paths:services'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:services/create'))}
				component={ServicePage}
				parentPath={url}
				translatePathKey={getPath(t('paths:services/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:services/{{serviceID}}', { serviceID: ':serviceID' }))}
				component={ServicePage}
				parentPath={url}
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
				parentPath={url}
				translatePathKey={getPath(t('paths:employees'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:employees/create'))}
				component={CreateEmployeePage}
				parentPath={url}
				translatePathKey={getPath(t('paths:employees/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:employees/{{employeeID}}', { employeeID: ':employeeID' }))}
				component={EmployeePage}
				parentPath={url}
				translatePathKey={getPath(t('paths:employees/{{employeeID}}', { employeeID: ':employeeID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
			/>
		</Switch>
	)
}

export default SalonSubRoutes
