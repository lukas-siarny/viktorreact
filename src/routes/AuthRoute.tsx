import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteProps } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import { Dictionary } from 'lodash'
import { useDispatch } from 'react-redux'

// routes
import BaseRoute from './BaseRoute'

// utils
import { isLoggedIn } from '../utils/auth'
import { PAGE, SUBMENU_PARENT, REFRESH_TOKEN_INTERVAL, REFRESH_PAGE_INTERVAL } from '../utils/enums'
import { getPath } from '../utils/history'

// redux
import { refreshToken } from '../reducers/users/userActions'

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
	const dispatch = useDispatch()
	const { redirectTo } = props

	useEffect(() => {
		const refreshInterval = setInterval(dispatch(refreshToken), REFRESH_TOKEN_INTERVAL)

		return () => {
			if (refreshInterval) {
				clearInterval(refreshInterval)
			}
		}
	}, [dispatch])

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
				timeout={REFRESH_PAGE_INTERVAL} // refresh page if user is longer time inactive
			/>
			<BaseRoute {...(props as any)} />
		</>
	)
}

export default AuthRoute
