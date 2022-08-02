import i18next from 'i18next'
import { isEmpty } from 'lodash'
import { ISalonForm } from '../../../types/interfaces'

export default (values: ISalonForm) => {
	const requiedFields: string[] = []

	if (!values?.name) {
		requiedFields.push(i18next.t('loc:Názov'))
	}

	if (!values?.aboutUsFirst) {
		requiedFields.push(i18next.t('loc:O nás'))
	}

	const filledPhoneInputs = values?.phones?.filter((phone: any) => phone.phone)

	if (filledPhoneInputs?.length < 1) {
		requiedFields.push(i18next.t('loc:Telefónne čísla'))
	}

	if (!values?.email) {
		requiedFields.push(i18next.t('loc:Email'))
	}

	if (!values?.gallery || isEmpty(values?.gallery)) {
		requiedFields.push(i18next.t('loc:Fotogaléria'))
	}

	if (
		!values?.openingHours ||
		isEmpty(values?.openingHours) ||
		!values?.openingHours?.some((day) => !isEmpty(day.timeRanges) && day.timeRanges.some((timeRange) => timeRange.timeFrom && timeRange.timeTo))
	) {
		requiedFields.push(i18next.t('loc:Otváracie hodiny'))
	}

	return requiedFields
}
