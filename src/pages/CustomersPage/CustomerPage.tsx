import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Row } from 'antd'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'

type Props = {
	computedMatch: IComputedMatch<{ customerID: number }>
}

const CustomerPage = (props: Props) => {
	const [t] = useTranslation()
	const { customerID } = props.computedMatch.params

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov'),
				link: t('paths:customers')
			},
			{
				name: t('loc:Detail zákazníka'),
				titleName: 'Customer detail' // TODO `${get(customer, 'data.customer.firstName')} ${get(customer, 'data.customer.lastName')}`
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:customers')} />
			</Row>
			<div className='content-body small'>
				<h1 className='text-5xl font-bold'>TODO: edit customer with id: {customerID}</h1>
			</div>
		</>
	)
}

export default CustomerPage
