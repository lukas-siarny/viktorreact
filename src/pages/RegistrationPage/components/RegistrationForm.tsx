import React, { FC, useCallback, useEffect } from 'react'
import { Field, reduxForm, InjectedFormProps, FieldArray, Fields } from 'redux-form'
import { Space, Row, Form, Button, Col } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// assets
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon-16.svg'

// atoms
import InputField from '../../../atoms/InputField'
import InputPasswordField from '../../../atoms/InputPasswordField'
import SwitchField from '../../../atoms/SwitchField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// // interfaces
import { IRegistrationForm } from '../../../types/interfaces'

// // utils
import { FORM } from '../../../utils/enums'

// validate
// eslint-disable-next-line import/no-cycle
import validateRegistrationForm from './validateRegistrationForm'

type ComponentProps = {}

type Props = InjectedFormProps<IRegistrationForm, ComponentProps> & ComponentProps

const RegistrationForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props
	return (
		<Form layout={'vertical'} className={'form h-full max-w-48 flex flex-col'} onSubmitCapture={handleSubmit}>
			<h3>{t('loc:Registrácia')}</h3>
			<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
			<Field
				component={InputPasswordField}
				label={t('loc:Heslo')}
				placeholder={t('loc:Zadajte heslo')}
				type={'password'}
				size={'large'}
				name={'password'}
				tooltip={{ title: t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak'), icon: <InfoIcon /> }}
			/>
			<PhoneWithPrefixField label={'Telefón'} placeholder={t('loc:Zadajte telefón')} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} />

			<Field
				className='noti-registration-switch'
				component={SwitchField}
				longLabel={t('loc:GDPR Lorem ipsum dolor sit amet, consectetur adipiscing elit')}
				name={'gdpr'}
				size={'large'}
			/>
			<Field
				className='noti-registration-switch'
				component={SwitchField}
				name={'gtc'}
				longLabel='Obchodne Lorem ipsum dolor sit amet, consectetur adipiscing elit'
				size={'large'}
			/>
			<Field
				className='noti-registration-switch'
				component={SwitchField}
				name={'marketing'}
				longLabel='Marketing Lorem ipsum dolor sit amet, consectetur adipiscing elit'
				size={'large'}
			/>
			<div className='mt-auto'>
				<Button type={'primary'} block size={'large'} className={`noti-btn m-regular mb-4`} htmlType={'submit'} disabled={submitting} loading={submitting}>
					{t('loc:Registrovať')}
				</Button>

				<span className='flex items-center justify-center text-notino-black'>
					{t('loc:Už ste registrovaný? ')}
					<Link to='paths:zabudnute-heslo'>
						<Button className='p-0 ml-1' type={'link'} htmlType={'button'}>
							{t('loc:Prihlásiť sa')}
						</Button>
					</Link>
				</span>
			</div>
		</Form>
	)
}

const form = reduxForm<IRegistrationForm, ComponentProps>({
	form: FORM.REGISTRATION,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	validate: validateRegistrationForm
})(RegistrationForm)

export default form
