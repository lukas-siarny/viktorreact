import React, { FC } from 'react'
import { RouteProps, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import BaseRoute from './BaseRoute'
import { isLoggedIn } from '../utils/auth'
import LogoutUser from '../utils/LogoutUser'

type Props = RouteProps & {
	layout?: any
	translatePathKey?: string
	element?: any
	className?: string
	customProps?: Object
	showBackButton?: boolean
	logoutUser?: boolean
	skipRedirectToLoginPage?: boolean
}

const PublicRoute: FC<Props> = (props) => {
	const [t] = useTranslation()

	const { skipRedirectToLoginPage = false } = props

	if (!skipRedirectToLoginPage && isLoggedIn()) {
		return <Navigate to={t('paths:index')} />
	}

	return <BaseRoute {...props} />
}

const PublicRouteWrapper: FC<Props> = (props) => {
	return (
		<LogoutUser skipRedirectToLoginPage={props.skipRedirectToLoginPage}>
			<PublicRoute {...props} />
		</LogoutUser>
	)
}

export default PublicRouteWrapper
