import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export default (values: any) => {
	const errors: FormErrors<any> = {}

	if (!values.firstName) {
		errors.firstName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.firstName && values.firstName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.firstName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (!values.lastName) {
		errors.lastName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.lastName && values.lastName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.lastName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (values?.email) {
		if (values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		} else if (!isEmail(values?.email)) {
			errors.email = i18next.t('loc:Email nie je platný')
		}
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (values?.phone && !values?.phonePrefixCountryCode) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.note && values.note?.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.note = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	if (values?.street && values?.street?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.street = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (values?.streetNumber && values?.streetNumber?.length > VALIDATION_MAX_LENGTH.LENGTH_10) {
		errors.streetNumber = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_10
		})
	}

	if (values?.city && values?.city?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.city = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (values?.zipCode && values?.zipCode?.length > VALIDATION_MAX_LENGTH.LENGTH_10) {
		errors.zipCode = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_10
		})
	}

	return errors
}
