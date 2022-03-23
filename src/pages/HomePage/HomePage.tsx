import React from 'react'
import AddressForm, { IDestinationForm } from './AddressForm'

const HomePage = () => {
	const handleSubmit = (values: IDestinationForm) => {
		console.log('🚀 ~ file: HomePage.tsx ~ line 5 ~ handleSubmit ~ values', values)
	}

	return <AddressForm onSubmit={handleSubmit} />
}
export default HomePage
