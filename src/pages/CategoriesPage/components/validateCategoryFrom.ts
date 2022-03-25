import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export default (values: any) => {
	const errors: FormErrors<any> = {}

	if (!values.name) {
		errors.name = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.name && values.name?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.name = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	return errors
}
