import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteProps } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import { Dictionary } from 'lodash'

// routes
import BaseRoute from './BaseRoute'

// utils
import { isLoggedIn } from '../utils/auth'
import { PAGE, SUBMENU_PARENT } from '../utils/enums'
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
	redirectTo?: string
}

const onIdle = () => {
	document.location.reload()
}

const AuthRoute: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { redirectTo } = props

	if (!isLoggedIn()) {
		return <Redirect to={getPath(t('paths:login'))} />
	}

	if (redirectTo) {
		return <Redirect to={redirectTo} />
	}

	return (
		<>
			{/* NOTE: prevent to have cached app version */}
			<IdleTimer
				element={document}
				onIdle={onIdle}
				debounce={250}
				timeout={1000 * 60 * 60 * 4} // refresh page if user is more than 4 hours inactive
			/>
			<BaseRoute {...(props as any)} />
		</>
	)
}

export default AuthRoute
