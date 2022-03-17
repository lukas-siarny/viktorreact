import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { reset, initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { map } from 'lodash'

// components
import RegistrationForm from './components/RegistrationForm'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM, ENUMERATIONS_KEYS } from '../../utils/enums'
import { setAccessToken, setRefreshToken } from '../../utils/auth'
import { history, getPath } from '../../utils/history'
import { getPrefixCountryCode } from '../../utils/helper'

// interfaces
import { IRegistrationForm } from '../../types/interfaces'

// reducers
import { getCountries } from '../../reducers/enumerations/enumerationActions'

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
		const { data } = await dispatch(getCountries(ENUMERATIONS_KEYS.COUNTRIES)) // save data to redux and return prefix data
		const phonePrefixCountryCode = getPrefixCountryCode(
			map(data, (item) => item.code),
			'SK'
		)

		const initData = {
			phonePrefixCountryCode
		}

		dispatch(initialize(FORM.REGISTRATION, initData || {}))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <RegistrationForm onSubmit={handleSubmit} />
}

export default RegistrationPage
