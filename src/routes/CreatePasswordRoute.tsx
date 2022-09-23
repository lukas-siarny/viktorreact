import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { compose } from 'redux'
import { DispatchProp } from 'react-redux'
import qs from 'qs'
import decode from 'jwt-decode'
import { get } from 'lodash'
import { Redirect, RouteProps, Route } from 'react-router-dom'

// routes
import BaseRoute from './BaseRoute'

// utils
import { TOKEN_AUDIENCE } from '../utils/enums'
import { isLoggedIn } from '../utils/auth'
import { logOutUser } from '../reducers/users/userActions'

type Props = WithTranslation &
	DispatchProp &
	RouteProps & {
		translatePathKey?: string
		layout: any
		className?: string
	}

class CreatePasswordRoute extends Route<Props> {
	componentDidMount() {
		if (isLoggedIn()) {
			const { dispatch } = this.props
			dispatch(logOutUser(true))
		}
	}

	render = () => {
		// t je query param pre token (nie preklad)
		const { t } = qs.parse(document.location.search, { ignoreQueryPrefix: true })

		// if user is already logged In or token does not exist redirect to index route
		if (!t) {
			return <Redirect to={this.props.t('paths:index')} />
		}

		const payload = decode(t as string)
		const aud = get(payload, 'aud')

		if (aud === TOKEN_AUDIENCE.FORGOTTEN_PASSWORD || aud === TOKEN_AUDIENCE.INVITATION) {
			// dokoncenie registracie , zabudnute heslo
			return <BaseRoute {...(this.props as any)} token={t} />
		}

		return <Redirect to={this.props.t('paths:index')} />
	}
}

export default compose(withTranslation())(CreatePasswordRoute)
