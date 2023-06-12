import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { find, get } from 'lodash'
import { Button, Tooltip, Typography } from 'antd'
import { getFormValues, initialize, submit } from 'redux-form'

// utils
import { deleteReq, postReq } from '../../../utils/request'
import { EXTERNAL_CALENDAR_CONFIG, EXTERNAL_CALENDAR_TYPE, FORM, MS_REDIRECT_MESSAGE_KEY, NOTIFICATION_TYPE } from '../../../utils/enums'
import { formatObjToQuery } from '../../../hooks/useQueryParamsZod'
import showNotifications from '../../../utils/tsxHelpers'

// types
import { RootState } from '../../../reducers'
import { MSRedirectMessage } from '../../../types/interfaces'
import { ISalonIdsForm } from '../../../schemas/reservation'

// components
import SalonIdsForm from './SalonIdsForm'
import ConfirmModal from '../../../atoms/ConfirmModal'

// assets
import { ReactComponent as CheckIcon } from '../../../assets/icons/checkbox-checked-icon-24.svg'
import { ReactComponent as CopyableIcon } from '../../../assets/icons/copyable-icon.svg'
import { ReactComponent as DownloadIcon } from '../../../assets/icons/download-icon.svg'

// redux
import { getCurrentUser } from '../../../reducers/users/userActions'

enum REQUEST_MODAL_TYPE {
	DELETE = 'DELETE',
	CREATE = 'CREATE'
}

const { Paragraph } = Typography

const CalendarIntegrations = () => {
	const { t } = useTranslation()
	const { salonID } = useParams<Required<{ salonID: string }>>()
	const dispatch = useDispatch()
	const [visibleModal, setVisibleModal] = useState<{ type: EXTERNAL_CALENDAR_TYPE; title: string; description: string; requestType: REQUEST_MODAL_TYPE } | undefined>(undefined)
	const [pickedSalonIds, setPickedSalonIds] = useState<string[]>([])
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const icalUrl = get(find(authUser.data?.salons, { id: salonID }), 'employeeIcsLink') || ''
	const salonIdsValues: Partial<{ salonIDs: string[] }> = useSelector((state: RootState) => getFormValues(FORM.SALON_IDS_FORM)(state))
	const partnerInOneSalon = authUser?.data?.salons.length === 1 && authUser.data.salons[0].id === salonID
	const signedSalon = authUser?.data?.salons.find((salon) => salon.id === salonID)
	// const hasGoogleSync = get(signedSalon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.GOOGLE}].enabledSync`)
	const hasMicrosoftSync = get(signedSalon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.MICROSOFT}].enabledSync`)
	const googleSyncInitData = authUser.data?.salons.filter((salon) => get(salon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.GOOGLE}].enabledSync`))
	const microsoftSyncInitData = authUser.data?.salons.filter((salon) => get(salon, `calendarSync.[${EXTERNAL_CALENDAR_TYPE.MICROSOFT}].enabledSync`))
	const httpsIcalUrl = icalUrl.replace(/^webcal:/i, 'https:')

	const popupRef = useRef<Window | null>(null)

	const getOptionsData = () => {
		if (visibleModal?.requestType === REQUEST_MODAL_TYPE.DELETE) {
			if (visibleModal.type === EXTERNAL_CALENDAR_TYPE.GOOGLE) return googleSyncInitData
			return microsoftSyncInitData
		}
		return authUser?.data?.salons
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

	const handleMSLogin = useCallback(
		async (salonsIDs: (string | undefined)[]) => {
			const msLoginQueryParams = formatObjToQuery({
				// eslint-disable-next-line no-underscore-dangle
				client_id: window.__RUNTIME_CONFIG__.REACT_APP_MS_OAUTH_CLIENT_ID,
				redirect_uri: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].redirect_uri,
				response_type: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].response_type,
				response_mode: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].response_mode,
				scope: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].scope,
				prompt: EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].prompt,
				state: authUser?.data?.salons && partnerInOneSalon ? authUser.data.salons[0].id : salonsIDs.join(',')
			})

			const width = 500
			const height = 600

			try {
				popupRef.current = window.open(
					`${EXTERNAL_CALENDAR_CONFIG[EXTERNAL_CALENDAR_TYPE.MICROSOFT].authorize_url}${msLoginQueryParams}`,
					'_blank',
					`
					popup
					scrollbars,
					width=${width},
					height=${height},
					left=${(window.screen.width - width) / 2},
					top=${(window.screen.height - height) / 2}
				  	`
				)
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		},
		[authUser?.data?.salons, partnerInOneSalon]
	)

	useEffect(() => {
		/**
		 * After successfull login to Microsoft account in login popup window, user is redirected to /ms-oauth2 URL, which renders MSRedirectPage.tsx component
		 * Communication between login popup window and window that triggered the popup is handled via browser postMessage API
		 */
		const messageListener = (event: MessageEvent<MSRedirectMessage>) => {
			// Important! Check the origin of the data!! (only messages from our host are allowed)
			if (event.origin === `${window.location.protocol}//${window.location.host}` && event.data.key === MS_REDIRECT_MESSAGE_KEY && popupRef.current) {
				if (event.data.status === 'success') {
					dispatch(getCurrentUser())
					if (event.data.messages?.length) {
						showNotifications(event.data.messages, NOTIFICATION_TYPE.NOTIFICATION)
					}
					popupRef.current.close()
				} else if (event.data.status === 'error') {
					showNotifications(event.data.messages || [], NOTIFICATION_TYPE.NOTIFICATION)
					popupRef.current.close()
				}
			}
		}

		window.addEventListener('message', messageListener)

		return () => window.removeEventListener('message', messageListener)
	}, [dispatch])

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
					handleMSLogin(values.salonIDs)
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
			{/* hasGoogleSync && (
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
			) */}
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
			{/* <button
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
			</button> */}
			<button
				className={'sync-button microsoft mr-2'}
				onClick={() => {
					const salonIDs = [...(microsoftSyncInitData?.map((salon) => salon.id) || []), salonID]
					if (partnerInOneSalon) {
						handleMSLogin(salonIDs)
					} else {
						dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs }))
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
