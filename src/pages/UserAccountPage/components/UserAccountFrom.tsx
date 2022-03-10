import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Form, Row, Space } from 'antd'

// enums
import { FORM } from '../../../utils/enums'

// types
import { ILoginForm } from '../../../types/interfaces'

// validate
import validateUserAccountForm from './validateUserAccountForm'
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'

type ComponentProps = {}

type Props = InjectedFormProps<ILoginForm, ComponentProps> & ComponentProps

const UserAccountForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, form } = props

	return (<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
		<Field component={InputField} label={t('loc:Meno')} placeholder={t('loc:Zadajte meno')} name={'firstName'} size={'large'} />
		<Field component={InputField} label={t('loc:Priezvisko')} placeholder={t('loc:Zadajte priezvisko')} name={'lastName'} size={'large'} />
		<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
		<Row>
			<Field component={SelectField} label={t('loc:Predvoľba')} placeholder={t('loc:Vyber predvoľbu')} options={[{ label: 'Slovak', value: 'sk' }, { label: 'Czech', value: 'cz' }]} name={'phonePrefixCountryCode'} size={'large'} />
			<Field component={InputField} label={t('loc:Telefónne číslo')} placeholder={t('loc:Zadajte telefónne číslo')} name={'phone'} size={'large'} />
		</Row>
	</Form>)
}

const form = reduxForm<ILoginForm, ComponentProps>({
	form: FORM.USER_ACCOUNT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateUserAccountForm
})(UserAccountForm)

export default form
