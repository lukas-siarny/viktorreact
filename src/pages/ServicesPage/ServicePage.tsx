import React from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { compose } from 'redux'

// components
import ServiceCreatePage from './ServiceCreatePage'
import ServiceEditPage from './ServiceEditPage'
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs, IComputedMatch, SalonSubPageProps } from '../../types/interfaces'

// utils
import { PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{
		serviceID: number
	}>
}

const ServicePage = (props: Props) => {
	const { serviceID } = props.computedMatch.params
	const { salonID } = props
	const { t } = useTranslation()

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam služieb'),
				link: t('paths:salons/{{salonID}}/services', { salonID })
			},
			{
				name: serviceID ? t('loc:Detail služby') : t('loc:Vytvoriť službu')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:salons/{{salonID}}/services', { salonID })} />
			</Row>
			<div className='content-body small mt-2'>
				{serviceID ? <ServiceEditPage serviceID={serviceID} salonID={salonID} /> : undefined}
				{!serviceID ? <ServiceCreatePage salonID={salonID} /> : undefined}
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.PARTNER, PERMISSION.SALON_EDIT, PERMISSION.SALON_BROWSING]))(ServicePage)
