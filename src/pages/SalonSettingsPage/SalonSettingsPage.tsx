import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { Col, Row, Spin } from 'antd'
import { reduce } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import ReservationSystemSettingsForm from './components/ReservationSystemSettingsForm'

// utils
import { PERMISSION, ROW_GUTTER_X_DEFAULT, FORM, RS_NOTIFICATION, RS_NOTIFICATION_TYPE } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { RootState } from '../../reducers'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { Paths } from '../../types/api'
import { IBreadcrumbs, SalonSubPageProps, IReservationSystemSettingsForm, IReservationsSettingsNotification } from '../../types/interfaces'
import { postReq } from '../../utils/request'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const EXCLUDED_NOTIFICATIONS_B2B: string[] = [RS_NOTIFICATION.RESERVATION_REJECTED, RS_NOTIFICATION.RESERVATION_REMINDER]

const NOTIFICATIONS = Object.keys(RS_NOTIFICATION)
const NOTIFICATION_TYPES = Object.keys(RS_NOTIFICATION_TYPE)

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

const initDisabledNotifications = (notifications: any[]): IReservationSystemSettingsForm['disabledNotifications'] => {
	// find all relevant notifications
	const relevantNotifications = notifications.filter((notification) => NOTIFICATIONS.includes(notification.eventType as string))
	// transform into object of type IReservationSystemSettingsForm.disabledNotifications
	const current = reduce(
		relevantNotifications,
		(data: any, item) => {
			// eslint-disable-next-line no-param-reassign
			data[item.eventType as string] = {
				// included notification types of RS_NOTIFICATION_TYPE(EMAIL, PUSH) means switch is OFF (false value)
				b2cChannels: NOTIFICATION_TYPES.map((type) => ({ [type]: !item.b2cChannels.includes(type as RS_NOTIFICATION_TYPE) })),
				b2bChannels: NOTIFICATION_TYPES.map((type) => ({ [type]: !item.b2bChannels.includes(type as RS_NOTIFICATION_TYPE) }))
			}

			return data
		},
		{}
	)

	return reduce(
		NOTIFICATIONS,
		(data: any, key) => {
			// fullfill notifications: current from API + default values (TRUE - switch is ON)
			// eslint-disable-next-line no-param-reassign
			data[key] = current[key] ?? {
				b2cChannels: NOTIFICATION_TYPES.map((type) => ({ [type]: true })),
				b2bChannels: NOTIFICATION_TYPES.flatMap((type) => (EXCLUDED_NOTIFICATIONS_B2B.includes(type) ? [] : [{ [type]: true }]))
			}

			return data
		},
		{}
	)
}

const SalonSettingsPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props

	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenia rezervačného systému')
			}
		]
	}

	useEffect(() => {
		dispatch(selectSalon(salonID))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (salon.data?.settings) {
			const { settings } = salon.data

			dispatch(
				initialize(FORM.RESEVATION_SYSTEM_SETTINGS, {
					enabledReservations: settings.enabledReservations,
					maxDaysB2cCreateReservation: settings.maxDaysB2cCreateReservation,
					maxHoursB2cCreateReservationBeforeStart: settings.maxHoursB2cCreateReservationBeforeStart,
					maxHoursB2cCancelReservationBeforeStart: settings.maxHoursB2cCancelReservationBeforeStart,
					minutesIntervalBetweenB2CReservations: settings.minutesIntervalBetweenB2CReservations,
					disabledNotifications: initDisabledNotifications(settings.disabledNotifications)
				})
			)
		}
	}, [salon.data, dispatch])

	const submitSettings = async (formData: IReservationSystemSettingsForm) => {
		// find notification which are OFF - relevant for API
		const disabledNotifications = NOTIFICATIONS.map((type: string) => {
			return {
				eventType: type,
				b2bChannels: transformNotificationsChannelForRequest(formData.disabledNotifications[type as RS_NOTIFICATION].b2bChannels),
				b2cChannels: transformNotificationsChannelForRequest(formData.disabledNotifications[type as RS_NOTIFICATION].b2cChannels)
			}
		})

		try {
			// TODO: aktualne mi to vracia 404 :/
			await postReq(
				'/api/b2b/admin/salons/{salonID}/settings' as any,
				{ salonID },
				{
					...formData,
					disabledNotifications
				}
			)

			dispatch(selectSalon(salonID))
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
							{/* <Permissions allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_CREATE]} render={() => <ServicesFilter onSubmit={handleSubmit} />} /> */}
							<ReservationSystemSettingsForm onSubmit={submitSettings} salonID={salonID} excludedB2BNotifications={EXCLUDED_NOTIFICATIONS_B2B} />
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default withPermissions(permissions)(SalonSettingsPage)
