import React, { useMemo, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'
import { useMsal } from '@azure/msal-react'
import qs from 'qs'
import axios, { AxiosError } from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { find, get } from 'lodash'

// utils
import { Button } from 'antd'
import { getFormValues, initialize, submit } from 'redux-form'
import { buildHeaders, postReq, showErrorNotifications } from '../../../utils/request'
import { EXTERNAL_CALENDAR_CONFIG, EXTERNAL_CALENDAR_TYPE, FORM, MSG_TYPE, NOTIFICATION_TYPE, PERMISSION } from '../../../utils/enums'
import { checkPermissions } from '../../../utils/Permissions'
import showNotifications from '../../../utils/tsxHelpers'

// types
import { RootState } from '../../../reducers'
import SalonIdsForm from '../../../components/SalonIdsForm'

// assets
import { ReactComponent as CheckIcon } from '../../../assets/icons/checkbox-checked-icon-24.svg'
import ConfirmModal from '../../../atoms/ConfirmModal'

enum MODAL_TYPE {
	MS_MODAL = 'MS_MODAL',
	GOOGLE_MODAL = 'GOOGLE_MODAL'
}
enum REQUEST_MODAL_TYPE {
	DELETE = 'DELETE',
	CREATE = 'CREATE'
}

const CalendarIntegrations = () => {
	const { t } = useTranslation()
	const { salonID } = useParams<Required<{ salonID: string }>>()
	const { instance } = useMsal()
	const dispatch = useDispatch()

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const icalUrl = get(find(authUser.data?.salons, { id: salonID }), 'employeeIcsLink')
	const isPartner = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.PARTNER]), [authUser.data?.uniqPermissions])
	const salonIdsValues: Partial<{ salonIDs: string[] }> = useSelector((state: RootState) => getFormValues(FORM.SALON_IDS_FORM)(state))
	// const partnerInOneSalon = authUser?.data?.salons.length === 1 && authUser.data.salons[0].id === salonID
	const partnerInOneSalon = true

	// NOTE: intercept Microsoft auth token request and get code from the payload and send it to our BE
	const originalFetch = window.fetch
	// TODO: init salonoch bna true ak maju calendarSync
	// TODO: disabled buttonov ak ma konkretny salon zapnutu synchronizaciu asi treba naviazat na typ synchronizacie GOOGLE / MS
	// TODO: ak uz ma zapnutu synchonizaciu v nejakom salone tak tento salon je checked na true a neda sa zmenit cize je disabled - spravit podmienku
	// TODO: spravit isPristine nad formom ak sa nevykona zmena tak bude disabled
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
								salonIDs: [salonID],
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
					salonIDs: salonIdsValues.salonIDs as any,
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
	const [visibleModal, setVisibleModal] = useState<{ type: MODAL_TYPE; title: string; description: string; requestType: REQUEST_MODAL_TYPE } | undefined>(undefined)

	const handleSubmitSalons = () => {
		setVisibleModal(undefined)
		if (visibleModal?.type === MODAL_TYPE.GOOGLE_MODAL) {
			handleGoogleLogin()
		} else if (visibleModal?.type === MODAL_TYPE.MS_MODAL) {
			handleMSLogin()
		} else {
			// TODO: ZRUDENIE
		}
		// console.log('chckes', values)
		// TODO: doplnit salonIDs
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
				<SalonIdsForm label={visibleModal?.description} onSubmit={handleSubmitSalons} />
			</ConfirmModal>
		</>
	)
	return (
		<div>
			{modals}
			{/* // TODO: podmienky kedy sa ma zobrazit */}
			{/* <div className={'flex items-center mb-4'}> */}
			{/*	<CheckIcon className={'text-notino-pink mr-2'} /> */}
			{/*	<div>{t('loc:Synchronizácia s Google kalendárom bola spustená.')}</div> */}
			{/*	<Button */}
			{/*		onClick={() => { */}
			{/*			dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [salonID] })) */}
			{/*			setVisibleModal({ */}
			{/*				type: MODAL_TYPE.GOOGLE_MODAL, */}
			{/*				requestType: REQUEST_MODAL_TYPE.DELETE, */}
			{/*				title: t('loc:Zrušenie Google synchronizácie'), */}
			{/*				description: t('loc:Vyberte, pre ktoré salóny chcete zrušiť synchronizáciu do vybraných kalendárov.') */}
			{/*			}) */}
			{/*		}} */}
			{/*		type={'ghost'} */}
			{/*		size={'middle'} */}
			{/*		className={'text-notino-pink'} */}
			{/*		htmlType={'button'} */}
			{/*	> */}
			{/*		{t('loc:Zrušiť')} */}
			{/*	</Button> */}
			{/* </div> */}
			{/* <div className={'flex items-center mb-4'}> */}
			{/*	<CheckIcon className={'text-notino-pink mr-2'} /> */}
			{/*	<div>{t('loc:Synchronizácia s Microsoft kalendárom bola spustená.')}</div> */}
			{/*	<Button */}
			{/*		onClick={() => { */}
			{/*			dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [salonID] })) */}
			{/*			setVisibleModal({ */}
			{/*				type: MODAL_TYPE.MS_MODAL, */}
			{/*				requestType: REQUEST_MODAL_TYPE.DELETE, */}
			{/*				title: t('loc:Zrušenie Microsoft synchronizácie'), */}
			{/*				description: t('loc:Vyberte, pre ktoré salóny chcete zrušiť synchronizáciu do vybraných kalendárov.') */}
			{/*			}) */}
			{/*		}} */}
			{/*		type={'ghost'} */}
			{/*		size={'middle'} */}
			{/*		className={'text-notino-pink'} */}
			{/*		htmlType={'button'} */}
			{/*	> */}
			{/*		{t('loc:Zrušiť')} */}
			{/*	</Button> */}
			{/* </div> */}
			<button
				className={'sync-button google mr-2'}
				onClick={() => {
					if (partnerInOneSalon) {
						handleGoogleLogin()
					} else {
						dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [salonID] }))
						setVisibleModal({
							type: MODAL_TYPE.GOOGLE_MODAL,
							requestType: REQUEST_MODAL_TYPE.CREATE,
							title: t('loc:Synchronizácia Google kalendára'),
							description: t('loc:Pre synchronizáciu Google kalendára je potrebné vyplniť ID salónov, ktoré chcete synchronizovať.')
						})
					}
				}}
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
						dispatch(initialize(FORM.SALON_IDS_FORM, { salonIDs: [salonID] }))
						setVisibleModal({
							type: MODAL_TYPE.MS_MODAL,
							requestType: REQUEST_MODAL_TYPE.CREATE,
							title: t('loc:Synchronizácia Microsoft kalendára'),
							description: t('loc:Pre synchronizáciu Microsoft kalendára je potrebné vyplniť ID salónov, ktoré chcete synchronizovať.')
						})
					}
				}}
				type='button'
			>
				{t('loc:Sign in')}
			</button>
			{isPartner && (
				<a href={icalUrl} className={'sync-button apple'}>
					{t('loc:Import pomocou .ics súboru')}
				</a>
			)}
		</div>
	)
}

export default CalendarIntegrations
