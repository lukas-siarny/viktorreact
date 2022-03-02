import { get } from 'lodash'
import { isEmail } from 'lodash-checkit'
import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// types
// import { ILoginForm } from '../../../types/interfaces'

export default (values: any /* ILoginForm */) => {
	// const errors: FormErrors<ILoginForm> = {}
	const errors: FormErrors<any> = {}

	if (get(values, 'email') && !isEmail(get(values, 'email'))) {
		errors.email = i18next.t('loc:Nesprávny formát emailovej adresy')
	}
	if (!get(values, 'email')) {
		errors.email = i18next.t('loc:Toto pole je povinné')
	}
	if (!get(values, 'password')) {
		errors.password = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
