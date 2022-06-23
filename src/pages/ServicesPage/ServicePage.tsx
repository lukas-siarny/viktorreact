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
	// TODO - add salonID
	const salonID = 1

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
				{serviceID ? <ServiceEditPage serviceID={serviceID} salonID={salonID} /> : undefined}
				{!serviceID ? <ServiceCreatePage salonID={salonID} /> : undefined}
			</div>
		</>
	)
}

export default ServicePage
