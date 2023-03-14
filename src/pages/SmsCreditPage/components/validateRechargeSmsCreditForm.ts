import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isNil } from 'lodash'

// types
import { IRechargeSmsCreditForm } from '../../../types/interfaces'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

// schema
import { validationFn } from '../../../schemas/rechargeSmsCredit'

export default validationFn

/*
export default (values: IRechargeSmsCreditForm) => {
	const errors: FormErrors<IRechargeSmsCreditForm> = {}

	if (isNil(values.amount)) {
		errors.amount = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.transactionNote && values.transactionNote.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.transactionNote = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
	}

	return errors
}
*/
