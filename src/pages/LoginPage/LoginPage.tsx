import React, { FC, useState } from 'react'
import { Modal, Button } from 'antd'
import { useTranslation } from 'react-i18next'
// import { get } from 'lodash'
import { useDispatch } from 'react-redux'

// components
import LoginForm from './components/LoginForm'
import ForgottenPasswordForm from './components/ForgottenPasswordForm'

// interfaces
import { ILoginForm } from '../../types/interfaces'

// // actions
import * as UserActions from '../../reducers/users/userActions'

type Props = {}

const LoginPage: FC<Props> = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const handleSubmit = async (values: ILoginForm) => dispatch(UserActions.logInUser(values))

	return (
		<>
			<LoginForm onSubmit={handleSubmit as any} showForgottenPasswordModal={() => setModalVisible(true)} />
			<Modal title={t('loc:Zabudnuté heslo')} centered visible={modalVisible} footer={null} onCancel={() => setModalVisible(false)}>
				<ForgottenPasswordForm />
			</Modal>
		</>
	)
}

export default LoginPage
