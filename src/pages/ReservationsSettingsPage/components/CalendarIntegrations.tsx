import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { useMsal } from '@azure/msal-react'
import qs from 'qs'
import axios, { AxiosError } from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { find, get } from 'lodash'
import { Button, Tooltip, Typography } from 'antd'
import { getFormValues, initialize, submit } from 'redux-form'

// utils
import { buildHeaders, deleteReq, postReq, showErrorNotifications } from '../../../utils/request'
import { EXTERNAL_CALENDAR_CONFIG, EXTERNAL_CALENDAR_TYPE, FORM, MSG_TYPE, NOTIFICATION_TYPE } from '../../../utils/enums'
import showNotifications from '../../../utils/tsxHelpers'

// types
import { RootState } from '../../../reducers'

// components
import SalonIdsForm from './SalonIdsForm'
import ConfirmModal from '../../../atoms/ConfirmModal'

// assets
import { ReactComponent as CheckIcon } from '../../../assets/icons/checkbox-checked-icon-24.svg'
import { ReactComponent as CopyableIcon } from '../../../assets/icons/copyable-icon.svg'
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon.svg'

// redux
import { getCurrentUser } from '../../../reducers/users/userActions'

// schemas
import { ISalonIdsForm } from '../../../schemas/reservation'

enum REQUEST_MODAL_TYPE {
	DELETE = 'DELETE',
	CREATE = 'CREATE'
}

const { Paragraph } = Typography

const CalendarIntegrations = () => {
	const { t } = useTranslation()
	const { salonID } = useParams<Required<{ salonID: string }>>()
	const { instance } = useMsal()
	const dispatch = useDispatch()
	const [visibleModal, setVisibleModal] = useState<{ type: EXTERNAL_CALENDAR_TYPE; title: string; description: string; requestType: REQUEST_MODAL_TYPE } | undefined>(undefined)
	const [pickedSalonIds, setPickedSalonIds] = useState<string[]>([])
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const icalUrl = get(find(authUser.data?.salons, { id: salonID }), 'employeeIcsLink') || ''
	const salonIdsValues: Partial<{ salonIDs: string[] }> = useSelector((state: RootState) => getFormValues(FORM.SALON_IDS_FORM)(state))
	const partnerInOneSalon = authUser?.data?.salons.length === 1 && authUser.data.salons[0].id === salonID
	const signedSalon = authUser?.data?.salons.find((salon) => salon.id === salonID)
	const hasGoogleSync = get(signedSalon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.GOOGLE}].enabledSync`)
	const hasMicrosoftSync = get(signedSalon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.MICROSOFT}].enabledSync`)
	const googleSyncInitData = authUser.data?.salons.filter((salon) => get(salon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.GOOGLE}].enabledSync`))
	const microsoftSyncInitData = authUser.data?.salons.filter((salon) => get(salon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.MICROSOFT}].enabledSync`))
	const httpsIcalUrl = icalUrl.replace(/^webcal:/i, 'https:')

	const getOptionsData = () => {
		if (visibleModal?.requestType === REQUEST_MODAL_TYPE.DELETE) {
			if (visibleModal.type === EXTERNAL_CALENDAR_TYPE.GOOGLE) return googleSyncInitData
			return microsoftSyncInitData
		}
		return authUser?.data?.salons
	}

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
								grant_type: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].grant_type,
								// eslint-disable-next-line no-underscore-dangle
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
						const responseData = await originalFetch('/api/b2b/admin/calendar-sync/sync-token', {
							method: 'POST',
							headers: {
								...buildHeaders()
							},
							body: JSON.stringify({
								// Ak je len jeden salon tak da ID ktore ma dany salon ak ma priradenych viacero salonov tak posle IDecka ktore su picknute v modaly
								salonIDs: authUser?.data?.salons && partnerInOneSalon ? [authUser.data.salons[0].id] : pickedSalonIds,
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
						dispatch(getCurrentUser())
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
		onSuccess: async (tokenResponse) => {
			// NOTE: treba pockat kym sa vykona zmazanie syncu a potom sa zavola EP na aktualizovanie dat v getUser
			if (authUser?.data?.salons) {
				await postReq(
					'/api/b2b/admin/calendar-sync/sync-token',
					null,
					{
						// Ak je len jeden salon tak da ID ktore ma dany salon ak ma priradenych viacero salonov tak posle IDecka ktore su picknute v modaly
						salonIDs: partnerInOneSalon ? [authUser.data.salons[0].id] : (pickedSalonIds as [string]),
						authCode: tokenResponse.code,
						calendarType: EXTERNAL_CALENDAR_TYPE.GOOGLE
					},
					undefined,
					NOTIFICATION_TYPE.NOTIFICATION,
					true
				)
				dispatch(getCurrentUser())
			}
		},
		// eslint-disable-next-line no-console
		onError: (errorResponse) => console.error(errorResponse)
	})

	const handleMSLogin = async () => {
		try {
			await instance.loginPopup({
				scopes: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].scopes,
				prompt: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].prompt
			})
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const handleSubmitSalons = async (values: ISalonIdsForm) => {
		setVisibleModal(undefined)
		setPickedSalonIds(values.salonIDs)
		try {
			if (visibleModal?.type === EXTERNAL_CALENDAR_TYPE.GOOGLE) {
				if (visibleModal.requestType === REQUEST_MODAL_TYPE.DELETE) {
					// NOTE: treba pockat kym sa vykona zmazanie syncu a potom sa zavola EP na aktualizovanie dat v getUser
					await deleteReq('/api/b2b/admin/calendar-sync/sync-token', undefined, undefined, NOTIFICATION_TYPE.NOTIFICATION, false, {
						salonIDs: salonIdsValues.salonIDs,
						calendarType: EXTERNAL_CALENDAR_TYPE.GOOGLE
					})
					dispatch(getCurrentUser())
				} else {
					handleGoogleLogin()
				}
			} else if (visibleModal?.type === EXTERNAL_CALENDAR_TYPE.MICROSOFT) {
				if (visibleModal.requestType === REQUEST_MODAL_TYPE.DELETE) {
					await deleteReq('/api/b2b/admin/calendar-sync/sync-token', undefined, undefined, NOTIFICATION_TYPE.NOTIFICATION, false, {
						salonIDs: salonIdsValues.salonIDs,
						calendarType: EXTERNAL_CALENDAR_TYPE.MICROSOFT
					})
					dispatch(getCurrentUser())
				} else {
					handleMSLogin()
				}
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const modals = (
		<>
			<ConfirmModal
				className='rounded-fields'
				title={visibleModal?.title}
				centered
				destroyOnClose
				onOk={() => dispatch(submit(FORM.SALON_IDS_FORM))}
				open={!!visibleModal}
				okConfirm={
					visibleModal?.requestType === REQUEST_MODAL_TYPE.DELETE
						? {
								title: t('loc:Zrušenie synchronizácie'),
								okText: t('loc:Áno, zrušiť')
						  }
						: undefined
				}
				onCancel={() => setVisibleModal(undefined)}
				okText={t('loc:Pokračovať')}
				cancelText={t('loc:Zrušiť')}
			>
				<SalonIdsForm optionsData={getOptionsData()} label={visibleModal?.description} onSubmit={handleSubmitSalons} />
			</ConfirmModal>
		</>
	)
	return (
		<>
			{modals}
			{hasGoogleSync && (
				<div className={'flex items-center mb-4'}>
					<CheckIcon className={'text-notino-pink mr-2'} />
					<span>{t('loc:Synchronizácia s {{ calendarType }} kalendárom bola spustená.', { calendarType: 'Google' })}</span>
					<Button
						onClick={() => {
							dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [salonID] }))
							setVisibleModal({
								type: EXTERNAL_CALENDAR_TYPE.GOOGLE,
								requestType: REQUEST_MODAL_TYPE.DELETE,
								title: t('loc:Zrušenie {{ calendarType }} synchronizácie', { calendarType: 'Google' }),
								description: t('loc:Vyberte, pre ktoré salóny chcete zrušiť synchronizáciu do vybraných kalendárov.')
							})
						}}
						type={'ghost'}
						size={'middle'}
						className={'text-notino-pink'}
						htmlType={'button'}
					>
						{t('loc:Zrušiť')}
					</Button>
				</div>
			)}
			{hasMicrosoftSync && (
				<div className={'flex items-center mb-4'}>
					<CheckIcon className={'text-notino-pink mr-2'} />
					<span>{t('loc:Synchronizácia s {{ calendarType }} kalendárom bola spustená.', { calendarType: 'Microsoft' })}</span>
					<Button
						onClick={() => {
							dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [salonID] }))
							setVisibleModal({
								type: EXTERNAL_CALENDAR_TYPE.MICROSOFT,
								requestType: REQUEST_MODAL_TYPE.DELETE,
								title: t('loc:Zrušenie {{ calendarType }} synchronizácie', { calendarType: 'Microsoft' }),
								description: t('loc:Vyberte, pre ktoré salóny chcete zrušiť synchronizáciu do vybraných kalendárov.')
							})
						}}
						type={'ghost'}
						size={'middle'}
						className={'text-notino-pink'}
						htmlType={'button'}
					>
						{t('loc:Zrušiť')}
					</Button>
				</div>
			)}
			<button
				className={'sync-button google mr-2'}
				onClick={() => {
					if (partnerInOneSalon) {
						handleGoogleLogin()
					} else {
						dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [...(googleSyncInitData?.map((salon) => salon.id) || []), salonID] }))
						setVisibleModal({
							type: EXTERNAL_CALENDAR_TYPE.GOOGLE,
							requestType: REQUEST_MODAL_TYPE.CREATE,
							title: t('loc:Synchronizácia {{ calendarType }} kalendára', { calendarType: 'Google' }),
							description: t('loc:Vyberte, z ktorých salónov chcete automaticky synchronizovať informácie o vašich rezerváciach.')
						})
					}
				}}
				disabled={hasGoogleSync}
				type='button'
			>
				{'Google'}
			</button>
			<button
				className={'sync-button microsoft mr-2'}
				onClick={() => {
					if (partnerInOneSalon) {
						handleMSLogin()
					} else {
						dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [...(microsoftSyncInitData?.map((salon) => salon.id) || []), salonID] }))
						setVisibleModal({
							type: EXTERNAL_CALENDAR_TYPE.MICROSOFT,
							requestType: REQUEST_MODAL_TYPE.CREATE,
							title: t('loc:Synchronizácia {{ calendarType }} kalendára', { calendarType: 'Microsoft' }),
							description: t('loc:Vyberte, z ktorých salónov chcete automaticky synchronizovať informácie o vašich rezerváciach.')
						})
					}
				}}
				disabled={hasMicrosoftSync}
				type='button'
			>
				{t('loc:Sign in')}
			</button>

			<Tooltip
				title={
					<div>
						<Paragraph
							className={'flex text-white items-center text-xs m-0 w-full'}
							copyable={{
								text: httpsIcalUrl,
								icon: [
									<CopyableIcon width={24} height={24} className={'text-notino-pink hover:text-notino-pink'} />,
									<CheckIcon width={24} height={24} className={'text-notino-pink hover:text-notino-pink'} />
								]
							}}
						>
							<>
								{`${httpsIcalUrl.slice(0, Math.floor(httpsIcalUrl.length / 2))}...`}
								<Button
									className={'mx-2 p-0 hover:text-notino-pink'}
									href={httpsIcalUrl}
									target='_blank'
									rel='noopener noreferrer'
									type={'link'}
									htmlType={'button'}
									title='Download calendar'
									download
								>
									<DownloadIcon width={24} />
								</Button>
							</>
						</Paragraph>
					</div>
				}
			>
				<a href={icalUrl} className={'sync-button apple'}>
					{t('loc:Import pomocou .ics súboru')}
				</a>
			</Tooltip>
		</>
	)
}

export default CalendarIntegrations
