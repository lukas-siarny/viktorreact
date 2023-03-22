import { FormErrors } from 'redux-form'
import i18next from 'i18next'

import { ICategoryParamForm } from '../../../types/interfaces'
import { PARAMETERS_VALUE_TYPES } from '../../../utils/enums'

export default (values: ICategoryParamForm) => {
	const errors: FormErrors<ICategoryParamForm> = {}

	if (!values.nameLocalizations?.[0]?.value) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		errors.nameLocalizations = [{ value: i18next.t('loc:Toto pole je povinné') }]
	}

	const valuesErrors: any = {}

	if (!values.valueType) {
		errors.valueType = i18next.t('loc:Toto pole je povinné')
	} else if (values.valueType === PARAMETERS_VALUE_TYPES.TIME) {
		const enteredValues = values.values.filter((item) => item.value)

		if (enteredValues.length < 1) {
			valuesErrors[0] = { value: i18next.t('loc:Toto pole je povinné') }
		} else {
			const onlyValues = enteredValues.map((item) => item.value)

			const duplicates: number[] = []

			enteredValues.forEach((item, index) => {
				if (item.value && onlyValues.indexOf(item.value) !== index) {
					duplicates.push(index)
				}
			})

			duplicates.forEach((index: number) => {
				valuesErrors[index] = { value: i18next.t('loc:Táto hodnota už je zadaná') }
			})
		}

		errors.values = valuesErrors
	} else {
		const { localizedValues } = values

		if (!localizedValues || localizedValues.length < 1 || !localizedValues[0] || !localizedValues[0].valueLocalizations || !localizedValues[0].valueLocalizations[0]?.value) {
			valuesErrors[0] = { valueLocalizations: [{ value: i18next.t('loc:Toto pole je povinné') }] }
		} else {
			const missingDefaultLanguage: number[] = []

			localizedValues.forEach((localizedValue, rootIndex) => {
				if (localizedValue && localizedValue.valueLocalizations) {
					valuesErrors[rootIndex] = { valueLocalizations: [{ value: undefined }] }

					const defaultValueIsEmpty = !localizedValue.valueLocalizations[0].value
					const otherValueIsFilled = localizedValue.valueLocalizations.some((entry, index) => index > 0 && entry.value)

					if (defaultValueIsEmpty && otherValueIsFilled) {
						missingDefaultLanguage.push(rootIndex)
					}
				}
			})

			missingDefaultLanguage.forEach((index: number) => {
				valuesErrors[index].valueLocalizations[0] = { value: i18next.t('loc:Toto pole je povinné') }
			})
		}
		errors.localizedValues = valuesErrors
	}

	return errors
}
