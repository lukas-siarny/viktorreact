import React, { useMemo, useEffect } from 'react'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { useMsal } from '@azure/msal-react'
import { useAuth } from 'react-oidc-context'

// utils
import { useSelector } from 'react-redux'
import { Params, useParams } from 'react-router'
import { find, get } from 'lodash'
import { postReq } from '../../../utils/request'
import { NOTIFICATION_TYPE, PERMISSION } from '../../../utils/enums'
import { RootState } from '../../../reducers'
import { checkPermissions } from '../../../utils/Permissions'

type Props = {}

const loginRequest = {
	scopes: ['User.Read', 'offline_access', 'Calendars.ReadWrite.Shared', 'Calendars.ReadWrite', 'Calendars.Read.Shared', 'Calendars.Read']
}

const graphConfig = {
	graphMeEndpoint: 'Enter_the_Graph_Endpoint_Here/v1.0/me'
}

const CalendarIntegrations = (props: Props) => {
	const { t } = useTranslation()
	const { salonID }: any = useParams()
	const { instance, accounts, inProgress } = useMsal()

	useEffect(() => {
		if (instance) {
			instance.handleRedirectPromise().then((authResult) => {
				if (authResult) {
					// Use the authResult.authorizationCode to exchange for an access token
					console.log('Authorization result:', authResult)
				}
			})
		}
	}, [instance])

	const auth = useAuth()

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const icalUrl = get(find(authUser.data?.salons, { id: salonID }), 'employeeIcsLink')
	const isPartner = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.PARTNER]), [authUser.data?.uniqPermissions])

	const login = useGoogleLogin({
		flow: 'auth-code',
		scope: 'email profile https://www.googleapis.com/auth/calendar openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
		redirect_uri: 'postmessage',
		onSuccess: (tokenResponse) => {
			postReq(
				'/api/b2b/admin/calendar-sync/sync-token',
				null,
				{
					authCode: tokenResponse.code,
					calendarType: 'GOOGLE'
				},
				undefined,
				NOTIFICATION_TYPE.NOTIFICATION,
				true
			)
		},
		onError: (errorResponse) => console.log('Error GAPI: ', errorResponse)
	})

	const handleLogin = () => {
		// auth.signinRedirect().then(console.log)

		instance
			.loginPopup(loginRequest)
			.then((response) => {
				console.log('🚀 ~ file: CalendarIntegrations.tsx:61 ~ instance.acquireTokenPopup ~ response:', response)
				// setAccessToken(response.accessToken);
			})
			.catch(console.error)

		// instance
		// 	.acquireTokenPopup({
		// 		scopes: ['User.Read', 'offline_access', 'Calendars.ReadWrite.Shared', 'Calendars.ReadWrite', 'Calendars.Read.Shared', 'Calendars.Read'],
		// 		extraQueryParameters: {}
		// 	})
		// 	.then((response) => {
		// 		console.log('🚀 ~ file: CalendarIntegrations.tsx:61 ~ instance.acquireTokenPopup ~ response:', response)
		// 		// setAccessToken(response.accessToken);
		// 	})
		// 	.catch(console.error)

		// instance.loginPopup({

		// }).then(console.log)
		// const request = {
		// 	...loginRequest,
		// 	account: accounts[0]
		// }

		// instance
		// 	.acquireTokenSilent({
		// 		scopes: ['User.Read', 'offline_access', 'Calendars.ReadWrite.Shared', 'Calendars.ReadWrite', 'Calendars.Read.Shared', 'Calendars.Read']
		// 	})
		// 	.then((response) => {
		// 		console.log('🚀 ~ file: CalendarIntegrations.tsx:47 ~ instance.acquireTokenSilent ~ response:', response)
		// 		// postReq(
		// 		// 	'/api/b2b/admin/calendar-sync/sync-token',
		// 		// 	null,
		// 		// 	{
		// 		// 		authCode: tokenResponse.code,
		// 		// 		calendarType: 'GOOGLE'
		// 		// 	},
		// 		// 	undefined,
		// 		// 	NOTIFICATION_TYPE.NOTIFICATION,
		// 		// 	true
		// 		// )
		// 	})
		// 	.catch((e) => {
		// 		instance.acquireTokenPopup(request).then((response) => {
		// 			console.log('🚀 ~ file: CalendarIntegrations.tsx:61 ~ instance.acquireTokenPopup ~ response:', response)
		// 			// setAccessToken(response.accessToken);
		// 		})
		// 	})
	}
	return (
		<div>
			{/* <GoogleLogin
				onSuccess={(credentialResponse) => {
					console.log(credentialResponse)
				}}
				onError={() => {
					console.log('Login Failed')
				}}
				locale={i18n.language}
				type='icon'
				theme='filled_black'
			/> */}
			<button className={'sync-button google mr-2'} onClick={() => login()} type='button'>
				{'Google'}
			</button>
			<button className={'sync-button microsoft mr-2'} onClick={handleLogin} type='button'>
				{t('loc:Sign in')}
			</button>
			{isPartner && (
				<a
					// TODO: ked sa implemntuje NOT-4876 tak dat disabled stav pre tych ktore budu mat v url empty=true
					href={icalUrl}
					className={'sync-button apple'}
				>
					{t('loc:Import pomocou .ics súboru')}
				</a>
			)}
		</div>
	)
}

export default CalendarIntegrations
