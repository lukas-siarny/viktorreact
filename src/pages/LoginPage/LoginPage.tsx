import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

// components
import LoginForm from './components/LoginForm'
import ForgottenPasswordModal from '../../components/ForgottenPassword/ForgottenPasswordModal'

// interfaces
import { ILoginForm } from '../../types/interfaces'

// actions
import { processAuthorizationResult } from '../../reducers/users/userActions'

// utils
import { postReq } from '../../utils/request'

type Props = {}

const LoginPage: FC<Props> = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const location = useLocation()
	const navigate = useNavigate()
	const handleLoginSubmit = async (values: ILoginForm) => {
		try {
			const { data } = await postReq('/api/b2b/admin/auth/login', null, values, { skipLoginRedirect: true })
			dispatch(processAuthorizationResult(data, location?.state?.redirectFrom, navigate))
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error)
		}
	}

	return (
		<div className='mt-16 max-w-80 w-full'>
			<h3>{t('loc:Prihlásenie')}</h3>
			<LoginForm onSubmit={handleLoginSubmit} showForgottenPasswordModal={() => setModalVisible(true)} />
			{modalVisible && <ForgottenPasswordModal visible={modalVisible} onClose={() => setModalVisible(false)} />}
		</div>
	)
}

export default LoginPage
