import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// atoms
import InputField from '../../atoms/InputField'

// interfaces
import { IForgotPasswordForm } from '../../types/interfaces'

// utils
import { FORM } from '../../utils/enums'

// validate
import validateForgotPasswordForm from './validateForgotPasswordForm'

type ComponentProps = {}

type Props = InjectedFormProps<IForgotPasswordForm, ComponentProps> & ComponentProps

const ForgottenPasswordForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<p className={'base-regular mb-7'}>{t('loc:Na vašu adresu odošleme link na obnovenie hesla. Prosím zadajte svoju adresu.')}</p>
			<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
			<Button className='noti-btn' block size='large' type='primary' htmlType='submit' disabled={submitting} loading={submitting}>
				{t('loc:Odoslať email')}
			</Button>
		</Form>
	)
}

const form = reduxForm<IForgotPasswordForm, ComponentProps>({
	form: FORM.FORGOT_PASSWORD,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateForgotPasswordForm
})(ForgottenPasswordForm)

export default form
