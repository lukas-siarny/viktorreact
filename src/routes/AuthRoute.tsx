import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteProps } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import { Dictionary } from 'lodash'

// routes
import BaseRoute from './BaseRoute'

// utils
import { isLoggedIn } from '../utils/auth'
import { PAGE, SUBMENU_PARENT, REFRESH_PAGE_INTERVAL } from '../utils/enums'
import { getPath } from '../utils/history'

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
}

const onIdle = () => {
	document.location.reload()
}

const AuthRoute: FC<Props> = (props) => {
	const [t] = useTranslation()

	if (!isLoggedIn()) {
		return <Redirect to={getPath(t('paths:login'))} />
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
			<BaseRoute {...(props as any)} />
		</>
	)
}

export default AuthRoute
