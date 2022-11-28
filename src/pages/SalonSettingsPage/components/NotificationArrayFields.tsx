import React from 'react'
import { Field, WrappedFieldArrayProps } from 'redux-form'
import { Tooltip, Form } from 'antd'

// atoms
import SwitchField from '../../../atoms/SwitchField'

// utils
import { RS_NOTIFICATION, RS_NOTIFICATION_FIELD_TEXTS, NOTIFICATION_CHANNEL, RS_NOTIFICATION_TYPE } from '../../../utils/enums'

// assets
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon-32.svg'

const { Item } = Form

const getNotificationTitle = (notificationType: RS_NOTIFICATION, channel: NOTIFICATION_CHANNEL) => {
	const { title, tooltip } = RS_NOTIFICATION_FIELD_TEXTS(notificationType, channel)
	return (
		<div className={'mt-5 mb-4 w-full'}>
			<div className={'mb-0 mt-0 flex items-center justify-between'}>
				<span className='base-semibold'>{title}</span>
				<Tooltip title={tooltip} className={'cursor-pointer'}>
					<InfoIcon width={16} height={16} className={'text-notino-grayDark'} />
				</Tooltip>
			</div>
		</div>
	)
}

const TYPES = Object.keys(RS_NOTIFICATION_TYPE)

type Props = WrappedFieldArrayProps & {
	notificationType: RS_NOTIFICATION
	channel: NOTIFICATION_CHANNEL
}

const NotificationArrayFields = (props: Props) => {
	const { fields, notificationType, channel } = props
	const disabled = false

	return (
		<Item className='pb-0'>
			{getNotificationTitle(notificationType, channel)}
			{fields.map((field: string, index: number) => (
				<Field key={index} component={SwitchField} label={TYPES[index]} name={`${field}.${TYPES[index].toUpperCase()}`} size={'middle'} disabled={disabled} />
			))}
		</Item>
	)
}

export default NotificationArrayFields
