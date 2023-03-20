import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmpty } from 'lodash'

import dayjs from 'dayjs'
import { VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { formatDate } from '../../../../utils/helper'

const validateEventForm = (values?: any) => {
	// const errors: FormErrors<ICalendarEventForm> = {}
	//
	// if (isEmpty(values?.repeatOn)) {
	// 	errors.repeatOn = i18next.t('loc:Možnosť opakovania musí obsahovať aspoň jeden platný deň')
	// }
	//
	// if (!values?.date) {
	// 	errors.date = i18next.t('loc:Toto pole je povinné')
	// }
	//
	// if (!values?.employee) {
	// 	errors.employee = i18next.t('loc:Toto pole je povinné')
	// }
	//
	// if (!values?.timeFrom) {
	// 	errors.timeFrom = i18next.t('loc:Toto pole je povinné')
	// }
	//
	// if (!values?.timeTo) {
	// 	errors.timeTo = i18next.t('loc:Toto pole je povinné')
	// }
	//
	// if (values?.recurring && !values?.end) {
	// 	errors.end = i18next.t('loc:Toto pole je povinné')
	// }
	//
	// if (values?.note && values.note.length > VALIDATION_MAX_LENGTH.LENGTH_1500) {
	// 	errors.note = i18next.t('loc:Max. počet znakov je {{max}}', { max: VALIDATION_MAX_LENGTH.LENGTH_1500 })
	// }
	//
	// if (dayjs(values?.date).isAfter(dayjs(values?.end))) {
	// 	errors.end = i18next.t('loc:Koniec opakovania musí byť po dátume {{ date }}', { date: formatDate(values?.date) })
	// }
	//
	// return errors
}

export default validateEventForm
