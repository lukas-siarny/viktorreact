import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { useTranslation } from 'react-i18next'

type Props = {}

const CalendarIntegrations = (props: Props) => {
	const { i18n } = useTranslation()
	return (
		<GoogleLogin
			onSuccess={(credentialResponse) => {
				console.log(credentialResponse)
			}}
			onError={() => {
				console.log('Login Failed')
			}}
			locale={i18n.language}
		/>
	)
}

export default CalendarIntegrations
