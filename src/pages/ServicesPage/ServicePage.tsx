import React from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'

// components
import ServiceCreatePage from './ServiceCreatePage'
import ServiceEditPage from './ServiceEditPage'
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'

type Props = {
	computedMatch: IComputedMatch<{
		serviceID: string
	}>
}

const ServicePage = (props: Props) => {
	const serviceID = parseInt(props.computedMatch.params.serviceID, 10)
	const { t } = useTranslation()

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam služieb'),
				link: t('paths:services')
			},
			{
				name: serviceID ? t('loc:Detail služby') : t('loc:Vytvoriť službu')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:services')} />
			</Row>
			<div className='content-body small mt-2'>
				{serviceID ? <ServiceEditPage serviceID={serviceID} /> : undefined}
				{!serviceID ? <ServiceCreatePage /> : undefined}
			</div>
		</>
	)
}

export default ServicePage
