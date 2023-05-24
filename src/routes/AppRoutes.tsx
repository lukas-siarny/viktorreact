import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// authorized pages
import HomePage from '../pages/HomePage/HomePage'

// routes middlewares
import PublicRoute from './PublicRoute'
import AuthRoute from './AuthRoute'
import CreatePasswordRoute from './CreatePasswordRoute'
import CancelReservationRoute from './CancelReservationRoute'

// layouts
import MainLayout from '../layouts/MainLayout'
import PublicLayout from '../layouts/PublicLayout'

// utils
import { NEW_SALON_ID, PAGE, SALONS_TAB_KEYS } from '../utils/enums'

// Auth
import LoginPage from '../pages/LoginPage/LoginPage'
import CreatePasswordPage from '../pages/CreatePasswordPage/CreatePasswordPage'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'
import ActivationPage from '../pages/ActivationPage/ActivationPage'

// Users
import UsersPage from '../pages/UsersPage/UsersPage'
import CreateUserPage from '../pages/UsersPage/CreateUserPage'
import EditUserPage from '../pages/UsersPage/EditUserPage'
import MyProfilePage from '../pages/UsersPage/MyProfilePage'

// Categories
import CategoriesPage from '../pages/CategoriesPage/CategoriesPage'

// Category params
import CategoryParamsPage from '../pages/CategoryParamsPage/CategoryParamsPage'
import CreateCategoryParamsPage from '../pages/CategoryParamsPage/CreateCategoryParamsPage'
import EditCategoryParamsPage from '../pages/CategoryParamsPage/EditCategoryParamsPage'

// Cosmetics
import CosmeticsPage from '../pages/CosmeticsPage/CosmeticsPage'

// Languages
import LanguagesPage from '../pages/LanguagesPage/LanguagesPage'

// Salons
import SalonSubRoutes from './SalonSubRoutes'
import SalonsPage from '../pages/SalonsPage/SalonsPage'
import SalonPage from '../pages/SalonsPage/SalonPage'

// Support contacts
import SupportContactsPage from '../pages/SupportContactsPage/SupportContactsPage'
import SupportContactPage from '../pages/SupportContactsPage/SupportContactPage'
import ContactPage from '../pages/Contact/ContactPage'

// Specialist contacts
import SpecialistContactsPage from '../pages/SpecialistContactsPage/SpecialistContactsPage'

// Reviews
import ReviewsPage from '../pages/ReviewsPage/ReviewsPage'

// SMS Credits
import SmsCreditAdminPage from '../pages/SmsCreditAdminPage/SmsCreditAdminPage'
import SmsUnitPricesDetailPage from '../pages/SmsCreditAdminPage/SmsUnitPricesDetailPage'

// Documents

// Cancel reservation page
import CancelReservationPage from '../pages/CancelReservationPage/CancelReservationPage'

import AppInit from '../components/AppInit'

// 404, 403
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage'
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'
import ErrorBoundary from '../components/ErrorBoundary'
import RechargeSmsCreditAdminPage from '../pages/SmsCreditAdminPage/RechargeSmsCreditAdminPage'
import NotinoReservationsPage from '../pages/NotinoReservationsPage/NotinoReservationsPage'
import DocumentsPage from '../pages/DocumentsPage/DocumentsPage'

const AppRoutes: FC = () => {
	const [t] = useTranslation()
	return (
		<AppInit>
			<Routes>
				{/* // CreatePassword route */}
				<Route element={<CreatePasswordRoute layout={PublicLayout} className={'noti-login-page'} />}>
					<Route path={t('paths:reset-password')} element={<CreatePasswordPage />} />
				</Route>
				{/* // Public routes */}
				<Route errorElement={<ErrorBoundary />} element={<PublicRoute layout={PublicLayout} className={'noti-login-page'} />}>
					<Route path={t('paths:login')} element={<LoginPage />} />
					<Route path={t('paths:signup')} element={<RegistrationPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} element={<PublicRoute skipRedirectToLoginPage layout={PublicLayout} className={'noti-login-page'} />}>
					<Route path={t('paths:invite')} element={<RegistrationPage />} />
				</Route>
				<Route
					errorElement={<ErrorBoundary />}
					element={<PublicRoute skipRedirectToLoginPage showBackButton layout={PublicLayout} className={'noti-support-contact-page'} />}
				>
					<Route path={t('paths:contact')} element={<ContactPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} element={<CancelReservationRoute layout={PublicLayout} className={'noti-cancel-reservation-page'} />}>
					<Route path={t('paths:cancel-reservation')} element={<CancelReservationPage />} />
				</Route>
				{/* // Private Routes */}
				<Route errorElement={<ErrorBoundary />} element={<AuthRoute layout={MainLayout} page={PAGE.HOME} />}>
					<Route index element={<HomePage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:users')} element={<AuthRoute layout={MainLayout} page={PAGE.USERS} />}>
					<Route index element={<UsersPage />} />
					<Route path={':userID'} element={<EditUserPage />} />
					<Route path={t('paths:createEntity')} element={<CreateUserPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:my-account')} element={<AuthRoute layout={MainLayout} page={PAGE.MY_ACCOUNT} />}>
					<Route index element={<MyProfilePage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:activation')} element={<AuthRoute layout={MainLayout} page={PAGE.ACTIVATION} />}>
					<Route index element={<ActivationPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:salons')} element={<AuthRoute layout={MainLayout} page={PAGE.SALONS} />}>
					<Route index element={<SalonsPage tabKey={SALONS_TAB_KEYS.ACTIVE} />} />
					<Route path={t('paths:deleted')} element={<SalonsPage tabKey={SALONS_TAB_KEYS.DELETED} />} />
					<Route path={t('paths:rejected')} element={<SalonsPage tabKey={SALONS_TAB_KEYS.MISTAKES} />} />
					<Route path={t('paths:createEntity')} element={<SalonPage salonID={NEW_SALON_ID} />} />
				</Route>
				{/* // Salon view */}
				<Route errorElement={<ErrorBoundary />} path={t('paths:salons')}>
					<Route path={':salonID/*'} element={<SalonSubRoutes />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:categories')} element={<AuthRoute layout={MainLayout} page={PAGE.CATEGORIES} />}>
					<Route index element={<CategoriesPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:category-parameters')} element={<AuthRoute layout={MainLayout} page={PAGE.CATEGORY_PARAMETERS} />}>
					<Route index element={<CategoryParamsPage />} />
					<Route path={':parameterID'} element={<EditCategoryParamsPage />} />
					<Route path={t('paths:createEntity')} element={<CreateCategoryParamsPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:cosmetics')} element={<AuthRoute layout={MainLayout} page={PAGE.COSMETICS} />}>
					<Route index element={<CosmeticsPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:languages-in-salons')} element={<AuthRoute layout={MainLayout} page={PAGE.LANGUAGES} />}>
					<Route index element={<LanguagesPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:support-contacts')} element={<AuthRoute layout={MainLayout} page={PAGE.SUPPORT_CONTACTS} />}>
					<Route index element={<SupportContactsPage />} />
					<Route path={':supportContactID'} element={<SupportContactPage />} />
					<Route path={t('paths:createEntity')} element={<SupportContactPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:specialist-contacts')} element={<AuthRoute layout={MainLayout} page={PAGE.SPECIALIST_CONTACTS} />}>
					<Route index element={<SpecialistContactsPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:reviews')} element={<AuthRoute layout={MainLayout} page={PAGE.REVIEWS} />}>
					<Route index element={<ReviewsPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:documents')} element={<AuthRoute layout={MainLayout} page={PAGE.DOCUMENTS} />}>
					<Route index element={<DocumentsPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:reservations')} element={<AuthRoute layout={MainLayout} page={PAGE.NOTINO_RESERVATIONS} />}>
					<Route index element={<NotinoReservationsPage />} />
				</Route>
				<Route errorElement={<ErrorBoundary />} path={t('paths:sms-credits')} element={<AuthRoute layout={MainLayout} page={PAGE.SMS_CREDITS} />}>
					<Route index element={<SmsCreditAdminPage />} />
					<Route path={':countryCode'} element={<SmsUnitPricesDetailPage />} />
					<Route path={t('paths:recharge')} element={<RechargeSmsCreditAdminPage />} />
				</Route>
				<Route path={'/403'} element={<AuthRoute layout={MainLayout} />}>
					<Route index element={<ForbiddenPage />} />
				</Route>
				{/* // 404 */}
				<Route element={<AuthRoute layout={MainLayout} />}>
					<Route path={'*'} element={<NotFoundPage />} />
				</Route>
			</Routes>
		</AppInit>
	)
}

export default AppRoutes
