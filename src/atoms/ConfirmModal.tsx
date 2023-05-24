import React, { FC } from 'react'
import { Button, Modal, ModalProps } from 'antd'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

// assets
import { ReactComponent as CloseIcon } from '../assets/icons/close-icon-modal.svg'
import PopConfirmComponent from '../components/PopConfirmComponent'

export interface IConfirmModal extends ModalProps {
	loading?: boolean
	disabled?: boolean
	okConfirm?: {
		title: string
		okText?: string
		placement?: string
	}
}

const ConfirmModal: FC<IConfirmModal> = (props) => {
	const { loading, disabled, onOk, onCancel, children, okText, cancelText, okConfirm, ...restProps } = props
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
				{okConfirm ? (
					<PopConfirmComponent
						placement={'top' || okConfirm.placement}
						title={okConfirm.title}
						onConfirm={onOk as any}
						okText={t('loc:Potvrdiť') || okConfirm.okText}
						allowedButton={
							<Button
								type={'primary'}
								size={'middle'}
								className={cx(props.okButtonProps?.className, 'noti-btn w-1/2')}
								htmlType={'button'}
								disabled={disabled}
								loading={loading}
							>
								{okText || 'Ok'}
							</Button>
						}
					/>
				) : (
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
				)}
			</div>
		</Modal>
	)
}

export default ConfirmModal
