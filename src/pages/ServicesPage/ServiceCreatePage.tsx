import React from 'react'
import { useTranslation } from 'react-i18next'
import { get, map } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'

// components
import ServiceForm from './components/ServiceForm'
import { addEmployee, parseEmployeeIds } from './ServiceEditPage'

// types
import { IServiceForm, SalonSubPageProps } from '../../types/interfaces'

// reducers
import { RootState } from '../../reducers'

// utils
import { postReq } from '../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'
import { withPermissions } from '../../utils/Permissions'
import { encodePrice } from '../../utils/helper'

const permissions = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_CREATE]

const ServiceCreatePage = (props: SalonSubPageProps) => {
	const { t } = useTranslation()
	const { salonID, parentPath } = props
	const dispatch = useDispatch()

	const employees = useSelector((state: RootState) => state.employees.employees)
	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])

	const handleSubmit = async (values: IServiceForm) => {
		try {
			const reqData = {
				name: values.name,
				description: values.description,
				durationFrom: values.durationFrom,
				durationTo: values.variableDuration ? values.durationTo : undefined,
				priceFrom: encodePrice(values.priceFrom),
				priceTo: values.variablePrice ? encodePrice(values.priceTo) : undefined,
				salonID,
				employeeIDs: parseEmployeeIds(values.employees),
				categoryID: values.categorySecondLevel || values.categoryFirstLevel,
				imageIDs: map(values?.gallery, (image) => image.id)
			}

			const { data } = await postReq('/api/b2b/admin/services/', undefined, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)

			const serviceID = get(data, 'service.id', 0)
			history.push(parentPath + (serviceID > 0 ? t('paths:services/{{serviceID}}', { serviceID }) : t('paths:services')))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	return <ServiceForm addEmployee={() => addEmployee(employees, form, dispatch)} onSubmit={handleSubmit} salonID={salonID} />
}

export default compose(withPermissions(permissions))(ServiceCreatePage)
