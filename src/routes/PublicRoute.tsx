import React, { FC, useEffect } from 'react'
import { RouteProps, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'

import BaseRoute from './BaseRoute'
import { isLoggedIn } from '../utils/auth'
import { logOutUser } from '../reducers/users/userActions'

type Props = RouteProps & {
	layout?: any
	translatePathKey?: string
	element?: any
	redirectLoggedInUser?: boolean
	className?: string
	customProps?: Object
	showBackButton?: boolean
}

const PublicRoute: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { search } = useLocation()

	const { redirectLoggedInUser = true } = props

	const { logout } = queryString.parse(search, { decode: false })

	useEffect(() => {
		if (logout === 'true' && isLoggedIn()) {
			dispatch(logOutUser(true))
		}
	}, [logout, dispatch])

	if (isLoggedIn() && redirectLoggedInUser && logout !== 'true') {
		return <Navigate to={t('paths:index')} />
	}

	return <BaseRoute {...props} />
}

export default PublicRoute

/**
 * import React, { FC, PropsWithChildren, useEffect } from 'react'
import { RouteProps, Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import queryString from 'query-string'
import { useDispatch } from 'react-redux'

import BaseRoute from './BaseRoute'
import { isLoggedIn } from '../utils/auth'
import { logOutUser } from '../reducers/users/userActions'
import LogoutUserBeforeNavigate from '../utils/LogoutUserBeforeNavigate'

type Props = RouteProps & {
	layout?: any
	translatePathKey?: string
	element?: any
	redirectLoggedInUser?: boolean
	className?: string
	customProps?: Object
	showBackButton?: boolean
}

const PublicRoute: FC<Props> = (props) => {
	const [t] = useTranslation()

	const { redirectLoggedInUser = true } = props

	if (isLoggedIn() && redirectLoggedInUser) {
		console.log('bbbbb')
		return <Navigate to={t('paths:index')} />
	}

	return <BaseRoute {...props} />
}

const PublicRouteWrapper: FC<Props> = (props) => {
	return (
		<LogoutUserBeforeNavigate>
			<PublicRoute {...props} />
		</LogoutUserBeforeNavigate>
	)
}

export default PublicRouteWrapper

 */
