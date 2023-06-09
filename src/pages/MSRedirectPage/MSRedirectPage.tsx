import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// utils
import { Spin } from 'antd'
import { postReq } from '../../utils/request'
import { EXTERNAL_CALENDAR_CONFIG, EXTERNAL_CALENDAR_TYPE } from '../../utils/enums'

// hooks
import useQueryParams from '../../hooks/useQueryParamsZod'

// schemas
import { msRedircetPageURLQueryParams } from '../../schemas/queryParams'

type Props = {}

const MSRedirectPage: FC<Props> = () => {
	const [query] = useQueryParams(msRedircetPageURLQueryParams)
	const navigate = useNavigate()
	const salonIDs = (query.state || '').split(',')

	const [t] = useTranslation()

	useEffect(() => {
		const sendToken = async () => {
			if (query.code && salonIDs.length) {
				try {
					await postReq(
						'/api/b2b/admin/calendar-sync/sync-token',
						{},
						{
							authCode: query.code,
							calendarType: 'MICROSOFT',
							salonIDs: salonIDs as [string, ...string[]],
							redirectURI: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].redirect_uri
						}
					)
				} catch (error) {
					// eslint-disable-next-line no-console
					console.error(error)
				} finally {
					navigate(`${t('paths:salons')}/${salonIDs[0]}${t('paths:reservations-settings')}`)
				}
			} else {
				navigate(t('paths:index'))
			}
		}

		sendToken()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Spin spinning>
			<h1 className={'text-center mt-4'}>{t('loc:Prebieha synchronizácia...')}</h1>
		</Spin>
	)
}

export default MSRedirectPage
