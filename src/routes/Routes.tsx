import React, { FC } from 'react'
import { Switch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// starting page
import EntryPage from '../pages/EntryPage/EntryPage'

// routes middlewares
import PublicRoute from './PublicRoute'
import AuthRoute from './AuthRoute'
import CreatePasswordRoute from './CreatePasswordRoute'

// layouts
import MainLayout from '../layouts/MainLayout'
import SimpleLayout from '../layouts/SimpleLayout'

// utils
import { PAGE } from '../utils/enums'
// import { SUBMENU_PARENT_ITEMS } from '../utils/helper'

// import SubMenuPage from '../components/SubMenuPage'

// User
import LoginPage from '../pages/LoginPage/LoginPage'
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage'
import CreatePasswordPage from '../pages/CreatePasswordPage/CreatePasswordPage'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage'

// accommodationFacilities
// import AccommodationFacilitiesPage from '../pages/AccommodationFacilityPage/AccommodationFacilitiesPage'

// 404, 403
import ForbiddenPage from '../pages/ErrorPages/ForbiddenPage'
import NotFoundPage from '../pages/ErrorPages/NotFoundPage'

// TODO remove test page
function TestPage() {
	return <div style={{ height: '1000px' }}>hello</div>
}

const Routes: FC = (props) => {
	const [t] = useTranslation()
	return (
		<Switch>
			{/* <AuthRoute
				{...props}
				exact
				page={PAGE.GENERAL}
				path={t('paths:obecne')}
				translatePathKey='paths:obecne'
				component={SubMenuPage}
				layout={MainLayout}
				submenuParent={SUBMENU_PARENT_ITEMS().GENERAL}
			/>
			<AuthRoute
				{...props}
				exact
				path={t('paths:inventar')}
				translatePathKey='paths:inventar'
				component={SubMenuPage}
				layout={MainLayout}
				page={PAGE.INVENTORY}
				submenuParent={SUBMENU_PARENT_ITEMS().INVENTORY}
			/>
			<AuthRoute
				{...props}
				exact
				path={t('paths:produkty')}
				translatePathKey='paths:produkty'
				component={SubMenuPage}
				layout={MainLayout}
				page={PAGE.PRODUCTS}
				submenuParent={SUBMENU_PARENT_ITEMS().PRODUCTS}
			/>
			<AuthRoute
				{...props}
				exact
				path={t('paths:predaj')}
				translatePathKey='paths:predaj'
				component={SubMenuPage}
				layout={MainLayout}
				page={PAGE.SALES}
				submenuParent={SUBMENU_PARENT_ITEMS().SALES}
			/> */}
			<PublicRoute {...props} exact path={t('paths:prihlasenie')} component={LoginPage} layout={SimpleLayout} />
			<PublicRoute {...props} exact path={t('paths:registracia')} component={RegistrationPage} layout={SimpleLayout} />
			<PublicRoute {...props} exact path={t('paths:zabudnute-heslo')} component={ForgotPasswordPage} layout={SimpleLayout} />
			<CreatePasswordRoute exact path={t('paths:obnovenie-hesla')} translatePathKey={'paths:obnovenie-hesla'} component={CreatePasswordPage} layout={SimpleLayout} />
			{/* <CreatePasswordRoute
				exact
				path={t('paths:dokoncenie-registracie')}
				translatePathKey={'paths:dokoncenie-registracie'}
				component={AdminConfirmUserPage}
				layout={SimpleLayout}
			/> */}
			{/* <AuthRoute {...props} exact path={t('paths:index')} component={EntryPage} page={PAGE.ENTRY} translatePathKey={'paths:index'} layout={MainLayout} /> */}
			<PublicRoute {...props} exact path={t('paths:index')} component={EntryPage} layout={SimpleLayout} />

			{/* <AuthRoute
				{...props}
				exact
				path={t('paths:inventar/ubytovacie-zariadenia')}
				component={AccommodationFacilitiesPage}
				translatePathKey={'paths:inventar/ubytovacie-zariadenia'}
				page={PAGE.ACCOMMODATION_FACILITIES}
				layout={MainLayout}
			/> */}
			<AuthRoute {...props} exact path={t('paths:prehlad')} translatePathKey='paths:prehlad' component={TestPage} layout={MainLayout} page={PAGE.OVERVIEW} />
			<AuthRoute {...props} exact path={t('paths:sluzby')} translatePathKey='paths:sluzby' component={TestPage} layout={MainLayout} page={PAGE.SERVICES} />
			<AuthRoute {...props} exact path={t('paths:salon')} translatePathKey='paths:salon' component={TestPage} layout={MainLayout} page={PAGE.SALON} />

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
