import React, { FC } from 'react'
import { Switch, Route } from 'react-router-dom'
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
import { PAGE } from '../utils/enums'

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

import AppInit from '../components/AppInit'

// 404, 403
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage'
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'

const Routes: FC = (props) => {
	const [t] = useTranslation()

	return (
		<AppInit>
			<Switch>
				<PublicRoute {...props} exact path={t('paths:login')} component={LoginPage} layout={PublicLayout} className={'noti-login-page'} />
				<PublicRoute {...props} exact path={t('paths:signup')} component={RegistrationPage} layout={PublicLayout} className={'noti-login-page'} />
				<PublicRoute
					{...props}
					exact
					path={t('paths:contact')}
					component={ContactPage}
					layout={PublicLayout}
					redirectLoggedInUser={false}
					className={'noti-support-contact-page'}
					showBackButton
				/>
				<CreatePasswordRoute
					exact
					path={t('paths:reset-password')}
					translatePathKey={t('paths:reset-password')}
					component={CreatePasswordPage}
					layout={PublicLayout}
					className={'noti-login-page'}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:users/create')}
					component={CreateUserPage}
					translatePathKey={t('paths:users/create')}
					layout={MainLayout}
					page={PAGE.USERS}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:users/{{userID}}', { userID: ':userID' })}
					translatePathKey={t('paths:users/{{userID}}', { userID: ':userID' })}
					component={UserPage}
					layout={MainLayout}
					page={PAGE.USERS}
				/>
				<AuthRoute {...props} exact path={t('paths:users')} component={UsersPage} translatePathKey={t('paths:users')} layout={MainLayout} page={PAGE.USERS} />
				<AuthRoute {...props} exact path={t('paths:my-account')} translatePathKey={t('paths:my-account')} component={UserPage} layout={MainLayout} page={PAGE.MY_ACCOUNT} />
				<AuthRoute {...props} exact path={t('paths:index')} component={HomePage} translatePathKey={t('paths:index')} layout={MainLayout} page={PAGE.HOME} />
				<AuthRoute
					{...props}
					exact
					path={t('paths:activation')}
					component={ActivationPage}
					translatePathKey={t('paths:activation')}
					layout={MainLayout}
					page={PAGE.ACTIVATION}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:salons/create')}
					component={SalonPage}
					translatePathKey={t('paths:salons/create')}
					layout={MainLayout}
					page={PAGE.SALONS}
					// override selected salon ID - 0 indicates CREATE form
					salonID={0}
				/>
				<Route {...props} path={t('paths:salons/{{salonID}}', { salonID: ':salonID' })} component={SalonSubRoutes} />

				<AuthRoute {...props} exact path={t('paths:salons')} component={SalonsPage} translatePathKey={t('paths:salons')} layout={MainLayout} page={PAGE.SALONS} />
				<AuthRoute
					{...props}
					exact
					path={t('paths:categories')}
					component={CategoriesPage}
					translatePathKey={t('paths:categories')}
					layout={MainLayout}
					page={PAGE.CATEGORIES}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:cosmetics')}
					component={CosmeticsPage}
					translatePathKey={t('paths:cosmetics')}
					layout={MainLayout}
					page={PAGE.COSMETICS}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:languages-in-salons')}
					component={LanguagesPage}
					translatePathKey={t('paths:languages-in-salons')}
					layout={MainLayout}
					page={PAGE.LANGUAGES}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:support-contacts')}
					component={SupportContactsPage}
					translatePathKey={t('paths:support-contacts')}
					layout={MainLayout}
					page={PAGE.SUPPORT_CONTACTS}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:support-contacts/create')}
					component={SupportContactPage}
					translatePathKey={t('paths:support-contacts/create')}
					layout={MainLayout}
					page={PAGE.SUPPORT_CONTACT}
				/>
				<AuthRoute
					{...props}
					exact
					path={t('paths:support-contacts/{{supportContactID}}', { supportContactID: ':supportContactID' })}
					translatePathKey={t('paths:support-contacts/{{supportContactID}}', { supportContactID: ':supportContactID' })}
					component={SupportContactPage}
					layout={MainLayout}
					page={PAGE.SUPPORT_CONTACT}
				/>
				{/* NOTE: add all private routes before this declaration */}
				<AuthRoute {...props} path={'/403'} component={ForbiddenPage} layout={MainLayout} />
				<AuthRoute
					{...props}
					component={NotFoundPage} // NOTE: for non auth route just let the user redirect on login page
					layout={MainLayout}
				/>
			</Switch>
		</AppInit>
	)
}

export default Routes
