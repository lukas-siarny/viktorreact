import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { isEmpty } from 'lodash'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export default (values: any) => {
	const errors: FormErrors<any> = {}
	const touched: string[] = []

	if (!values?.name) {
		errors.name = i18next.t('loc:Toto pole je pre publikáciu povinné')
		touched.push('name')
	}

	if (values?.name && values.name?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
		errors.name = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_255
		})
		touched.push('name')
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
		touched.push('phone')
	}

	if (values?.phone && !values?.phonePrefixCountryCode) {
		errors.phonePrefixCountryCode = i18next.t('loc:Toto pole je pre povinné')
		touched.push('phonePrefixCountryCode')
	}

	if (!values?.phone) {
		errors.phone = i18next.t('loc:Toto pole je pre povinné')
		touched.push('phone')
	}

	if (!(values?.zipCode && values?.city && values?.street && values?.streetNumber && values?.latitude && values?.longitude && values?.country)) {
		errors.address = i18next.t(
			'loc:Adresa nie je kompletná. Uistite sa, či je vyplnené - Mesto, Ulica (s číslom!), PSČ a Krajina. Upresniť adresu môžete vo vyhľadávaní alebo priamo v mape.'
		)
	}

	if (!values?.email) {
		errors.email = i18next.t('loc:Toto pole je pre publikáciu povinné')
		touched.push('email')
	}

	if (values?.email) {
		if (values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_255) {
			errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_255
			})
			touched.push('email')
		} else if (!isEmail(values?.email)) {
			errors.email = i18next.t('loc:Email nie je platný')
			touched.push('email')
		}
	}

	if (!values?.aboutUsFirst) {
		errors.aboutUsFirst = i18next.t('loc:Toto pole je pre publikáciu povinné')
		touched.push('aboutUsFirst')
	}

	if (values?.aboutUsFirst && values.aboutUsFirst?.length > VALIDATION_MAX_LENGTH.LENGTH_1000) {
		errors.aboutUsFirst = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_1000
		})
		touched.push('aboutUsFirst')
	}

	if (values?.aboutUsSecond && values.aboutUsSecond?.length > VALIDATION_MAX_LENGTH.LENGTH_500) {
		errors.aboutUsSecond = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_500
		})
		touched.push('aboutUsSecond')
	}

	if (!values.gallery || isEmpty(values.gallery)) {
		errors.gallery = i18next.t('loc:Toto pole je pre publikáciu povinné')
		touched.push('gallery')
	}

	if (values?.otherPaymentMethods && values.otherPaymentMethods?.length > VALIDATION_MAX_LENGTH.LENGTH_500) {
		errors.otherPaymentMethods = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_500
		})
		touched.push('otherPaymentMethods')
	}

	const contactPerson = values?.companyContactPerson
	const contactPersonErrors: any = {}

	if (contactPerson?.firstName && contactPerson.firstName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		contactPersonErrors.firstName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
		touched.push('companyContactPerson.firstName')
	}

	if (contactPerson?.lastName && contactPerson.lastName?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
		contactPersonErrors.lastName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_100
		})
		touched.push('companyContactPerson.lastName')
	}

	if (!contactPerson?.email) {
		contactPersonErrors.email = i18next.t('loc:Toto pole je povinné')
		touched.push('companyContactPerson.email')
	} else if (!isEmail(contactPerson?.email)) {
		contactPersonErrors.email = i18next.t('loc:Email nie je platný')
		touched.push('companyContactPerson.email')
	}

	if (!contactPerson?.phone) {
		contactPersonErrors.phone = i18next.t('loc:Toto pole je povinné')
		touched.push('companyContactPerson.phone')
	}

	if (contactPerson?.phone && contactPerson.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		contactPersonErrors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
		touched.push('companyContactPerson.phone')
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
			touched.push('companyInfo.companyName')
		}

		if (companyInfo?.businessID && companyInfo?.businessID?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
			companyErrors.businessID = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_20
			})
			touched.push('companyInfo.businessID')
		}

		if (companyInfo?.vatID && companyInfo?.vatID?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
			companyErrors.vatID = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_20
			})
			touched.push('companyInfo.vatID')
		}

		if (companyInfo?.taxID && companyInfo?.taxID?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
			companyErrors.taxID = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_20
			})
			touched.push('companyInfo.taxID')
		}

		if (!isEmpty(companyErrors)) {
			errors.companyInfo = companyErrors
		}
	}

	return { errors, touched }
}
