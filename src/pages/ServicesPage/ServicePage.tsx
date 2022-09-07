import React, { useEffect } from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// components
import ServiceEditPage from './ServiceEditPage'
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs, IComputedMatch, SalonSubPageProps } from '../../types/interfaces'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import { RootState } from '../../reducers'

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

	const service = useSelector((state: RootState) => state.service.service)
	const [backUrl] = useBackUrl(parentPath + t('paths:services-settings'))

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const renderBredCrumbLastLabel = () => {
		if (serviceID) {
			if (service?.data?.service?.category?.child?.child?.name) {
				return `${t('loc:Detail služby')} - ${service?.data?.service?.category?.child?.child?.name}`
			}
			return t('loc:Detail služby')
		}
		return t('loc:Vytvoriť službu')
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Nastavenie služieb'),
				link: backUrl
			},
			{
				name: renderBredCrumbLastLabel()
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={backUrl} />
			</Row>
			<div className='content-body small mt-2'>{serviceID && <ServiceEditPage serviceID={serviceID} salonID={salonID} parentPath={backUrl} />}</div>
		</>
	)
}

export default ServicePage
