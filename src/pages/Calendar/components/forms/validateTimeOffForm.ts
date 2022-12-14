import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmpty } from 'lodash'

import { ICalendarEventForm } from '../../../../types/interfaces'
import { TEXT_LIMITS } from '../../../../utils/enums'

const validateTimeOffForm = (values?: ICalendarEventForm) => {
	const errors: FormErrors<ICalendarEventForm> = {}

	if (isEmpty(values?.repeatOn)) {
		errors.repeatOn = i18next.t('loc:Možnosť opakovania musí obsahovať aspoň jeden platný deň')
	}

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

	if (values?.recurring && !values?.end) {
		errors.end = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.note && values.note.length > TEXT_LIMITS.MAX_1500) {
		errors.note = i18next.t('loc:Max. počet znakov je {{max}}', { max: TEXT_LIMITS.MAX_1500 })
	}

	return errors
}

export default validateTimeOffForm
