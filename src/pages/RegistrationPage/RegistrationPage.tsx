import React, { FC } from 'react'

// components
import RegistrationForm from './components/RegistrationForm'

type Props = {}

const RegistrationPage: FC<Props> = () => {
	// const handleSubmit = async (values: ILoginForm) => dispatch(UserActions.logInUser(get(values, 'email'), get(values, 'password')))
	// const handleSubmit = (values: any) => console.log('🚀 ~ file: RegistrationPage.tsx ~ line 20 ~ values', values)
	// return <RegistrationForm onSubmit={handleSubmit as any} />
	return <RegistrationForm />
}

export default RegistrationPage
