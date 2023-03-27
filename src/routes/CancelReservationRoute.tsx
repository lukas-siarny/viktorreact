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

type Props = RouteProps & {
	translatePathKey?: string
	layout: any
	className?: string
}

const CancelReservationRoute = (props: Props) => {
	// t je query param pre token (nie preklad)
	const { t } = qs.parse(document.location.search, { ignoreQueryPrefix: true })

	try {
		const payload = decode(t as string)
		const aud = get(payload, 'aud')

		if (t && aud === TOKEN_AUDIENCE.CANCEL_RESERVATION) {
			return <BaseRoute {...(props as any)} />
		}
	} catch {
		return <Navigate to={i18next.t('paths:index')} />
	}

	return <Navigate to={i18next.t('paths:index')} />
}

export default CancelReservationRoute
