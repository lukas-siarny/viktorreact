import React, { FC, useCallback } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Space } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// components
import { isEmpty } from 'lodash'
import i18next from 'i18next'
import OpeningHours from '../../../../components/OpeningHours/OpeningHours'
import AddressFields from '../../../../components/AddressFields'

// atoms
import InputField from '../../../../atoms/InputField'
import SwitchField from '../../../../atoms/SwitchField'
import TextareaField from '../../../../atoms/TextareaField'
import ImgUploadField from '../../../../atoms/ImgUploadField'
import SelectField from '../../../../atoms/SelectField'
import PhoneArrayField from '../../../../atoms/PhoneArrayField'
import AutocompleteField from '../../../../atoms/AutocompleteField'

// utils
import { optionRenderWithImage, showErrorNotification } from '../../../../utils/helper'
import { FILTER_ENTITY, FORM, SALON_STATES, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { withPromptUnsavedChanges } from '../../../../utils/promptUnsavedChanges'
import { getSalonTagChanges, getSalonTagDeleted, getSalonTagPublished, getSalonTagSourceType } from '../salonUtils'
import searchWrapper from '../../../../utils/filters'

// types
import { ISalonForm, ISelectOptionItem } from '../../../../types/interfaces'

// validate
import validateSalonForm from './validateSalonForm'

// reducers
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as InstagramIcon } from '../../../../assets/icons/social-instagram-icon.svg'
import { ReactComponent as FacebookIcon } from '../../../../assets/icons/social-facebook-icon.svg'
import { ReactComponent as CreditCardIcon } from '../../../../assets/icons/credit-card-outlined-icon.svg'
import { ReactComponent as InfoIcon } from '../../../../assets/icons/info-icon.svg'
import { ReactComponent as PhoneIcon } from '../../../../assets/icons/phone-2-icon.svg'
import { ReactComponent as TimerIcon } from '../../../../assets/icons/clock-icon.svg'
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-24.svg'
import { ReactComponent as SocialIcon } from '../../../../assets/icons/social-24.svg'
import { ReactComponent as SocialPinterest } from '../../../../assets/icons/social-pinterest.svg'
import { ReactComponent as SocialYoutube } from '../../../../assets/icons/social-youtube.svg'
import { ReactComponent as SocialTikTok } from '../../../../assets/icons/social-tiktok.svg'
import { ReactComponent as CosmeticIcon } from '../../../../assets/icons/cosmetic-icon-24.svg'
import { ReactComponent as LanguagesIcon } from '../../../../assets/icons/languages-24-icon.svg'
import { ReactComponent as InfoIcon16 } from '../../../../assets/icons/info-icon-16.svg'
import { ReactComponent as LocationIcon } from '../../../../assets/icons/location-16.svg'

type ComponentProps = {
	disabledForm?: boolean
	noteModalControlButtons?: React.ReactNode
	notinoUserModalControlButtons?: React.ReactNode
	deletedSalon?: boolean
	loadBasicSalon?: (id: string) => void
	clearSalonForm?: () => void
	searchSalons?: (search: string, page: number) => void
	showBasicSalonsSuggestions?: boolean
}

type Props = InjectedFormProps<ISalonForm, ComponentProps> & ComponentProps

export const optionRenderSalonSearch = (itemData: any) => {
	const { label, extra } = itemData
	const address = extra?.salon?.address

	return (
		<div className='noti-salon-search-option-render'>
			<span className={'label'}>{label}</span>
			<div className={'address'}>
				{!isEmpty(address) ? (
					<>
						{address?.street && (
							<>
								{address?.street} {address?.streetNumber}
							</>
						)}
						{(address?.zipCode || address?.city) && ', '}
						{address?.zipCode} {address?.city}
						{`, ${address?.countryCode}`}
					</>
				) : (
					<i>{i18next.t('loc:Adresa salónu nie je známa')}</i>
				)}
			</div>
		</div>
	)
}

const SalonForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const {
		handleSubmit,
		change,
		noteModalControlButtons,
		disabledForm,
		loadBasicSalon,
		clearSalonForm,
		searchSalons,
		showBasicSalonsSuggestions,
		deletedSalon,
		notinoUserModalControlButtons
	} = props
	const dispatch = useDispatch()
	const languages = useSelector((state: RootState) => state.languages.languages)
	const cosmetics = useSelector((state: RootState) => state.cosmetics.cosmetics)
	const formValues = useSelector((state: RootState) => state.form?.[FORM?.SALON]?.values)

	const searchCosmetics = useCallback(
		async (search: string, page: string) => {
			return searchWrapper(dispatch, { search, limit: 100, page }, FILTER_ENTITY.COSMETICS)
		},
		[dispatch]
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
								{!deletedSalon ? (
									<>
										{getSalonTagSourceType(formValues?.sourceOfPremium)}
										{getSalonTagPublished(formValues?.state as SALON_STATES)}
										{getSalonTagChanges(formValues?.state as SALON_STATES)}
									</>
								) : (
									getSalonTagDeleted(!!formValues?.deletedAt, true)
								)}
							</Row>
						</Row>
						<Divider className={'mb-3 mt-3'} />
						{showBasicSalonsSuggestions ? (
							<Field
								component={AutocompleteField}
								label={t('loc:Názov')}
								placeholder={t('loc:Vyhľadajte salón podľa názvu alebo zadajte vlastný')}
								name={'nameSelect'}
								filterOption={false}
								showSearch
								onDidMountSearch
								required
								size={'large'}
								optionRender={optionRenderSalonSearch}
								allowClear
								labelInValue
								onSearch={searchSalons}
								onSelect={(_value: string | ISelectOptionItem, option: ISelectOptionItem) => {
									if (option?.extra?.salon?.id && loadBasicSalon) {
										loadBasicSalon(option?.extra.salon.id)
									}
								}}
								onClear={clearSalonForm}
								allowInfinityScroll
							/>
						) : (
							<Field
								component={InputField}
								label={t('loc:Názov')}
								placeholder={t('loc:Zadajte názov')}
								name={'name'}
								size={'large'}
								disabled={disabledForm}
								required
							/>
						)}
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
						{notinoUserModalControlButtons}
						<Field
							component={SelectField}
							options={languages.enumerationsOptions}
							label={t('loc:Jazyky, ktorými sa dá v salóne dohovoriť')}
							placeholder={t('loc:Vyberte jazyk')}
							name={'languageIDs'}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <LanguagesIcon />)}
							size={'large'}
							showSearch
							filterOption={true}
							loading={languages.isLoading}
							mode={'multiple'}
							disabled={disabledForm}
							allowClear
						/>
						<Field
							component={SelectField}
							label={t('loc:Kozmetika')}
							placeholder={t('loc:Vyberte kozmetiku')}
							name={'cosmeticIDs'}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <CosmeticIcon />, 40)}
							showSearch
							onSearch={searchCosmetics}
							filterOption={false}
							size={'large'}
							loading={cosmetics.isLoading}
							mode={'multiple'}
							disabled={disabledForm}
							allowClear
							allowInfinityScroll
							onDidMountSearch
						/>
						<Field
							component={ImgUploadField}
							name={'logo'}
							label={t('loc:Logo')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple={false}
							maxCount={1}
							category={UPLOAD_IMG_CATEGORIES.SALON_LOGO}
							disabled={disabledForm}
						/>
						<Field
							uploaderClassName={'overflow-x-auto'}
							component={ImgUploadField}
							name={'gallery'}
							tooltip={{ title: t('loc:Poradie fotiek môžete zmeniť ich presunutím pomocou Drag & Drop'), icon: <InfoIcon16 /> }}
							label={t('loc:Fotogaléria')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple
							maxCount={10}
							category={UPLOAD_IMG_CATEGORIES.SALON_IMAGE}
							disabled={disabledForm}
							draggable
							selectable
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
						<FieldArray component={PhoneArrayField} name={'phones'} props={{ disabled: disabledForm, requiedAtLeastOne: true }} />
						<Field
							className={'w-full'}
							component={InputField}
							label={t('loc:Email')}
							placeholder={t('loc:Zadajte email')}
							name={'email'}
							size={'large'}
							disabled={disabledForm}
						/>
						<h3 className={'mb-0 flex items-center'}>
							<LocationIcon width={20} height={20} className={'text-notino-black mr-2'} />
							{t('loc:Adresa')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Field
							component={AddressFields}
							inputValues={{
								latitude: formValues?.latitude,
								longitude: formValues?.longitude,
								city: formValues?.city,
								street: formValues?.street,
								streetNumber: formValues?.streetNumber,
								zipCode: formValues?.zipCode,
								country: formValues?.country
							}}
							changeFormFieldValue={change}
							disabled={disabledForm}
							name={'address'}
						/>
						<Field
							component={TextareaField}
							label={t('loc:Poznámka k adrese')}
							name={'locationNote'}
							size={'large'}
							placeholder={t('loc:Zadajte poznámku k adrese, napr. "3. poschodie vľavo"')}
							disabled={disabledForm}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
							showLettersCount
						/>
						<Field
							component={TextareaField}
							label={t('loc:Poznámka k parkovaniu')}
							name={'parkingNote'}
							className={'pb-0'}
							size={'large'}
							placeholder={t('loc:Zadajte poznámku k parkovaniu, napr. "Parkovanie oproti budove."')}
							disabled={disabledForm}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
							showLettersCount
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
							className={'pb-0'}
							component={SwitchField}
							label={t('loc:Pon - Pi rovnaké otváracie hodiny')}
							name={'sameOpenHoursOverWeek'}
							size={'middle'}
							disabled={disabledForm}
						/>
						<FieldArray component={OpeningHours} name={'openingHours'} props={{ disabled: disabledForm, showOnDemand: true }} />
						{noteModalControlButtons}
					</Col>
				</Row>
				<Row>
					<Col span={24}>
						<h3 className={'mb-0 flex items-center'}>
							<CreditCardIcon className={'text-notino-black mr-2'} />
							{t('loc:Možnosti platby')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<Row justify={'space-between'}>
							<Field
								className={'w-12/25'}
								component={SwitchField}
								label={t('loc:Platba v hotovosti')}
								name={'payByCash'}
								size={'middle'}
								disabled={disabledForm}
								required
							/>
							<Field
								className={'w-12/25'}
								component={SwitchField}
								label={t('loc:Platba kartou')}
								name={'payByCard'}
								size={'middle'}
								disabled={disabledForm}
								required
							/>
						</Row>
						<Field
							component={InputField}
							label={t('loc:Iné spôsoby platby')}
							name={'otherPaymentMethods'}
							size={'large'}
							placeholder={t('loc:Aké spôsoby platby akceptujete, napr. hotovosť, poukazy, kryptomeny,...')}
							disabled={disabledForm}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_500}
							className={'pb-6'}
						/>
						<Field
							className={'m-0 pb-0'}
							uploaderClassName={'overflow-x-auto'}
							component={ImgUploadField}
							name={'pricelists'}
							label={t('loc:Cenníky')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple
							maxCount={10}
							category={UPLOAD_IMG_CATEGORIES.SALON_PRICELIST}
							disabled={disabledForm}
							accept={'image/jpeg,image/png,application/pdf'}
						/>
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
							label={t('loc:Webstránka')}
							name={'socialLinkWebPage'}
							size={'large'}
							prefix={(<GlobeIcon />) as any}
							placeholder={t('loc:Odkaz na webovú stránku salóna')}
							disabled={disabledForm}
						/>
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
							label={t('loc:Pinterest')}
							name={'socialLinkPinterest'}
							size={'large'}
							prefix={(<SocialPinterest />) as any}
							placeholder={t('loc:Odkaz na Pinterest')}
							disabled={disabledForm}
						/>
						<Field
							component={InputField}
							label={t('loc:Youtube')}
							name={'socialLinkYoutube'}
							size={'large'}
							prefix={(<SocialYoutube />) as any}
							placeholder={t('loc:Odkaz na Youtube')}
							disabled={disabledForm}
						/>
						<Field
							component={InputField}
							label={t('loc:TikTok')}
							name={'socialLinkTikTok'}
							size={'large'}
							prefix={(<SocialTikTok />) as any}
							placeholder={t('loc:Odkaz na TikTok')}
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
})(withPromptUnsavedChanges(SalonForm))

export default form
