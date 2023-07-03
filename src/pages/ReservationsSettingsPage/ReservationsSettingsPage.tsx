import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { initialize, isSubmitting } from 'redux-form'
import { Col, Row, Spin } from 'antd'
import { compact, includes, isEmpty } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import ReservationSystemSettingsForm from './components/ReservationSystemSettingsForm'

// utils
import {
	EXCLUDED_NOTIFICATIONS_B2B,
	EXCLUDED_SMS_NOTIFICATIONS_FOR_B2C,
	FORM,
	NOTIFICATION_TYPES,
	PERMISSION,
	ROW_GUTTER_X_DEFAULT,
	RS_NOTIFICATION,
	RS_NOTIFICATION_TYPE
} from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { getCurrentUser } from '../../reducers/users/userActions'

// types
import {
	DisabledNotificationsArray,
	IBreadcrumbs,
	IReservationsSettingsNotification,
	IReservationSystemSettingsForm,
	PatchSettingsBody,
	SalonSubPageProps
} from '../../types/interfaces'

const NOTIFICATIONS = Object.keys(RS_NOTIFICATION) as RS_NOTIFICATION[]

type InitDisabledNotifications = {
	[key in RS_NOTIFICATION]: IReservationsSettingsNotification
}

type PatchDisabledNotifications = NonNullable<NonNullable<PatchSettingsBody['settings']>['disabledNotifications']>

const transformNotificationsChannelForRequest = (
	channel: {
		[key in RS_NOTIFICATION_TYPE]?: boolean
	}[]
): string[] => {
	return channel.flatMap((item) => {
		const isDisabled = Object.entries(item).map(([key, value]) => {
			// if switch is OFF (false), then key (type of RS_NOTIFICATION_TYPE) is relevant for API
			if (!value) {
				return key
			}
			return null
		})
		return isDisabled[0] ? [isDisabled[0]] : []
	})
}

const getNotificationFormName = (notification?: string) => {
	if (notification && (notification.endsWith('EMPLOYEE') || notification.endsWith('CUSTOMER'))) {
		const lastIndexOf = notification.lastIndexOf('_')
		const notificationName = notification.substring(0, lastIndexOf) as RS_NOTIFICATION
		return NOTIFICATIONS.includes(notificationName) ? notificationName : undefined
	}
	return undefined
}

const setDefualtNotification = (rsType: RS_NOTIFICATION) => {
	const hasExcludedSMSNotification = includes(EXCLUDED_SMS_NOTIFICATIONS_FOR_B2C, rsType)
	// NOTE: vyfiltruje SMS pre B2b vsetky + B2C channel podla rsType. Treba zabezpecit ze odstrani cez compact aj undefined hodnoty lebo switch by takuto hodnotu vyrenderoval ako false
	return {
		b2cChannels: compact(NOTIFICATION_TYPES.map((type) => (type === RS_NOTIFICATION_TYPE.SMS && hasExcludedSMSNotification ? undefined : { [type]: true }))),
		b2bChannels: compact(
			NOTIFICATION_TYPES.flatMap((type) => (EXCLUDED_NOTIFICATIONS_B2B.includes(type) ? [] : [type === RS_NOTIFICATION_TYPE.SMS ? undefined : { [type]: true }]))
		)
	}
}

const initDisabledNotifications = (notifications: DisabledNotificationsArray): IReservationSystemSettingsForm['disabledNotifications'] => {
	// find all relevant notifications
	const relevantNotifications = notifications.filter((notification) => !!getNotificationFormName(notification.eventType) && !isEmpty(notification.channels))
	// transform into object of type IReservationSystemSettingsForm.disabledNotifications
	const current = relevantNotifications?.reduce((data, item) => {
		const isB2BChannel = item.eventType?.endsWith('EMPLOYEE') // B2B internal (employee)
		const isB2CChannel = item.eventType?.endsWith('CUSTOMER') // B2C customer
		const notificationFormName = getNotificationFormName(item.eventType)
		if (notificationFormName) {
			if (isB2CChannel) {
				const hasExcludedSMSNotification = includes(EXCLUDED_SMS_NOTIFICATIONS_FOR_B2C, notificationFormName)
				return {
					...data,
					[notificationFormName]: {
						...data[notificationFormName],
						b2bChannels: data[notificationFormName]?.b2bChannels || setDefualtNotification(notificationFormName).b2bChannels,
						b2cChannels: compact(
							NOTIFICATION_TYPES.map((type) =>
								type === RS_NOTIFICATION_TYPE.SMS && hasExcludedSMSNotification ? undefined : { [type]: !item.channels.includes(type as RS_NOTIFICATION_TYPE) }
							)
						)
					}
				}
			}
			if (isB2BChannel) {
				return {
					...data,
					[notificationFormName]: {
						...data[notificationFormName],
						b2cChannels: data[notificationFormName]?.b2cChannels || setDefualtNotification(notificationFormName).b2cChannels,
						b2bChannels: compact(
							NOTIFICATION_TYPES.map((type) => (type !== RS_NOTIFICATION_TYPE.SMS ? { [type]: !item.channels.includes(type as RS_NOTIFICATION_TYPE) } : undefined))
						)
					}
				}
			}
		}

		return data
	}, {} as InitDisabledNotifications)
	const result = NOTIFICATIONS.reduce((data, key) => {
		return {
			...data,
			[key]: current[key] || {
				b2cChannels: setDefualtNotification(key).b2cChannels,
				b2bChannels: setDefualtNotification(key).b2bChannels
			}
		}
	}, {} as InitDisabledNotifications)
	return result
}

const ReservationsSettingsPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { parentPath, salonID } = props
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const submitting = useSelector(isSubmitting(FORM.RESEVATION_SYSTEM_SETTINGS))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenia rezervačného systému')
			}
		]
	}

	const fetchData = async () => {
		await dispatch(getCurrentUser())
		const salonRes = await dispatch(selectSalon(salonID))

		if (salonRes?.data?.settings) {
			dispatch(
				initialize(FORM.RESEVATION_SYSTEM_SETTINGS, {
					enabledReservations: salonRes.data.settings.enabledReservations,
					enabledCustomerReservationNotes: salonRes.data.settings.enabledCustomerReservationNotes,
					maxDaysB2cCreateReservation: salonRes.data.settings.maxDaysB2cCreateReservation,
					maxHoursB2cCreateReservationBeforeStart: salonRes.data.settings.maxHoursB2cCreateReservationBeforeStart,
					maxHoursB2cCancelReservationBeforeStart: salonRes.data.settings.maxHoursB2cCancelReservationBeforeStart,
					minutesIntervalB2CReservations: salonRes.data.settings.minutesIntervalB2CReservations,
					disabledNotifications: initDisabledNotifications(salonRes.data.settings.disabledNotifications)
				})
			)
		}
	}

	useEffect(() => {
		// on mount init
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmitSettings = async (values: IReservationSystemSettingsForm) => {
		// find notification which are OFF - relevant for API
		const disabledNotifications = NOTIFICATIONS.reduce((result: any, item) => {
			const notificationValues = values.disabledNotifications[item]
			const b2cChannel = transformNotificationsChannelForRequest(notificationValues.b2cChannels) as NonNullable<PatchDisabledNotifications[0]>['channels']
			const b2bChannel = transformNotificationsChannelForRequest(notificationValues.b2bChannels) as NonNullable<PatchDisabledNotifications[0]>['channels']
			const items = [] as PatchDisabledNotifications

			if (!isEmpty(b2cChannel)) {
				items.push({
					eventType: `${item}_CUSTOMER`,
					channels: b2cChannel
				})
			}

			if (!isEmpty(b2bChannel)) {
				items.push({
					eventType: `${item}_EMPLOYEE` as any,
					channels: b2bChannel
				})
			}

			return [...result, ...items]
		}, [] as PatchDisabledNotifications)

		const reqData: PatchSettingsBody = {
			settings: {
				enabledCustomerReservationNotes: values.enabledCustomerReservationNotes,
				enabledReservations: values.enabledReservations,
				maxDaysB2cCreateReservation: values.maxDaysB2cCreateReservation,
				maxHoursB2cCancelReservationBeforeStart: values.maxHoursB2cCancelReservationBeforeStart,
				maxHoursB2cCreateReservationBeforeStart: values.maxHoursB2cCreateReservationBeforeStart,
				minutesIntervalB2CReservations: (values.minutesIntervalB2CReservations as any) || undefined,
				disabledNotifications: disabledNotifications as any
			}
		}

		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/settings', { salonID }, reqData)
			fetchData()
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body'>
						<Spin spinning={salon.isLoading || authUser.isLoading || submitting}>
							<ReservationSystemSettingsForm
								onSubmit={handleSubmitSettings}
								salonID={salonID}
								excludedB2BNotifications={EXCLUDED_NOTIFICATIONS_B2B}
								parentPath={parentPath}
							/>
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER])(ReservationsSettingsPage)
