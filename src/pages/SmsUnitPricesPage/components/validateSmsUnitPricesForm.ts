import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'

// enums
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

// types
import { ISmsUnitPricesForm } from '../../../types/interfaces'

export default (values: ISmsUnitPricesForm) => {
	const errors: FormErrors<ISmsUnitPricesForm> = {}

	/* if (values?.email) {
		if (values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		} else if (!isEmail(values?.email)) {
			errors.email = i18next.t('loc:Email nie je platný')
		}
	}

	if (!values?.phone) {
		errors.phone = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.phonePrefixCountryCode) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (!values?.countryCode) {
		errors.countryCode = i18next.t('loc:Toto pole je povinné')
	} */

	return errors
}
