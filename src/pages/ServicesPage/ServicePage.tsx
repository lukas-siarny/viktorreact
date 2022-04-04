import React, { useEffect } from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { compose } from 'redux'
import { useDispatch } from 'react-redux'

// components
import ServiceCreatePage from './ServiceCreatePage'
import ServiceEditPage from './ServiceEditPage'
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'

// utils
import { PERMISSION } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

type Props = {
	computedMatch: IComputedMatch<{
		serviceID: string
	}>
}

const ServicePage = (props: Props) => {
	const serviceID = parseInt(props.computedMatch.params.serviceID, 10)
	const { t } = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getCategories())
	}, [])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam služieb'),
				link: t('paths:services')
			},
			{
				name: t('loc:Detail služby')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:services')} />
			</Row>
			<div className='content-body small'>
				{serviceID ? <ServiceEditPage serviceID={serviceID} /> : undefined}
				{!serviceID ? <ServiceCreatePage /> : undefined}
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.PARTNER, PERMISSION.SALON_EDIT, PERMISSION.SALON_BROWSING]))(ServicePage)
