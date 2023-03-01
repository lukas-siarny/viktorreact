import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { isEmpty } from 'lodash'

// interfaces
import { AutocompleteLabelInValue, ISalonForm } from '../../../../types/interfaces'

// utils
import { VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { socialMediaRegex } from '../../../../utils/regex'
import { validateOpeningHours } from '../../../../components/OpeningHours/OpeningHoursUtils'

export default (values: ISalonForm) => {
	const errors: any = {}

	if (!values?.salonNameFromSelect) {
		const name = values?.name as string | null
		if (!name) {
			errors.name = i18next.t('loc:Toto pole je povinné')
		}

		if (name && name.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.name = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		}
	} else {
		const name = values?.name as AutocompleteLabelInValue | null
		if (!name || !name.label) {
			errors.name = i18next.t('loc:Toto pole je povinné')
		}

		if (name?.label && name?.label?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.name = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		}
	}

	const filledPhoneInputs = values?.phones?.filter((phone: any) => phone.phone)

	if (!isEmpty(filledPhoneInputs)) {
		const phonesErrors: { [key: number]: { phone?: string; phonePrefixCountryCode?: string } } = {}

		values?.phones?.forEach((phone: any, index: number) => {
			const phoneError: any = {}

			if (phone.phone && !phone.phonePrefixCountryCode) {
				phoneError.phonePrefixCountryCode = i18next.t('loc:Zadajte predvoľbu')
			}

			if (phone.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
				phoneError.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
					max: VALIDATION_MAX_LENGTH.LENGTH_20
				})
			}

			phonesErrors[index] = phoneError
		})

		errors.phones = phonesErrors
	} else {
		errors.phones = [
			{
				phone: i18next.t('loc:Toto pole je povinné')
			}
		]
	}

	if (!(values?.zipCode && values?.city && values?.street && values?.latitude && values?.longitude && values?.country)) {
		errors.address = i18next.t(
			'loc:Adresa nie je kompletná. Uistite sa, či je vyplnené - Mesto, Ulica, PSČ a Krajina. Upresniť adresu môžete vo vyhľadávaní alebo priamo v mape.'
		)
	}

	if (values?.locationNote && values.locationNote.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.locationNote = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	if (values?.parkingNote && values.parkingNote.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.parkingNote = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	if (values?.email) {
		if (values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		} else if (!isEmail(values?.email)) {
			errors.email = i18next.t('loc:Email nie je platný')
		}
	}

	if (values?.aboutUsFirst && values.aboutUsFirst?.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.aboutUsFirst = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	if (values?.otherPaymentMethods && values.otherPaymentMethods?.length > VALIDATION_MAX_LENGTH.LENGTH_500) {
		errors.otherPaymentMethods = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_500
		})
	}

	if (values?.socialLinkFB && !socialMediaRegex.facebook.test(values.socialLinkFB)) {
		errors.socialLinkFB = i18next.t('loc:Zadajte správny formát adresy (napr. {{url}})', {
			url: 'https://www.facebook.com/facebook'
		})
	}

	if (values?.socialLinkYoutube && !socialMediaRegex.youtube.test(values.socialLinkYoutube)) {
		errors.socialLinkYoutube = i18next.t('loc:Zadajte správny formát adresy (napr. {{url}})', {
			url: 'https://www.youtube.com/youtube'
		})
	}

	if (values?.socialLinkInstagram && !socialMediaRegex.instagram.test(values.socialLinkInstagram)) {
		errors.socialLinkInstagram = i18next.t('loc:Zadajte správny formát adresy (napr. {{url}})', {
			url: 'https://www.instagram.com/instagram'
		})
	}

	if (values?.socialLinkPinterest && !socialMediaRegex.pinterest.test(values.socialLinkPinterest)) {
		errors.socialLinkPinterest = i18next.t('loc:Zadajte správny formát adresy (napr. {{url}})', {
			url: 'https://www.pinterest.com/pinterest'
		})
	}

	if (values?.socialLinkTikTok && !socialMediaRegex.tiktok.test(values.socialLinkTikTok)) {
		errors.socialLinkTikTok = i18next.t('loc:Zadajte správny formát adresy (napr. {{url}})', {
			url: 'https://www.tiktok.com/tiktok'
		})
	}

	if (values?.socialLinkWebPage && !socialMediaRegex.website.test(values.socialLinkWebPage)) {
		errors.socialLinkWebPage = i18next.t('loc:Zadajte správny formát adresy (napr. {{url}})', {
			url: 'https://www.notino.com/'
		})
	}

	if (values.openingHours) {
		const openingHoursErrors = validateOpeningHours(values.openingHours)
		if (!isEmpty(openingHoursErrors)) {
			errors.openingHours = openingHoursErrors
		}
	}

	return errors
}
