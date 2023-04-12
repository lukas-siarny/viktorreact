import i18next from 'i18next'
import { isEmpty, isNil } from 'lodash'
import { IServiceForm } from '../../../types/interfaces'

const validateServiceForm = (values?: IServiceForm) => {
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

	if (values?.variableDuration && !isNil(values?.durationTo) && (values?.durationFrom || 0) > values?.durationTo) {
		errors.durationFrom = i18next.t('loc:Chybný rozsah')
		errors.durationTo = ' '
	}

	if (values?.variablePrice && !isNil(values?.priceTo) && (values?.priceFrom || 0) > values?.priceTo) {
		errors.priceFrom = i18next.t('loc:Chybný rozsah')
		errors.priceTo = ' '
	}

	if (values?.useCategoryParameter && isEmpty(values?.serviceCategoryParameter?.filter((value: any) => value.useParameter))) {
		errors.serviceCategoryParameter = { _error: i18next.t('loc:Musíte zvoliť a nastaviť aspoň jednu hodnotu parametra!') }
	}

	if (values?.descriptionLocalizations && !values?.descriptionLocalizations[0].value && values?.descriptionLocalizations.some((value, index) => index !== 0 && value.value)) {
		errors.descriptionLocalizations = [{ value: i18next.t('loc:Toto pole je povinné') }]
	}

	return errors
}

export default validateServiceForm
