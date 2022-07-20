import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Space } from 'antd'
import { useSelector } from 'react-redux'
import { get, isEqual } from 'lodash'

// components
import OpeningHours from '../../../components/OpeningHours/OpeningHours'
import AddressFields from '../../../components/AddressFields'
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import Compare from '../../../components/Compare'

// atoms
import InputField from '../../../atoms/InputField'
import SwitchField from '../../../atoms/SwitchField'
import TextareaField from '../../../atoms/TextareaField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import SelectField from '../../../atoms/SelectField'

// utils
import { getSalonTagChanges, getSalonTagDeleted, getSalonTagPublished, showErrorNotification } from '../../../utils/helper'
import { FORM, SALON_STATES, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, VALIDATION_MAX_LENGTH } from '../../../utils/enums'

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
	return JSON.stringify(oldAddress) === JSON.stringify(newAddress)
}

const SalonForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, change, openNoteModal, salonID, disabledForm } = props
	const categories = useSelector((state: RootState) => state.categories.categories)
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.SALON]?.values)

	const aboutUsFirstPlaceholder = t('loc:Zadajte základné informácie o salóne')
	const aboutUsFirstLabel = t('loc:O nás')
	const aboutUsSecondPlaceholder = t('loc:Zadajte doplňujúce informácie o salóne')
	const aboutUsSecondLabel = t('loc:Doplňujúci popis')
	const aboutUsFirstFormField = (filedName: string, disabled: boolean, placeholder: string, label: string, maxLength: number) => {
		return (
			<Field component={TextareaField} label={label} name={filedName} size={'large'} placeholder={placeholder} disabled={disabled} maxLength={maxLength} showLettersCount />
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
			maxCount={10}
			category={UPLOAD_IMG_CATEGORIES.SALON}
			disabled={disabled}
		/>
	)

	const logoFormField = (filedName: string, disabled: boolean) => (
		<Field
			component={ImgUploadField}
			name={filedName}
			label={t('loc:Logo')}
			signUrl={URL_UPLOAD_IMAGES}
			multiple={false}
			maxCount={1}
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
			getPopupContainer={() => document.querySelector('.content-body')}
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

	const nameFormField = (filedName: string, disabled: boolean) => (
		<Field component={InputField} label={t('loc:Názov')} placeholder={t('loc:Zadajte názov')} name={filedName} size={'large'} disabled={disabled} required />
	)

	const addressDescriptionFormFiled = (filedName: string, disabled: boolean) => (
		<Field
			component={TextareaField}
			label={t('loc:Poznámka k adrese')}
			name={filedName}
			size={'large'}
			placeholder={t('loc:Zadajte poznámku k adrese, napr. "3. poschodie vľavo"')}
			disabled={disabled}
			maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
			showLettersCount
		/>
	)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full'} direction='vertical' size={36}>
				<Row>
					<Col span={24}>
						<Row justify={'space-between'}>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<InfoIcon className={'text-notino-black mr-2'} />
								{t('loc:Základné údaje')}
							</h3>
							<Row className={'py-2'} wrap={false}>
								{getSalonTagPublished(formValues?.state as SALON_STATES)}
								{getSalonTagChanges(formValues?.state as SALON_STATES)}
								{getSalonTagDeleted(!!formValues?.deletedAt, true)}
							</Row>
						</Row>
						<Divider className={'mb-3 mt-3'} />
						<Compare
							oldValue={formValues?.publishedSalonData?.name}
							newValue={formValues?.name}
							oldFormField={nameFormField('publishedSalonData.name', true)}
							newFormField={nameFormField('name', disabledForm)}
						/>
						<Compare
							oldValue={formValues?.publishedSalonData?.aboutUsFirst}
							newValue={formValues?.aboutUsFirst}
							oldFormField={aboutUsFirstFormField(
								'publishedSalonData.aboutUsFirst',
								true,
								aboutUsFirstPlaceholder,
								aboutUsFirstLabel,
								VALIDATION_MAX_LENGTH.LENGTH_1000
							)}
							newFormField={aboutUsFirstFormField('aboutUsFirst', disabledForm, aboutUsFirstPlaceholder, aboutUsFirstLabel, VALIDATION_MAX_LENGTH.LENGTH_1000)}
						/>
						<Compare
							oldValue={formValues?.publishedSalonData?.aboutUsSecond}
							newValue={formValues?.aboutUsSecond}
							oldFormField={aboutUsFirstFormField(
								'publishedSalonData.aboutUsSecond',
								true,
								aboutUsSecondPlaceholder,
								aboutUsSecondLabel,
								VALIDATION_MAX_LENGTH.LENGTH_500
							)}
							newFormField={aboutUsFirstFormField('aboutUsSecond', disabledForm, aboutUsSecondPlaceholder, aboutUsSecondLabel, VALIDATION_MAX_LENGTH.LENGTH_500)}
						/>
						<Field
							component={SelectField}
							options={categories.enumerationsOptions}
							label={t('loc:Odvetvie')}
							placeholder={t('loc:Vyberte odvetvie')}
							name={'categoryIDs'}
							size={'large'}
							loading={categories.isLoading}
							mode={'multiple'}
							required
						/>
						<Compare
							oldValue={formValues?.publishedSalonData?.logo}
							equal={isEqual(formValues?.logo, formValues?.publishedSalonData?.logo)}
							oldFormField={logoFormField('publishedSalonData.logo', true)}
							newFormField={logoFormField('logo', disabledForm)}
							ellipsis
						/>
						<Compare
							oldValue={formValues?.publishedSalonData?.gallery}
							equal={isEqual(formValues?.gallery, formValues?.publishedSalonData?.gallery)}
							oldFormField={imagesFormField('publishedSalonData.gallery', true)}
							newFormField={imagesFormField('gallery', disabledForm)}
							ellipsis
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
						<Compare
							oldValue={formValues?.publishedSalonData?.phone}
							newValue={formValues?.phone}
							oldFormField={phoneFormField('publishedSalonData.phone', 'publishedSalonData.phonePrefixCountryCode', true)}
							newFormField={phoneFormField('phone', 'phonePrefixCountryCode', disabledForm)}
						/>
						<Compare
							oldValue={formValues?.publishedSalonData?.email}
							newValue={formValues?.email}
							oldFormField={emailFormField('publishedSalonData.email', true)}
							newFormField={emailFormField('email', disabledForm)}
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
						<Compare
							oldValue={formValues?.publishedSalonData?.address?.description}
							newValue={formValues?.description}
							oldFormField={addressDescriptionFormFiled('publishedSalonData.address.description', true)}
							newFormField={addressDescriptionFormFiled('description', disabledForm)}
						/>
						{!compareAddress(formValues?.publishedSalonData?.address, formValues?.address) && formValues?.publishedSalonData?.address && (
							<Compare
								oldValue={formValues?.publishedSalonData?.address}
								equal={compareAddress(formValues?.publishedSalonData?.address, formValues?.address)}
								oldFormField={
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
								newFormField={
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
								placeholder={t('loc:Zadajte IČO')}
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
								className='w-12/25'
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
						{!!salonID && (
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
