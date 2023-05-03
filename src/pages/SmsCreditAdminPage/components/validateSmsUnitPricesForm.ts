import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isNil } from 'lodash'

// schemas
import { ISmsUnitPricesForm } from '../../../schemas/smsUnitPrices'

export default (values: ISmsUnitPricesForm) => {
	const errors: FormErrors<ISmsUnitPricesForm> = {}

	if (!values.countryCode) {
		errors.countryCode = i18next.t('loc:Toto pole je povinné')
	}

	if (isNil(values.amount)) {
		errors.amount = i18next.t('loc:Toto pole je povinné')
	}

	if (!values.validFrom) {
		errors.validFrom = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
