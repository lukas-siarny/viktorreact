import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { AxiosError } from 'axios'

// utils
import { Spin } from 'antd'
import { postReq } from '../../utils/request'
import { EXTERNAL_CALENDAR_CONFIG, EXTERNAL_CALENDAR_TYPE, MS_REDIRECT_MESSAGE_KEY } from '../../utils/enums'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schemas
import { msRedircetPageURLQueryParams } from '../../schemas/queryParams'

// types
import { IErrorMessage, MSRedirectMessage } from '../../types/interfaces'

type Props = {}

const postMessage = (msg: MSRedirectMessage) => {
	if (window.opener) {
		window.opener.postMessage(msg, `${window.location.protocol}//${window.location.host}`)
	}
}
/**
 * This page is rendered inside a popup window that handles Microsoft login (popup is triggered in '/salons/{salonID}/reservations-settings' (CalendarIntegration.tsx))
 * After successfull login to Microsoft account, user is redirected to /ms-oauth2 URL, which renders this component
 * Authorization code from MS is processed here and send to our BE
 * Communication between this popup window and window that triggered the popup is handled via browser postMessage API
 */
const MSRedirectPage: FC<Props> = () => {
	const [query] = useQueryParams(msRedircetPageURLQueryParams)
	const salonIDs = query.state.split(',')
	const openInsidePopup = !!window.opener

	const [t] = useTranslation()

	useEffect(() => {
		const sendToken = async () => {
			const msg: MSRedirectMessage = {
				key: MS_REDIRECT_MESSAGE_KEY,
				status: 'idle'
			}
			if (query.code && salonIDs.length && openInsidePopup) {
				postMessage({ ...msg, status: 'loading' })
				try {
					const { data } = await postReq(
						'/api/b2b/admin/calendar-sync/sync-token',
						{},
						{
							authCode: query.code,
							calendarType: EXTERNAL_CALENDAR_TYPE.MICROSOFT,
							salonIDs: salonIDs as [string, ...string[]],
							redirectURI: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].redirect_uri
						},
						undefined,
						false
					)
					postMessage({ ...msg, status: 'success', messages: data.messages as IErrorMessage[] })
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error(error)
					let messages: IErrorMessage[] = []
					if (error instanceof AxiosError) {
						messages = error.response?.data.messages
					}
					postMessage({ ...msg, status: 'error', messages })
				}
			}
		}

		sendToken()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// redirect to index page when required parameters for sync request are missing or when user opens URL in the browser manually
	if (!query.code || !salonIDs.length || !openInsidePopup) {
		return <Navigate to={t('paths:index')} />
	}

	return (
		<Spin spinning>
			<h1 className={'text-center mt-4'}>{t('loc:Prebieha synchronizácia...')}</h1>
		</Spin>
	)
}

export default MSRedirectPage
