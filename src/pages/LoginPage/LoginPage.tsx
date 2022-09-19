import React, { FC, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

// components
import LoginForm from './components/LoginForm'
import ForgottenPasswordModal from '../../components/ForgottenPassword/ForgottenPasswordModal'

// interfaces
import { ILoginForm } from '../../types/interfaces'

// actions
import { processAuthorizationResult } from '../../reducers/users/userActions'

// utils
import { postReq } from '../../utils/request'
import { RootState } from '../../reducers'

type Props = {}

interface LocationState {
	redirectFrom?: string
}

const LoginPage: FC<Props> = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const location = useLocation<LocationState>()
	const previousRoute = useSelector((state: RootState) => state.user.previousRoute)
	const regularLogout = useSelector((state: RootState) => state.user.regularLogout)

	console.log({ routerState: location, previousRoute, regularLogout })

	const handleLoginSubmit = async (values: ILoginForm) => {
		try {
			const { data } = await postReq('/api/b2b/admin/auth/login', null, values)
			dispatch(processAuthorizationResult(data, regularLogout ? t('paths:index') : previousRoute))
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
