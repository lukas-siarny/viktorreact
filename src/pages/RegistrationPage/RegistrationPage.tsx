import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { reset, initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'

// components
import RegistrationForm from './components/RegistrationForm'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM, ENUMERATIONS_KEYS } from '../../utils/enums'
import { setAccessToken, setRefreshToken } from '../../utils/auth'
import { history, getPath } from '../../utils/history'

// interfaces
import { IRegistrationForm } from '../../types/interfaces'

// reducers
import { getEnumerations } from '../../reducers/enumerations/enumerationActions'

type Props = {}

const RegistrationPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()

	const handleSubmit = async (values: IRegistrationForm) => {
		try {
			const reqData = {
				email: values.email,
				password: values.password,
				phonePrefixCountryCode: values.phonePrefixCountryCode,
				phone: values.phone,
				agreeGDPR: values.gdpr,
				agreeMarketing: !!values?.marketing,
				agreeGTC: values.gtc
			}

			const res = await postReq('/api/b2b/admin/users/registration', null, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(reset(FORM.REGISTRATION))
			const { accessToken, refreshToken } = res.data
			setAccessToken(accessToken)
			setRefreshToken(refreshToken)
			history.push(getPath(t('paths:home')))
			return res
		} catch (e) {
			console.log(e)
			return e
		}
	}

	const fetchData = async () => {
		const prefixData = await dispatch(getEnumerations(ENUMERATIONS_KEYS.COUNTRIES)) // save data to redux and return prefix data
		let initData: any
		if (prefixData.data) {
			initData = {
				phonePrefixCountryCode: 'SK'
			}
		}
		dispatch(initialize(FORM.REGISTRATION, initData || {}))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<h3>{t('loc:Registrácia')}</h3>
			<RegistrationForm onSubmit={handleSubmit} />
		</>
	)
}

export default RegistrationPage
