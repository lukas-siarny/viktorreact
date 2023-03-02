import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isNil } from 'lodash'

// types
import { IRechargeSmsCreditForm } from '../../../types/interfaces'

export default (values: IRechargeSmsCreditForm) => {
	const errors: FormErrors<IRechargeSmsCreditForm> = {}

	if (isNil(values.amount)) {
		errors.amount = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
