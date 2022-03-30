import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export default (values: any) => {
	const errors: FormErrors<any> = {}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (values?.phone && !values?.phonePrefixCountryCode) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
