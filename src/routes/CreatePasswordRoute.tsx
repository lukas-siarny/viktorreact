import React, { FC } from 'react'
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
import LogoutUser from '../utils/LogoutUser'

type Props = RouteProps & {
	translatePathKey?: string
	layout: any
	className?: string
	logoutUser?: boolean
	skipRedirectToLoginPage?: boolean
}

const CreatePasswordRoute = (props: Props) => {
	// t je query param pre token (nie preklad)
	const { t } = qs.parse(document.location.search, { ignoreQueryPrefix: true })
	const indexRedirect = <Navigate to={i18next.t('paths:index')} />

	try {
		// if user is already logged In redirect him to the index route
		if (!isLoggedIn() || props.logoutUser) {
			const payload = decode(t as string)
			const aud = get(payload, 'aud')

			if (aud === TOKEN_AUDIENCE.FORGOTTEN_PASSWORD || aud === TOKEN_AUDIENCE.INVITATION) {
				// dokoncenie registracie , zabudnute heslo
				return <BaseRoute {...(props as any)} token={t} />
			}
		}
	} catch {
		return indexRedirect
	}

	return indexRedirect
}

const CreatePasswordRouteWrapper: FC<Props> = (props) => {
	return (
		<LogoutUser skipRedirectToLoginPage={props.skipRedirectToLoginPage}>
			<CreatePasswordRoute {...props} />
		</LogoutUser>
	)
}

export default CreatePasswordRouteWrapper
