import React, { useEffect } from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

// components
import ServiceCreatePage from './ServiceCreatePage'
import ServiceEditPage from './ServiceEditPage'
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs, IComputedMatch, SalonSubPageProps } from '../../types/interfaces'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{
		serviceID: string
	}>
}

const ServicePage = (props: Props) => {
	const { serviceID } = props.computedMatch.params
	const { salonID, parentPath } = props
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const [backUrl] = useBackUrl(parentPath + t('paths:services'))

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam služieb'),
				link: backUrl
			},
			{
				name: serviceID ? t('loc:Detail služby') : t('loc:Vytvoriť službu')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:services')} />
			</Row>
			<div className='content-body small mt-2'>
				{serviceID ? <ServiceEditPage serviceID={serviceID} salonID={salonID} parentPath={parentPath} /> : <ServiceCreatePage salonID={salonID} parentPath={parentPath} />}
			</div>
		</>
	)
}

export default ServicePage
