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
import { IErrorMessage, MSRedirectMessage } from '../../types/interfaces'

type Props = {}

const postMessage = (msg: MSRedirectMessage) => window.opener.postMessage(msg, `${window.location.protocol}//${window.location.host}`)

const MSRedirectPage: FC<Props> = () => {
	const [query] = useQueryParams(msRedircetPageURLQueryParams)
	const salonIDs = query.state.split(',')

	const [t] = useTranslation()

	useEffect(() => {
		const sendToken = async () => {
			const msg: MSRedirectMessage = {
				key: MS_REDIRECT_MESSAGE_KEY,
				status: 'idle'
			}
			if (query.code && salonIDs.length) {
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

	if (!query.code || !salonIDs.length) {
		return <Navigate to={t('paths:index')} />
	}

	return (
		<Spin spinning>
			<h1 className={'text-center mt-4'}>{t('loc:Prebieha synchronizácia...')}</h1>
		</Spin>
	)
}

export default MSRedirectPage
