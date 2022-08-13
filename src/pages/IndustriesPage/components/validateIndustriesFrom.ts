import { FormErrors } from 'redux-form'
import i18next from 'i18next'
import { IIndustriesForm } from '../../../types/interfaces'

export default (values: IIndustriesForm) => {
	const errors: FormErrors<any> = {}

	if (values?.categoryIDs?.length < 1) {
		errors.categoryIDs = i18next.t('loc:Vyberte aspoň jedno odvetvie')
	}

	return errors
}
