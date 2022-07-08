import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Space } from 'antd'
import { useSelector } from 'react-redux'
import { get, isEqual } from 'lodash'

// components
import OpeningHours from './OpeningHours'
import AddressFields from '../../../components/AddressFields'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import Compare from '../../../components/Compare'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// utils
import { showErrorNotification } from '../../../utils/helper'
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

// types
import { ISalonForm } from '../../../types/interfaces'
import { Paths } from '../../../types/api'

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
	salonID?: number
}

type SalonAddress = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['address']

type Props = InjectedFormProps<ISalonForm, ComponentProps> & ComponentProps

const compareAddress = (oldAddress: SalonAddress, newAddress: SalonAddress): boolean => {
	return (
		oldAddress?.street === newAddress?.street &&
		oldAddress?.streetNumber === newAddress?.streetNumber &&
		oldAddress?.city === newAddress?.city &&
		oldAddress?.zipCode === newAddress?.zipCode &&
		oldAddress?.countryCode === newAddress?.countryCode
	)
}

const SalonForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, change, openNoteModal, salonID, disabledForm } = props
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.SALON]?.values)

	const aboutUsFirstPlaceholder = t('loc:Zadajte základné informácie o salóne')
	const aboutUsFirstLabel = t('loc:O nás')
	const aboutUsSecondPlaceholder = t('loc:Zadajte doplňujúce informácie o salóne')
	const aboutUsSecondLabel = t('loc:Doplňujúci popis')
	const aboutUsFirstFormField = (filedName: string, disabled: boolean, placeholder: string, label: string) => {
		return (
			<Field
				component={TextareaField}
				label={label}
				name={filedName}
				size={'large'}
				placeholder={placeholder}
				disabled={disabled}
				maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
				showLettersCount
			/>
		)
	}

	const imagesFormField = (filedName: string, disabled: boolean) => (
		<Field
			className={'m-0'}
			component={ImgUploadField}
			name={filedName}
			label={t('loc:Fotogaléria')}
			signUrl={URL_UPLOAD_IMAGES}
			multiple
			required
			maxCount={10}
			category={UPLOAD_IMG_CATEGORIES.SALON}
			disabled={disabled}
		/>
	)

	const phoneFormField = (phoneFiledName: string, phonePrefixFiledName: string, disabled: boolean) => (
		<PhoneWithPrefixField
			label={'Telefón'}
			placeholder={t('loc:Zadajte telefón')}
			size={'large'}
			prefixName={phonePrefixFiledName}
			phoneName={phoneFiledName}
			disabled={disabled}
			formName={FORM.SALON}
			required
		/>
	)

	const emailFormField = (filedName: string, disabled: boolean) => (
		<Field
			className={'w-full'}
			component={InputField}
			label={t('loc:Email')}
			placeholder={t('loc:Zadajte email')}
			name={filedName}
			size={'large'}
			disabled={disabled}
			required
		/>
	)

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
						</div>
						<Divider className={'mb-3 mt-3'} />

						<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={'name'} size={'large'} disabled={disabledForm} required />
						{!isEqual(formValues?.aboutUsFirst, formValues?.publishedSalonData?.aboutUsFirst) && formValues?.publishedSalonData?.aboutUsFirst ? (
							<Compare
								oldValue={aboutUsFirstFormField('publishedSalonData.aboutUsFirst', true, aboutUsFirstPlaceholder, aboutUsFirstLabel)}
								newValue={aboutUsFirstFormField('aboutUsFirst', disabledForm, aboutUsFirstPlaceholder, aboutUsFirstLabel)}
							/>
						) : (
							aboutUsFirstFormField('aboutUsFirst', disabledForm, aboutUsFirstPlaceholder, aboutUsFirstLabel)
						)}
						{!isEqual(formValues?.aboutUsSecond, formValues?.publishedSalonData?.aboutUsSecond) && formValues?.publishedSalonData?.aboutUsSecond ? (
							<Compare
								oldValue={aboutUsFirstFormField('publishedSalonData.aboutUsSecond', true, aboutUsSecondPlaceholder, aboutUsSecondLabel)}
								newValue={aboutUsFirstFormField('aboutUsSecond', disabledForm, aboutUsSecondPlaceholder, aboutUsSecondLabel)}
							/>
						) : (
							aboutUsFirstFormField('aboutUsSecond', disabledForm, aboutUsSecondPlaceholder, aboutUsSecondLabel)
						)}

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
						{!isEqual(formValues?.gallery, formValues?.publishedSalonData?.gallery) && formValues?.publishedSalonData?.gallery ? (
							<Compare oldValue={imagesFormField('publishedSalonData.gallery', true)} newValue={imagesFormField('gallery', disabledForm)} />
						) : (
							imagesFormField('gallery', disabledForm)
						)}
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<PhoneIcon width={20} height={20} className={'text-notino-black mr-2'} />
							{t('loc:Kontaktné údaje')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						{!isEqual(formValues?.phone, formValues?.publishedSalonData?.phone) && formValues?.publishedSalonData?.phone ? (
							<Compare
								oldValue={phoneFormField('publishedSalonData.phone', 'publishedSalonData.phonePrefixCountryCode', true)}
								newValue={phoneFormField('phone', 'phonePrefixCountryCode', disabledForm)}
							/>
						) : (
							phoneFormField('phone', 'phonePrefixCountryCode', disabledForm)
						)}
						{!isEqual(formValues?.email, formValues?.publishedSalonData?.email) && formValues?.publishedSalonData?.email ? (
							<Compare oldValue={emailFormField('publishedSalonData.email', true)} newValue={emailFormField('email', disabledForm)} />
						) : (
							emailFormField('email', disabledForm)
						)}
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
						{!compareAddress(formValues?.publishedSalonData?.address, formValues?.address) && formValues?.publishedSalonData?.address && (
							<Compare
								oldValue={
									<Col xl={6} md={9}>
										<div>
											{t('loc:Mesto')}
											<h4>{get(formValues, 'publishedSalonData.address.city')}</h4>
										</div>
										<div>
											{t('loc:Ulica')}
											<h4>{`${get(formValues, 'publishedSalonData.address.street') ?? ''} ${
												get(formValues, 'publishedSalonData.address.streetNumber') ?? ''
											}`}</h4>
										</div>
										<div>
											{t('loc:PSČ')}
											<h4>{get(formValues, 'publishedSalonData.address.zipCode')}</h4>
										</div>
										<div>
											{t('loc:Krajina')}
											<h4>{get(formValues, 'publishedSalonData.address.countryCode')}</h4>
										</div>
									</Col>
								}
								newValue={
									<Col xl={6} md={9}>
										<div>
											{t('loc:Mesto')}
											<h4>{get(formValues, 'city')}</h4>
										</div>
										<div>
											{t('loc:Ulica')}
											<h4>{`${get(formValues, 'street') ?? ''} ${get(formValues, 'streetNumber') ?? ''}`}</h4>
										</div>
										<div>
											{t('loc:PSČ')}
											<h4>{get(formValues, 'zipCode')}</h4>
										</div>
										<div>
											{t('loc:Krajina')}
											<h4>{get(formValues, 'country')}</h4>
										</div>
									</Col>
								}
							/>
						)}
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
								disabled={disabledForm}
								required
							/>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:IČO')}
								placeholder={t('loc:Zadajte ičo')}
								name={'companyInfo.businessID'}
								size={'large'}
								disabled={disabledForm}
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
								disabled={disabledForm}
								required
							/>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:DIČ')}
								placeholder={t('loc:Zadajte DIČ')}
								name={'companyInfo.taxID'}
								size={'large'}
								disabled={disabledForm}
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
								disabled={disabledForm}
							/>
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:Priezvisko')}
								placeholder={t('loc:Zadajte priezvisko')}
								name={'companyContactPerson.lastName'}
								size={'large'}
								disabled={disabledForm}
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
							<Button type={'primary'} size={'middle'} className={'noti-btn w-1/4 mb-6 mt-3'} onClick={() => openNoteModal()} disabled={disabledForm}>
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
