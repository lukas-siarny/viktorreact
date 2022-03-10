import React, { useEffect, FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteProps } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import IdleTimer from 'react-idle-timer'
import { Dictionary } from 'lodash'

// routes
import BaseRoute from './BaseRoute'

// redux
// import * as UserActions from '../reducers/users/userActions'

// utils
import { isLoggedIn } from '../utils/auth'
import { PAGE, ENUMERATIONS_KEYS, SUBMENU_PARENT } from '../utils/enums'
import { RootState } from '../reducers'

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
	// eslint-disable-next-line
	const user = useSelector((state: RootState) => state.user) // NOTE: auth Route has to listen on change user state cause of log in action
	const dispatch = useDispatch()
	const [t] = useTranslation()

	useEffect(() => {
		if (!isLoggedIn()) {
			// dispatch(UserActions.logOutUser())
			console.log('User is not logged...')
		}

		// dispatch(UserActions.getAuthUserProfile())
	}, [t, dispatch])

	// if (!isLoggedIn()) {
	// 	return <Redirect to={t('paths:prihlasenie')} />
	// }
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
