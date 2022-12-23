import React, { FC, useCallback, useEffect } from 'react'
import { Switch, useRouteMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { includes } from 'lodash'

import AuthRoute from './AuthRoute'

// utils
import { PAGE } from '../utils/enums'
import { isAdmin } from '../utils/Permissions'
import { history } from '../utils/history'

// redux
import { RootState } from '../reducers'
import { selectSalon } from '../reducers/selectedSalon/selectedSalonActions'

// layouts
import MainLayout from '../layouts/MainLayout'

// services
import ServicesPage from '../pages/ServicesPage/ServicesPage'
import ServicePage from '../pages/ServicesPage/ServicePage'

// Salons
import SalonPage from '../pages/SalonsPage/SalonPage'

// Customers
import CustomersPage from '../pages/CustomersPage/CustomersPage'
import CustomerPage from '../pages/CustomersPage/CustomerPage'
import CreateCustomerPage from '../pages/CustomersPage/CreateCustomerPage'

// Employees
import EmployeesPage from '../pages/EmployeesPage/EmployeesPage'
import EmployeePage from '../pages/EmployeesPage/EmployeePage'
import CreateEmployeePage from '../pages/EmployeesPage/CreateEmployeePage'

// Industries
import IndustriesPage from '../pages/IndustriesPage/IndustriesPage'
import IndustryPage from '../pages/IndustriesPage/IndustryPage'

// Billing info
import BillingInfoPage from '../pages/BillingInfoPage/BillingInfoPage'

// calendar
import Calendar from '../pages/Calendar/Calendar'

// reservations-settings
import ReservationsSettingsPage from '../pages/ReservationsSettingsPage/ReservationsSettingsPage'

// 404
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'

const redirectoToForbiddenPage = () => {
	history.push('/403')
}

const SalonSubRoutes: FC = (props) => {
	const { path, url, params } = useRouteMatch()

	const { salonID } = (params as any) || {}

	if (!salonID) {
		redirectoToForbiddenPage()
	}

	const [t] = useTranslation()
	const dispatch = useDispatch()

	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)

	const getPath = useCallback((pathSuffix: string) => `${path}${pathSuffix}`, [path])

	useEffect(() => {
		if (currentUser.isLoading) {
			return
		}
		if (currentUser.data) {
			// Only SUPER_ADMIN, ADMIN or PARTNER with assigned salon
			if (
				isAdmin(currentUser.data.uniqPermissions) ||
				includes(
					currentUser.data.salons.map((salon) => salon.id),
					salonID
				)
			) {
				if (selectedSalon?.id !== salonID) {
					dispatch(selectSalon(salonID))
				}
			} else {
				redirectoToForbiddenPage()
			}
		}
	}, [salonID, dispatch, currentUser, selectedSalon?.id])

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
				preventShowDeletedSalon
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
				preventShowDeletedSalon
			/>
			{/* SERVICES */}
			<AuthRoute
				exact
				path={getPath(t('paths:services-settings'))}
				component={ServicesPage}
				parentPath={url}
				translatePathKey={getPath(t('paths:services-settings'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES_SETTINGS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:services-settings/{{serviceID}}', { serviceID: ':serviceID' }))}
				component={ServicePage}
				parentPath={url}
				translatePathKey={getPath(t('paths:services-settings/{{serviceID}}', { serviceID: ':serviceID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES_SETTINGS}
				preventShowDeletedSalon
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
				preventShowDeletedSalon
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
				preventShowDeletedSalon
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
				preventShowDeletedSalon
			/>
			{/* Industries */}
			<AuthRoute
				exact
				path={getPath(t('paths:industries-and-services'))}
				component={IndustriesPage}
				parentPath={url}
				translatePathKey={getPath(t('paths:industries-and-services'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.INDUSTRIES_AND_SERVICES}
				preventShowDeletedSalon
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:industries-and-services/{{industryID}}', { industryID: ':industryID' }))}
				component={IndustryPage}
				parentPath={url}
				translatePathKey={getPath(t('paths:industries-and-services/{{industryID}}', { industryID: ':industryID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.INDUSTRIES_AND_SERVICES}
				preventShowDeletedSalon
			/>
			{/* Billing info */}
			<AuthRoute
				exact
				path={getPath(t('paths:billing-info'))}
				component={BillingInfoPage}
				parentPath={url}
				translatePathKey={getPath(t('paths:billing-info'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.BILLING_INFO}
				preventShowDeletedSalon
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:calendar'))}
				component={Calendar}
				parentPath={url}
				translatePathKey={getPath(t('paths:calendar'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CALENDAR}
				extra={{
					contentClassName: 'z-30'
				}}
				preventShowDeletedSalon
			/>
			<AuthRoute
				exact
				path={getPath(t('paths:reservations-settings'))}
				component={ReservationsSettingsPage}
				parentPath={url}
				translatePathKey={getPath(t('paths:reservations-settings'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.RESERVATIONS_SETTINGS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				{...props}
				component={NotFoundPage} // NOTE: for non auth route just let the user redirect on login page
				layout={MainLayout}
			/>
		</Switch>
	)
}

export default SalonSubRoutes
