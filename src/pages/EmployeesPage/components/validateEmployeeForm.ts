import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { FormErrors } from 'redux-form'

import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { IEmployeeForm } from '../../../types/interfaces'

export default (values: IEmployeeForm) => {
	const errors: FormErrors<IEmployeeForm> = {}

	if (!values?.lastName) {
		errors.lastName = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.orderIndex) {
		errors.orderIndex = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.lastName && values.lastName?.length > VALIDATION_MAX_LENGTH.LENGTH_50) {
		errors.lastName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_50
		})
	}

	if (!values?.firstName) {
		errors.firstName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.firstName && values.firstName?.length > VALIDATION_MAX_LENGTH.LENGTH_50) {
		errors.firstName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_50
		})
	}

	if (values?.email) {
		if (values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
			errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_100
			})
		} else if (!isEmail(values?.email)) {
			errors.email = i18next.t('loc:Email nie je platný')
		}
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	return errors
}
