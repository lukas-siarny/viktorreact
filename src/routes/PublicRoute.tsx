import React, { FC } from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import BaseRoute from './BaseRoute'
import { isLoggedIn } from '../utils/auth'

type Props = RouteProps & {
	layout: any
	translatePathKey?: string
	component: any
	redirectLoggedInUser?: boolean
	className?: string
	customProps?: Object
	showBackButton?: boolean
}

const PublicRoute: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { redirectLoggedInUser = true } = props

	if (isLoggedIn() && redirectLoggedInUser) {
		return <Redirect to={t('paths:index')} />
	}

	return <BaseRoute {...props} />
}

export default PublicRoute
