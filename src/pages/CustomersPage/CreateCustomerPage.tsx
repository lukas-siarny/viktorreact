import React from 'react'
import { useTranslation } from 'react-i18next'
import { Row } from 'antd'

// types
import { IBreadcrumbs } from '../../types/interfaces'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

const CreateCustomerPage = () => {
	const [t] = useTranslation()

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov'),
				link: t('paths:customers')
			},
			{
				name: t('loc:Vytvorenie zákazníka')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:customers')} />
			</Row>
			<div className='content-body small'>
				<h1 className='text-5xl font-bold'>TODO: create new customer</h1>
			</div>
		</>
	)
}

export default CreateCustomerPage
