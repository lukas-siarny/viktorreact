import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { compose } from 'redux'
import qs from 'qs'
import decode from 'jwt-decode'
import { get } from 'lodash'
import { Redirect, RouteProps, Route } from 'react-router-dom'

// routes
import BaseRoute from './BaseRoute'

// utils
import { TOKEN_AUDIENCE } from '../utils/enums'
import { isLoggedIn } from '../utils/auth'
import { getPath } from '../utils/history'

type Props = WithTranslation &
	RouteProps & {
		translatePathKey?: string
		layout: any
	}

class CreatePasswordRoute extends Route<Props> {
	render = () => {
		// t je query param pre token (nie preklad)
		const { t } = qs.parse(document.location.search, { ignoreQueryPrefix: true })
		console.log('🚀 ~ file: CreatePasswordRoute.tsx ~ line 27 ~ CreatePasswordRoute ~ t', t)

		// if user is already logged In or token does not exist redirect to index route
		if (isLoggedIn() || !t) {
			return <Redirect to={getPath(this.props.t('paths:index'))} />
		}

		const payload = decode(t as string)
		const aud = get(payload, 'aud')

		return <BaseRoute {...(this.props as any)} />

		// if (aud === TOKEN_AUDIENCE.FORGOTTEN_PASSWORD || aud === TOKEN_AUDIENCE.INVITATION) {
		// 	// dokoncenie registracie , zabudnute heslo
		// 	return <BaseRoute {...(this.props as any)} />
		// }

		// return <Redirect to={getPath(this.props.t('paths:index'))} />
	}
}

export default compose(withTranslation())(CreatePasswordRoute)
