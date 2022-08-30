import i18next from 'i18next'
import { isEmpty, isNil } from 'lodash'

const validateServiceForm = (values?: any) => {
	const errors: any = {}

	if (isNil(values?.durationFrom) && !values?.useCategoryParameter) {
		errors.durationFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variableDuration && isNil(values?.durationTo) && !values?.useCategoryParameter) {
		errors.durationTo = i18next.t('loc:Toto pole je povinné')
	}

	if (isNil(values?.priceFrom) && !values?.useCategoryParameter) {
		errors.priceFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variablePrice && isNil(values?.priceTo) && !values?.useCategoryParameter) {
		errors.priceTo = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variableDuration && !isNil(values?.durationTo) && values?.durationFrom > values?.durationTo) {
		errors.durationFrom = i18next.t('loc:Chybný rozsah')
		errors.durationTo = ' '
	}

	if (values?.variablePrice && !isNil(values?.priceTo) && values?.priceFrom > values?.priceTo) {
		errors.priceFrom = i18next.t('loc:Chybný rozsah')
		errors.priceTo = ' '
	}

	if (values?.useCategoryParameter && isEmpty(values?.serviceCategoryParameter?.filter((value: any) => value.useParameter))) {
		errors.serviceCategoryParameter = { _error: i18next.t('loc:Musíte zvoliť a nastaviť aspoň jednu hodnotu parametra!') }
	}

	return errors
}

export default validateServiceForm
