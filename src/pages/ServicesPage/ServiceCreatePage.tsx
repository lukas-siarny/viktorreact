import React from 'react'
import { useTranslation } from 'react-i18next'

// components
import ServiceForm from './components/ServiceForm'

// types
import { IServiceForm } from '../../types/interfaces'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE } from '../../utils/enums'
import { history } from '../../utils/history'

const ServiceCreatePage = () => {
	const { t } = useTranslation()

	const handleSubmit = async (values: IServiceForm) => {
		try {
			const reqData = {
				name: values.name,
				description: values.description,
				durationFrom: values.durationFrom,
				durationTo: values.durationTo,
				priceFrom: values.priceFrom,
				priceTo: values.priceTo,
				salonID: values.salonID,
				categoryID: values.categorySecondLevel
				// employeeIDs
				// imageIDs
			}

			await postReq('/api/b2b/admin/services/', undefined, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)

			const url = t('paths:services')
			history.push(url)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	return <ServiceForm onSubmit={handleSubmit} />
}

export default ServiceCreatePage
