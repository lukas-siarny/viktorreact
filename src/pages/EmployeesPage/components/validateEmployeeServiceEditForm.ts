import i18next from 'i18next'
import { FormErrors } from 'redux-form'
import { isNil } from 'lodash'

// types
import { IEmployeeServiceEditForm } from '../../../types/interfaces'

export default (values: IEmployeeServiceEditForm) => {
	const errors: FormErrors<IEmployeeServiceEditForm> = {}

	const priceAndDurationData = values?.employeePriceAndDurationData
	const employeePriceAndDurationErrors: any = {}

	if (!values?.useCategoryParameter) {
		if (isNil(priceAndDurationData?.priceFrom)) {
			employeePriceAndDurationErrors.priceFrom = i18next.t('loc:Toto pole je povinné')
		}
		if (priceAndDurationData?.variablePrice) {
			if (isNil(priceAndDurationData?.priceTo)) {
				employeePriceAndDurationErrors.priceTo = i18next.t('loc:Toto pole je povinné')
			}
			if (!isNil(priceAndDurationData?.priceFrom) && !isNil(priceAndDurationData?.priceTo) && priceAndDurationData?.priceFrom >= priceAndDurationData?.priceTo) {
				employeePriceAndDurationErrors.priceFrom = i18next.t('loc:Chybný rozzsah')
				employeePriceAndDurationErrors.priceTo = true
			}
		}
		if (priceAndDurationData?.variableDuration) {
			if (isNil(priceAndDurationData?.durationFrom)) {
				employeePriceAndDurationErrors.durationFrom = i18next.t('loc:Toto pole je povinné')
			}
			if (isNil(priceAndDurationData?.durationTo)) {
				employeePriceAndDurationErrors.durationTo = i18next.t('loc:Toto pole je povinné')
			}
			if (!isNil(priceAndDurationData?.durationFrom) && !isNil(priceAndDurationData?.durationTo) && priceAndDurationData?.durationFrom >= priceAndDurationData?.durationTo) {
				employeePriceAndDurationErrors.durationFrom = i18next.t('loc:Chybný rozzsah')
				employeePriceAndDurationErrors.durationTo = true
			}
		}
	}

	errors.employeePriceAndDurationData = employeePriceAndDurationErrors

	return errors
}
