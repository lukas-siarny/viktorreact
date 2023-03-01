import React, { FC, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { includes } from 'lodash'
import { useParams } from 'react-router'

// Auth
import AuthRoute from './AuthRoute'

// utils
import { PAGE, PERMISSION } from '../utils/enums'
import { checkPermissions } from '../utils/Permissions'

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

// Calendar
import Calendar from '../pages/Calendar/Calendar'

// Reservations-settings
import ReservationsSettingsPage from '../pages/ReservationsSettingsPage/ReservationsSettingsPage'

// Reservations
import ReservationsPage from '../pages/ReservationsPage/ReservationsPage'

// SMS credit
import SmsCreditPage from '../pages/SmsCreditPage/SmsCreditPage'

// 404
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'
import ErrorBoundary from '../components/ErrorBoundary'

const SalonSubRoutes: FC = () => {
	const navigate = useNavigate()
	const { salonID } = useParams()
	if (!salonID) {
		navigate('/403')
	}

	const [t] = useTranslation()
	const dispatch = useDispatch()

	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const selectedSalon = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data)

	const parentPath = t('paths:salons/{{salonID}}', { salonID })

	useEffect(() => {
		if (currentUser.isLoading) {
			return
		}
		if (currentUser.data) {
			// Only NOTINO users or PARTNER with assigned salon
			if (
				checkPermissions(currentUser.data.uniqPermissions, [PERMISSION.NOTINO]) ||
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
			<Route errorElement={<ErrorBoundary />} element={<AuthRoute layout={MainLayout} page={PAGE.SALONS} />}>
				<Route index element={<SalonPage salonID={salonID as string} />} />
			</Route>
			{/* CUSTOMERS */}
			<Route errorElement={<ErrorBoundary />} path={t('paths:customers')} element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.CUSTOMERS} />}>
				<Route index element={<CustomersPage parentPath={parentPath} salonID={salonID} />} />
				<Route path={t('paths:createEntity')} element={<CreateCustomerPage parentPath={parentPath} salonID={salonID} />} />
				<Route path={':customerID'} element={<CustomerPage parentPath={parentPath} />} />
			</Route>
			{/* SERVICES */}
			<Route
				errorElement={<ErrorBoundary />}
				path={t('paths:services-settings')}
				element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.SERVICES_SETTINGS} />}
			>
				<Route index element={<ServicesPage parentPath={parentPath} salonID={salonID} />} />
				<Route path={':serviceID'} element={<ServicePage parentPath={parentPath} salonID={salonID as string} />} />
			</Route>
			{/* EMPLOYEES */}
			<Route errorElement={<ErrorBoundary />} path={t('paths:employees')} element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.EMPLOYEES} />}>
				<Route index element={<EmployeesPage parentPath={parentPath} salonID={salonID} />} />
				<Route path={t('paths:createEntity')} element={<CreateEmployeePage parentPath={parentPath} salonID={salonID} />} />
				<Route path={':employeeID'} element={<EmployeePage parentPath={parentPath} salonID={salonID as string} />} />
			</Route>
			{/* INDUSTRIES */}
			<Route
				errorElement={<ErrorBoundary />}
				path={t('paths:industries-and-services')}
				element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.INDUSTRIES_AND_SERVICES} />}
			>
				<Route path={':industryID'} element={<IndustryPage parentPath={parentPath} salonID={salonID as string} />} />
				<Route index element={<IndustriesPage parentPath={parentPath} salonID={salonID} />} />
			</Route>
			{/* BILLING INFO */}
			<Route errorElement={<ErrorBoundary />} path={t('paths:billing-info')} element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.BILLING_INFO} />}>
				<Route index element={<BillingInfoPage parentPath={parentPath} salonID={salonID} />} />
			</Route>
			{/* CALENDAR */}
			<Route
				errorElement={<ErrorBoundary />}
				path={t('paths:calendar')}
				element={
					<AuthRoute
						preventShowDeletedSalon
						parentPath={parentPath}
						extra={{
							contentClassName: 'z-30'
						}}
						layout={MainLayout}
						page={PAGE.CALENDAR}
					/>
				}
			>
				<Route index element={<Calendar salonID={salonID} parentPath={parentPath} />} />
			</Route>
			{/* RESERVATIONS */}
			<Route errorElement={<ErrorBoundary />} path={t('paths:reservations')} element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.RESERVATIONS} />}>
				<Route index element={<ReservationsPage parentPath={parentPath} salonID={salonID} />} />
			</Route>
			{/* RESERVATIONS SETTINGS */}
			<Route
				errorElement={<ErrorBoundary />}
				path={t('paths:reservations-settings')}
				element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.SALON_SETTINGS} />}
			>
				<Route index element={<ReservationsSettingsPage parentPath={parentPath} salonID={salonID} />} />
			</Route>
			<Route errorElement={<ErrorBoundary />} path={t('paths:sms-credit')} element={<AuthRoute preventShowDeletedSalon layout={MainLayout} page={PAGE.SMS_CREDIT} />}>
				<Route index element={<SmsCreditPage parentPath={parentPath} salonID={salonID} />} />
			</Route>
			{/* 404 */}
			<Route element={<AuthRoute layout={MainLayout} />}>
				<Route path={'*'} element={<NotFoundPage />} />
			</Route>
		</Routes>
	)
}

export default SalonSubRoutes
