import React, { FC } from 'react'
import { Space, Row, Button, Form } from 'antd'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// atoms
import InputField from '../../../atoms/InputField'
import { ReactComponent as BackIcon } from '../../../assets/icons/back-icon.svg'
// interface
import { IForgotPasswordForm } from '../../../types/interfaces'

// utils
import { FORM } from '../../../utils/enums'
import { getPath } from '../../../utils/history'

// validate
import validateForgotPasswordForm from './validateForgotPasswordForm'

type ComponentProps = {}

type Props = InjectedFormProps<IForgotPasswordForm, ComponentProps> & ComponentProps

const ForgotPasswordForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props
	return (
		<Form layout='vertical' className={'forgot-password-form '} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={20}>
				<Link to={getPath(t('paths:login'))}>
					<Button icon={<BackIcon />} type={'link'} className={'noti-btn'} htmlType={'button'}>
						{t('loc:Späť na prihlásenie')}
					</Button>
				</Link>
				<h3>{t('loc:Zabudnuté heslo')}</h3>
				<Row justify='space-between' align='middle'>
					<span className={'text-gray-600'}>
						{t(
							'loc:Zadajte e-mailovú adresu, na ktorú máte registrovaný účet. Skontrolujte svoju e-mailovú schránku a kliknutím na odkaz v e-maile budete presmerovaný na stránku pre obnovenie hesla.'
						)}
					</span>
				</Row>
				<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name='email' required />
				<Button block size='large' type='primary' className={'noti-btn square'} htmlType='submit' disabled={submitting} loading={submitting}>
					{t('loc:Odoslať email')}
				</Button>
			</Space>
		</Form>
	)
}

const form = reduxForm<IForgotPasswordForm, ComponentProps>({
	form: FORM.FORGOT_PASSWORD,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateForgotPasswordForm
})(ForgotPasswordForm)

export default form
