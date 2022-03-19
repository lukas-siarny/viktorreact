import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'

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

	const handleLoginSubmit = async (values: ILoginForm) => dispatch(logInUser(values))

	return (
		<>
			<LoginForm onSubmit={handleLoginSubmit} showForgottenPasswordModal={() => setModalVisible(true)} />
			<ForgottenPasswordModal visible={modalVisible} onClose={() => setModalVisible(false)} />
		</>
	)
}

export default LoginPage
