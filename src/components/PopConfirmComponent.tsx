import React from 'react'
import { Popconfirm, PopconfirmProps } from 'antd'
import { useTranslation } from 'react-i18next'

export type PopConfirmComponentProps = Partial<PopconfirmProps> & {
	// TODO - check and add type
	allowedButton: any
}

const PopConfirmComponent = (props: PopConfirmComponentProps) => {
	const { getPopupContainer, onConfirm, placement, title, disabled, onCancel, allowedButton, okText, style } = props

	const [t] = useTranslation()

	return (
		<Popconfirm
			placement={placement || 'top'}
			title={title}
			style={style}
			okButtonProps={{
				type: 'default',
				className: 'noti-btn'
			}}
			cancelButtonProps={{
				type: 'primary',
				className: 'noti-btn'
			}}
			okText={okText}
			onConfirm={onConfirm}
			cancelText={t('loc:Zrušiť')}
			onCancel={onCancel}
			disabled={disabled}
			getPopupContainer={getPopupContainer}
		>
			{allowedButton}
		</Popconfirm>
	)
}

export default React.memo(PopConfirmComponent)
