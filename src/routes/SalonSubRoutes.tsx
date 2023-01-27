import React, { FC, useCallback, useEffect } from 'react'
import { Route, Routes, useMatch, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { includes } from 'lodash'

import { useParams } from 'react-router'
import AuthRoute from './AuthRoute'

// utils
import { PAGE } from '../utils/enums'
import { isAdmin } from '../utils/Permissions'

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
import ReservationsPage from '../pages/ReservationsPage/ReservationsPage'
import HomePage from '../pages/HomePage/HomePage'

// const redirectoToForbiddenPage = () => {
// 	history.push('/403')
// }

const SalonSubRoutes: FC = (props) => {
	// TODO: useMatch nevracia tieto hodnoty z hooku
	// const { path, url, params } = useMatch()
	// TODO: odkial params brat?
	// const { salonID } = (params as any) || {}
	const navigate = useNavigate()
	const { salonID } = useParams()
	if (!salonID) {
		navigate('/403')
	}

	const [t] = useTranslation()
	const dispatch = useDispatch()

	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)
	const path = '' // TODO: opravit
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
				navigate('/403')
			}
		}
	}, [salonID, dispatch, currentUser, selectedSalon?.id])

	return (
		<Routes>
			{/* SALON DETAIL */}
			<Route element={<AuthRoute layout={MainLayout} page={PAGE.SALONS} />}>
				<Route index element={<SalonPage salonID={salonID as string} />} />
			</Route>
			{/* CUSTOMERS */}
			{/* SERVICES */}
			{/* EMPLOYEES */}
			{/* Industries */}
			{/* Billing info */}

			{/*
			<AuthRoute path={path} element={SalonPage} translatePathKey={path} salonID={salonID} layout={MainLayout} page={PAGE.SALONS} />
			<AuthRoute
				path={getPath(t('paths:customers/create'))}
				element={CreateCustomerPage}
				// TODO: parent path by nemalo byt uz potrebne
				// parentPath={url}
				translatePathKey={getPath(t('paths:customers/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
			/>
			<AuthRoute
				path={getPath(t('paths:customers/{{customerID}}', { customerID: ':customerID' }))}
				element={CustomerPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:customers/{{customerID}}', { customerID: ':customerID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:customers'))}
				element={CustomersPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:customers'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.CUSTOMERS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:services-settings'))}
				element={ServicesPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:services-settings'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES_SETTINGS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:services-settings/{{serviceID}}', { serviceID: ':serviceID' }))}
				element={ServicePage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:services-settings/{{serviceID}}', { serviceID: ':serviceID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SERVICES_SETTINGS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:employees'))}
				element={EmployeesPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:employees'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:employees/create'))}
				element={CreateEmployeePage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:employees/create'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:employees/{{employeeID}}', { employeeID: ':employeeID' }))}
				element={EmployeePage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:employees/{{employeeID}}', { employeeID: ':employeeID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.EMPLOYEES}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:industries-and-services'))}
				element={IndustriesPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:industries-and-services'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.INDUSTRIES_AND_SERVICES}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:industries-and-services/{{industryID}}', { industryID: ':industryID' }))}
				element={IndustryPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:industries-and-services/{{industryID}}', { industryID: ':industryID' }))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.INDUSTRIES_AND_SERVICES}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:billing-info'))}
				element={BillingInfoPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:billing-info'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.BILLING_INFO}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:calendar'))}
				element={Calendar}
				// parentPath={url}
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
				path={getPath(t('paths:reservations'))}
				element={ReservationsPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:reservations'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.RESERVATIONS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				path={getPath(t('paths:reservations-settings'))}
				element={ReservationsSettingsPage}
				// parentPath={url}
				translatePathKey={getPath(t('paths:reservations-settings'))}
				salonID={salonID}
				layout={MainLayout}
				page={PAGE.SALON_SETTINGS}
				preventShowDeletedSalon
			/>
			<AuthRoute
				{...props}
				element={NotFoundPage} // NOTE: for non auth route just let the user redirect on login page
				layout={MainLayout}
			/>
			*/}
		</Routes>
	)
}

export default SalonSubRoutes
