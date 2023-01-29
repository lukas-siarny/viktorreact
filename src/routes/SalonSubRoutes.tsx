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
			{/* // TODO: doriesit parentPath */}
			{/* SALON DETAIL */}
			{/* // TODO: nefunguje detail? */}
			{/* <AuthRoute path={path} element={SalonPage} translatePathKey={path} salonID={salonID} layout={MainLayout} page={PAGE.SALONS} /> */}
			<Route element={<AuthRoute layout={MainLayout} page={PAGE.SALONS} />}>
				<Route index element={<SalonPage salonID={salonID as string} />} />
			</Route>
			{/* CUSTOMERS */}
			<Route path={t('paths:customers')} element={<AuthRoute layout={MainLayout} page={PAGE.CUSTOMERS} />}>
				<Route index element={<CustomersPage salonID={salonID} />} />
				<Route path={t('loc:createEntity')} element={<CreateCustomerPage salonID={salonID} />} />
				<Route path={':customerID'} element={<CustomerPage />} />
			</Route>
			{/* SERVICES */}
			<Route path={t('paths:services-settings')} element={<AuthRoute layout={MainLayout} page={PAGE.SERVICES_SETTINGS} />}>
				<Route index element={<ServicesPage salonID={salonID} />} />
				<Route path={':serviceID'} element={<ServicePage salonID={salonID as string} />} />
			</Route>
			{/* EMPLOYEES */}
			<Route path={t('paths:employees')} element={<AuthRoute layout={MainLayout} page={PAGE.EMPLOYEES} />}>
				<Route index element={<EmployeesPage salonID={salonID} />} />
				<Route path={t('loc:createEntity')} element={<CreateEmployeePage salonID={salonID} />} />
				<Route path={':employeeID'} element={<EmployeePage salonID={salonID as string} />} />
			</Route>
			{/* INDUSTRIES */}
			<Route path={t('paths:industries-and-services')} element={<AuthRoute layout={MainLayout} page={PAGE.INDUSTRIES_AND_SERVICES} />}>
				<Route index element={<IndustriesPage salonID={salonID} />} />
				<Route path={':industryID'} element={<IndustryPage salonID={salonID as string} />} />
			</Route>
			{/* BILLING INFO */}
			<Route path={t('paths:billing-info')} element={<AuthRoute layout={MainLayout} page={PAGE.BILLING_INFO} />}>
				<Route index element={<BillingInfoPage salonID={salonID} />} />
			</Route>
			{/* CALENDAR */}
			<Route
				path={t('paths:calendar')}
				element={
					<AuthRoute
						extra={{
							contentClassName: 'z-30'
						}}
						layout={MainLayout}
						page={PAGE.CALENDAR}
					/>
				}
			>
				<Route index element={<Calendar salonID={salonID} />} />
			</Route>
			{/* RESERVATIONS */}
			<Route path={t('paths:reservations')} element={<AuthRoute layout={MainLayout} page={PAGE.RESERVATIONS} />}>
				<Route index element={<ReservationsPage salonID={salonID} />} />
			</Route>
			{/* RESERVATIONS SETTINGS */}
			<Route path={t('paths:reservations-settings')} element={<AuthRoute layout={MainLayout} page={PAGE.SALON_SETTINGS} />}>
				<Route index element={<ReservationsSettingsPage salonID={salonID} />} />
			</Route>
			{/* 404 */}
			<Route element={<AuthRoute layout={MainLayout} />}>
				<Route path={'*'} element={<NotFoundPage />} />
			</Route>
		</Routes>
	)
}

export default SalonSubRoutes
