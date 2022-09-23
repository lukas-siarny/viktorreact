import { get } from 'lodash'
import { isEmail } from 'lodash-checkit'
import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// utils
import passwordRegEx from '../../../utils/regex'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

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
	if (values?.email && values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
	}

	if (!get(values, 'password')) {
		errors.password = i18next.t('loc:Toto pole je povinné')
	}
	/* TODO
	if (!get(values, 'confirmPassword')) {
		errors.confirmPassword = i18next.t('loc:Toto pole je povinné')
	}
	if (get(values, 'password') && get(values, 'confirmPassword') && get(values, 'password') !== get(values, 'confirmPassword')) {
		errors.confirmPassword = i18next.t('loc:Heslá sa nezhodujú')
	}
	*/
	if (values.password && !passwordRegEx.test(values.password)) {
		errors.password = i18next.t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak')
	}
	if (values?.password && values.password?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.password = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
	}

	if (!get(values, 'phonePrefixCountryCode')) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je povinné')
	}

	if (!get(values, 'phone')) {
		errors.phone = i18next.t('loc:Toto pole je povinné')
	}
	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (!get(values, 'gdpr')) {
		errors.gdpr = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
