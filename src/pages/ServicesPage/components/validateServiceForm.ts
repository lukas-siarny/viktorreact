import i18next from 'i18next'
import { forEach } from 'lodash'
// import { IProductInfoForm } from '../../../types/interfaces'

const validateServiceForm = (values?: any) => {
	const errors: any = {}

	if (values?.variableDuration && values?.durationTo && values?.durationFrom > values?.durationTo) {
		errors.durationFrom = i18next.t('loc:Chybný rozsah')
		errors.durationTo = ' '
	}
	if (values?.variablePrice && values?.priceTo && values?.priceFrom > values?.priceTo) {
		errors.priceFrom = i18next.t('loc:Chybný rozsah')
		errors.priceTo = ' '
	}
	// console.log(values)
	return errors
}

export default validateServiceForm
