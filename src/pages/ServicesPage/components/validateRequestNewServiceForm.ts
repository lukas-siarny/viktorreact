import i18next from 'i18next'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

const validateServiceForm = (values?: any) => {
	const errors: any = {}

	if (!values?.description) {
		errors.description = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.description && values.description.length > VALIDATION_MAX_LENGTH.LENGTH_3000) {
		errors.description = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_3000
		})
	}

	if (values?.description && values.description.length < VALIDATION_MAX_LENGTH.LENGTH_5) {
		errors.description = i18next.t('loc:Min. počet znakov je {{min}}', {
			min: VALIDATION_MAX_LENGTH.LENGTH_5
		})
	}

	if (!values?.rootCategoryID) {
		errors.rootCategoryID = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}

export default validateServiceForm
