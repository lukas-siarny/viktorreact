import { get } from 'lodash'
import { FormErrors, DecoratedFormProps } from 'redux-form'

// Types
// eslint-disable-next-line import/no-cycle
import { ComponentProps } from './CreatePasswordForm'
import { ICreatePasswordForm } from '../../../types/interfaces'
import passwordRegEx from '../../../utils/regex'

export default (values: ICreatePasswordForm, { t }: DecoratedFormProps<ICreatePasswordForm, ComponentProps>) => {
	const errors: FormErrors<ICreatePasswordForm> = {}

	if (!get(values, 'confirmPassword')) {
		errors.confirmPassword = t('loc:Toto pole je povinné')
	}

	if (!get(values, 'password')) {
		errors.password = t('loc:Toto pole je povinné')
	}

	if (get(values, 'password') && get(values, 'confirmPassword') && get(values, 'password') !== get(values, 'confirmPassword')) {
		errors.confirmPassword = t('loc:Heslá sa nezhodujú')
	}

	if (values.password && !passwordRegEx.test(values.password)) {
		errors.password = t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak')
	}
	return errors
}
