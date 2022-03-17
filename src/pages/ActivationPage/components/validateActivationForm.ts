import { get } from 'lodash'
import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// types
import { IActivationForm } from '../../../types/interfaces'

export const PIN_LENGTH = 6

export default (values: IActivationForm) => {
	const errors: FormErrors<IActivationForm> = {}

	if (get(values, 'code.length', 0) !== PIN_LENGTH) {
		errors.code = i18next.t('loc:Zadajte celý PIN')
	}

	return errors
}
