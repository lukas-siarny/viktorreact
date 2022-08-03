import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { isEmpty } from 'lodash'
import { ISalonForm } from '../../../types/interfaces'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export default (values: ISalonForm) => {
	const errors: any = {}

	if (!values?.name) {
		errors.name = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.name && values.name?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.name = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
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
	}

	if (!(values?.zipCode && values?.city && values?.street && values?.streetNumber && values?.latitude && values?.longitude && values?.country)) {
		errors.address = i18next.t(
			'loc:Adresa nie je kompletná. Uistite sa, či je vyplnené - Mesto, Ulica (s číslom!), PSČ a Krajina. Upresniť adresu môžete vo vyhľadávaní alebo priamo v mape.'
		)
	}

	if (values?.description && values.description.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	if (values?.parkingNote && values.parkingNote.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
	}

	if (!values?.email) {
		errors.email = i18next.t('loc:Toto pole je povinné')
	}

	if (!values?.categoryIDs || isEmpty(values?.categoryIDs)) {
		errors.categoryIDs = i18next.t('loc:Toto pole je povinné')
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

	if (values?.email && values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
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
	}

	return errors
}
