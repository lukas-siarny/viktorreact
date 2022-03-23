import { get } from 'lodash'
import i18next from 'i18next'

// types
import { IOpenHoursNoteForm } from '../../types/interfaces'

// utils
import { VALIDATION_MAX_LENGTH } from '../../utils/enums'

export default (values: IOpenHoursNoteForm) => {
	const errors: any = { hoursNote: {} }

	if (!get(values, 'hoursNote.note')) {
		errors.hoursNote.note = i18next.t('loc:Toto pole je povinné')
	}
	if (get(values, 'hoursNote.note.length') > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.hoursNote.note = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (!get(values, 'hoursNote.range.dateFrom') || !get(values, 'hoursNote.range.dateTo')) {
		errors.hoursNote.range = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
