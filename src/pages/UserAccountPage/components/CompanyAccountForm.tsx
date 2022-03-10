import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'antd'

// enums
import { FORM } from '../../../utils/enums'

// types
import { ILoginForm } from '../../../types/interfaces'

// validate
import validateCompanyAccount from './validateCompanyAccount'
import InputField from '../../../atoms/InputField'

type ComponentProps = {}

type Props = InjectedFormProps<ILoginForm, ComponentProps> & ComponentProps

const CompanyAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, form } = props

	return (<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
		<Field component={InputField} label={t('loc:Firma')} placeholder={t('loc:Zadajte firmu')} name={'companyName'} size={'large'} />
		<Field component={InputField} label={t('loc:Ulica')} placeholder={t('loc:Zadajte ulicu')} name={'street'} size={'large'} />
		<Field component={InputField} label={t('loc:PSČ')} placeholder={t('loc:Zadajte smerovacie číslo')} name={'zipCode'} size={'large'} />
		<Field component={InputField} label={t('loc:Mesto')} placeholder={t('loc:Zadajte mesto')} name={'city'} size={'large'} />
	</Form>)
}

const form = reduxForm<ILoginForm, ComponentProps>({
	form: FORM.COMPANY_ACCOUNT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateCompanyAccount
})(CompanyAccountForm)

export default form
