import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// authorized pages
import HomePage from '../pages/HomePage/HomePage'

// routes middlewares
import PublicRoute from './PublicRoute'
import AuthRoute from './AuthRoute'
import CreatePasswordRoute from './CreatePasswordRoute'

// layouts
import MainLayout from '../layouts/MainLayout'
import PublicLayout from '../layouts/PublicLayout'

// utils
import { NEW_SALON_ID, PAGE } from '../utils/enums'

// User
import LoginPage from '../pages/LoginPage/LoginPage'
import CreatePasswordPage from '../pages/CreatePasswordPage/CreatePasswordPage'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'
import ActivationPage from '../pages/ActivationPage/ActivationPage'
import UserPage from '../pages/UsersPage/UserPage'
import CreateUserPage from '../pages/UsersPage/CreateUserPage'
import UsersPage from '../pages/UsersPage/UsersPage'

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

import AppInit from '../components/AppInit'

// 404, 403
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage'
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'

const AppRoutes: FC = () => {
	const [t] = useTranslation()
	return (
		<AppInit>
			{/* <SalonSubRoutes /> */}
			<Routes>
				{/* // CreatePassword route */}
				<Route element={<CreatePasswordRoute layout={PublicLayout} className={'noti-login-page'} />}>
					<Route path={t('paths:reset-password')} element={<CreatePasswordPage />} />
				</Route>
				{/* // Public routes */}
				<Route element={<PublicRoute layout={PublicLayout} className={'noti-login-page'} />}>
					<Route path={t('paths:login')} element={<LoginPage />} />
					<Route path={t('paths:signup')} element={<RegistrationPage />} />
					<Route path={t('paths:invite')} element={<RegistrationPage />} />
				</Route>
				<Route element={<PublicRoute redirectLoggedInUser={false} showBackButton layout={PublicLayout} className={'noti-support-contact-page'} />}>
					<Route path={t('paths:contact')} element={<ContactPage />} />
				</Route>
				{/* // Private Routes */}
				<Route element={<AuthRoute layout={MainLayout} page={PAGE.HOME} />}>
					<Route index element={<HomePage />} />
				</Route>
				<Route path={t('paths:users')} element={<AuthRoute layout={MainLayout} page={PAGE.USERS} />}>
					<Route index element={<UsersPage />} />
					<Route path={':userID'} element={<UserPage />} />
					<Route path={t('paths:createEntity')} element={<CreateUserPage />} />
				</Route>
				<Route path={t('paths:my-account')} element={<AuthRoute layout={MainLayout} page={PAGE.MY_ACCOUNT} />}>
					<Route index element={<UserPage />} />
				</Route>
				<Route path={t('paths:activation')} element={<AuthRoute layout={MainLayout} page={PAGE.ACTIVATION} />}>
					<Route index element={<ActivationPage />} />
				</Route>
				<Route path={t('paths:salons')} element={<AuthRoute layout={MainLayout} page={PAGE.SALONS} />}>
					<Route index element={<SalonsPage />} />
					<Route path={t('paths:createEntity')} element={<SalonPage salonID={NEW_SALON_ID} />} />
				</Route>
				{/* // Salon view */}
				<Route path={t('paths:salons')}>
					<Route path={':salonID/*'} element={<SalonSubRoutes />} />
				</Route>
				<Route path={t('paths:categories')} element={<AuthRoute layout={MainLayout} page={PAGE.CATEGORIES} />}>
					<Route index element={<CategoriesPage />} />
				</Route>
				<Route path={t('paths:category-parameters')} element={<AuthRoute layout={MainLayout} page={PAGE.CATEGORY_PARAMETERS} />}>
					<Route index element={<CategoryParamsPage />} />
					<Route path={':parameterID'} element={<EditCategoryParamsPage />} />
					<Route path={t('paths:createEntity')} element={<CreateCategoryParamsPage />} />
				</Route>
				<Route path={t('paths:cosmetics')} element={<AuthRoute layout={MainLayout} page={PAGE.COSMETICS} />}>
					<Route index element={<CosmeticsPage />} />
				</Route>
				<Route path={t('paths:languages-in-salons')} element={<AuthRoute layout={MainLayout} page={PAGE.LANGUAGES} />}>
					<Route index element={<LanguagesPage />} />
				</Route>
				<Route path={t('paths:support-contacts')} element={<AuthRoute layout={MainLayout} page={PAGE.SUPPORT_CONTACTS} />}>
					<Route index element={<SupportContactsPage />} />
					<Route path={':supportContactID'} element={<SupportContactPage />} />
					<Route path={t('paths:createEntity')} element={<SupportContactPage />} />
				</Route>
				<Route path={t('paths:specialist-contacts')} element={<AuthRoute layout={MainLayout} page={PAGE.SPECIALIST_CONTACTS} />}>
					<Route index element={<SpecialistContactsPage />} />
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
