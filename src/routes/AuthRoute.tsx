import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteProps, useLocation } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import { Dictionary } from 'lodash'
import { useSelector } from 'react-redux'

// routes
import BaseRoute from './BaseRoute'

// reducers
import { RootState } from '../reducers'

// utils
import { isLoggedIn } from '../utils/auth'
import { PAGE, SUBMENU_PARENT, REFRESH_PAGE_INTERVAL } from '../utils/enums'

type Props = RouteProps & {
	layout: React.ReactNode
	component: React.ReactNode
	translatePathKey?: string
	page?: PAGE
	submenuParent?: {
		name: string
		key: SUBMENU_PARENT
	}
	/** e.g. tabKey or other extra props for page */
	extra?: Dictionary<any>
	salonID?: string
	parentPath?: string
	preventShowDeletedSalon?: boolean
}

const onIdle = () => {
	document.location.reload()
}

const AuthRoute: FC<Props> = (props) => {
	const { page } = props
	const [t] = useTranslation()
	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const isActivated = currentUser.data?.activateAt
	const { pathname, search } = useLocation()

	if (!isLoggedIn()) {
		/**
		 * v pripade, ze uzivatel nebol prihlaseny a v prehliadaci zvolil nejaku autorizovanu URL, tak ho to redirectne na login pagu
		 * do statu si ulozime URL, z ktorej bol presmerovany a nasledne po uspesnom prihlaseny presmerujeme naspät
		 */
		return (
			<Redirect
				to={{
					pathname: t('paths:login'),
					state: { redirectFrom: pathname + search }
				}}
			/>
		)
	}

	// account is not activated, redirect to route '/activation'
	if (!isActivated && page !== PAGE.ACTIVATION) {
		return currentUser.isLoading || !currentUser.data ? <></> : <Redirect to={t('paths:activation')} />
	}

	// account is activated, disabled route '/activation'
	if (!!isActivated && page === PAGE.ACTIVATION) {
		return <Redirect to={t('paths:index')} />
	}

	return (
		<>
			{/* NOTE: prevent to have cached app version */}
			<IdleTimer
				element={document}
				onIdle={onIdle}
				debounce={250}
				timeout={REFRESH_PAGE_INTERVAL} // refresh page if user is longer time inactive
			/>
			<BaseRoute {...(props as any)} showNavigation={page !== PAGE.ACTIVATION} />
		</>
	)
}

export default AuthRoute
