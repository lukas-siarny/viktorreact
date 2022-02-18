import React, { FC } from 'react'
import { get } from 'lodash'
import { useDispatch } from 'react-redux'

// components
import LoginForm from './components/LoginForm'

// interfaces
import { ILoginForm } from '../../types/interfaces'

// actions
import * as UserActions from '../../reducers/users/userActions'

type Props = {}

const LoginPage: FC<Props> = () => {
	const dispatch = useDispatch()

	const handleSubmit = async (values: ILoginForm) => dispatch(UserActions.logInUser(get(values, 'email'), get(values, 'password')))
	return <LoginForm onSubmit={handleSubmit as any} />
}

export default LoginPage
