import React, { useEffect } from 'react'
import { Row } from 'antd'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// components
import { useParams } from 'react-router-dom'
import ServiceEditPage from './ServiceEditPage'
import Breadcrumbs from '../../components/Breadcrumbs'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'
import { RootState } from '../../reducers'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

type Props = SalonSubPageProps

const ServicePage = (props: Props) => {
	const { serviceID } = useParams<Required<{ serviceID: string }>>()
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
			{serviceID && <ServiceEditPage serviceID={serviceID} salonID={salonID} parentPath={backUrl} />}
		</>
	)
}

export default ServicePage
