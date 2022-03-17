import React, { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { reset, initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { map } from 'lodash'

// components
import RegistrationForm from './components/RegistrationForm'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM, ENUMERATIONS_KEYS, LANGUAGE } from '../../utils/enums'
import { setAccessToken, setRefreshToken } from '../../utils/auth'
import { history, getPath } from '../../utils/history'
import { getPrefixCountryCode } from '../../utils/helper'

// interfaces
import { IRegistrationForm } from '../../types/interfaces'

// reducers
import { getCountries } from '../../reducers/enumerations/enumerationActions'

// actions
import * as UserActions from '../../reducers/users/userActions'

type Props = {}

const RegistrationPage: FC<Props> = () => {
	const dispatch = useDispatch()

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

			const res = dispatch(UserActions.registerUser(reqData))
			dispatch(reset(FORM.REGISTRATION))
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
			LANGUAGE.SK.toUpperCase()
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
