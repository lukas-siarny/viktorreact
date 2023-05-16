import React, { useMemo } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { useMsal } from '@azure/msal-react'
import qs from 'qs'
import axios, { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { find, get } from 'lodash'

// utils
import { buildHeaders, postReq, showErrorNotifications } from '../../../utils/request'
import { MSG_TYPE, EXTERNAL_CALENDAR_CONFIG, NOTIFICATION_TYPE, PERMISSION, EXTERNAL_CALENDAR_TYPE } from '../../../utils/enums'
import { checkPermissions } from '../../../utils/Permissions'
import showNotifications from '../../../utils/tsxHelpers'

// types
import { RootState } from '../../../reducers'

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

		if (url === EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].url) {
			if (typeof config?.body === 'string') {
				const data = qs.parse(config.body)

				if (typeof data.code === 'string') {
					try {
						const responseAuth = await axios.post(
							EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].url,
							{
								grant_type: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].grand_type,
								client_id: window.__RUNTIME_CONFIG__.REACT_APP_MS_OAUTH_CLIENT_ID,
								scope: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].scopes,
								redirect_uri: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].redirect_uri,
								code_verifier: data.code_verifier,
								code: data.code
							},
							{
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							}
						)
						// TODO: doplnit salonIDs
						const responseData = await originalFetch('/api/b2b/admin/calendar-sync/sync-token', {
							method: 'POST',
							headers: {
								...buildHeaders()
							},
							body: JSON.stringify({
								refreshToken: responseAuth.data.refresh_token,
								calendarType: EXTERNAL_CALENDAR_TYPE.MICROSOFT
							})
						})

						const responseDataJson = await responseData.clone().json()

						if (responseData.ok) {
							showNotifications(responseDataJson.messages, NOTIFICATION_TYPE.NOTIFICATION)
						} else {
							showErrorNotifications({ response: { status: responseData.status, data: responseDataJson } }, NOTIFICATION_TYPE.NOTIFICATION)
						}
						return responseData
					} catch (e) {
						// eslint-disable-next-line no-console
						console.error(e)
						if (e instanceof AxiosError) {
							const errorMsg = e.response?.data?.error_description
							showErrorNotifications(
								{
									response: {
										status: e.response?.status,
										data: { messages: errorMsg ? [{ type: MSG_TYPE.ERROR, message: e.response?.data?.error_description }] : [] }
									}
								},
								NOTIFICATION_TYPE.NOTIFICATION
							)
						} else {
							// Show general error
							showErrorNotifications(
								{
									response: {
										data: { messages: [] }
									}
								},
								NOTIFICATION_TYPE.NOTIFICATION
							)
						}
					}
				}
			}
			return Promise.reject()
		}
		return originalFetch(url, config)
	}

	const handleGoogleLogin = useGoogleLogin({
		...EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.GOOGLE],
		onSuccess: (tokenResponse) => {
			// TODO: doplnit salonIDs
			postReq(
				'/api/b2b/admin/calendar-sync/sync-token',
				null,
				{
					authCode: tokenResponse.code,
					calendarType: EXTERNAL_CALENDAR_TYPE.GOOGLE
				},
				undefined,
				NOTIFICATION_TYPE.NOTIFICATION,
				true
			)
		},
		// eslint-disable-next-line no-console
		onError: (errorResponse) => console.error(errorResponse)
	})

	const handleMSLogin = async () => {
		try {
			await instance.acquireTokenPopup({
				scopes: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].scopes
			})
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	return (
		<div>
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
