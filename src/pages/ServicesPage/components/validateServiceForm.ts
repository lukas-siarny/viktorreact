import i18next from 'i18next'

const validateServiceForm = (values?: any) => {
	const errors: any = {}

	if (!values?.categoryRoot) {
		errors.categoryRoot = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.categoryFirstLevel) {
		errors.categoryFirstLevel = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.categorySecondLevel) {
		errors.categorySecondLevel = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.durationFrom) {
		errors.durationFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variableDuration && !values?.durationTo) {
		errors.durationTo = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.priceFrom) {
		errors.priceFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.variablePrice && !values?.priceTo) {
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

	return errors
}

export default validateServiceForm
