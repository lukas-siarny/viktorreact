import React, { FC } from 'react'
import { get } from 'lodash'
import { useDispatch } from 'react-redux'
import { reset } from 'redux-form'

// components
import ForgotPasswordForm from './components/ForgotPasswordForm'

// interfaces
import { IForgotPasswordForm } from '../../types/interfaces'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM } from '../../utils/enums'

type Props = {}

const ForgotPasswordPage: FC<Props> = () => {
	const dispatch = useDispatch()
	const handleSubmit = async (values: IForgotPasswordForm) => {
		console.log('ForgotPasswordPage.tsx ~ line 21 ~ values', values)
		// try {
		// 	const reqData = {
		// 		email: get(values, 'email')
		// 	}

		// 	const res = await postReq('/api/v1/authorization/forgot-password', null, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
		// 	dispatch(reset(FORM.FORGOT_PASSWORD))
		// 	return res
		// } catch (e) {
		// 	return e
		// }
	}
	return <ForgotPasswordForm onSubmit={handleSubmit} />
}

export default ForgotPasswordPage
