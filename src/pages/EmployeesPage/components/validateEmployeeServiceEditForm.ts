import { FormErrors } from 'redux-form'
import { isEmpty } from 'lodash'

// types
import { IEmployeeServiceEditForm } from '../../../types/interfaces'

// utils
import { arePriceAndDurationDataEmpty, validatePriceAndDurationData } from '../../../utils/helper'

export default (values: IEmployeeServiceEditForm) => {
	const errors: FormErrors<IEmployeeServiceEditForm> = {}

	const priceAndDurationData = values?.employeePriceAndDurationData

	if (!values?.useCategoryParameter) {
		if (!arePriceAndDurationDataEmpty(priceAndDurationData)) {
			errors.employeePriceAndDurationData = validatePriceAndDurationData(priceAndDurationData)
		}
	} else {
		const serviceCategoryParameterErrors: any = []
		const areAllEmpty = !values.serviceCategoryParameter?.some((parameterValue) => !arePriceAndDurationDataEmpty(parameterValue.employeePriceAndDurationData))

		if (!areAllEmpty) {
			values.serviceCategoryParameter?.forEach((parameterValue, parameterValueIndex) => {
				const employeePriceAndDurationErros = validatePriceAndDurationData(parameterValue?.employeePriceAndDurationData)

				if (!isEmpty(employeePriceAndDurationErros)) {
					const parameterValueErrors = {
						employeePriceAndDurationData: employeePriceAndDurationErros,
						error: true
					}
					serviceCategoryParameterErrors[parameterValueIndex] = parameterValueErrors
				}
			})
		}
		errors.serviceCategoryParameter = serviceCategoryParameterErrors
	}

	return errors
}
