import i18next from 'i18next'
import { isEmail } from 'lodash-checkit'
import { VALIDATION_MAX_LENGTH } from '../../../utils/enums'

export default (values: any) => {
	const errors: any = {}

	if (!values?.lastName) {
		errors.lastName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.lastName && values.lastName?.length > VALIDATION_MAX_LENGTH.LENGTH_50) {
		errors.lastName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_50
		})
	}

	if (!values?.firstName) {
		errors.firstName = i18next.t('loc:Toto pole je povinné')
	}

	if (values?.firstName && values.firstName?.length > VALIDATION_MAX_LENGTH.LENGTH_50) {
		errors.firstName = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_50
		})
	}

	if (values?.email) {
		if (values.email?.length > VALIDATION_MAX_LENGTH.LENGTH_100) {
			errors.email = i18next.t('loc:Max. počet znakov je {{max}}', {
				max: VALIDATION_MAX_LENGTH.LENGTH_100
			})
		} else if (!isEmail(values?.email)) {
			errors.email = i18next.t('loc:Email nie je platný')
		}
	}

	if (values?.phone && values.phone?.length > VALIDATION_MAX_LENGTH.LENGTH_20) {
		errors.phone = i18next.t('loc:Max. počet znakov je {{max}}', {
			max: VALIDATION_MAX_LENGTH.LENGTH_20
		})
	}

	if (values?.services) {
		const servicesErrors: { [key: number]: any } = {}

		/*
			const serivcesErros = {
				0: {
					variableFrom: '',
					variableTo: '',
					emploeyyData: {

					}
				}
			}
		*/

		values?.services?.forEach((service: any, index: number) => {
			const employeeData: any = {}

			if (!service?.employeeData?.durationFrom) {
				employeeData.durationFrom = i18next.t('loc:Toto pole je povinné')
			}

			if (service?.variableDuration && !service?.employeeData?.durationTo) {
				employeeData.durationTo = i18next.t('loc:Toto pole je povinné')
			}

			if (!service?.employeeData?.priceFrom) {
				employeeData.priceFrom = i18next.t('loc:Toto pole je povinné')
			}

			if (service?.variablePrice && !service?.employeeData?.priceTo) {
				employeeData.priceTo = i18next.t('loc:Toto pole je povinné')
			}

			if (service?.variableDuration && service?.employeeData?.durationTo && service?.employeeData?.durationFrom > service?.employeeData?.durationTo) {
				employeeData.durationFrom = i18next.t('loc:Chybný rozsah')
				employeeData.durationTo = i18next.t('loc:Chybný rozsah')
			}

			if (service?.variablePrice && service?.employeeData?.priceTo && service?.employeeData?.priceFrom > service?.employeeData?.priceTo) {
				employeeData.priceFrom = i18next.t('loc:Chybný rozsah')
				employeeData.priceTo = i18next.t('loc:Chybný rozsah')
			}

			servicesErrors[index] = {
				employeeData
			}
		})

		errors.services = servicesErrors
	}

	return errors
}
