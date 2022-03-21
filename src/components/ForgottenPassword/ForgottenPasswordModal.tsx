import React, { FC } from 'react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { reset } from 'redux-form'

// components
import ForgottenPasswordForm from './ForgottenPasswordForm'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM } from '../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

// interfaces
import { IForgotPasswordForm } from '../../types/interfaces'

type Props = {
	onClose: () => void
	visible: boolean
}

const ForgottenPasswordModal: FC<Props> = (props) => {
	const { onClose, visible } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const hideModal = () => {
		dispatch(reset(FORM.FORGOT_PASSWORD))
		onClose()
	}

	const handleSubmit = async (values: IForgotPasswordForm) => {
		try {
			const reqData = {
				email: values.email
			}

			await postReq('/api/b2b/admin/auth/forgot-password', null, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			hideModal()
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
		}
	}

	return (
		<Modal className='rounded-fields' title={t('loc:Zabudnuté heslo')} centered visible={visible} footer={null} onCancel={hideModal} closeIcon={<CloseIcon />} width={394}>
			<ForgottenPasswordForm onSubmit={handleSubmit} />
		</Modal>
	)
}

export default ForgottenPasswordModal
