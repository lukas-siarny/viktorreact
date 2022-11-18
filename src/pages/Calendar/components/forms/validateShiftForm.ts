import i18next from 'i18next'
import { FormErrors } from 'redux-form'
import { ICalendarEventForm } from '../../../../types/interfaces'

const validateShiftForm = (values?: ICalendarEventForm) => {
	const errors: FormErrors<ICalendarEventForm> = {}

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

export default validateShiftForm
