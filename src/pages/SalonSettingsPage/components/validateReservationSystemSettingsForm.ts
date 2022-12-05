import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmpty, isNil } from 'lodash'

// types
import { IReservationSystemSettingsForm } from '../../../types/interfaces'

const validateForm = (values?: IReservationSystemSettingsForm) => {
	const errors: FormErrors<IReservationSystemSettingsForm> = {}

	return errors
}

export default validateForm
