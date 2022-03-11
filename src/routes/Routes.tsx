import React, { FC } from 'react'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// authorized pages
import EntryPage from '../pages/EntryPage/EntryPage'
import HomePage from '../pages/HomePage/HomePage'

// routes middlewares
import PublicRoute from './PublicRoute'
import AuthRoute from './AuthRoute'
import CreatePasswordRoute from './CreatePasswordRoute'

// layouts
import MainLayout from '../layouts/MainLayout'
import SimpleLayout from '../layouts/SimpleLayout'

// utils
import { getPath } from '../utils/history'
// import { SUBMENU_PARENT_ITEMS } from '../utils/helper'
import { PAGE } from '../utils/enums'

// import SubMenuPage from '../components/SubMenuPage'

// User
import LoginPage from '../pages/LoginPage/LoginPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import CreatePasswordPage from '../pages/CreatePasswordPage/CreatePasswordPage'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'

// 404, 403
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage'
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'

const Routes: FC = (props) => {
	const [t] = useTranslation()

	return (
		<Switch>
			<PublicRoute {...props} exact path={getPath(t('paths:login'))} component={LoginPage} layout={SimpleLayout} />
			<PublicRoute {...props} exact path={getPath(t('paths:signup'))} component={RegistrationPage} layout={SimpleLayout} />
			<CreatePasswordRoute
				exact
				path={getPath(t('paths:reset-password'))}
				translatePathKey={getPath(t('paths:reset-password'))}
				component={CreatePasswordPage}
				layout={SimpleLayout}
			/>
			<AuthRoute {...props} exact path={getPath(t('paths:index'))} component={EntryPage} translatePathKey={getPath(t('paths:index'))} layout={MainLayout} />
			<AuthRoute {...props} exact path={getPath(t('paths:home'))} component={HomePage} translatePathKey={getPath(t('paths:home'))} layout={MainLayout} page={PAGE.HOME} />
			<AuthRoute
				{...props}
				exact
				path={getPath(t('paths:my-account'))}
				component={EntryPage}
				translatePathKey={getPath(t('paths:my-account'))}
				layout={MainLayout}
				page={PAGE.MY_ACCOUNT}
			/>
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
