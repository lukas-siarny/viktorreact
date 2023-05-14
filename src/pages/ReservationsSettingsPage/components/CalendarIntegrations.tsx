import React, { useMemo } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { useMsal } from '@azure/msal-react'
import qs from 'qs'
import axios from 'axios'

// utils
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { cloneDeep, find, get } from 'lodash'
import i18next from 'i18next'
import { buildHeaders, postReq, showErrorNotifications } from '../../../utils/request'
import { MS_OATH_CONFIG, NOTIFICATION_TYPE, PERMISSION } from '../../../utils/enums'
import { RootState } from '../../../reducers'
import { checkPermissions } from '../../../utils/Permissions'
import showNotifications from '../../../utils/tsxHelpers'
import { getAccessToken, isLoggedIn } from '../../../utils/auth'

const CalendarIntegrations = () => {
	const { t } = useTranslation()
	const { salonID }: any = useParams()
	const { instance } = useMsal()

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const icalUrl = get(find(authUser.data?.salons, { id: salonID }), 'employeeIcsLink')
	const isPartner = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.PARTNER]), [authUser.data?.uniqPermissions])

	// NOTE: intercept Microsoft auth token request and get code from the payload and send it to our BE

	const originalFetch = window.fetch
	window.fetch = async (...args): Promise<any> => {
		const [url, config] = args
		if (url === MS_OATH_CONFIG.url) {
			if (typeof config?.body === 'string') {
				const data = qs.parse(config.body)

				if (typeof data.code === 'string') {
					const responseAuth = await axios.post(
						MS_OATH_CONFIG.url,
						{
							grant_type: MS_OATH_CONFIG.grand_type,
							client_id: window.__RUNTIME_CONFIG__.REACT_APP_MS_OAUTH_CLIENT_ID,
							scope: MS_OATH_CONFIG.scopes,
							redirect_uri: MS_OATH_CONFIG.redirect_uri,
							code_verifier: data.code_verifier,
							code: data.code
						},
						{
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}
					)

					const body = {
						refreshToken: responseAuth.data.refresh_token,
						calendarType: 'MICROSOFT'
					}

					const responseData = await originalFetch('/api/b2b/admin/calendar-sync/sync-token', {
						method: 'POST',
						headers: {
							...buildHeaders()
						},
						body: JSON.stringify(body)
					})

					const responseDataJson = await responseData.clone().json()
					showNotifications(responseDataJson.messages, NOTIFICATION_TYPE.NOTIFICATION)
					return responseData
				}
			}
			return Promise.reject()
		}
		// eslint-disable-next-line no-console
		return originalFetch(url, config)
	}

	const handleGoogleLogin = useGoogleLogin({
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
		// eslint-disable-next-line no-console
		onError: (errorResponse) => console.error(errorResponse)
	})

	const handleMSLogin = () => {
		instance.loginPopup({
			scopes: MS_OATH_CONFIG.scopes
		})
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
			<button className={'sync-button google mr-2'} onClick={() => handleGoogleLogin()} type='button'>
				{'Google'}
			</button>
			<button className={'sync-button microsoft mr-2'} onClick={handleMSLogin} type='button'>
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
