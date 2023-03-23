import React from 'react'
import qs from 'qs'
import decode from 'jwt-decode'
import { get } from 'lodash'
import { Navigate, RouteProps } from 'react-router-dom'
import i18next from 'i18next'

// routes
import BaseRoute from './BaseRoute'

// utils
import { TOKEN_AUDIENCE } from '../utils/enums'
import { isLoggedIn } from '../utils/auth'

type Props = RouteProps & {
	translatePathKey?: string
	layout: any
	className?: string
}

const CancelReservationRoute = (props: Props) => {
	// t je query param pre token (nie preklad)
	const { t } = qs.parse(document.location.search, { ignoreQueryPrefix: true })

	/* if (!t) {
		return <Navigate to={i18next.t('paths:index')} />
	} */

	const payload = decode(t as string)
	const isValidToken = true

	// if user is already logged In or token does not exist redirect to index route
	if (isValidToken) {
		return <BaseRoute {...(props as any)} token={t} />
	}

	return <Navigate to={i18next.t('paths:index')} />
}

export default CancelReservationRoute
