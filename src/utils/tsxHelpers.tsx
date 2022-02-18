/* eslint-disable import/no-cycle */
import React from 'react'
import { forEach, isEmpty, lowerCase } from 'lodash'
import { notification } from 'antd'

import { IErrorMessage } from '../types/interfaces'
import { NOTIFICATION_TYPE } from './enums'
import { translateMessageType } from './helper'
import { ReactComponent as NotifCloseIcon } from '../assets/icons/notification-close-icon.svg'

// NOTE: helpere ktore potrebuju pracovat s JSX.Element cize potrebuju aby bol importnuty react a mali priponu jsx/tsx lebo TS nedovoli aby React component bol js/ts neda sa to ignorovat
// Tento wrapper bude len exportovat funkcie ktore pracuju s nejkaym JSX.Elemetnom (eg: <NotifCloseIcon />)

const showNotifications = (messages: IErrorMessage[], typeNotification: NOTIFICATION_TYPE) => {
	if (!isEmpty(messages)) {
		if (typeNotification === NOTIFICATION_TYPE.NOTIFICATION) {
			forEach(messages, (message) => {
				let notif
				switch (lowerCase(message.type)) {
					case 'info':
						notif = notification.info
						break
					case 'warning':
						notif = notification.warning
						break
					case 'success':
						notif = notification.success
						break
					case 'error':
						notif = notification.error
						break
					default:
						notif = notification.info
						break
				}
				notif({
					closeIcon: <NotifCloseIcon className={'text-gray-100 hover:text-gray-200'} />,
					message: translateMessageType(message.type),
					description: message.message,
					className: 'tp-notification'
				})
			})
		} else if (typeNotification === NOTIFICATION_TYPE.MODAL) {
			// TODO: doriesit modal notification
		}
	}
}

export default showNotifications
