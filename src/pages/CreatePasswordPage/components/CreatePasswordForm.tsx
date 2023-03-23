import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// atoms
import InputPasswordField from '../../../atoms/InputPasswordField'
import InputField from '../../../atoms/InputField'

// utils
import { CHANGE_PASSWORD_NEW_LINK_BUTTON_ID, FORM, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID, showErrorNotification } from '../../../utils/helper'

// assets
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon-16.svg'

// schema
import { ICreatePasswordForm, validationCreatePasswordFn } from '../../../schemas/password'

type ComponentProps = {
	showForgottenPasswordModal: () => void
}

type Props = InjectedFormProps<ICreatePasswordForm, ComponentProps> & ComponentProps

const CreatePasswordForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, showForgottenPasswordModal } = props

	return (
		<Form layout={'vertical'} className={'form h-full flex flex-col w-full'} onSubmitCapture={handleSubmit}>
			<h3 className='mb-4'>{t('loc:Nastavenie hesla')}</h3>
			<Field
				component={InputPasswordField}
				label={t('loc:Heslo')}
				placeholder={t('loc:Zadajte heslo')}
				type={'password'}
				size={'large'}
				name={'password'}
				required
				tooltip={{ title: t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak'), icon: <InfoIcon /> }}
			/>
			<Field
				component={InputField}
				label={t('loc:Zopakujte heslo')}
				placeholder={t('loc:Zopakujte nové heslo')}
				name='confirmPassword'
				type='password'
				size={'large'}
				required
			/>
			<Row justify={'end'} className=''>
				<Button
					id={formFieldID(FORM.CREATE_PASSWORD, CHANGE_PASSWORD_NEW_LINK_BUTTON_ID)}
					className={'p-0 font-medium h-auto whitespace-normal max-w-full'}
					style={{ minHeight: 16 }}
					type={'link'}
					htmlType={'button'}
					onClick={showForgottenPasswordModal}
				>
					{t('loc:Vyžiadať nový odkaz pre nastavenie hesla')}
				</Button>
			</Row>
			<div className='mt-6'>
				<Button
					id={formFieldID(FORM.CREATE_PASSWORD, SUBMIT_BUTTON_ID)}
					type={'primary'}
					block
					className={`noti-btn m-regular mb-4`}
					htmlType={'submit'}
					disabled={submitting}
					loading={submitting}
				>
					{t('loc:Nastaviť heslo')}
				</Button>
			</div>
		</Form>
	)
}

const form = reduxForm<ICreatePasswordForm, ComponentProps>({
	form: FORM.CREATE_PASSWORD,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validationCreatePasswordFn
})(CreatePasswordForm)

export default form
