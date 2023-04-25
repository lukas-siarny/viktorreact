import i18next from 'i18next'
import { isNil } from 'lodash'
import { FormErrors } from 'redux-form'
import { IRechargeSmsCreditFilter } from '../../../types/interfaces'

const validateRechargeSmsCreditFilterForm = (values?: IRechargeSmsCreditFilter) => {
	const errors: FormErrors<IRechargeSmsCreditFilter> = {}

	if (
		!isNil(values?.walletAvailableBalanceFrom) &&
		!isNil(values?.walletAvailableBalanceTo) &&
		(values?.walletAvailableBalanceFrom || 0) >= (values?.walletAvailableBalanceTo || 0)
	) {
		errors.walletAvailableBalanceFrom = i18next.t('loc:Stav konta OD musí byť menší ako stav konta DO')
		errors.walletAvailableBalanceTo = true as any
	}

	return errors
}

export default validateRechargeSmsCreditFilterForm
