import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { reset } from 'redux-form'
import { useTranslation } from 'react-i18next'

// components
import RegistrationForm from './components/RegistrationForm'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM } from '../../utils/enums'
import { setAccessToken, setRefreshToken } from '../../utils/auth'
import { history, getPath } from '../../utils/history'

// interfaces
import { ILoginForm, IRegistrationForm } from '../../types/interfaces'

type Props = {}

const RegistrationPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()

	// const handleSubmit = async (values: ILoginForm) => dispatch(UserActions.logInUser(get(values, 'email'), get(values, 'password')))
	const handleSubmit = async (values: IRegistrationForm) => {
		try {
			// const reqData = {
			// 	email: values.email
			// }

			const reqData = {
				email: values.email,
				password: values.password,
				phonePrefixCountryCode: values.phonePrefixCountryCode,
				phone: values.phone,
				agreeGDPR: values.gdpr,
				agreeMarketing: !!values?.marketing,
				agreeGTC: values.gtc
			}

			console.log(reqData)
			const res = await postReq('/api/b2b/admin/users/registration', null, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(reset(FORM.REGISTRATION))
			const { accessToken, refreshToken } = res.data
			console.log(res.data)
			setAccessToken(accessToken)
			setRefreshToken(refreshToken)
			history.push(getPath(t('paths:home')))
			// setModalVisible(false)
			return res
		} catch (e) {
			console.log(e)
			return e
		}
	}
	// return <RegistrationForm onSubmit={handleSubmit as any} />
	return <RegistrationForm onSubmit={handleSubmit} />
}

export default RegistrationPage
