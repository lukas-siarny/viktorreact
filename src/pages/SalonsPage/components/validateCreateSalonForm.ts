import { get } from 'lodash'
import { FormErrors } from 'redux-form'
import i18next from 'i18next'

// types
// eslint-disable-next-line import/no-cycle
import { TempSalonFormDefinition } from './CreateSalonForm'
import { AddressInputFields } from '../../../components/AddressFields'

export default (values: TempSalonFormDefinition) => {
	const errors: FormErrors<TempSalonFormDefinition> = {}

	const addressValues: AddressInputFields = { ...values }

	// NOTE: if property exists in formValues then check value
	// eslint-disable-next-line no-restricted-syntax
	for (const property of Object.keys(addressValues)) {
		if (!get(values, property)) {
			errors.address = i18next.t('loc:Upresnite adresu vo vyhľadávaní alebo priamo v mape')
			break
		}
	}

	return errors
}
