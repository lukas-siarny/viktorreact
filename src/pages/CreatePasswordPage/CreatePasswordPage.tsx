import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

// components
import CreatePasswordForm from './components/CreatePasswordForm'
import ForgottenPasswordModal from '../../components/ForgottenPassword/ForgottenPasswordModal'

// actions
import { processAuthorizationResult } from '../../reducers/users/userActions'

// utils
import { postReq } from '../../utils/request'

// hooks
import useQueryParams, { StringParam } from '../../hooks/useQueryParams'

// schemas
import { ICreatePasswordForm } from '../../schemas/createPassword'

const CreatePasswordPage = () => {
	const [modalVisible, setModalVisible] = useState(false)
	const dispatch = useDispatch()
	const [query] = useQueryParams({
		t: StringParam()
	})

	const handleSubmit = async (values: ICreatePasswordForm) => {
		try {
			const input = {
				password: values.confirmPassword
			}

			const config = {
				headers: {
					Authorization: `Bearer ${query.t}`
				}
			}

			const { data } = await postReq('/api/b2b/admin/auth/reset-password', null, input, config)
			return dispatch(processAuthorizationResult(data))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
			return e
		}
	}

	return (
		<div className={'pb-8 w-full max-w-80'}>
			<CreatePasswordForm onSubmit={handleSubmit} showForgottenPasswordModal={() => setModalVisible(true)} />
			{modalVisible && <ForgottenPasswordModal visible={modalVisible} onClose={() => setModalVisible(false)} />}
		</div>
	)
}

export default CreatePasswordPage
