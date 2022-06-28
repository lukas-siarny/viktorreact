import React, { FC, useCallback } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { get } from 'lodash'

// components
import i18next from 'i18next'
import OpeningHours from './OpeningHours'
import AddressFields from '../../../components/AddressFields'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// utils
import { showErrorNotification } from '../../../utils/helper'
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, PERMISSION, VALIDATION_MAX_LENGTH, ENUMERATIONS_KEYS, FILTER_ENTITY } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import searchWrapper from '../../../utils/filters'

// types
import { ISalonForm } from '../../../types/interfaces'

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
	changeSalonVisibility: (visible: boolean) => void
	publishSalon: (published: boolean) => void
	switchDisabled: boolean
	disabledForm: boolean
	salonID?: number
}

type Props = InjectedFormProps<ISalonForm, ComponentProps> & ComponentProps

const SalonForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, change, openNoteModal, changeSalonVisibility, publishSalon, switchDisabled, salonID, disabledForm } = props
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.SALON]?.values)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={36}>
				<Row>
					<Col span={24}>
						<div className={'flex justify-between w-full items-center'}>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<InfoIcon className={'text-notino-black mr-2'} />
								{t('loc:Základné údaje')}
							</h3>
							{salonID ? (
								<div className={'flex justify-between w-1/2'}>
									<Permissions
										allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]}
										render={(hasPermission, { openForbiddenModal }) => (
											<Field
												className={'mt-2 mb-2 w-12/25'}
												component={SwitchField}
												label={t('loc:Viditeľný')}
												name={'isVisible'}
												size={'middle'}
												required
												customOnChange={(value: boolean) => {
													if (!hasPermission) {
														openForbiddenModal()
													} else {
														changeSalonVisibility(value)
													}
												}}
												disabled={switchDisabled || disabledForm}
											/>
										)}
									/>
									<Permissions
										allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_UPDATE]}
										render={(hasPermission, { openForbiddenModal }) => (
											<Field
												className={'mt-2 mb-2 w-12/25'}
												component={SwitchField}
												label={t('loc:Publikovaný')}
												name={'isPublished'}
												size={'middle'}
												required
												customOnChange={(value: boolean) => {
													if (!hasPermission) {
														openForbiddenModal()
													} else {
														publishSalon(value)
													}
												}}
												disabled={switchDisabled || disabledForm}
											/>
										)}
									/>
								</div>
							) : null}
						</div>
						<Divider className={'mb-3 mt-3'} />

						<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} disabled={disabledForm} required />
						<Field
							component={TextareaField}
							label={t('loc:O nás')}
							name={'aboutUsFirst'}
							size={'large'}
							placeholder={t('loc:Zadajte základné informácie o salóne')}
							disabled={disabledForm}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
							showLettersCount
						/>
						<Field
							component={TextareaField}
							label={t('loc:Doplňujúci popis')}
							name={'aboutUsSecond'}
							size={'large'}
							placeholder={t('loc:Zadajte doplňujúce informácie o salóne')}
							disabled={disabledForm}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_500}
							showLettersCount
						/>
						<Field
							component={ImgUploadField}
							name={'logo'}
							label={t('loc:Logo')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple={false}
							maxCount={1}
							category={UPLOAD_IMG_CATEGORIES.SALON}
							disabled={disabledForm}
						/>
						<Field
							className={'m-0'}
							component={ImgUploadField}
							name={'gallery'}
							label={t('loc:Fotogaléria')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple
							required
							maxCount={10}
							category={UPLOAD_IMG_CATEGORIES.SALON}
							disabled={disabledForm}
						/>
					</Col>
				</Row>
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
							<CompanyIcon width={24} height={24} className={'text-notino-black mr-2'} />
							{t('loc:Firemné údaje')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Row justify={'space-between'}>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:Názov')}
								placeholder={t('loc:Zadajte názov')}
								name={'companyInfo.companyName'}
								size={'large'}
								required
							/>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:IČO')}
								placeholder={t('loc:Zadajte ičo')}
								name={'companyInfo.businessID'}
								size={'large'}
								required
							/>
						</Row>
						<Row justify={'space-between'}>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:IČ DPH')}
								placeholder={t('loc:Zadajte IČ DPH')}
								name={'companyInfo.vatID'}
								size={'large'}
								required
							/>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:DIČ')}
								placeholder={t('loc:Zadajte DIČ')}
								name={'companyInfo.taxID'}
								size={'large'}
								required
							/>
						</Row>
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<UserIcon width={20} height={20} className={'text-notino-black mr-2'} />
							{t('loc:Kontaktná osoba')}
						</h3>

						<Divider className={'mb-3 mt-3'} />
						<Row justify={'space-between'}>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:Meno')}
								placeholder={t('loc:Zadajte meno')}
								name={'companyContactPerson.firstName'}
								size={'large'}
							/>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:Priezvisko')}
								placeholder={t('loc:Zadajte priezvisko')}
								name={'companyContactPerson.lastName'}
								size={'large'}
							/>
						</Row>
						<Row justify={'space-between'}>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:Email')}
								placeholder={t('loc:Zadajte email')}
								name={'companyContactPerson.email'}
								size={'large'}
								disabled={disabledForm}
								required
							/>
							<PhoneWithPrefixField
								label={'Telefón'}
								placeholder={t('loc:Zadajte telefón')}
								size={'large'}
								prefixName={'companyContactPerson.phonePrefixCountryCode'}
								phoneName={'companyContactPerson.phone'}
								disabled={disabledForm}
								style={{ width: 'calc(50% - 8px' }}
								formName={FORM.SALON}
								required
							/>
						</Row>
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
						{salonID && (
							<Button type={'primary'} size={'middle'} className={`noti-btn w-1/4 mb-6 mt-3`} onClick={() => openNoteModal()} disabled={disabledForm}>
								{t('loc:Pridať poznámku')}
							</Button>
						)}
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<CreditCardIcon className={'text-notino-black mr-2'} />
							{t('loc:Možnosti platby')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field
							component={InputField}
							label={t('loc:Iné spôsoby platby')}
							name={'otherPaymentMethods'}
							size={'large'}
							placeholder={t('loc:Aké spôsoby platby akceptujete, napr. hotovosť, poukazy, kryptomeny,...')}
							disabled={disabledForm}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_500}
						/>
						<Field className={'mb-6'} component={SwitchField} label={t('loc:Platba kartou')} name={'payByCard'} size={'middle'} disabled={disabledForm} required />
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<SocialIcon className={'text-notino-black mr-2'} />
							{t('loc:Sociálne siete')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field
							component={InputField}
							label={t('loc:Facebook')}
							name={'socialLinkFB'}
							size={'large'}
							prefix={(<FacebookIcon />) as any}
							placeholder={t('loc:Odkaz na Facebook')}
							disabled={disabledForm}
						/>
						<Field
							component={InputField}
							label={t('loc:Instagram')}
							name={'socialLinkInstagram'}
							size={'large'}
							prefix={(<InstagramIcon />) as any}
							placeholder={t('loc:Odkaz na Instagram')}
							disabled={disabledForm}
						/>
						<Field
							component={InputField}
							label={t('loc:Webstránka')}
							name={'socialLinkWebPage'}
							size={'large'}
							prefix={(<GlobeIcon />) as any}
							placeholder={t('loc:Odkaz na webovú stránku salóna')}
							disabled={disabledForm}
						/>
					</Col>
				</Row>
			</Space>
		</Form>
	)
}

const form = reduxForm<ISalonForm, ComponentProps>({
	form: FORM.SALON,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateSalonForm
})(SalonForm)

export default form
