import i18next from 'i18next'
import { get } from 'lodash'
import { isEmail } from 'lodash-checkit'
import { FormErrors } from 'redux-form'

import { IForgotPasswordForm } from '../../../types/interfaces'

export default (values: IForgotPasswordForm) => {
	const errors: FormErrors<IForgotPasswordForm> = {}

	if (get(values, 'email') && !isEmail(get(values, 'email'))) {
		errors.email = i18next.t('loc:Nesprávny formát emailovej adresy')
	}

	if (!get(values, 'email')) {
		errors.email = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
