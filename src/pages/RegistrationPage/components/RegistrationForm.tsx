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

// schema
import { IRegistrationForm, validationRegistrationFn } from '../../../schemas/registration'

// utils
import { FORM, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { formFieldID, showErrorNotification } from '../../../utils/helper'

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
			<PhoneWithPrefixField
				label={'Telefón'}
				placeholder={t('loc:Zadajte telefón')}
				size={'large'}
				prefixName={'phonePrefixCountryCode'}
				phoneName={'phone'}
				formName={FORM.REGISTRATION}
				required
			/>
			<Field
				className='noti-registration-switch'
				component={SwitchField}
				name={'agreeGDPR'}
				customLabel={
					<div className='text-notino-grayDark text-xs md:text-sm'>
						<span>{`${t('loc:Prehlasujem, že som sa oboznámil s')} `}</span>
						<a
							onClick={(e) => e.stopPropagation()}
							className='text-notino-grayDark hover:text-notino-pink'
							href={t('loc:LINK podmienky používania')}
							target='_blank'
							rel='noreferrer'
						>
							<u>{t('loc:Podmienkami používania')}</u>
						</a>
						{` ${t('loc:a')} `}
						<a
							onClick={(e) => e.stopPropagation()}
							className='text-notino-grayDark hover:text-notino-pink'
							href={t('loc:LINK ochrana osobných údajov')}
							target='_blank'
							rel='noreferrer'
						>
							<u>{t('loc:Zásadami spracovania osobných údajov')}</u>
						</a>
						<span>{` ${t('loc:a chcem sa zaregistrovať do programu Notino Partner.')}`}</span>
					</div>
				}
				size={'large'}
			/>
			<Field
				className='noti-registration-switch marketing-field'
				component={SwitchField}
				name={'marketing'}
				customLabel={
					<div className='text-notino-grayDark text-xs md:text-sm w-11/12'>
						{t('loc:V súvislosti s touto registráciou si neprajem dostávať informácie o novinkách a akciách.')}
					</div>
				}
				size={'large'}
				tooltipText={
					<div>
						{`${t(
							'loc:Spoločnosť Notino, s.r.o. je oprávnená kontaktovať registrovaných užívateľov z dôvodu priameho marketingu. Aby sme zamedzili nevyžiadanej pošte, potvrďte, ak toto spracovanie namietate. Viac informácii v'
						)} `}
						<a
							onClick={(e) => e.stopPropagation()}
							className='text-notino-pink font-semibold'
							href={t('loc:LINK ochrana osobných údajov')}
							target='_blank'
							rel='noreferrer'
						>
							{t('loc:zásadách zpracovania osobných údajov.')}
						</a>
					</div>
				}
			/>
			<div className='mt-2'>
				<Button
					id={formFieldID(FORM.REGISTRATION, SUBMIT_BUTTON_ID)}
					type={'primary'}
					block
					className={`noti-btn m-regular mb-1 sm:mb-4`}
					htmlType={'submit'}
					disabled={submitting}
					loading={submitting}
				>
					{t('loc:Registrovať')}
				</Button>

				<span className='flex items-center md:justify-center text-notino-black font-medium'>
					{`${t('loc:Už ste registrovaný?')} `}
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
	validate: validationRegistrationFn
})(RegistrationForm)

export default form
