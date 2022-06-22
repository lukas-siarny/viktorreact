import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { get, map } from 'lodash'
import { useDispatch } from 'react-redux'
import { compose } from 'redux'

// components
import ServiceForm from './components/ServiceForm'

// types
import { IServiceForm } from '../../types/interfaces'

// reducers
import { getCategories } from '../../reducers/categories/categoriesActions'

// utils
import { postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'
import { withPermissions } from '../../utils/Permissions'
import { encodePrice } from '../../utils/helper'

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.PARTNER_ADMIN, PERMISSION.PARTNER, PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_CREATE]

const ServiceCreatePage = () => {
	const { t } = useTranslation()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const handleSubmit = async (values: IServiceForm) => {
		try {
			const reqData = {
				name: values.name,
				description: values.description,
				durationFrom: values.durationFrom,
				durationTo: values.variableDuration ? values.durationTo : undefined,
				priceFrom: encodePrice(values.priceFrom),
				priceTo: values.variablePrice ? encodePrice(values.priceTo) : undefined,
				salonID: values.salonID,
				// TODO add employee
				// employeeIDs
				categoryID: values.categorySecondLevel || values.categoryFirstLevel,
				imageIDs: map(values?.gallery, (image) => image.id)
			}

			const { data } = await postReq('/api/b2b/admin/services/', undefined, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)

			const serviceID = get(data, 'service.id', 0)
			history.push(serviceID > 0 ? t('paths:services/{{serviceID}}', { serviceID }) : t('paths:services'))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	return <ServiceForm onSubmit={handleSubmit} />
}

export default compose(withPermissions(permissions))(ServiceCreatePage)
