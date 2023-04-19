import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

// atoms
import InputField from '../../atoms/InputField'

// interfaces
import { IForgotPasswordForm } from '../../types/interfaces'

// utils
import { FORM, SUBMIT_BUTTON_ID } from '../../utils/enums'

// validate
import validateForgotPasswordForm from './validateForgotPasswordForm'
import { formFieldID } from '../../utils/helper'

type ComponentProps = {}

type Props = InjectedFormProps<IForgotPasswordForm, ComponentProps> & ComponentProps

const ForgottenPasswordForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props

	return (
		<Form layout='vertical' onSubmitCapture={handleSubmit}>
			<p className={'base-regular mb-7'}>{t('loc:Na vašu adresu odošleme link na obnovenie hesla. Prosím zadajte svoju adresu.')}</p>
			<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} focused />
			<Button
				id={formFieldID(FORM.FORGOT_PASSWORD, SUBMIT_BUTTON_ID)}
				className='noti-btn'
				block
				size='large'
				type='primary'
				htmlType='submit'
				disabled={submitting}
				loading={submitting}
			>
				{t('loc:Odoslať email')}
			</Button>
		</Form>
	)
}

const form = reduxForm<IForgotPasswordForm, ComponentProps>({
	form: FORM.FORGOT_PASSWORD,
	forceUnregisterOnUnmount: true,
	touchOnChange: false,
	touchOnBlur: true,
	destroyOnUnmount: true,
	validate: validateForgotPasswordForm
})(ForgottenPasswordForm)

export default form
