import React, { useEffect } from 'react'
import { forEach, map } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { change, initialize } from 'redux-form'
import { Action, compose, Dispatch } from 'redux'

// components
import { notification } from 'antd'
import i18next from 'i18next'
import ServiceForm from './components/ServiceForm'

// reducers
import { RootState } from '../../reducers'
import { getService } from '../../reducers/services/serviceActions'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { IEmployeesPayload } from '../../reducers/employees/employeesActions'

// types
import { IServiceForm, SalonSubPageProps, ILoadingAndFailure } from '../../types/interfaces'

// utils
import { patchReq } from '../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { decodePrice, encodePrice } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { history } from '../../utils/history'

type Props = SalonSubPageProps & {
	serviceID: number
	salonID: number
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

export const parseEmployeeIds = (employees: any[]) => {
	return employees?.map((employee: any) => employee?.id)
}

export const addEmployee = (employees: IEmployeesPayload & ILoadingAndFailure, form: any, dispatch: Dispatch<Action>) => {
	const selectedEmployeeIDs = form?.values?.employee
	const updatedEmployees: any[] = []
	// go through selected employees
	forEach(selectedEmployeeIDs, (employeeId) => {
		const employeeData = employees?.data?.employees?.find((employee: any) => employee?.id === employeeId)
		if (form?.values?.employees?.find((employee: any) => employee?.id === employeeId)) {
			notification.warning({
				message: i18next.t('loc:Upozornenie'),
				description: i18next.t(`Zamestnanec ${employeeData?.firstName} ${employeeData?.lastName} je už priradený!`)
			})
		} else if (employeeData) {
			updatedEmployees.push({
				id: employeeData?.id,
				name: `${employeeData?.firstName} ${employeeData?.lastName}`
			})
		}
	})
	// update filed array services with new added service
	if (updatedEmployees.length > 0) {
		if (form?.values?.employees) {
			dispatch(change(FORM.SERVICE_FORM, 'employees', [...form.values.employees, ...updatedEmployees]))
		} else {
			dispatch(change(FORM.SERVICE_FORM, 'employees', [...updatedEmployees]))
		}
	}
	// clear selected value
	dispatch(change(FORM.SERVICE_FORM, 'employee', null))
}

const parseEmployees = (employees: any[]) => {
	return employees.map((employee) => {
		return {
			id: employee?.id,
			name: employee?.fullName,
			image: employee?.image,
			employeeData: {
				...employee.employeeData,
				// decode and set price
				priceFrom: decodePrice(employee?.employeeData?.priceFrom),
				priceTo: decodePrice(employee?.employeeData?.priceTo)
			}
		}
	})
}

const ServiceEditPage = (props: Props) => {
	const { serviceID, salonID, parentPath } = props
	const dispatch = useDispatch()

	const employees = useSelector((state: RootState) => state.employees.employees)
	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])

	const fetchData = async () => {
		const { data } = await dispatch(getService(serviceID))
		dispatch(getCategories())
		if (!data?.service?.id) {
			history.push('/404')
		}
		let initData: any
		if (data) {
			initData = {
				name: data?.service?.name,
				description: data?.service?.description,
				durationFrom: data?.service?.durationFrom,
				durationTo: data?.service?.durationTo,
				variableDuration: !!data?.service?.durationTo,
				priceFrom: decodePrice(data?.service?.priceFrom),
				priceTo: decodePrice(data?.service?.priceTo),
				variablePrice: !!data?.service?.priceTo,
				gallery: map(data?.service?.images, (image) => ({ id: image.id, url: image.original })),
				categoryRoot: data?.service?.category?.id,
				categoryFirstLevel: data?.service?.category?.child?.id,
				categorySecondLevel: data?.service?.category?.child?.child?.id,
				employees: parseEmployees(data?.service?.employees)
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
				priceFrom: encodePrice(values.priceFrom),
				priceTo: values.variablePrice ? encodePrice(values.priceTo) : undefined,
				categoryID: values.categorySecondLevel || values.categoryFirstLevel,
				employeeIDs: parseEmployeeIds(values.employees),
				imageIDs: map(values?.gallery, (image) => image.id)
			}
			await patchReq('/api/b2b/admin/services/{serviceID}', { serviceID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(getService(serviceID))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}
	return (
		<Permissions
			allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<ServiceForm
					parentPath={parentPath}
					addEmployee={() => addEmployee(employees, form, dispatch)}
					onSubmit={(formData: IServiceForm) => {
						if (hasPermission) {
							handleSubmit(formData)
						} else {
							openForbiddenModal()
						}
					}}
					salonID={salonID}
					serviceID={serviceID}
				/>
			)}
		/>
	)
}

export default compose(withPermissions(permissions))(ServiceEditPage)
