import { FormErrors } from 'redux-form'
import i18next from 'i18next'

export default (values: any) => {
	const errors: FormErrors<any> = {}

	if (!values?.nameLocalizations?.[0]?.value) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		errors.nameLocalizations = [{ value: i18next.t('loc:Toto pole je povinné') }]
	}

	if (values?.level === 0 && !values?.image) {
		errors.image = i18next.t('loc:Toto pole je povinné')
	}

	return errors
}
