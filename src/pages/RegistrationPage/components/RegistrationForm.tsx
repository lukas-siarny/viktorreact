import React, { FC, useCallback, useEffect } from 'react'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { Space, Row, Form, Button, Col } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

// atoms
import InputField from '../../../atoms/InputField'
import InputPasswordField from '../../../atoms/InputPasswordField'
import SwitchField from '../../../atoms/SwitchField'
import PhonePrefixField from '../../../atoms/PhonePrefixField'

// // interfaces
import { IRegistrationForm } from '../../../types/interfaces'

// // utils
import { FORM, ENUMERATIONS_KEYS } from '../../../utils/enums'

// validate
// eslint-disable-next-line import/no-cycle
import validateRegistrationForm from './validateRegistrationForm'

// reducers
import { RootState } from '../../../reducers'
import { getEnumerations } from '../../../reducers/enumerations/enumerationActions'

type ComponentProps = {}

type Props = InjectedFormProps<IRegistrationForm, ComponentProps> & ComponentProps
// type Props = {}

// const opitons = [
// 	{
// 		key: '1',
// 		label: '+421',
// 		value: 'SK',
// 		flag: 'https://flagcdn.com/h20/sk.png'
// 	},
// 	{
// 		key: '2',
// 		label: '+420',
// 		value: 'CZ',
// 		flag: 'https://flagcdn.com/h20/cz.png'
// 	}
// ]

const RegistrationForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, submitting, form } = props
	const prefixOptions = useSelector((state: RootState) => state.enumerationsStore.countries)
	const dispatch = useDispatch()

	const onSearchCountries = useCallback(() => dispatch(getEnumerations(ENUMERATIONS_KEYS.COUNTRIES)), [])

	return (
		<Form layout={'vertical'} className={'form h-full'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction={'vertical'} size={26}>
				<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
				<Field component={InputPasswordField} label={t('loc:Heslo')} placeholder={t('loc:Zadajte heslo')} type={'password'} size={'large'} name={'password'} />

				<Form.Item label='Telefón'>
					<Row gutter={8}>
						<Col flex='102px'>
							<Field
								component={PhonePrefixField}
								name={'phonePrefixCountryCode'}
								size={'large'}
								options={prefixOptions.enumerationsOptions}
								onFocus={onSearchCountries}
							/>
						</Col>
						<Col flex='auto'>
							<Field component={InputField} placeholder={t('loc:Zadajte telefón')} name={'phone'} size={'large'} />
						</Col>
					</Row>
				</Form.Item>

				{/* <Row>
					<Field
						component={PhonePrefixField}
						label={t('loc:Prefix')}
						placeholder={t('loc:Zadajte predvolbu')}
						name={'phonePrefixCountryCode'}
						size={'large'}
						options={opitons}
					/>
					<Field component={InputField} label={t('loc:Telefón')} placeholder={t('loc:Zadajte telefón')} name={'phone'} size={'large'} />
				</Row> */}
				{/* <Field component={PhonePrefixField} label={t('loc:Prefix')} placeholder={t('loc:Zadajte predvolbu')} name={'phonePrefixCountryCode'} size={'large'} /> */}
				{/* <Field
					component={InputField}
					label={t('loc:Telefón')}
					placeholder={t('loc:Zadajte telefón')}
					name={'phone'}
					size={'large'}
					// addonBefore={
					// 	<Field component={PhonePrefixField} placeholder={t('loc:Zadajte predvolbu')} name={'phonePrefixCountryCode'} size={'large'} />
					// }
				/> */}

				<Field component={SwitchField} label={t('loc:GDPR Lorem i')} name={'gdpr'} size={'large'} />
				<Field component={SwitchField} name={'gtc'} label='gtc asdf asdfasd fadf s' size={'large'} />
				<Field component={SwitchField} name={'marketing'} label='marketing asdf asdfasd fadf s' size={'large'} />
			</Space>
			<Button type={'primary'} block size={'large'} className={`noti-btn m-regular mb-4`} htmlType={'submit'} disabled={submitting} loading={submitting}>
				{t('loc:Registrovať')}
			</Button>
			{/* <div className='absolute bottom-0 left-0 right-0'>
				<Button type={'primary'} block size={'large'} className={`noti-btn m-regular mb-4`} htmlType={'submit'} disabled={submitting} loading={submitting}>
					{t('loc:Registrovať')}
				</Button>



				<span className='table m-auto text-notino-black'>
					{t('loc:Už ste registrovaný? ')}
					<Link to='paths:zabudnute-heslo' className='inline-block'>
						<Button style={{ paddingRight: 0 }} type={'link'} htmlType={'button'}>
							{t('loc:Prihlásiť sa')}
						</Button>
					</Link>
				</span>
			</div> */}
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
