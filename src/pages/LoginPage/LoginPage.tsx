import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

// components
import LoginForm from './components/LoginForm'
import ForgottenPasswordModal from '../../components/ForgottenPassword/ForgottenPasswordModal'

// interfaces
import { ILoginForm } from '../../schemas/login'

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
	const handleLoginSubmit = async (values: ILoginForm) => {
		try {
			/**
			 * v pripade, ze uzivatel nebol prihlaseny a v prehliadaci zvolil nejaku autorizovanu URL, tak ho to redirectne sem na login pagu
			 * v AuthRoute sa pri redirecte do state objektu ulozi patha, z ktorej sem bol redirectnuty (state = { redirectFrom: 'redirect path' })
			 * ak sa teda v redirectFrom nachadza nejaka URL, tak ma to na nu po uspensom logine presmeruje
			 * do postReq sa posiela skipRedirectToLoginPage kvoli tomu, ze ak uzivatel zada zle heslo, tak sa nasledne vyvola akcia logOut user (vid: postReq => catch => showErrorNotifications => logOutUser)
			 * v nej sa po uspesnom odlhaseni vola redirect na login pagu, ktory by premazal URLcku ulozenu v state objekte.. kedze vsak viem, ze uz sa nachadzam na login page, tento redirect v logOut akcii uz nie je nutny
			 */
			const { data } = await postReq('/api/b2b/admin/auth/login', null, values, { skipRedirectToLoginPage: true })
			dispatch(processAuthorizationResult(data, location?.state?.redirectFrom))
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
