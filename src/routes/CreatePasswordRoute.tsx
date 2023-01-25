import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { compose } from 'redux'
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

type Props = WithTranslation &
	RouteProps & {
		translatePathKey?: string
		layout: any
		className?: string
	}

const CreatePasswordRoute = (props: Props) => {
	// t je query param pre token (nie preklad)
	const { t } = qs.parse(document.location.search, { ignoreQueryPrefix: true })
	// if user is already logged In or token does not exist redirect to index route
	if (isLoggedIn() || !t) {
		return <Navigate to={i18next.t('paths:index')} />
	}

	const payload = decode(t as string)
	const aud = get(payload, 'aud')

	if (aud === TOKEN_AUDIENCE.FORGOTTEN_PASSWORD || aud === TOKEN_AUDIENCE.INVITATION) {
		// dokoncenie registracie , zabudnute heslo
		return <BaseRoute {...(props as any)} token={t} />
	}

	return <Navigate to={i18next.t('paths:index')} />
}

export default compose(withTranslation())(CreatePasswordRoute)
