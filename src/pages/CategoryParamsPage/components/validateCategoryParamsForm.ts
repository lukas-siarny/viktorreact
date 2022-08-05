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
		const enteredValues = values.values

		const filledValues = enteredValues.filter((item) => item.value)

		if (filledValues.length < 1) {
			valuesErrors[0] = { value: i18next.t('loc:Toto pole je povinné') }
		} else {
			const onlyValues = enteredValues.map((item) => item.value)

			const duplicates: number[] = []

			enteredValues.forEach((item, index) => {
				if (onlyValues.indexOf(item.value) !== index) {
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

		if (!localizedValues || localizedValues.length < 1 || !localizedValues[0].value) {
			valuesErrors[0] = { value: i18next.t('loc:Toto pole je povinné') }
		}

		errors.localizedValues = valuesErrors
	}

	return errors
}
