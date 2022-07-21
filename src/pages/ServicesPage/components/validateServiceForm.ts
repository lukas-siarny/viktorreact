import i18next from 'i18next'

// utils
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

const validateServiceForm = (values?: any) => {
	const errors: any = {}

	if (!values?.categoryRoot) {
		errors.categoryRoot = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.categoryFirstLevel) {
		errors.categoryFirstLevel = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.salonID) {
		errors.salonID = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.name) {
		errors.name = i18next.t('loc:Toto pole je povinné')
	}
	if (values?.name && values.name?.length > VALIDATION_MAX_LENGTH.LENGTH_60) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_60
		})
	}

	if (values?.description && values.description?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.description = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
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
