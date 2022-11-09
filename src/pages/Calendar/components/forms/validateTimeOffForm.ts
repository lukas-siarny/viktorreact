import { FormErrors } from 'redux-form'
import i18next from 'i18next'

import { ICalendarTimeOffForm } from '../../../../types/interfaces'

const validateTimeOffForm = (values?: ICalendarTimeOffForm) => {
	const errors: FormErrors<ICalendarTimeOffForm> = {}

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

export default validateTimeOffForm
