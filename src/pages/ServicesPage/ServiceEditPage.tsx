import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { map } from 'lodash'
import { useDispatch } from 'react-redux'
import { initialize } from 'redux-form'

// components
import ServiceForm from './components/ServiceForm'

// reducers
import { getService } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IServiceForm, SalonSubPageProps } from '../../types/interfaces'

// utils
import { patchReq } from '../../utils/request'
import { FORM, NOTIFICATION_TYPE } from '../../utils/enums'
import { history } from '../../utils/history'
import { getDefaultFormCategories } from '../../utils/helper'

type Props = SalonSubPageProps & {
	serviceID: number
}

const ServiceEditPage = (props: Props) => {
	const { serviceID, salonID } = props
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const fetchData = async () => {
		const { data } = await dispatch(getService(serviceID))
		const { data: categories } = await dispatch(getCategories())
		let initData: any
		const category = getDefaultFormCategories(data?.service?.category?.id, categories)
		if (data) {
			initData = {
				name: data?.service?.name,
				description: data?.service?.description,
				salonID: data?.service?.salon.id,
				durationFrom: data?.service?.durationFrom,
				durationTo: data?.service?.durationTo,
				variableDuration: !!data?.service?.durationTo,
				priceFrom: data?.service?.priceFrom,
				priceTo: data?.service?.priceTo,
				variablePrice: !!data?.service?.priceTo,
				gallery: map(data?.service?.images, (image) => ({ id: image.id, url: image.original })),
				categoryRoot: category?.[0]?.id,
				categoryFirstLevel: category?.[1]?.id,
				categorySecondLevel: category?.[2]?.id
			}
		}
		dispatch(initialize(FORM.SERVICE_FORM, initData || {}))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmit = async (values: IServiceForm) => {
		try {
			const reqData = {
				name: values.name,
				description: values.description,
				durationFrom: values.durationFrom,
				durationTo: values.variableDuration ? values.durationTo : undefined,
				priceFrom: values.priceFrom,
				priceTo: values.variablePrice ? values.priceTo : undefined,
				salonID: values.salonID,
				categoryID: values.categorySecondLevel || values.categoryFirstLevel,
				// TODO add employee
				// employeeIDs
				imageIDs: map(values?.gallery, (image) => image.id)
			}

			await patchReq('/api/b2b/admin/services/{serviceID}', { serviceID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)

			const url = t('paths:services')
			history.push(url)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	return <ServiceForm onSubmit={handleSubmit} serviceID={serviceID} />
}

export default ServiceEditPage
