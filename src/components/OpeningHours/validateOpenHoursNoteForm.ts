import { get } from 'lodash'
import i18next from 'i18next'

// types
import { IOpenHoursNoteForm } from '../../types/interfaces'

// utils
import { VALIDATION_MAX_LENGTH } from '../../utils/enums'
import { isValidDateRange } from '../../utils/helper'

export default (values: IOpenHoursNoteForm) => {
	const errors: any = { hoursNote: {} }

	console.log(values)
	if (!get(values, 'hoursNote.note')) {
		errors.hoursNote.note = i18next.t('loc:Toto pole je povinné')
	}
	if (get(values, 'hoursNote.note.length') > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.hoursNote.note = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	const dateFrom = get(values, 'hoursNote.range.dateFrom')
	const dateTo = get(values, 'hoursNote.range.dateTo')
	if (!dateFrom || !dateTo) {
		errors.hoursNote.range = i18next.t('loc:Toto pole je povinné')
	}
	if (dateFrom && dateTo && !isValidDateRange(dateFrom, dateTo)) {
		errors.hoursNote.range = i18next.t('loc:Chybný rozsah dátumov')
	}

	return errors
}
