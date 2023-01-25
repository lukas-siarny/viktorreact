import React, { FC } from 'react'
import { Routes, Route } from 'react-router-dom'
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
import { PAGE, NEW_SALON_ID } from '../utils/enums'

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

const AppRoutes: FC = (props) => {
	const [t] = useTranslation()

	return (
		<Routes>
			<Route path={'/nested'} element={<PublicRoute layout={PublicLayout} />}>
				<Route path={'detail'} element={<div>test2</div>} />
			</Route>
			{/* <Route {...props} element={<AuthRoute index translatePathKey={t('paths:index')} layout={MainLayout} page={PAGE.HOME} />}> */}
			{/*	<Route element={<HomePage />} /> */}
			{/* </Route> */}

			{/* <Route {...props} element={<AuthRoute {...props} />}> */}
			{/*	*/}
			{/* <AuthRoute {...props} path={t('paths:index')} element={<HomePage />} translatePathKey={t('paths:index')} layout={MainLayout} page={PAGE.HOME} /> */}
			{/* </Route> */}

			{/* <PublicRoute {...props} path={t('paths:login')} element={LoginPage} layout={PublicLayout} className={'noti-login-page'} /> */}
			{/* <PublicRoute {...props} path={t('paths:signup')} element={RegistrationPage} layout={PublicLayout} className={'noti-login-page'} /> */}
			{/* <PublicRoute {...props} path={t('paths:invite')} element={RegistrationPage} layout={PublicLayout} className={'noti-login-page'} /> */}
			{/* <PublicRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:contact')} */}
			{/*	element={ContactPage} */}
			{/*	layout={PublicLayout} */}
			{/*	redirectLoggedInUser={false} */}
			{/*	className={'noti-support-contact-page'} */}
			{/*	showBackButton */}
			{/* /> */}
			{/* /!* // TODO: hadze chybu *!/ */}
			{/* /!* <CreatePasswordRoute *!/ */}
			{/* /!*	path={t('paths:reset-password')} *!/ */}
			{/* /!*	translatePathKey={t('paths:reset-password')} *!/ */}
			{/* /!*	element={CreatePasswordPage} *!/ */}
			{/* /!*	layout={PublicLayout} *!/ */}
			{/* /!*	className={'noti-login-page'} *!/ */}
			{/* /!* /> *!/ */}
			{/* <AuthRoute {...props} path={t('paths:users/create')} element={CreateUserPage} translatePathKey={t('paths:users/create')} layout={MainLayout} page={PAGE.USERS} /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:users/{{userID}}', { userID: ':userID' })} */}
			{/*	translatePathKey={t('paths:users/{{userID}}', { userID: ':userID' })} */}
			{/*	element={UserPage} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.USERS} */}
			{/* /> */}
			{/* <AuthRoute {...props} path={t('paths:users')} element={<UsersPage />} translatePathKey={t('paths:users')} layout={MainLayout} page={PAGE.USERS} /> */}
			{/* <AuthRoute {...props} path={t('paths:my-account')} translatePathKey={t('paths:my-account')} element={UserPage} layout={MainLayout} page={PAGE.MY_ACCOUNT} /> */}
			{/* <AuthRoute {...props} path={t('paths:activation')} element={ActivationPage} translatePathKey={t('paths:activation')} layout={MainLayout} page={PAGE.ACTIVATION} /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:salons/create')} */}
			{/*	element={SalonPage} */}
			{/*	translatePathKey={t('paths:salons/create')} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.SALONS} */}
			{/*	// NOTE: override selected salon ID -> NEW_SALON_ID indicates CREATE form */}
			{/*	salonID={NEW_SALON_ID} */}
			{/* /> */}
			{/* <Route {...props} path={t('paths:salons/{{salonID}}', { salonID: ':salonID' })} element={<SalonSubRoutes />} /> */}

			{/* <AuthRoute {...props} path={t('paths:salons')} element={SalonsPage} translatePathKey={t('paths:salons')} layout={MainLayout} page={PAGE.SALONS} /> */}
			{/* <AuthRoute {...props} path={t('paths:categories')} element={CategoriesPage} translatePathKey={t('paths:categories')} layout={MainLayout} page={PAGE.CATEGORIES} /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:category-parameters')} */}
			{/*	element={CategoryParamsPage} */}
			{/*	translatePathKey={t('paths:category-parameters')} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.CATEGORY_PARAMETERS} */}
			{/* /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:category-parameters/create')} */}
			{/*	element={<CreateCategoryParamsPage />} */}
			{/*	translatePathKey={t('paths:category-parameters/create')} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.CATEGORY_PARAMETERS} */}
			{/* /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:category-parameters/{{parameterID}}', { parameterID: ':parameterID' })} */}
			{/*	element={EditCategoryParamsPage} */}
			{/*	translatePathKey={t('paths:category-parameters/{{parameterID}}', { parameterID: ':parameterID' })} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.CATEGORY_PARAMETERS} */}
			{/* /> */}
			{/* <AuthRoute {...props} path={t('paths:cosmetics')} element={CosmeticsPage} translatePathKey={t('paths:cosmetics')} layout={MainLayout} page={PAGE.COSMETICS} /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:languages-in-salons')} */}
			{/*	element={LanguagesPage} */}
			{/*	translatePathKey={t('paths:languages-in-salons')} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.LANGUAGES} */}
			{/* /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:support-contacts')} */}
			{/*	element={SupportContactsPage} */}
			{/*	translatePathKey={t('paths:support-contacts')} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.SUPPORT_CONTACTS} */}
			{/* /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:support-contacts/create')} */}
			{/*	element={SupportContactPage} */}
			{/*	translatePathKey={t('paths:support-contacts/create')} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.SUPPORT_CONTACTS} */}
			{/* /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:support-contacts/{{supportContactID}}', { supportContactID: ':supportContactID' })} */}
			{/*	translatePathKey={t('paths:support-contacts/{{supportContactID}}', { supportContactID: ':supportContactID' })} */}
			{/*	element={SupportContactPage} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.SUPPORT_CONTACTS} */}
			{/* /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	path={t('paths:specialist-contacts')} */}
			{/*	element={SpecialistContactsPage} */}
			{/*	translatePathKey={t('paths:specialist-contacts')} */}
			{/*	layout={MainLayout} */}
			{/*	page={PAGE.SPECIALIST_CONTACTS} */}
			{/* /> */}
			{/* /!* NOTE: add all private routes before this declaration *!/ */}
			{/* <AuthRoute {...props} path={'/403'} element={ForbiddenPage} layout={MainLayout} /> */}
			{/* <AuthRoute */}
			{/*	{...props} */}
			{/*	element={NotFoundPage} // NOTE: for non auth route just let the user redirect on login page */}
			{/*	layout={MainLayout} */}
			{/* /> */}
		</Routes>
	)
}

export default AppRoutes
