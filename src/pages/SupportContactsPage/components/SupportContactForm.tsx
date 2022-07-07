import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Space } from 'antd'
import { useSelector } from 'react-redux'
import { get } from 'lodash'

// components
import AddressFields from '../../../components/AddressFields'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import OpeningHours from '../../../components/OpeningHours/OpeningHours'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'

// utils
import { showErrorNotification } from '../../../utils/helper'
import { FORM, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'

// types
import { ISupportContactForm } from '../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

// reducers
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as InstagramIcon } from '../../../assets/icons/social-instagram-icon.svg'
import { ReactComponent as FacebookIcon } from '../../../assets/icons/social-facebook-icon.svg'
import { ReactComponent as CreditCardIcon } from '../../../assets/icons/credit-card-outlined-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as PhoneIcon } from '../../../assets/icons/phone-2-icon.svg'
import { ReactComponent as TimerIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as UserIcon } from '../../../assets/icons/user-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as SocialIcon } from '../../../assets/icons/social-24.svg'
import { ReactComponent as CompanyIcon } from '../../../assets/icons/companies-icon.svg'

type ComponentProps = {
	openNoteModal: Function
	disabledForm: boolean
	supportContactID?: number
}

type Props = InjectedFormProps<ISupportContactForm, ComponentProps> & ComponentProps

const SupportContactForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, change, openNoteModal, supportContactID, disabledForm } = props
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.SALON]?.values)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={36}>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<PhoneIcon width={20} height={20} className={'text-notino-black mr-2'} />
							{t('loc:Kontaktné údaje')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<PhoneWithPrefixField
							label={'Telefón'}
							placeholder={t('loc:Zadajte telefón')}
							size={'large'}
							prefixName={'phonePrefixCountryCode'}
							phoneName={'phone'}
							disabled={disabledForm}
							formName={FORM.SALON}
							required
						/>
						<Field
							className={'w-full'}
							component={InputField}
							label={t('loc:Email')}
							placeholder={t('loc:Zadajte email')}
							name={'email'}
							size={'large'}
							disabled={disabledForm}
							required
						/>
						<Field
							component={AddressFields}
							inputValues={{
								latitude: get(formValues, 'latitude'),
								longitude: get(formValues, 'longitude'),
								city: get(formValues, 'city'),
								street: get(formValues, 'street'),
								streetNumber: get(formValues, 'streetNumber'),
								zipCode: get(formValues, 'zipCode'),
								country: get(formValues, 'country')
							}}
							changeFormFieldValue={change}
							disabled={disabledForm}
							name={'address'}
						/>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<TimerIcon width={24} height={24} className={'text-notino-black mr-2'} /> {t('loc:Otváracie hodiny')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field
							className={'mb-0'}
							component={SwitchField}
							label={t('loc:Pon - Pi rovnaké otváracie hodiny')}
							name={'sameOpenHoursOverWeek'}
							size={'middle'}
							disabled={disabledForm}
						/>
						<FieldArray component={OpeningHours} name={'openingHours'} props={{ disabled: disabledForm }} />
						{supportContactID && (
							<Button type={'primary'} size={'middle'} className={`noti-btn w-1/4 mb-6 mt-3`} onClick={() => openNoteModal()} disabled={disabledForm}>
								{t('loc:Pridať poznámku')}
							</Button>
						)}
					</Col>
				</Row>
			</Space>
		</Form>
	)
}

const form = reduxForm<ISupportContactForm, ComponentProps>({
	form: FORM.SUPPORT_CONTACT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateSalonForm
})(SupportContactForm)

export default form
