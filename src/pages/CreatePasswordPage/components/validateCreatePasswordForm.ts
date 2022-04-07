import { get } from 'lodash'
import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// Types
import { ICreatePasswordForm } from '../../../types/interfaces'
import passwordRegEx from '../../../utils/regex'

export default (values: ICreatePasswordForm) => {
	const errors: FormErrors<ICreatePasswordForm> = {}

	if (!get(values, 'confirmPassword')) {
		errors.confirmPassword = i18next.t('loc:Toto pole je povinné')
	}

	if (!get(values, 'password')) {
		errors.password = i18next.t('loc:Toto pole je povinné')
	}

	if (get(values, 'password') && get(values, 'confirmPassword') && get(values, 'password') !== get(values, 'confirmPassword')) {
		errors.confirmPassword = i18next.t('loc:Heslá sa nezhodujú')
	}

	if (values.password && !passwordRegEx.test(values.password)) {
		errors.password = i18next.t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak')
	}
	return errors
}
