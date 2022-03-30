import React, { FC, useEffect } from 'react'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

// authorized pages
import EntryPage from '../pages/EntryPage/EntryPage'
import HomePage from '../pages/HomePage/HomePage'

// routes middlewares
import PublicRoute from './PublicRoute'
import AuthRoute from './AuthRoute'
import CreatePasswordRoute from './CreatePasswordRoute'

// layouts
import MainLayout from '../layouts/MainLayout'
import PublicLayout from '../layouts/PublicLayout'

// redux
import { refreshToken } from '../reducers/users/userActions'

// utils
import { REFRESH_TOKEN_INTERVAL, PAGE } from '../utils/enums'
import { setIntervalImmediately } from '../utils/helper'

// import SubMenuPage from '../components/SubMenuPage'

// User
import LoginPage from '../pages/LoginPage/LoginPage'
import CreatePasswordPage from '../pages/CreatePasswordPage/CreatePasswordPage'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'
import UserAccountPage from '../pages/UserAccountPage/UserAccountPage'
import AdminUsersPage from '../pages/AdminUsersPage/AdminUsersPage'
import ActivationPage from '../pages/ActivationPage/ActivationPage'
import CreateUserAccountPage from '../pages/UserAccountPage/CreateUserAccountPage'

// Categories
import CategoriesPage from '../pages/CategoriesPage/CategoriesPage'

// services
import ServicesPage from '../pages/ServicesPage/ServicesPage'

// Salons
import SalonsPage from '../pages/SalonsPage/SalonsPage'
import SalonPage from '../pages/SalonPage/SalonPage'

// 404, 403
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage'
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'

const Routes: FC = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		const refreshInterval = setIntervalImmediately(() => dispatch(refreshToken()), REFRESH_TOKEN_INTERVAL)

		return () => {
			if (refreshInterval) {
				clearInterval(refreshInterval)
			}
		}
	}, [dispatch])

	return (
		<Switch>
			<PublicRoute {...props} exact path={t('paths:login')} component={LoginPage} layout={PublicLayout} />
			<PublicRoute {...props} exact path={t('paths:signup')} component={RegistrationPage} layout={PublicLayout} />
			<CreatePasswordRoute exact path={t('paths:reset-password')} translatePathKey={t('paths:reset-password')} component={CreatePasswordPage} layout={PublicLayout} />
			<AuthRoute
				{...props}
				exact
				path={t('paths:user-detail/{{userID}}', { userID: ':userID' })}
				translatePathKey={t('paths:user-detail/{{userID}}', { userID: ':userID' })}
				component={UserAccountPage}
				layout={MainLayout}
			/>
			<AuthRoute {...props} exact path={t('paths:user/create')} component={CreateUserAccountPage} translatePathKey={t('paths:user/create')} layout={MainLayout} />
			<AuthRoute {...props} exact path={t('paths:my-account')} translatePathKey={t('paths:my-account')} component={UserAccountPage} layout={MainLayout} />
			<AuthRoute {...props} exact path={t('paths:index')} component={EntryPage} translatePathKey={t('paths:index')} layout={MainLayout} />
			<AuthRoute {...props} exact path={t('paths:home')} component={HomePage} translatePathKey={t('paths:home')} layout={MainLayout} page={PAGE.HOME} />
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
				path={t('paths:salon/{{salonID}}', { salonID: ':salonID' })}
				component={SalonPage}
				translatePathKey={t('paths:salon/{{salonID}}', { salonID: ':salonID' })}
				layout={MainLayout}
				page={PAGE.SALON}
			/>
			<AuthRoute {...props} exact path={t('paths:salons')} component={SalonsPage} translatePathKey={t('paths:salons')} layout={MainLayout} page={PAGE.SALONS} />
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
			<AuthRoute {...props} exact path={t('paths:users')} component={AdminUsersPage} translatePathKey={t('paths:users')} layout={MainLayout} page={PAGE.USERS} />
			<AuthRoute
				{...props}
				exact
				path={t('paths:my-account')}
				component={UserAccountPage}
				translatePathKey={t('paths:my-account')}
				layout={MainLayout}
				page={PAGE.MY_ACCOUNT}
			/>
			<AuthRoute {...props} exact path={t('paths:services')} component={ServicesPage} translatePathKey={t('paths:services')} layout={MainLayout} page={PAGE.SERVICES} />
			{/* NOTE: add all private routes before this declaration */}
			<AuthRoute {...props} path={'/403'} component={ForbiddenPage} layout={MainLayout} />
			<AuthRoute
				{...props}
				component={NotFoundPage} // NOTE: for non auth route just let the user redirect on login page
				layout={MainLayout}
			/>
		</Switch>
	)
}

export default Routes
