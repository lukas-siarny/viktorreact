import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { change, initialize, startSubmit, stopSubmit } from 'redux-form'
import { Action, compose, Dispatch } from 'redux'
import { notification } from 'antd'
import i18next from 'i18next'
import { forEach, isNil, unionBy } from 'lodash'

// components
import ServiceForm from './components/ServiceForm'

// reducers
import { RootState } from '../../reducers'
import { getService } from '../../reducers/services/serviceActions'
import { getCategory, ICategoryParameterValue } from '../../reducers/categories/categoriesActions'

// types
import { IServiceForm, SalonSubPageProps, ILoadingAndFailure, IEmployeesPayload, EmployeeServiceData, Employees, ServiceDetail } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { patchReq } from '../../utils/request'
import { FORM, NOTIFICATION_TYPE, PARAMETER_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { decodePrice, encodePrice, getAssignedUserLabel, getServicePriceAndDurationData } from '../../utils/helper'
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

export const addEmployee = (dispatch: Dispatch<Action>, employees: Employees, service?: ServiceDetail | null, formValues?: IServiceForm) => {
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

		if (formValues?.employees?.find((employee: any) => employee?.id === employeeId)) {
			notification.warning({
				message: i18next.t('loc:Upozornenie'),
				description: i18next.t('loc:Zamestnanec {{ name }} je už priradený!', { name: employeeName })
			})
		} else if (employeeData) {
			const useCategoryParameter = !!service?.useCategoryParameter

			let newServiceData: EmployeeServiceData = {
				id: service?.id,
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
							// vygeneruje objekt so vsetkymi potrebnymi parametrami, ktore budu mat ale hodnotu null
							// redux-form tak potom vyhodnoti isPristine spravne
							employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined),
							// ulozime si aj original data, aby sme potom vedei porovnat, ci ich ma uzivatel pretazene alebo nie
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

type ParseParameterValuesInitResult = {
	activeKeys: string[]
	serviceCategoryParameter: IParameterValue[]
}

const parseParameterValuesInit = (values: (ServiceParameterValues | ICategoryParameterValue[]) | undefined): ParseParameterValuesInitResult => {
	const result: ParseParameterValuesInitResult = { activeKeys: [], serviceCategoryParameter: [] }

	values?.forEach((value: any) => {
		const durationFrom = value?.priceAndDurationData?.durationFrom
		const durationTo = value?.priceAndDurationData?.durationTo
		const priceFrom = decodePrice(value?.priceAndDurationData?.priceFrom)
		const priceTo = decodePrice(value?.priceAndDurationData?.priceTo)
		const useParameter = !isNil(durationFrom) || !isNil(priceFrom)
		result.serviceCategoryParameter.push({
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

		if (useParameter) {
			result.activeKeys.push(value?.categoryParameterValueID || value?.id)
		}
	})
	return result
}

const parseEmployeesInit = (employees: ServiceEmployees, service: ServiceDetail) => {
	return employees?.map((employee) => {
		const useCategoryParameter = service?.useCategoryParameter

		let formEmployeeServiceData: EmployeeServiceData = {
			id: service?.id,
			hasOverriddenPricesAndDurationData: false,
			useCategoryParameter,
			employee: {
				id: employee.id,
				image: employee.image.resizedImages.thumbnail,
				name: employee.fullName,
				email: employee.email,
				inviteEmail: employee.inviteEmail,
				hasActiveAccount: employee.hasActiveAccount
			}
		}

		if (useCategoryParameter) {
			formEmployeeServiceData = {
				...formEmployeeServiceData,
				hasOverriddenPricesAndDurationData: !!employee?.serviceCategoryParameter?.values.length,
				serviceCategoryParameterName: service?.serviceCategoryParameter?.name,
				serviceCategoryParameterType: service?.serviceCategoryParameter?.valueType as PARAMETER_TYPE,
				serviceCategoryParameter: service?.serviceCategoryParameter?.values?.map((value) => {
					const employeeData = employee?.serviceCategoryParameter?.values.find((employeeValue) => employeeValue?.id === value.id)
					const employeePriceAndDuration = employeeData?.priceAndDurationData
					const salonPriceAndDuration = value?.priceAndDurationData

					return {
						id: value.id,
						name: value.value,
						salonPriceAndDurationData: getServicePriceAndDurationData(
							salonPriceAndDuration?.durationFrom,
							salonPriceAndDuration?.durationTo,
							salonPriceAndDuration?.priceFrom,
							salonPriceAndDuration?.priceTo
						),
						employeePriceAndDurationData: getServicePriceAndDurationData(
							employeePriceAndDuration?.durationFrom,
							employeePriceAndDuration?.durationTo,
							employeePriceAndDuration?.priceFrom,
							employeePriceAndDuration?.priceTo
						)
					}
				})
			}
		} else if (employee?.hasOverriddenPricesAndDurationData) {
			formEmployeeServiceData = {
				...formEmployeeServiceData,
				hasOverriddenPricesAndDurationData: true,
				salonPriceAndDurationData: getServicePriceAndDurationData(
					service?.priceAndDurationData?.durationFrom,
					service?.priceAndDurationData?.durationTo,
					service?.priceAndDurationData?.priceFrom,
					service?.priceAndDurationData?.priceTo
				),
				employeePriceAndDurationData: getServicePriceAndDurationData(
					employee?.priceAndDurationData.durationFrom,
					employee?.priceAndDurationData.durationTo,
					employee?.priceAndDurationData.priceFrom,
					employee?.priceAndDurationData.priceTo
				)
			}
		}

		return formEmployeeServiceData
	})
}

const ServiceEditPage = (props: Props) => {
	const { serviceID, salonID, parentPath } = props
	const dispatch = useDispatch()

	const employees = useSelector((state: RootState) => state.employees.employees)
	const service = useSelector((state: RootState) => state.service.service.data?.service)
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
			const { serviceCategoryParameter } = parseParameterValuesInit(parameterValues)
			initData = {
				id: data.service.id,
				serviceCategoryParameterType: data.service.serviceCategoryParameter?.valueType,
				serviceCategoryParameter,
				durationFrom: data.service.priceAndDurationData.durationFrom,
				durationTo: data.service.priceAndDurationData.durationTo,
				variableDuration: !!data.service.priceAndDurationData.durationTo,
				priceFrom: decodePrice(data.service.priceAndDurationData.priceFrom),
				priceTo: decodePrice(data.service.priceAndDurationData.priceTo),
				variablePrice: !!data.service.priceAndDurationData.priceTo,
				employees: parseEmployeesInit(data?.service?.employees, data.service),
				useCategoryParameter: data.service.useCategoryParameter,
				settings: data.service.settings
			}
		}
		dispatch(initialize(FORM.SERVICE_FORM, initData || {}))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
							priceFrom: encodePrice(values.priceFrom),
							priceTo: values.variablePrice ? encodePrice(values.priceTo) : null
					  }) as any,
				categoryParameterValues: parseParameterValuesCreateAndUpdate(values.serviceCategoryParameter),
				employeeIDs: parseEmployeeCreateAndUpdate(values.employees),
				settings: values.settings
			}
			await patchReq('/api/b2b/admin/services/{serviceID}', { serviceID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			history.push(parentPath)
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		} finally {
			dispatch(stopSubmit(FORM.SERVICE_FORM))
		}
	}

	return (
		<Permissions
			allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<>
					<ServiceForm
						backUrl={parentPath}
						addEmployee={() => addEmployee(dispatch, employees?.data?.employees || [], service || null, form?.values as IServiceForm)}
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
				</>
			)}
		/>
	)
}

export default compose(withPermissions(permissions))(ServiceEditPage)
