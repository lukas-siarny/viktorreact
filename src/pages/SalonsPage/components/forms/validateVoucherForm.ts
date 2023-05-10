import { FormErrors } from 'redux-form'
import i18next from 'i18next'

import { IVoucherForm } from '../../../../types/interfaces'

export default (values: IVoucherForm) => {
	const errors: FormErrors<IVoucherForm> = {}

	if (!values?.code) {
		errors.code = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
