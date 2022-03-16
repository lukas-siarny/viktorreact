import { get } from 'lodash'
import { isEmail } from 'lodash-checkit'
import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// utils
import passwordRegEx from '../../../utils/regex'

// types
import { IRegistrationForm } from '../../../types/interfaces'

export default (values: IRegistrationForm) => {
	const errors: FormErrors<IRegistrationForm> = {}

	if (get(values, 'email') && !isEmail(get(values, 'email'))) {
		errors.email = i18next.t('loc:Nesprávny formát emailovej adresy')
	}
	if (!get(values, 'email')) {
		errors.email = i18next.t('loc:Toto pole je povinné')
	}
	if (!get(values, 'password')) {
		errors.password = i18next.t('loc:Toto pole je povinné')
	}
	if (values.password && !passwordRegEx.test(values.password)) {
		errors.password = i18next.t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak')
	}
	if (!get(values, 'phonePrefixCountryCode')) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je povinné')
	}
	if (!get(values, 'phone')) {
		errors.phone = i18next.t('loc:Toto pole je povinné')
	}
	if (!get(values, 'gdpr')) {
		errors.gdpr = i18next.t('loc:Toto pole je povinné')
	}
	if (!get(values, 'gtc')) {
		errors.gtc = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
