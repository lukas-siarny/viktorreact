import i18next from 'i18next'
import { FormErrors } from 'redux-form'
import { ICalendarReservationForm } from '../../../../types/interfaces'
import { TEXT_LIMITS } from '../../../../utils/enums'

const validateReservationForm = (values?: ICalendarReservationForm) => {
	const errors: FormErrors<ICalendarReservationForm> = {}

	if (!values?.customer) {
		errors.customer = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.date) {
		errors.date = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.employee) {
		errors.employee = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.service) {
		errors.service = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.timeFrom) {
		errors.timeFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.timeTo) {
		errors.timeTo = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.note && values.note.length > TEXT_LIMITS.MAX_1500) {
		errors.note = i18next.t('loc:Max. počet znakov je {{max}}', { max: TEXT_LIMITS.MAX_1500 })
	}

	return errors
}

export default validateReservationForm
