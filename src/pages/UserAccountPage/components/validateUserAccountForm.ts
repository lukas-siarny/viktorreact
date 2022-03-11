import { FormErrors } from 'redux-form'
import i18next from 'i18next'

export default (values: any) => {
	const errors: FormErrors<any> = {}

	if (!values.firstName) {
		errors.firstName = i18next.t('loc:Toto pole je povinné')
	}

	if (values.firstName && values.firstName.length > 255) {
		errors.firstName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: 255
		})
	}

	if (!values.lastName) {
		errors.lastName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.lastName && values.lastName?.length > 255) {
		errors.lastName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: 255
		})
	}

	if (!values.phone || !values.phonePrefixCountryCode) {
		errors.phone = i18next.t('loc:Toto pole je povinné')
	}

	if (!values.companyName) {
		errors.companyName = i18next.t('loc:Toto pole je povinné')
	}

	if (!values.businessID) {
		errors.businessID = i18next.t('loc:Toto pole je povinné')
	}

	if (!values.street) {
		errors.street = i18next.t('loc:Toto pole je povinné')
	}

	if (!values.city) {
		errors.city = i18next.t('loc:Toto pole je povinné')
	}

	if (!values.zipCode) {
		errors.zipCode = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
