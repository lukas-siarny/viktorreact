import React, { FC } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Form, Button } from 'antd'
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
import SwitchLabel from './SwitchLabel'

// // interfaces
import { IRegistrationForm } from '../../../types/interfaces'

// // utils
import { FORM, GDPR_URL, GTC_URL, MARKETING_URL } from '../../../utils/enums'
import { showErrorNotification } from '../../../utils/helper'

// validate
// eslint-disable-next-line import/no-cycle
import validateRegistrationForm from './validateRegistrationForm'

type ComponentProps = {}

type Props = InjectedFormProps<IRegistrationForm, ComponentProps> & ComponentProps

const RegistrationForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting } = props
	return (
		<Form layout={'vertical'} className={'form registration-form max-w-80 flex flex-col'} onSubmitCapture={handleSubmit}>
			<h3 className='mb-4'>{t('loc:Registrácia')}</h3>
			<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} required />
			<Field
				component={InputPasswordField}
				label={t('loc:Heslo')}
				placeholder={t('loc:Zadajte heslo')}
				type={'password'}
				size={'large'}
				name={'password'}
				required
				tooltip={{ title: t('loc:Aspoň 8 znakov, 1 číslo, 1 veľký, 1 malý a 1 špeciálny znak'), icon: <InfoIcon width={14} height={14} /> }}
			/>
			{/* TODO: <Field component={InputField} label={t('loc:Zopakujte heslo')} placeholder={t('loc:Zopakujte nové heslo')} name={'confirmPassword'} type={'password'} size={'large'} /> */}
			<PhoneWithPrefixField label={'Telefón'} placeholder={t('loc:Zadajte telefón')} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} required />

			<Field
				className='noti-registration-switch'
				component={SwitchField}
				customLabel={<SwitchLabel label={t('loc:Vyhlasujem, že som sa oboznámil so')} anchorText={t('loc:Zásadami spracovania osobných údajov')} href={GDPR_URL} />}
				name={'gdpr'}
				size={'large'}
			/>
			<Field
				className='noti-registration-switch'
				component={SwitchField}
				name={'gtc'}
				customLabel={<SwitchLabel label={t('loc:Vyhlasujem, že som sa oboznámil s')} anchorText={t('loc:Obchodnými podmienkami')} href={GTC_URL} />}
				size={'large'}
			/>
			<Field
				className='noti-registration-switch marketing-field'
				component={SwitchField}
				name={'marketing'}
				customLabel={<SwitchLabel label={t('loc:Udeľujem súhlas so spracúvaním osobných údajov na')} anchorText={t('loc:Marketingové účely')} href={MARKETING_URL} />}
				size={'large'}
			/>
			<div className='mt-2'>
				<Button type={'primary'} block className={`noti-btn m-regular mb-1 sm:mb-4`} htmlType={'submit'} disabled={submitting} loading={submitting}>
					{t('loc:Registrovať')}
				</Button>

				<span className='flex items-center md:justify-center text-notino-black font-medium'>
					{t('loc:Už ste registrovaný? ')}
					<Link to={`${t('paths:login')}`}>
						<Button className='p-0 ml-1 font-medium' type={'link'} htmlType={'button'}>
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
	onSubmitFail: showErrorNotification,
	validate: validateRegistrationForm
})(RegistrationForm)

export default form
