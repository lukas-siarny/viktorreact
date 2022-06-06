import React, { FC, useEffect, useState } from 'react'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

// authorized pages
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
import { getCountries } from '../reducers/enumerations/enumerationActions'

// utils
import { REFRESH_TOKEN_INTERVAL, PAGE } from '../utils/enums'
import { setIntervalImmediately } from '../utils/helper'

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

// services
import ServicesPage from '../pages/ServicesPage/ServicesPage'
import ServicePage from '../pages/ServicesPage/ServicePage'

// Salons
import SalonsPage from '../pages/SalonsPage/SalonsPage'
import SalonPage from '../pages/SalonsPage/SalonPage'

// Customers
import CustomersPage from '../pages/CustomersPage/CustomersPage'
import CustomerPage from '../pages/CustomersPage/CustomerPage'
import CreateCustomerPage from '../pages/CustomersPage/CreateCustomerPage'

// Employees
import EmployeesPage from '../pages/EmployeesPage/EmployeesPage'

// 404, 403
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage'
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'

const Routes: FC = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [tokenLoading, setTokenLoading] = useState<boolean>(true)

	useEffect(() => {
		// set accessible enumeration data for whole app
		dispatch(getCountries())
		// repeat refreshing of tokens
		const refreshInterval = setIntervalImmediately(async () => {
			await dispatch(refreshToken())
			if (tokenLoading) {
				setTokenLoading(false)
			}
		}, REFRESH_TOKEN_INTERVAL)

		return () => {
			if (refreshInterval) {
				clearInterval(refreshInterval)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch])

	return (
		<>
			{!tokenLoading ? (
				<Switch>
					<PublicRoute {...props} exact path={t('paths:login')} component={LoginPage} layout={PublicLayout} />
					<PublicRoute {...props} exact path={t('paths:signup')} component={RegistrationPage} layout={PublicLayout} />
					<CreatePasswordRoute exact path={t('paths:reset-password')} translatePathKey={t('paths:reset-password')} component={CreatePasswordPage} layout={PublicLayout} />
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
					<AuthRoute
						{...props}
						exact
						path={t('paths:my-account')}
						translatePathKey={t('paths:my-account')}
						component={UserPage}
						layout={MainLayout}
						page={PAGE.MY_ACCOUNT}
					/>
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
					/>
					<AuthRoute
						{...props}
						exact
						path={t('paths:salons/{{salonID}}', { salonID: ':salonID' })}
						component={SalonPage}
						translatePathKey={t('paths:salons/{{salonID}}', { salonID: ':salonID' })}
						layout={MainLayout}
						page={PAGE.SALONS}
					/>
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
						path={t('paths:customers/create')}
						component={CreateCustomerPage}
						translatePathKey={t('paths:customers/create')}
						layout={MainLayout}
						page={PAGE.CUSTOMERS}
					/>
					<AuthRoute
						{...props}
						exact
						path={t('paths:customers/{{customerID}}', { customerID: ':customerID' })}
						component={CustomerPage}
						translatePathKey={t('paths:customers/{{customerID}}', { customerID: ':customerID' })}
						layout={MainLayout}
						page={PAGE.CUSTOMERS}
					/>
					<AuthRoute
						{...props}
						exact
						path={t('paths:customers')}
						component={CustomersPage}
						translatePathKey={t('paths:customers')}
						layout={MainLayout}
						page={PAGE.CUSTOMERS}
					/>
					<AuthRoute
						{...props}
						exact
						path={t('paths:services')}
						component={ServicesPage}
						translatePathKey={t('paths:services')}
						layout={MainLayout}
						page={PAGE.SERVICES}
					/>
					<AuthRoute
						{...props}
						exact
						path={t('paths:services/create')}
						component={ServicePage}
						translatePathKey={t('paths:services/create')}
						layout={MainLayout}
						page={PAGE.SERVICES}
					/>
					<AuthRoute
						{...props}
						exact
						path={t('paths:services/{{serviceID}}', { serviceID: ':serviceID' })}
						component={ServicePage}
						translatePathKey={t('paths:services/{{serviceID}}', { serviceID: ':serviceID' })}
						layout={MainLayout}
						page={PAGE.SERVICES}
					/>
					<AuthRoute
						{...props}
						exact
						path={t('paths:employees')}
						component={EmployeesPage}
						translatePathKey={t('paths:employees')}
						layout={MainLayout}
						page={PAGE.EMPLOYEES}
					/>
					{/* NOTE: add all private routes before this declaration */}
					<AuthRoute {...props} path={'/403'} component={ForbiddenPage} layout={MainLayout} />
					<AuthRoute
						{...props}
						component={NotFoundPage} // NOTE: for non auth route just let the user redirect on login page
						layout={MainLayout}
					/>
				</Switch>
			) : undefined}
		</>
	)
}

export default Routes
