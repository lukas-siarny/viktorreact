import React from 'react'
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'

// utils
import { postReq } from '../../../utils/request'
import { NOTIFICATION_TYPE } from '../../../utils/enums'

type Props = {}

const CalendarIntegrations = (props: Props) => {
	const { i18n } = useTranslation()

	const login = useGoogleLogin({
		flow: 'auth-code',
		scope: 'email profile https://www.googleapis.com/auth/calendar openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
		redirect_uri: 'postmessage',
		onSuccess: (tokenResponse) => {
			console.log({ tokenResponse })
			postReq(
				'/api/b2b/admin/calendar-sync/sync-token',
				null,
				{
					authCode: tokenResponse.access_token, // tokenResponse.code,
					calendarType: 'GOOGLE'
				},
				undefined,
				NOTIFICATION_TYPE.NOTIFICATION,
				true
			)
		},
		onError: (errorResponse) => console.log('Error GAPI: ', errorResponse)
	})

	return (
		<>
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
			<button onClick={() => login()} type='button'>
				Log in to Google
			</button>
		</>
	)
}

export default CalendarIntegrations
