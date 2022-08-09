import i18next from 'i18next'
import { isEmpty } from 'lodash'

const validateServiceForm = (values?: any) => {
	const errors: any = {}

	if (!values?.durationFrom && values?.useCategoryParameter) {
		errors.durationFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variableDuration && !values?.durationTo && values?.useCategoryParameter) {
		errors.durationTo = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.priceFrom && values?.useCategoryParameter) {
		errors.priceFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variablePrice && !values?.priceTo && values?.useCategoryParameter) {
		errors.priceTo = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variableDuration && values?.durationTo && values?.durationFrom > values?.durationTo) {
		errors.durationFrom = i18next.t('loc:Chybný rozsah')
		errors.durationTo = ' '
	}

	if (values?.variablePrice && values?.priceTo && values?.priceFrom > values?.priceTo) {
		errors.priceFrom = i18next.t('loc:Chybný rozsah')
		errors.priceTo = ' '
	}

	if (values?.useCategoryParameter && isEmpty(values?.categoryParameterValues)) {
		errors.categoryParameterValues = i18next.t('loc:Musite pouzit aspon jeden parameter')
	}

	return errors
}

export default validateServiceForm
