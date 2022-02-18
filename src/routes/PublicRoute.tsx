import React, { FC } from 'react'
import { RouteProps, Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import BaseRoute from './BaseRoute'
import { isLoggedIn } from '../utils/auth'

type Props = RouteProps & {
	layout: any
	translatePathKey?: string
	component: any
}

const PublicRoute: FC<Props> = (props) => {
	const [t] = useTranslation()
	if (isLoggedIn()) {
		return <Redirect to={t('paths:index')} />
	}
	return <BaseRoute {...props} />
}

export default PublicRoute
