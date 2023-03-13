import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Space, Row, Form, Button } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// atoms
import InputPasswordField from '../../../atoms/InputPasswordField'
import InputField from '../../../atoms/InputField'

// interfaces
import { ILoginForm } from '../../../types/interfaces'

// utils
import { FORGOT_PASSWORD_BUTTON_ID, FORM, HELP_BUTTON_ID, SIGNUP_BUTTON_ID, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID, showErrorNotification } from '../../../utils/helper'

// validate
import validateLoginForm from './validateLoginForm'

type ComponentProps = {
	showForgottenPasswordModal: () => void
}

type Props = InjectedFormProps<ILoginForm, ComponentProps> & ComponentProps

const LoginForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, showForgottenPasswordModal } = props

	return (
		<Form layout={'vertical'} className={'form h-full w-full'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction={'vertical'} size={26}>
				<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
				<Field component={InputPasswordField} label={t('loc:Heslo')} placeholder={t('loc:Zadajte heslo')} type={'password'} size={'large'} name={'password'} required />
			</Space>
			<Row justify={'end'}>
				<Button
					id={formFieldID(FORM.LOGIN, FORGOT_PASSWORD_BUTTON_ID)}
					className={'p-0 font-medium h-auto whitespace-normal max-w-full'}
					style={{ minHeight: 16 }}
					onClick={showForgottenPasswordModal}
					type={'link'}
					htmlType={'button'}
				>
					{t('loc:Zabudnuté heslo')}
				</Button>
			</Row>
			<div className='mt-6'>
				<Button
					id={formFieldID(FORM.LOGIN, SUBMIT_BUTTON_ID)}
					type={'primary'}
					block
					className={`noti-btn m-regular mb-4`}
					htmlType={'submit'}
					disabled={submitting}
					loading={submitting}
				>
					{t('loc:Prihlásiť sa')}
				</Button>
				<span className='flex items-center md:justify-center text-notino-black font-medium'>
					{t('loc:Ešte nemáte účet?')}
					<Link to={`${t('paths:signup')}`} className='inline-block'>
						<Button id={formFieldID(FORM.LOGIN, SIGNUP_BUTTON_ID)} className='p-0 ml-1 font-medium' type={'link'} htmlType={'button'}>
							{t('loc:Registrovať sa')}
						</Button>
					</Link>
				</span>
				<span className={'flex items-center md:justify-center font-medium pb-6'}>
					<Link to={`${t('paths:contact')}`} className='inline-block'>
						<Button id={formFieldID(FORM.LOGIN, HELP_BUTTON_ID)} className='p-0 font-medium' type={'link'} htmlType={'button'}>
							{t('loc:Potrebujete pomôcť?')}
						</Button>
					</Link>
				</span>
			</div>
		</Form>
	)
}

const form = reduxForm<ILoginForm, ComponentProps>({
	form: FORM.LOGIN,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateLoginForm
})(LoginForm)

export default form
