import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

// components
import LoginForm from './components/LoginForm'
import ForgottenPasswordModal from '../../components/ForgottenPassword/ForgottenPasswordModal'

// interfaces
import { ILoginForm } from '../../types/interfaces'

// actions
import { logInUser } from '../../reducers/users/userActions'

type Props = {}

const LoginPage: FC<Props> = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const dispatch = useDispatch()
	const [t] = useTranslation()

	const handleLoginSubmit = async (values: ILoginForm) => dispatch(logInUser(values))

	return (
		<div className='mt-16'>
			<h3>{t('loc:Prihlásenie')}</h3>
			<LoginForm onSubmit={handleLoginSubmit} showForgottenPasswordModal={() => setModalVisible(true)} />
			{modalVisible && <ForgottenPasswordModal visible={modalVisible} onClose={() => setModalVisible(false)} />}
		</div>
	)
}

export default LoginPage
