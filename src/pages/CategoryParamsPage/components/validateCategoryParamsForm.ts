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

	if (!values.valueType) {
		errors.valueType = i18next.t('loc:Toto pole je povinné')
	} else if (values.valueType === PARAMETERS_VALUE_TYPES.TIME) {
		const valuesErrors: any = {}
		const enteredValues = values.values
		console.log('🚀 ~ file: validateCategoryParamsForm.ts ~ line 22 ~ enteredValues', enteredValues)

		const filledValues = enteredValues.filter((item) => item.value)

		if (filledValues.length < 1) {
			valuesErrors[0] = { value: i18next.t('loc:Toto pole je povinné') }
		}

		if (enteredValues.length > 1) {
			const hasDuplicate = enteredValues
				.slice(0, -1)
				.map((item) => item.value)
				.includes(enteredValues[enteredValues.length - 1].value)

			if (hasDuplicate) {
				valuesErrors[enteredValues.length - 1] = { value: i18next.t('loc:Táto hodnota už je zadaná') }
			}
		}

		errors.values = valuesErrors
	}

	return errors
}
