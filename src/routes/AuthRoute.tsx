import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteProps } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import { Dictionary } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

// routes
import BaseRoute from './BaseRoute'

// reducers
import { RootState } from '../reducers'

// utils
import { isLoggedIn } from '../utils/auth'
import { PAGE, SUBMENU_PARENT, REFRESH_PAGE_INTERVAL } from '../utils/enums'
import { getPath } from '../utils/history'
import { getCurrentUser } from '../reducers/users/userActions'

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
	const { page } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const currentUser = useSelector((state: RootState) => state.user.authUser)
	const isActivated = currentUser.data?.activateAt

	useEffect(() => {
		dispatch(getCurrentUser())
	}, [dispatch])

	if (!isLoggedIn()) {
		return <Redirect to={getPath(t('paths:login'))} />
	}

	// account is not activated, redirect to route '/activation'
	if (!isActivated && page !== PAGE.ACTIVATION) {
		return currentUser.isLoading || !currentUser.data ? <></> : <Redirect to={getPath(t('paths:activation'))} />
	}

	// account is activated, disabled route '/activation'
	if (!!isActivated && page === PAGE.ACTIVATION) {
		return <Redirect to={getPath(t('paths:index'))} />
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
