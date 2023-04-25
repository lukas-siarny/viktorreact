import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { IVoucherForm } from '../../../../types/interfaces'

export default (values: IVoucherForm) => {
	const errors: FormErrors<IVoucherForm> = {}

	if (!values?.code) {
		errors.code = i18next.t('loc:Toto pole je povinné')
	}
	// TODO: syncnut s BE

	if (values?.code && values.code?.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.code = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	return errors
}
