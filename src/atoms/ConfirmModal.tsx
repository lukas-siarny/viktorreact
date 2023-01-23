import React, { FC } from 'react'
import { Button, Modal, ModalProps } from 'antd'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// assets
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon-2.svg'

export interface IConfirmModal extends ModalProps {
	loading?: boolean
	disabled?: boolean
}

const ConfirmModal: FC<IConfirmModal> = (props) => {
	const { loading, disabled, onOk, onCancel, children, okText, cancelText, ...restProps } = props
	const [t] = useTranslation()

	return (
		<Modal {...restProps} closeIcon={<CloseIcon />} onCancel={onCancel} onOk={onOk} footer={null}>
			{children}
			<div className={'flex gap-4 mt-6'}>
				<Button
					type={'dashed'}
					size={'middle'}
					className={cx(props.cancelButtonProps?.className, 'noti-btn w-1/2')}
					htmlType={'button'}
					onClick={onCancel as any}
					disabled={disabled}
					loading={loading}
				>
					{cancelText || t('loc:Zrušiť')}
				</Button>
				<Button
					type={'primary'}
					size={'middle'}
					className={cx(props.okButtonProps?.className, 'noti-btn w-1/2')}
					htmlType={'button'}
					onClick={onOk as any}
					disabled={disabled}
					loading={loading}
				>
					{okText || 'Ok'}
				</Button>
			</div>
		</Modal>
	)
}

export default ConfirmModal
