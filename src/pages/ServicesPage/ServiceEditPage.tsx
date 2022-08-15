import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { change, initialize } from 'redux-form'
import { Action, compose, Dispatch } from 'redux'
import { notification } from 'antd'
import i18next from 'i18next'
import { forEach, unionBy } from 'lodash'

// components
import ServiceForm from './components/ServiceForm'

// reducers
import { RootState } from '../../reducers'
import { getService } from '../../reducers/services/serviceActions'
import { IEmployeesPayload } from '../../reducers/employees/employeesActions'
import { getCategory, ICategoryParameterValue } from '../../reducers/categories/categoriesActions'

// types
import { IServiceForm, SalonSubPageProps, ILoadingAndFailure } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { patchReq } from '../../utils/request'
import { FORM, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { decodePrice, encodePrice } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { history } from '../../utils/history'

interface IParameterValue {
	id: string | undefined
	name: string | undefined
	durationFrom: number | null | undefined
	durationTo: number | null | undefined
	variableDuration: boolean
	priceFrom: number | null | undefined
	priceTo: number | null | undefined
	variablePrice: boolean
	useParameter: boolean
}

type Props = SalonSubPageProps & {
	serviceID: string
}

type ServiceEmployees = Paths.GetApiB2BAdminServicesServiceId.Responses.$200['service']['employees']
type ServiceParameterValues = NonNullable<Paths.GetApiB2BAdminServicesServiceId.Responses.$200['service']['serviceCategoryParameter']>['values']
type ServicePatch = Paths.PatchApiB2BAdminServicesServiceId.RequestBody
type ServiceParameterValuesPatch = ServicePatch['categoryParameterValues']

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

export const parseEmployeeCreateAndUpdate = (employees: any[]): any => {
	return employees?.map((employee: any) => employee?.id)
}

export const parseParameterValuesCreateAndUpdate = (values: IParameterValue[]): ServiceParameterValuesPatch => {
	const result: ServiceParameterValuesPatch = []
	values?.forEach((value: any) => {
		if (value?.useParameter) {
			result.push({
				id: value?.id,
				priceAndDurationData: {
					durationFrom: value?.durationFrom,
					durationTo: value?.variableDuration ? value?.durationTo : undefined,
					priceFrom: encodePrice(value?.priceFrom),
					priceTo: value?.variablePrice ? encodePrice(value?.priceTo) : undefined
				}
			})
		}
	})
	return result
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

const parseParameterValuesInit = (values: (ServiceParameterValues | ICategoryParameterValue[]) | undefined): IParameterValue[] => {
	const result: IParameterValue[] = []
	values?.forEach((value: any) => {
		const durationFrom = value?.priceAndDurationData?.durationFrom
		const durationTo = value?.priceAndDurationData?.durationTo
		const priceFrom = decodePrice(value?.priceAndDurationData?.priceFrom)
		const priceTo = decodePrice(value?.priceAndDurationData?.priceTo)
		result.push({
			id: value?.categoryParameterValueID || value?.id,
			name: value.value,
			durationFrom,
			durationTo,
			variableDuration: !!value?.priceAndDurationData?.durationTo,
			priceFrom,
			priceTo,
			variablePrice: !!value?.priceAndDurationData?.priceTo,
			useParameter: !!(durationFrom && priceFrom)
		})
	})
	return result
}

const parseEmployeesInit = (employees: ServiceEmployees) => {
	return employees?.map((employee) => {
		return {
			id: employee?.id,
			name: employee?.fullName,
			image: employee?.image,
			durationFrom: employee.priceAndDurationData?.durationFrom,
			durationTo: employee.priceAndDurationData?.durationFrom,
			priceFrom: decodePrice(employee.priceAndDurationData?.priceFrom),
			priceTo: decodePrice(employee.priceAndDurationData?.priceTo),
			variableDuration: !!employee?.priceAndDurationData?.durationTo,
			variablePrice: !!employee?.priceAndDurationData?.priceTo,
			serviceCategoryParameter: parseParameterValuesInit(employee?.serviceCategoryParameter?.values)
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
		const { categoryParameterValues } = await dispatch(getCategory(data?.service?.category?.child?.child?.id))
		if (!data?.service?.id) {
			history.push('/404')
		}
		let initData: any
		if (data) {
			// union parameter values form service and category detail based on categoryParameterValueID
			const parameterValues = unionBy(data.service?.serviceCategoryParameter?.values, categoryParameterValues as any, 'categoryParameterValueID')
			initData = {
				id: data.service.id,
				serviceCategoryParameterType: data.service.serviceCategoryParameter?.valueType,
				serviceCategoryParameter: parseParameterValuesInit(parameterValues),
				durationFrom: data.service.priceAndDurationData.durationFrom,
				durationTo: data.service.priceAndDurationData.durationTo,
				variableDuration: !!data.service.priceAndDurationData.durationTo,
				priceFrom: decodePrice(data.service.priceAndDurationData.priceFrom),
				priceTo: decodePrice(data.service.priceAndDurationData.priceTo),
				variablePrice: !!data.service.priceAndDurationData.priceTo,
				employees: parseEmployeesInit(data?.service?.employees),
				useCategoryParameter: data.service.useCategoryParameter
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
			const reqData: ServicePatch = {
				useCategoryParameter: values.useCategoryParameter,
				noteForPriceAndDuration: undefined,
				// set null if useCategoryParameter is true
				priceAndDurationData: (values.useCategoryParameter
					? null
					: {
							durationFrom: values.durationFrom,
							durationTo: values.variableDuration ? values.durationTo : undefined,
							priceFrom: encodePrice(values.priceFrom),
							priceTo: values.variablePrice ? encodePrice(values.priceTo) : undefined
					  }) as any,
				categoryParameterValues: parseParameterValuesCreateAndUpdate(values.serviceCategoryParameter),
				employeeIDs: parseEmployeeCreateAndUpdate(values.employees)
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
