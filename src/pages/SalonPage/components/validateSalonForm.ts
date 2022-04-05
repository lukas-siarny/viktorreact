import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export default (values: any) => {
	const errors: FormErrors<any> = {}

	if (!values?.name) {
		errors.name = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.name && values.name?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.name = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (values?.phone && !values?.phonePrefixCountryCode) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je povinné')
	}

	if (!(values?.zip && values?.city && values?.street && values?.latitude && values?.longitude && values?.country)) {
		errors.address = i18next.t('loc:Upresnite adresu vo vyhľadávaní alebo priamo v mape')
	}

	if (!values?.phone) {
		errors.phone = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (!values?.email) {
		errors.email = i18next.t('loc:Toto pole je povinné')
	}

	if (!(values?.gallery?.length > 0)) {
		errors.gallery = i18next.t('loc:Nahrajte aspoň jeden obrázok')
	}

	if (values?.email && values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	return errors
}
