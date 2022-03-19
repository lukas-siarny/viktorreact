import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Form, Row } from 'antd'
import { useTranslation } from 'react-i18next'

// types
import { ICreatePasswordForm } from '../../../types/interfaces'

// atoms
import InputPasswordField from '../../../atoms/InputPasswordField'
import InputField from '../../../atoms/InputField'

// utils
import { FORM } from '../../../utils/enums'

// assets
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon-16.svg'

// validate
// eslint-disable-next-line import/no-cycle
import validateCreatePasswordForm from './validateCreatePasswordForm'

type ComponentProps = {
	showForgottenPasswordModal: () => void
}

type Props = InjectedFormProps<ICreatePasswordForm, ComponentProps> & ComponentProps

const CreatePasswordForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, showForgottenPasswordModal } = props

	return (
		<Form layout={'vertical'} className={'form h-full max-w-48 flex flex-col'} onSubmitCapture={handleSubmit}>
			<h3>{t('loc:Nastavenie hesla')}</h3>
			<Field
				component={InputPasswordField}
				label={t('loc:Heslo')}
				placeholder={t('loc:Zadajte heslo')}
				type={'password'}
				size={'large'}
				name={'password'}
				tooltip={{ title: t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak'), icon: <InfoIcon /> }}
			/>
			<Field component={InputField} label={t('loc:Zopakujte heslo')} placeholder={t('loc:Zopakujte nové heslo')} name='confirmPassword' type='password' size={'large'} />
			<Row justify={'end'} className=''>
				<Button style={{ paddingRight: 0 }} className={'noti-btn text-notino-black'} onClick={showForgottenPasswordModal} type={'link'} htmlType={'button'}>
					{t('loc:Vyžiadať nový odkaz pre nastavenie hesla')}
				</Button>
			</Row>
			<div className='mt-auto'>
				<Button type={'primary'} block size={'large'} className={`noti-btn m-regular mb-4`} htmlType={'submit'} disabled={submitting} loading={submitting}>
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
	validate: validateCreatePasswordForm
})(CreatePasswordForm)

export default form
