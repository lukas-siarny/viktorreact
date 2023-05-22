/* eslint-disable import/no-cycle */
import React from 'react'
import cx from 'classnames'
import i18next from 'i18next'
import { forEach, isNil } from 'lodash'
import { notification } from 'antd'
import { Action, Dispatch } from 'redux'
import { change } from 'redux-form'

// assets
import { ReactComponent as ClockIcon } from '../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../assets/icons/coupon.svg'
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-modal.svg'
import { ReactComponent as CheckIcon } from '../../assets/icons/check-current-color.svg'

// schema
import { FormPriceAndDurationData, IEmployeeServiceEditForm, IParameterValue, IServiceForm } from '../../schemas/service'

// types
import { Employees, ServiceDetail, ServicePatchBody, ServicePriceAndDurationData } from '../../types/interfaces'
import { ICategoryParameterValue } from '../../reducers/categories/categoriesActions'
import { Paths } from '../../types/api'

// utils
import { decodePrice, encodePrice, getAssignedUserLabel } from '../../utils/helper'
import { FORM, PARAMETER_TYPE } from '../../utils/enums'

export const renderFromTo = (from: number | undefined | null, to: number | undefined | null, variable: boolean, icon: React.ReactNode, extra?: string, className = '') => {
	if ((!isNil(from) && !Number.isNaN(from)) || (!isNil(to) && !Number.isNaN(to))) {
		return (
			<div className={cx('flex items-center gap-1', className)}>
				{icon}
				{from}
				{variable && !isNil(to) && !Number.isNaN(to) && from !== to ? ` - ${to}` : undefined} {extra}
			</div>
		)
	}
	return undefined
}

export const renderPriceAndDurationInfo = (
	salonPriceAndDuration?: FormPriceAndDurationData,
	employeePriceAndDuration?: FormPriceAndDurationData,
	hasOverridenData?: boolean,
	currencySymbol?: string
) => {
	return (
		<div className='flex flex-col items-end'>
			<div className={cx('flex gap-1 whitespace-nowrap text-xs font-normal text-notino-grayDark', { 'service-original-data-overriden': hasOverridenData })}>
				{renderFromTo(
					salonPriceAndDuration?.durationFrom,
					salonPriceAndDuration?.durationTo,
					!!salonPriceAndDuration?.variableDuration,
					<ClockIcon className='w-3 h-3' />,
					i18next.t('loc:min')
				)}
				{renderFromTo(
					salonPriceAndDuration?.priceFrom,
					salonPriceAndDuration?.priceTo,
					!!salonPriceAndDuration?.variablePrice,
					<CouponIcon className='w-3 h-3' />,
					currencySymbol
				)}
			</div>

			{hasOverridenData && (
				<div className={'flex gap-1 whitespace-nowrap font-bold text-xs text-notino-pink'}>
					{renderFromTo(
						employeePriceAndDuration?.durationFrom,
						employeePriceAndDuration?.durationTo,
						!!employeePriceAndDuration?.variableDuration,
						<ClockIcon className='w-3 h-3' />,
						i18next.t('loc:min')
					)}
					{renderFromTo(
						employeePriceAndDuration?.priceFrom,
						employeePriceAndDuration?.priceTo,
						!!employeePriceAndDuration?.variablePrice,
						<CouponIcon className='w-3 h-3' />,
						currencySymbol
					)}
				</div>
			)}
		</div>
	)
}

export const getServicePriceAndDurationData = (
	durationFrom?: number,
	durationTo?: number,
	priceFrom?: ServicePriceAndDurationData['priceFrom'],
	priceTo?: ServicePriceAndDurationData['priceTo']
): FormPriceAndDurationData => {
	const decodedPriceFrom = decodePrice(priceFrom)
	let decodedPriceTo
	let variablePrice = false

	if (!isNil(decodedPriceFrom)) {
		decodedPriceTo = decodePrice(priceTo)
		if (!isNil(decodedPriceTo) && decodedPriceTo >= decodedPriceFrom) {
			variablePrice = true
		}
	}

	const variableDuration = !!(!isNil(durationFrom) && !isNil(durationTo) && durationTo >= durationFrom)

	return {
		durationFrom: durationFrom || null,
		durationTo: durationTo || null,
		priceFrom: decodedPriceFrom || null,
		priceTo: decodedPriceTo || null,
		variableDuration,
		variablePrice
	}
}

export const arePriceAndDurationDataEmpty = (data?: FormPriceAndDurationData) => {
	let emptyPrice = isNil(data?.priceFrom) || Number.isNaN(data?.priceFrom)
	let emptyDuration = isNil(data?.durationFrom) || Number.isNaN(data?.durationFrom)

	if (data?.variableDuration) {
		emptyDuration = emptyDuration && (isNil(data?.durationTo) || Number.isNaN(data?.durationTo))
	}

	if (data?.variablePrice) {
		emptyPrice = emptyPrice && (isNil(data?.priceTo) || Number.isNaN(data?.priceTo))
	}

	return emptyPrice && emptyDuration
}

export const getEmployeeServiceDataForPatch = (values: IEmployeeServiceEditForm, resetUserServiceData?: boolean) => {
	let employeePatchServiceData: ServicePatchBody = {}

	if (resetUserServiceData) {
		employeePatchServiceData = {
			priceAndDurationData: null,
			serviceCategoryParameterValues: null
		}
	} else if (values?.useCategoryParameter) {
		const areAllParameterValuesEmpty = !values?.serviceCategoryParameter?.some((parameterValue) => !arePriceAndDurationDataEmpty(parameterValue.employeePriceAndDurationData))

		if (areAllParameterValuesEmpty) {
			employeePatchServiceData = {
				...employeePatchServiceData,
				serviceCategoryParameterValues: null
			}
		} else if ((values?.serviceCategoryParameter?.length || 0) <= 100) {
			const serviceCategoryParameterValues: ServicePatchBody['serviceCategoryParameterValues'] = []
			values?.serviceCategoryParameter?.forEach((parameterValue) => {
				serviceCategoryParameterValues.push({
					id: parameterValue.id,
					priceAndDurationData: {
						durationFrom: parameterValue.employeePriceAndDurationData?.durationFrom,
						durationTo: parameterValue.employeePriceAndDurationData?.variableDuration ? parameterValue.employeePriceAndDurationData?.durationTo : undefined,
						priceFrom: encodePrice(parameterValue.employeePriceAndDurationData?.priceFrom as number),
						priceTo:
							parameterValue.employeePriceAndDurationData?.variablePrice && !isNil(parameterValue.employeePriceAndDurationData?.priceTo)
								? encodePrice(parameterValue.employeePriceAndDurationData?.priceTo)
								: undefined
					}
				})
			})
			employeePatchServiceData = {
				...employeePatchServiceData,
				serviceCategoryParameterValues
			}
		}
	} else {
		const priceAndDurationData = values?.employeePriceAndDurationData
		if (arePriceAndDurationDataEmpty(priceAndDurationData)) {
			employeePatchServiceData = {
				...employeePatchServiceData,
				priceAndDurationData: null
			}
		} else if (!isNil(priceAndDurationData?.priceFrom)) {
			employeePatchServiceData = {
				...employeePatchServiceData,
				priceAndDurationData: {
					durationFrom: priceAndDurationData?.durationFrom,
					durationTo: priceAndDurationData?.variableDuration ? priceAndDurationData?.durationTo : undefined,
					priceFrom: encodePrice(priceAndDurationData?.priceFrom as number),
					priceTo: priceAndDurationData?.variablePrice && !isNil(priceAndDurationData?.priceTo) ? encodePrice(priceAndDurationData?.priceTo) : undefined
				}
			}
		}
	}
	return employeePatchServiceData
}

type ServiceParameterValues = NonNullable<Paths.GetApiB2BAdminServicesServiceId.Responses.$200['service']['serviceCategoryParameter']>['values']
type ServicePatch = Paths.PatchApiB2BAdminServicesServiceId.RequestBody
type ServiceParameterValuesPatch = ServicePatch['categoryParameterValues']

export const parseEmployeeCreateAndUpdate = (employees: IServiceForm['employees']): any => {
	return employees?.map((employeeService) => employeeService?.employee?.id)
}

export const parseParameterValuesCreateAndUpdate = (values: IParameterValue[]): ServiceParameterValuesPatch => {
	const result: ServiceParameterValuesPatch = []
	values.forEach((value) => {
		if (value.useParameter) {
			result.push({
				id: value.id,
				priceAndDurationData: {
					durationFrom: value.durationFrom ?? null,
					durationTo: value.variableDuration ? value.durationTo : null,
					priceFrom: encodePrice(value.priceFrom as number),
					priceTo: value.variablePrice && !isNil(value.priceTo) ? encodePrice(value.priceTo) : null
				}
			})
		}
	})
	return result
}

export const addEmployee = (dispatch: Dispatch<Action>, employees: Employees, service: ServiceDetail, formValues?: IServiceForm) => {
	const selectedEmployeeIDs = formValues?.employee
	const updatedEmployees: IEmployeeServiceEditForm[] = []
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

			let newServiceData: IEmployeeServiceEditForm = {
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

export const parseParameterValuesInit = (values: (ServiceParameterValues | ICategoryParameterValue[]) | undefined): IParameterValue[] => {
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

export const parseEmployeesInit = (service: ServiceDetail) => {
	return service.employees?.map((employee) => {
		const useCategoryParameter = service?.useCategoryParameter

		let formEmployeeServiceData: IEmployeeServiceEditForm = {
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

const hasPrice = (data: FormPriceAndDurationData) => {
	let isFilledIn = false

	if (data?.variablePrice) {
		isFilledIn = !isNil(data?.priceFrom) && !Number.isNaN(data?.priceFrom) && !isNil(data?.priceTo) && !Number.isNaN(data?.priceTo)
	} else {
		isFilledIn = !isNil(data?.priceFrom) && !Number.isNaN(data?.priceFrom)
	}

	return isFilledIn
}

const hasDuration = (data: FormPriceAndDurationData) => {
	let isFilledIn = false

	if (data?.variableDuration) {
		isFilledIn = !isNil(data?.durationFrom) && !Number.isNaN(data?.durationFrom) && !isNil(data?.durationTo) && !Number.isNaN(data?.durationTo)
	} else {
		isFilledIn = !isNil(data?.durationFrom) && !Number.isNaN(data?.durationFrom)
	}

	return isFilledIn
}

const getHasPriceFilledIn = (values?: IServiceForm) => {
	if (values?.useCategoryParameter) {
		return values?.serviceCategoryParameter?.some((parameterValue) => hasPrice(parameterValue))
	}
	return hasPrice({ priceFrom: values?.priceFrom, priceTo: values?.priceTo, variablePrice: values?.variablePrice })
}

const getHasDurationFilledIn = (values?: IServiceForm) => {
	if (values?.useCategoryParameter) {
		return values?.serviceCategoryParameter?.some((parameterValue) => hasDuration(parameterValue))
	}
	return hasDuration({ durationFrom: values?.durationFrom, durationTo: values?.durationTo, variableDuration: values?.variableDuration })
}

export const checkConditions = (values?: IServiceForm): { hasDurationFilledIn: boolean; hasPriceFilledIn: boolean; hasEmployee: boolean } => {
	return {
		hasDurationFilledIn: getHasDurationFilledIn(values),
		hasPriceFilledIn: getHasPriceFilledIn(values),
		hasEmployee: !!values?.employees.length
	}
}

export const getConditionIcon = (checked?: boolean) => {
	if (checked) {
		return <CheckIcon className={'text-notino-pink w-4 h-4 flex-shrink-0'} />
	}

	return <CloseIcon className={'text-notino-grayDark w-4 h-4 flex-shrink-0'} />
}
