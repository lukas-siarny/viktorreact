import { get } from 'lodash'
import i18next from 'i18next'
import { FormErrors } from 'redux-form'

// types
import { IOpenHoursNoteForm } from '../../types/interfaces'

// utils
import { VALIDATION_MAX_LENGTH } from '../../utils/enums'

export default (values: IOpenHoursNoteForm) => {
	const errors: FormErrors<IOpenHoursNoteForm> = {}

	if (!get(values, 'openingHoursNote')) {
		errors.openingHoursNote = i18next.t('loc:Toto pole je povinné')
	}
	if (get(values, 'openingHoursNote.length') > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.openingHoursNote = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	return errors
}
