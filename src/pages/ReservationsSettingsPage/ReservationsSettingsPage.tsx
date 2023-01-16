import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { Col, Row, Spin } from 'antd'
import { forEach, includes, isEmpty, reduce } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import ReservationSystemSettingsForm from './components/ReservationSystemSettingsForm'

// utils
import { FORM, NOTIFICATION_TYPES, PERMISSION, ROW_GUTTER_X_DEFAULT, RS_NOTIFICATION, RS_NOTIFICATION_TYPE, SERVICE_TYPE } from '../../utils/enums'
import { withPermissions, checkPermissions, isAdmin } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'
import { history } from '../../utils/history'

// reducers
import { RootState } from '../../reducers'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { getServices } from '../../reducers/services/serviceActions'

// types
import {
	DisabledNotificationsArray,
	IBreadcrumbs,
	IReservationsSettingsNotification,
	IReservationSystemSettingsForm,
	PathSettingsBody,
	SalonSubPageProps
} from '../../types/interfaces'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const EXCLUDED_NOTIFICATIONS_B2B: string[] = [RS_NOTIFICATION.RESERVATION_REJECTED, RS_NOTIFICATION.RESERVATION_REMINDER]

const NOTIFICATIONS = Object.keys(RS_NOTIFICATION) as RS_NOTIFICATION[]

type InitDisabledNotifications = {
	[key in RS_NOTIFICATION]: IReservationsSettingsNotification
}

type PatchDisabledNotifications = NonNullable<NonNullable<PathSettingsBody['settings']>['disabledNotifications']>

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

const defualtNotification = {
	b2cChannels: NOTIFICATION_TYPES.map((type) => ({ [type]: true })),
	b2bChannels: NOTIFICATION_TYPES.flatMap((type) => (EXCLUDED_NOTIFICATIONS_B2B.includes(type) ? [] : [{ [type]: true }]))
}

const initDisabledNotifications = (notifications: DisabledNotificationsArray): IReservationSystemSettingsForm['disabledNotifications'] => {
	// find all relevant notifications
	const relevantNotifications = notifications.filter((notification) => !!getNotificationFormName(notification.eventType) && !isEmpty(notification.channels))

	// transform into object of type IReservationSystemSettingsForm.disabledNotifications
	const current = relevantNotifications?.reduce((data, item) => {
		const isB2CChannel = item.eventType?.endsWith('EMPLOYEE') // B2C interne
		const isB2BChannel = item.eventType?.endsWith('CUSTOMER') // B2C klientse
		const notificationFormName = getNotificationFormName(item.eventType)

		if (notificationFormName) {
			if (isB2CChannel) {
				return {
					...data,
					[notificationFormName]: {
						...data[notificationFormName],
						b2bChannels: data[notificationFormName]?.b2bChannels || defualtNotification.b2bChannels,
						b2cChannels: NOTIFICATION_TYPES.map((type) => ({ [type]: !item.channels.includes(type as RS_NOTIFICATION_TYPE) }))
					}
				}
			}
			if (isB2BChannel) {
				return {
					...data,
					[notificationFormName]: {
						...data[notificationFormName],
						b2cChannels: data[notificationFormName]?.b2cChannels || defualtNotification.b2cChannels,
						b2bChannels: NOTIFICATION_TYPES.map((type) => ({ [type]: !item.channels.includes(type as RS_NOTIFICATION_TYPE) }))
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
				b2cChannels: defualtNotification.b2cChannels,
				b2bChannels: defualtNotification.b2bChannels
			}
		}
	}, {} as InitDisabledNotifications)

	return result
}

const ReservationsSettingsPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID } = props
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const groupedSettings = useSelector((state: RootState) => state.service.services.data?.groupedServicesByCategory)

	const currentUser = useSelector((state: RootState) => state.user.authUser.data)
	const authUserPermissions = currentUser?.uniqPermissions

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenia rezervačného systému')
			}
		]
	}

	const fetchData = async () => {
		const salonRes = await dispatch(selectSalon(salonID))
		console.log('salonRes', salonRes)
		// NOT-3601: docasna implementacia, po rozhodnuti o zmene, treba prejst vsetky commenty s tymto oznacenim a revertnut
		const canVisitThisPage = isAdmin(authUserPermissions) || (checkPermissions(authUserPermissions, [PERMISSION.PARTNER]) && salonRes?.data?.settings?.enabledReservations)
		if (!canVisitThisPage) {
			history.push('/404')
		}

		const servicesRes = await dispatch(getServices({ salonID }))

		if (salonRes?.data?.settings) {
			const autoConfirmItems: any = []
			const onlineReservationItems: any = []
			forEach(servicesRes.data?.groupedServicesByCategory, (level1) =>
				forEach(level1.category?.children, (level2) =>
					forEach(level2.category?.children, (level3) => {
						autoConfirmItems.push({
							[level3.service.id]: level3.service.settings.autoApproveReservatons
						})
						onlineReservationItems.push({
							[level3.service.id]: level3.service.settings.enabledB2cReservations
						})
					})
				)
			)
			const autoConfirmSettings = reduce(
				autoConfirmItems,
				(prev: any, item: any) => {
					return { ...prev, ...item }
				},
				{}
			)

			const onlineBookingSettings = reduce(
				onlineReservationItems,
				(prev: any, item: any) => {
					return { ...prev, ...item }
				},
				{}
			)

			const autoConfirmSettingsHasFalse = includes(Object.values(autoConfirmSettings), false)
			const onlineBookingSettingsHasFalse = includes(Object.values(onlineBookingSettings), false)

			const servicesSettings = {
				[SERVICE_TYPE.AUTO_CONFIRM]: autoConfirmSettings,
				[SERVICE_TYPE.ONLINE_BOOKING]: onlineBookingSettings
			}

			dispatch(
				initialize(FORM.RESEVATION_SYSTEM_SETTINGS, {
					enabledReservations: salonRes?.data?.settings?.enabledReservations,
					maxDaysB2cCreateReservation: salonRes?.data?.settings?.maxDaysB2cCreateReservation,
					maxHoursB2cCreateReservationBeforeStart: salonRes?.data?.settings?.maxHoursB2cCreateReservationBeforeStart,
					maxHoursB2cCancelReservationBeforeStart: salonRes?.data?.settings?.maxHoursB2cCancelReservationBeforeStart,
					minutesIntervalB2CReservations: salonRes?.data?.settings?.minutesIntervalB2CReservations,
					disabledNotifications: initDisabledNotifications(salonRes?.data?.settings?.disabledNotifications),
					servicesSettings,
					onlineBookingAll: !onlineBookingSettingsHasFalse,
					autoConfirmAll: !autoConfirmSettingsHasFalse
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
		// Settings
		const allIds: any = []
		forEach(groupedSettings, (level1) => forEach(level1.category?.children, (level2) => forEach(level2.category?.children, (level3) => allIds.push(level3.service.id))))

		const allowedAutoConfirmIds: string[] = []
		const allowedOnlineBookingIds: string[] = []
		forEach(values.servicesSettings.AUTO_CONFIRM, (item, index) => (item ? allowedAutoConfirmIds.push(index) : undefined))
		forEach(values.servicesSettings.ONLINE_BOOKING, (item, index) => (item ? allowedOnlineBookingIds.push(index) : undefined))

		const servicesSettings: any[] = []
		forEach(allIds, (serviceID) => {
			const enabledB2cReservations = includes(allowedOnlineBookingIds, serviceID)
			const autoApproveReservatons = includes(allowedAutoConfirmIds, serviceID)
			servicesSettings.push({
				id: serviceID,
				settings: {
					enabledB2cReservations: enabledB2cReservations || false, // ONLINE_BOOKING
					autoApproveReservatons: autoApproveReservatons || false // AUTO_CONFIRM
				}
			})
		})
		// Notifications
		// find notification which are OFF - relevant for API
		/* const disabledNotifications = NOTIFICATIONS.map((type: string) => {
			return {
				eventType: type,
				b2bChannels: transformNotificationsChannelForRequest(values.disabledNotifications[type as RS_NOTIFICATION].b2bChannels),
				b2cChannels: transformNotificationsChannelForRequest(values.disabledNotifications[type as RS_NOTIFICATION].b2cChannels)
			}
		}) */

		const disabledNotifications = NOTIFICATIONS.reduce((result: any, item) => {
			const notificationValues = values.disabledNotifications[item]
			const b2cChannel = transformNotificationsChannelForRequest(notificationValues.b2cChannels) as NonNullable<PatchDisabledNotifications[0]>['channels']
			const b2bChannel = transformNotificationsChannelForRequest(notificationValues.b2bChannels) as NonNullable<PatchDisabledNotifications[0]>['channels']

			if (result.length > 100) {
				return result
			}

			const items = [] as PatchDisabledNotifications

			if (!isEmpty(b2cChannel)) {
				items.push({
					eventType: `${item}_EMPLOYEE` as any,
					channels: b2cChannel
				})
			}

			if (!isEmpty(b2bChannel)) {
				items.push({
					eventType: `${item}_CUSTOMER`,
					channels: b2bChannel
				})
			}

			return [...result, ...items]
		}, [] as PatchDisabledNotifications)

		console.log({ disabledNotifications })

		const reqData: PathSettingsBody = {
			settings: {
				enabledReservations: values.enabledReservations,
				maxDaysB2cCreateReservation: values.maxDaysB2cCreateReservation,
				maxHoursB2cCancelReservationBeforeStart: values.maxHoursB2cCancelReservationBeforeStart,
				maxHoursB2cCreateReservationBeforeStart: values.maxHoursB2cCreateReservationBeforeStart,
				minutesIntervalB2CReservations: (values.minutesIntervalB2CReservations as any) || undefined,
				disabledNotifications: disabledNotifications as any
			},
			servicesSettings
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
						<Spin spinning={salon.isLoading}>
							<ReservationSystemSettingsForm onSubmit={handleSubmitSettings} salonID={salonID} excludedB2BNotifications={EXCLUDED_NOTIFICATIONS_B2B} />
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default withPermissions(permissions)(ReservationsSettingsPage)
