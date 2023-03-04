import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { change, initialize, startSubmit, stopSubmit } from 'redux-form'
import { Action, compose, Dispatch } from 'redux'
import { notification } from 'antd'
import i18next from 'i18next'
import { forEach, isNil, unionBy } from 'lodash'
import { useNavigate } from 'react-router-dom'

// components
import ServiceForm from './components/ServiceForm'
import ServiceEditModal from '../EmployeesPage/components/ServiceEditModal'

// reducers
import { RootState } from '../../reducers'
import { getService } from '../../reducers/services/serviceActions'
import { getCategory, ICategoryParameterValue } from '../../reducers/categories/categoriesActions'

// types
import { IServiceForm, SalonSubPageProps, EmployeeServiceData, Employees, ServiceDetail, IEmployeeServiceEditForm, IParameterValue } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { patchReq } from '../../utils/request'
import { FORM, NOTIFICATION_TYPE, PARAMETER_TYPE, PERMISSION } from '../../utils/enums'
import { decodePrice, encodePrice, getAssignedUserLabel, getEmployeeServiceDataForPatch, getServicePriceAndDurationData } from '../../utils/helper'
import Permissions, { withPermissions } from '../../utils/Permissions'

type Props = SalonSubPageProps & {
	serviceID: string
}

type ServiceParameterValues = NonNullable<Paths.GetApiB2BAdminServicesServiceId.Responses.$200['service']['serviceCategoryParameter']>['values']
type ServicePatch = Paths.PatchApiB2BAdminServicesServiceId.RequestBody
type ServiceParameterValuesPatch = ServicePatch['categoryParameterValues']

export const parseEmployeeCreateAndUpdate = (employees: IServiceForm['employees']): any => {
	return employees?.map((employeeService) => employeeService?.employee?.id)
}

export const parseParameterValuesCreateAndUpdate = (values: IParameterValue[]): ServiceParameterValuesPatch => {
	const result: ServiceParameterValuesPatch = []
	values?.forEach((value: any) => {
		if (value?.useParameter) {
			result.push({
				id: value?.id,
				priceAndDurationData: {
					durationFrom: value?.durationFrom ?? null,
					durationTo: value?.variableDuration ? value?.durationTo : null,
					priceFrom: encodePrice(value?.priceFrom),
					priceTo: value?.variablePrice ? encodePrice(value?.priceTo) : null
				}
			})
		}
	})
	return result
}

export const addEmployee = (dispatch: Dispatch<Action>, employees: Employees, service: ServiceDetail, formValues?: IServiceForm) => {
	const selectedEmployeeIDs = formValues?.employee
	const updatedEmployees: EmployeeServiceData[] = []
	// go through selected employees
	forEach(selectedEmployeeIDs, (employeeId) => {
		const employeeData = employees?.find((employee) => employee?.id === employeeId)
		const employeeName = getAssignedUserLabel({
			firstName: employeeData?.firstName,
			lastName: employeeData?.lastName,
			email: employeeData?.email,
			id: employeeData?.id || '-'
		})

		if (formValues?.employees?.find((employee) => employee.employee.id === employeeId)) {
			notification.warning({
				message: i18next.t('loc:Upozornenie'),
				description: i18next.t('loc:Zamestnanec {{ name }} je už priradený!', { name: employeeName })
			})
		} else if (employeeData) {
			const useCategoryParameter = !!service?.useCategoryParameter

			let newServiceData: EmployeeServiceData = {
				id: service.id,
				hasOverriddenPricesAndDurationData: false,
				employee: {
					id: employeeData.id,
					name: employeeName,
					image: employeeData?.image?.resizedImages?.thumbnail,
					hasActiveAccount: employeeData.hasActiveAccount
				},
				salonPriceAndDurationData: getServicePriceAndDurationData(
					service?.priceAndDurationData?.durationFrom,
					service?.priceAndDurationData?.durationTo,
					service?.priceAndDurationData?.priceFrom,
					service?.priceAndDurationData?.priceTo
				),
				employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined),
				useCategoryParameter
			}

			if (useCategoryParameter) {
				newServiceData = {
					...newServiceData,
					serviceCategoryParameterType: service?.serviceCategoryParameter?.valueType as PARAMETER_TYPE,
					serviceCategoryParameterName: service?.serviceCategoryParameter?.name,
					serviceCategoryParameterId: service?.serviceCategoryParameter?.id,
					serviceCategoryParameter: service?.serviceCategoryParameter?.values?.map((value) => {
						return {
							id: value?.id,
							name: value?.value,
							hasOverriddenPricesAndDurationData: false,
							employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined),
							salonPriceAndDurationData: getServicePriceAndDurationData(
								value?.priceAndDurationData?.durationFrom,
								value?.priceAndDurationData?.durationTo,
								value?.priceAndDurationData?.priceFrom,
								value?.priceAndDurationData?.priceTo
							)
						}
					})
				}
			}

			updatedEmployees.push(newServiceData)
		}
	})
	// update filed array services with new added service
	if (updatedEmployees.length > 0) {
		if (formValues?.employees) {
			dispatch(change(FORM.SERVICE_FORM, 'employees', [...formValues.employees, ...updatedEmployees]))
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
		const useParameter = !isNil(durationFrom) || !isNil(priceFrom)
		result.push({
			id: value?.categoryParameterValueID || value?.id,
			name: value.value || value.name,
			durationFrom,
			durationTo,
			variableDuration: !!value?.priceAndDurationData?.durationTo,
			priceFrom,
			priceTo,
			variablePrice: !!value?.priceAndDurationData?.priceTo,
			useParameter
		})
	})
	return result
}

const parseEmployeesInit = (service: ServiceDetail) => {
	return service.employees?.map((employee) => {
		const useCategoryParameter = service?.useCategoryParameter

		let formEmployeeServiceData: EmployeeServiceData = {
			id: service.id,
			industry: service?.category.name,
			category: service?.category?.child?.name,
			name: service?.category?.child?.child?.name,
			hasOverriddenPricesAndDurationData: employee?.hasOverriddenPricesAndDurationData,
			useCategoryParameter,
			employee: {
				id: employee.id,
				image: employee.image.resizedImages.thumbnail,
				name: employee.fullName,
				email: employee.email,
				inviteEmail: employee.inviteEmail,
				hasActiveAccount: employee.hasActiveAccount
			},
			salonPriceAndDurationData: getServicePriceAndDurationData(
				service?.priceAndDurationData?.durationFrom,
				service?.priceAndDurationData?.durationTo,
				service?.priceAndDurationData?.priceFrom,
				service?.priceAndDurationData?.priceTo
			),
			employeePriceAndDurationData: employee?.hasOverriddenPricesAndDurationData
				? getServicePriceAndDurationData(
						employee?.priceAndDurationData.durationFrom,
						employee?.priceAndDurationData.durationTo,
						employee?.priceAndDurationData.priceFrom,
						employee?.priceAndDurationData.priceTo
				  )
				: getServicePriceAndDurationData(undefined, undefined, undefined, undefined)
		}

		if (useCategoryParameter) {
			formEmployeeServiceData = {
				...formEmployeeServiceData,
				hasOverriddenPricesAndDurationData: !!employee?.serviceCategoryParameter?.values.length,
				serviceCategoryParameterName: service?.serviceCategoryParameter?.name,
				serviceCategoryParameterType: service?.serviceCategoryParameter?.valueType as PARAMETER_TYPE,
				serviceCategoryParameter: service?.serviceCategoryParameter?.values?.map((value) => {
					const employeeData = employee?.serviceCategoryParameter?.values.find((employeeValue) => employeeValue?.id === value.id)
					return {
						id: value.id,
						name: value.value,
						salonPriceAndDurationData: getServicePriceAndDurationData(
							value?.priceAndDurationData?.durationFrom,
							value?.priceAndDurationData?.durationTo,
							value?.priceAndDurationData?.priceFrom,
							value?.priceAndDurationData?.priceTo
						),
						employeePriceAndDurationData: getServicePriceAndDurationData(
							employeeData?.priceAndDurationData?.durationFrom,
							employeeData?.priceAndDurationData?.durationTo,
							employeeData?.priceAndDurationData?.priceFrom,
							employeeData?.priceAndDurationData?.priceTo
						)
					}
				})
			}
		}

		return formEmployeeServiceData
	})
}

const ServiceEditPage = (props: Props) => {
	const { serviceID, salonID, parentPath } = props
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const employees = useSelector((state: RootState) => state.employees.employees)
	const service = useSelector((state: RootState) => state.service.service.data?.service)
	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])

	const [visibleServiceEditModal, setVisibleServiceEditModal] = useState(false)
	const [updatingService, setUpdatingSerivce] = useState(false)

	const fetchData = useCallback(async () => {
		const { data } = await dispatch(getService(serviceID))

		if (!data?.service?.id) {
			navigate('/404')
		}

		const { categoryParameterValues } = await dispatch(getCategory(data?.service?.category?.child?.child?.id))

		if (data) {
			// union parameter values form service and category detail based on categoryParameterValueID
			const parameterValues = unionBy(data.service?.serviceCategoryParameter?.values, categoryParameterValues as any, 'categoryParameterValueID')
			const initData: IServiceForm = {
				id: data.service.id,
				serviceCategoryParameterType: data.service.serviceCategoryParameter?.valueType as PARAMETER_TYPE,
				serviceCategoryParameter: parseParameterValuesInit(parameterValues),
				serviceCategoryParameterName: data.service.serviceCategoryParameter?.name,
				durationFrom: data.service.priceAndDurationData.durationFrom,
				durationTo: data.service.priceAndDurationData.durationTo,
				variableDuration: !!data.service.priceAndDurationData.durationTo,
				priceFrom: decodePrice(data.service.priceAndDurationData.priceFrom),
				priceTo: decodePrice(data.service.priceAndDurationData.priceTo),
				variablePrice: !!data.service.priceAndDurationData.priceTo,
				employees: parseEmployeesInit(data?.service),
				useCategoryParameter: data.service.useCategoryParameter,
				settings: data.service.settings
			}
			dispatch(initialize(FORM.SERVICE_FORM, initData || {}))
		}
	}, [dispatch, serviceID, navigate])

	const editEmployeeService = async (values: IEmployeeServiceEditForm, _dispatch?: Dispatch<any>, customProps?: any) => {
		const employeeID = values.employee?.id
		const { resetUserServiceData = false } = customProps || {}

		if (employeeID) {
			try {
				setUpdatingSerivce(true)
				const employeePatchServiceData = getEmployeeServiceDataForPatch(values, resetUserServiceData)

				await patchReq('/api/b2b/admin/employees/{employeeID}/services/{serviceID}', { employeeID, serviceID }, employeePatchServiceData)
				fetchData()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				setUpdatingSerivce(false)
				setVisibleServiceEditModal(false)
			}
		}
	}

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const handleSubmit = async (values: IServiceForm) => {
		dispatch(startSubmit(FORM.SERVICE_FORM))
		try {
			const reqData: ServicePatch = {
				useCategoryParameter: values.useCategoryParameter,
				noteForPriceAndDuration: undefined,
				// set null if useCategoryParameter is true
				priceAndDurationData: (values.useCategoryParameter
					? null
					: {
							durationFrom: values.durationFrom ?? null,
							durationTo: values.variableDuration ? values.durationTo : null,
							priceFrom: encodePrice(values.priceFrom as number),
							priceTo: values.variablePrice && !isNil(values.priceTo) ? encodePrice(values.priceTo) : null
					  }) as any,
				categoryParameterValues: parseParameterValuesCreateAndUpdate(values.serviceCategoryParameter),
				employeeIDs: parseEmployeeCreateAndUpdate(values.employees),
				settings: values.settings
			}
			await patchReq('/api/b2b/admin/services/{serviceID}', { serviceID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			fetchData()
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		} finally {
			dispatch(stopSubmit(FORM.SERVICE_FORM))
		}
	}

	return (
		<Permissions
			allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<>
					<ServiceForm
						backUrl={parentPath}
						addEmployee={() => {
							if (service) {
								addEmployee(dispatch, employees?.data?.employees || [], service, form?.values as IServiceForm)
							}
						}}
						onSubmit={(formData: IServiceForm) => {
							if (hasPermission) {
								handleSubmit(formData)
							} else {
								openForbiddenModal()
							}
						}}
						salonID={salonID}
						serviceID={serviceID}
						setVisibleServiceEditModal={setVisibleServiceEditModal}
					/>
					<ServiceEditModal
						visible={visibleServiceEditModal}
						setVisible={setVisibleServiceEditModal}
						loading={updatingService}
						editEmployeeService={editEmployeeService}
					/>
				</>
			)}
		/>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(ServiceEditPage)
