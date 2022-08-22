import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { isEmpty } from 'lodash'
import { ISalonForm } from '../../../types/interfaces'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { socialMediaRegex } from '../../../utils/regex'

export default (values: ISalonForm) => {
	const errors: any = {}

	if (!values?.salonNameFromSelect) {
		if (!values?.name) {
			errors.name = i18next.t('loc:Toto pole je povinné')
		}

		if (values?.name && values.name?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.name = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		}
	} else {
		if (!values?.nameSelect || !values?.nameSelect.label) {
			errors.nameSelect = i18next.t('loc:Toto pole je povinné')
		}

		if (values?.nameSelect?.label && values?.nameSelect?.label?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.nameSelect = i18next.t('loc:Max. počet znakov je {{max}}', {
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

	if (!(values?.zipCode && values?.city && values?.street && values?.streetNumber && values?.latitude && values?.longitude && values?.country)) {
		errors.address = i18next.t(
			'loc:Adresa nie je kompletná. Uistite sa, či je vyplnené - Mesto, Ulica (s číslom!), PSČ a Krajina. Upresniť adresu môžete vo vyhľadávaní alebo priamo v mape.'
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

	if (values?.aboutUsSecond && values.aboutUsSecond?.length > VALIDATION_MAX_LENGTH.LENGTH_500) {
		errors.aboutUsSecond = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_500
		})
	}

	if (values?.otherPaymentMethods && values.otherPaymentMethods?.length > VALIDATION_MAX_LENGTH.LENGTH_500) {
		errors.otherPaymentMethods = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_500
		})
	}

	const contactPerson = values?.companyContactPerson
	const contactPersonErrors: any = {}

	if (contactPerson?.firstName && contactPerson.firstName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		contactPersonErrors.firstName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (contactPerson?.lastName && contactPerson.lastName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		contactPersonErrors.lastName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
	}

	if (!contactPerson?.email) {
		contactPersonErrors.email = i18next.t('loc:Toto pole je povinné')
	} else if (!isEmail(contactPerson?.email)) {
		contactPersonErrors.email = i18next.t('loc:Email nie je platný')
	}

	if (!contactPerson?.phone) {
		contactPersonErrors.phone = i18next.t('loc:Toto pole je povinné')
	}

	if (contactPerson?.phone && contactPerson.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		contactPersonErrors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (!isEmpty(contactPersonErrors)) {
		errors.companyContactPerson = contactPersonErrors
	}

	const companyInfo = values?.companyInfo

	if (companyInfo) {
		const companyErrors: any = {}

		if (companyInfo?.companyName && companyInfo?.companyName?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			companyErrors.companyName = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
		}

		if (companyInfo?.businessID && companyInfo?.businessID?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
			companyErrors.businessID = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_20
			})
		}

		if (companyInfo?.vatID && companyInfo?.vatID?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
			companyErrors.vatID = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_20
			})
		}

		if (companyInfo?.taxID && companyInfo?.taxID?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
			companyErrors.taxID = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_20
			})
		}

		if (!isEmpty(companyErrors)) {
			errors.companyInfo = companyErrors
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
	}

	return errors
}
