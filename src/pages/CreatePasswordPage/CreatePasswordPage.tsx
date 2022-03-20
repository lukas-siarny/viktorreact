import React, { FC, useState } from 'react'
import { useDispatch } from 'react-redux'

// components
import CreatePasswordForm from './components/CreatePasswordForm'
import ForgottenPasswordModal from '../../components/ForgottenPassword/ForgottenPasswordModal'

// inteerfaces
import { ICreatePasswordForm } from '../../types/interfaces'

// actions
import { resetPassword } from '../../reducers/users/userActions'

type Props = {
	token: string
}

const CreatePasswordPage: FC<Props> = (props) => {
	const [modalVisible, setModalVisible] = useState(false)
	const dispatch = useDispatch()

	const handleSubmit = async (values: ICreatePasswordForm) => {
		try {
			const data = {
				password: values.confirmPassword
			}

			return dispatch(resetPassword(data, props.token))
		} catch (e) {
			return e
		}
	}

	return (
		<>
			<CreatePasswordForm onSubmit={handleSubmit} showForgottenPasswordModal={() => setModalVisible(true)} />
			{modalVisible && <ForgottenPasswordModal visible={modalVisible} onClose={() => setModalVisible(false)} />}
		</>
	)
}

export default CreatePasswordPage
