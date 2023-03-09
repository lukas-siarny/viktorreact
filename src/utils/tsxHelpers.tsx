/* eslint-disable import/no-cycle */
import React from 'react'
import { forEach, isEmpty, lowerCase } from 'lodash'
import { Button, Modal, ModalFuncProps, notification, Result } from 'antd'
import i18next from 'i18next'
import { ResultStatusType } from 'antd/es/result'

// types
import { IErrorMessage } from '../types/interfaces'

// utils
import { NOTIFICATION_TYPE } from './enums'
import { translateMessageType } from './helper'

// assets
import { ReactComponent as NotifCloseIcon } from '../assets/icons/notification-close-icon.svg'

// NOTE: helpere ktore potrebuju pracovat s JSX.Element cize potrebuju aby bol importnuty react a mali priponu jsx/tsx lebo TS nedovoli aby React component bol js/ts neda sa to ignorovat
// Tento wrapper bude len exportovat funkcie ktore pracuju s nejkaym JSX.Elemetnom (eg: <NotifCloseIcon />)

const showNotifications = (messages: IErrorMessage[], typeNotification: NOTIFICATION_TYPE) => {
	if (!isEmpty(messages)) {
		if (typeNotification === NOTIFICATION_TYPE.NOTIFICATION) {
			forEach(messages, (message) => {
				let notif
				switch (lowerCase(message.type)) {
					case 'warning':
						notif = notification.warning
						break
					case 'success':
						notif = notification.success
						break
					case 'error':
						notif = notification.error
						break
					case 'info':
					default:
						notif = notification.info
						break
				}
				notif({
					closeIcon: <NotifCloseIcon className={'text-gray-100 hover:text-gray-200'} />,
					message: translateMessageType(message.type),
					description: message.message,
					className: 'noti-notification'
				})
			})
		} else if (typeNotification === NOTIFICATION_TYPE.MODAL) {
			// TODO: doriesit modal notification
		}
	}
}

export const showNotificationModal = (
	config: ModalFuncProps & {
		message?: string
		actionButtonLabel?: string
		action?: (e: any) => void
		notifactionType?: ResultStatusType
	} = {}
) => {
	const { message, actionButtonLabel, action, notifactionType, ...modalConfig } = config

	const modal = Modal.info({ open: false })

	modal.update({
		open: true,
		className: 'noti-notification-modal',
		closable: true,
		footer: false,
		maskClosable: true,
		keyboard: true,
		content: (
			<Result
				status={notifactionType || 'error'}
				title={message}
				extra={
					<Button
						className={'noti-btn'}
						onClick={(e) => {
							if (action) {
								action(e)
							}

							modal.destroy()
						}}
						type='primary'
					>
						{i18next.t('loc:Nastaviť adresu')}
					</Button>
				}
			/>
		),
		...modalConfig
	})
}

export default showNotifications
