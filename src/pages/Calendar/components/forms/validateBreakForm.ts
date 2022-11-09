import { FormErrors } from 'redux-form'
import i18next from 'i18next'

import { ICalendarBreakForm } from '../../../../types/interfaces'

const validateBreakForm = (values?: ICalendarBreakForm) => {
	const errors: FormErrors<ICalendarBreakForm> = {}

	if (!values?.date) {
		errors.date = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.employee) {
		errors.employee = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.timeFrom) {
		errors.timeFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.timeTo) {
		errors.timeTo = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}

export default validateBreakForm
