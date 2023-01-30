import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset, initialize } from 'redux-form'
import { map } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'

// components
import RegistrationForm from './components/RegistrationForm'

// actions
import { processAuthorizationResult } from '../../reducers/users/userActions'

// utils
import { postReq } from '../../utils/request'
import { FORM, ENUMERATIONS_KEYS } from '../../utils/enums'
import { getPrefixCountryCode } from '../../utils/helper'

// interfaces
import { IRegistrationForm } from '../../types/interfaces'

// reducers
import { RootState } from '../../reducers'

type Props = {}

const RegistrationPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const [t] = useTranslation()
	const { search } = useLocation()
	const { email } = queryString.parse(search, { decode: false })
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const navigate = useNavigate()
	const handleSubmit = async (values: IRegistrationForm) => {
		try {
			const reqData = {
				email: values.email,
				password: values.password,
				phonePrefixCountryCode: values.phonePrefixCountryCode,
				phone: values.phone,
				agreeGDPR: values.gdpr,
				agreeMarketing: !!values?.marketing
			}

			const { data } = await postReq('/api/b2b/admin/users/registration', null, reqData)
			dispatch(reset(FORM.REGISTRATION))
			return dispatch(processAuthorizationResult(data, t('paths:activation'), navigate))
			// return res
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
			return e
		}
	}

	const fetchData = () => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

		const initData = {
			phonePrefixCountryCode,
			email
		}
		dispatch(initialize(FORM.REGISTRATION, initData || {}))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phonePrefixes])

	return <RegistrationForm onSubmit={handleSubmit} />
}

export default RegistrationPage
