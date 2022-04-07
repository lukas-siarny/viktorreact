import React, { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset, initialize } from 'redux-form'
import { map } from 'lodash'

// components
import RegistrationForm from './components/RegistrationForm'

// utils
import { FORM, LANGUAGE, ENUMERATIONS_KEYS } from '../../utils/enums'
import { getPrefixCountryCode } from '../../utils/helper'

// interfaces
import { IRegistrationForm } from '../../types/interfaces'

// reducers
import { RootState } from '../../reducers'

// actions
import { registerUser } from '../../reducers/users/userActions'

type Props = {}

const RegistrationPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])

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

			const res = dispatch(registerUser(reqData))
			dispatch(reset(FORM.REGISTRATION))
			return res
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
			return e
		}
	}

	const fetchData = () => {
		const phonePrefixCountryCode = getPrefixCountryCode(
			map(phonePrefixes?.data, (item) => item.code),
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
	}, [phonePrefixes])

	return <RegistrationForm onSubmit={handleSubmit} />
}

export default RegistrationPage
