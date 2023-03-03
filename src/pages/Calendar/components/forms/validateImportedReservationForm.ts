import i18next from 'i18next'
import { FormErrors } from 'redux-form'
import { ICalendarImportedReservationForm } from '../../../../types/interfaces'
import { VALIDATION_MAX_LENGTH } from '../../../../utils/enums'

const validateReservationForm = (values?: ICalendarImportedReservationForm) => {
	const errors: FormErrors<ICalendarImportedReservationForm> = {}

	if (!values?.date) {
		errors.date = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.timeFrom) {
		errors.timeFrom = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.timeTo) {
		errors.timeTo = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.note && values.note.length > VALIDATION_MAX_LENGTH.LENGTH_1500) {
		errors.note = i18next.t('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_1500 })
	}

	return errors
}

export default validateReservationForm
