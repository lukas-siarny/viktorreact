import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { ISupportContactForm } from '../../../types/interfaces'

export default (values: ISupportContactForm) => {
	const errors: any = {}

	if (values?.emails) {
		const emailErrors: { [key: number]: { email: string } } = {}

		values.emails.forEach((email, index) => {
			if (!isEmail(email.email)) {
				emailErrors[index] = { email: i18next.t('loc:Nesprávny formát emailovej adresy') }
			}
		})

		const filledEmailInputs = values?.emails.filter((email) => email.email)

		if (filledEmailInputs.length < 1) {
			emailErrors[0] = { email: i18next.t('loc:Toto pole je povinné') }
		}

		errors.emails = emailErrors
	}

	if (values?.phones) {
		const phoneErrors: { [key: number]: { phone: string } } = {}

		const filledPhoneInputs = values?.phones.filter((phone) => phone.phone)

		if (filledPhoneInputs.length < 1) {
			phoneErrors[0] = { phone: i18next.t('loc:Toto pole je povinné') }
		}

		errors.phones = phoneErrors
	}

	if (values?.street && values?.street?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.street = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
	}

	if (values?.streetNumber && values?.streetNumber?.length > VALIDATION_MAX_LENGTH.LENGTH_10) {
		errors.streetNumber = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_30
		})
	}

	if (values?.city && values?.city?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		errors.city = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
	}

	if (values?.zipCode && values?.zipCode?.length > VALIDATION_MAX_LENGTH.LENGTH_10) {
		errors.zipCode = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_30
		})
	}

	if (!values?.countryCode) {
		errors.countryCode = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
