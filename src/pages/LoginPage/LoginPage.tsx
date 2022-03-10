import React, { FC, useState } from 'react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
// import { get } from 'lodash'
import { useDispatch } from 'react-redux'
import { reset } from 'redux-form'

// components
import LoginForm from './components/LoginForm'
import ForgottenPasswordForm from './components/ForgottenPasswordForm'

// interfaces
import { IForgotPasswordForm } from '../../types/interfaces'

// // actions
// import * as UserActions from '../../reducers/users/userActions'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM } from '../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

type Props = {}

const LoginPage: FC<Props> = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const [t] = useTranslation()
	const dispatch = useDispatch()

	// const handleSubmit = async (values: ILoginForm) => dispatch(UserActions.logInUser(get(values, 'email'), get(values, 'password')))
	const handleSubmit = (values: any) => console.log('🚀 ~ file: LoginPage.tsx ~ line 21 ~ values', values)

	const handleForgottenPassSubmit = async (values: IForgotPasswordForm) => {
		try {
			const reqData = {
				email: values.email
			}

			const res = await postReq('/api/b2b/admin/auth/forgot-password', null, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(reset(FORM.FORGOT_PASSWORD))
			setModalVisible(false)
			return res
		} catch (e) {
			console.log(e)
			return e
		}
	}

	return (
		<>
			<LoginForm onSubmit={handleSubmit as any} showForgottenPasswordModal={() => setModalVisible(true)} />
			<Modal
				className='rounded-fields'
				title={t('loc:Zabudnuté heslo')}
				centered
				visible={modalVisible}
				footer={null}
				onCancel={() => setModalVisible(false)}
				closeIcon={<CloseIcon />}
				width={394}
			>
				<ForgottenPasswordForm onSubmit={handleForgottenPassSubmit} />
			</Modal>
		</>
	)
}

export default LoginPage
