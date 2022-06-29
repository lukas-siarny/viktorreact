import React from 'react'
import { Popconfirm, Button, ButtonProps, PopconfirmProps } from 'antd'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { ReactComponent as BinIcon } from '../assets/icons/bin-icon.svg'
import { _Permissions } from '../types/interfaces'
import { STRINGS } from '../utils/enums'
import Permissions from '../utils/Permissions'

type Props = ButtonProps &
	Partial<PopconfirmProps> & {
		// NOTE: onlyIcon optional prop - for rendering only delete icon button without background and text -> for tables, lists...
		onlyIcon?: boolean
		permissions?: _Permissions
		entityName?: string
		withoutIcon?: boolean
		ghost?: boolean
		tableButton?: boolean
		smallIcon?: boolean
		noConfirm?: boolean
	}

const DeleteButton = (props: Props) => {
	const {
		getPopupContainer,
		onConfirm,
		placement,
		title,
		onlyIcon,
		permissions,
		disabled,
		icon,
		style,
		entityName,
		type,
		withoutIcon,
		size,
		ghost,
		tableButton,
		block,
		onCancel,
		onClick,
		smallIcon,
		id,
		noConfirm,
		shape,
		className
	} = props

	const [t] = useTranslation()

	const defaultEntityName = entityName ?? (t('loc:Položku') as string)

	let buttonIcon = icon
	if (!buttonIcon && onlyIcon) {
		buttonIcon = <BinIcon className={cx({ 'text-gray-600': disabled, 'text-red-600': !disabled, 'small-icon': smallIcon })} />
	} else if (!buttonIcon && !withoutIcon) {
		buttonIcon = <BinIcon className={cx({ 'text-gray-600': disabled, 'text-red-600': !disabled, 'small-icon': smallIcon })} />
	}

	const btnProps = {
		htmlType: 'button' as any,
		style: { ...style },
		type,
		danger: true,
		id,
		className: cx('ant-btn noti-btn', className, { 'noti-table-btn': tableButton }),
		size: size || 'middle',
		block,
		icon: buttonIcon,
		disabled,
		ghost,
		onClick,
		shape
	}

	let allowedButton = <Button {...btnProps}>{!onlyIcon && STRINGS(t).delete(defaultEntityName)}</Button>

	if (!noConfirm) {
		allowedButton = (
			<Popconfirm
				placement={placement || 'top'}
				title={title || STRINGS(t).areYouSureDelete(defaultEntityName)}
				okButtonProps={{
					type: 'default',
					className: 'noti-btn'
				}}
				cancelButtonProps={{
					type: 'primary',
					className: 'noti-btn'
				}}
				okText={t('loc:Zmazať')}
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

	if (!permissions) {
		return allowedButton
	}

	return (
		<Permissions
			allowed={permissions}
			render={(hasPermission, { openForbiddenModal }) => (
				<>
					{hasPermission ? (
						allowedButton
					) : (
						<Button
							{...btnProps}
							onClick={(e) => {
								e.preventDefault()
								openForbiddenModal()
							}}
						>
							{!onlyIcon && STRINGS(t).delete(defaultEntityName)}
						</Button>
					)}
				</>
			)}
		/>
	)
}

export default React.memo(DeleteButton)
