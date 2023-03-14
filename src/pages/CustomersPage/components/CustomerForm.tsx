import React, { FC } from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, FormProps, Row } from 'antd'
import { useSelector } from 'react-redux'

// utils
import { ENUMERATIONS_KEYS, FORM, GENDER, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import { optionRenderWithImage, showErrorNotification } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// types
import { ISelectOptionItem } from '../../../types/interfaces'
import { ICustomerForm } from '../../../schemas/customer'

// validate
import validateCustomerForm from './validateCustomerForm'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'
import TextareaField from '../../../atoms/TextareaField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// reducers
import { RootState } from '../../../reducers'
import ImgUploadField from '../../../atoms/ImgUploadField'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'

type ComponentProps = FormProps & {
	inModal?: boolean
}

type Props = InjectedFormProps<ICustomerForm, ComponentProps> & ComponentProps

const CustomerForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, inModal, disabled } = props
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const genders: ISelectOptionItem[] = [
		{ label: `${t('loc:Muž')}`, value: GENDER.MALE, key: GENDER.MALE },
		{ label: `${t('loc:Žena')}`, value: GENDER.FEMALE, key: GENDER.FEMALE }
	]

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			{inModal ? (
				<Row className={'w-full h-full block'} justify='center'>
					<div className={'flex space-between w-full'}>
						<Field
							className={'m-0 mr-3'}
							component={ImgUploadField}
							name={'avatar'}
							label={t('loc:Avatar')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple={false}
							maxCount={1}
							disabled={disabled}
							category={UPLOAD_IMG_CATEGORIES.CUSTOMER}
						/>

						<div className={'flex-1'}>
							<Field
								component={InputField}
								disabled={disabled}
								label={t('loc:Meno')}
								placeholder={t('loc:Zadajte meno')}
								name={'firstName'}
								size={'large'}
								required
							/>
							<Field
								component={InputField}
								disabled={disabled}
								label={t('loc:Priezvisko')}
								placeholder={t('loc:Zadajte priezvisko')}
								name={'lastName'}
								size={'large'}
								required
							/>
						</div>
					</div>
					<PhoneWithPrefixField
						label={'Telefón'}
						placeholder={t('loc:Zadajte telefón')}
						size={'large'}
						prefixName={'phonePrefixCountryCode'}
						phoneName={'phone'}
						formName={FORM.CUSTOMER}
						disabled={disabled}
						required
					/>
					<Field
						component={TextareaField}
						label={t('loc:Poznámka')}
						placeholder={t('loc:Zadajte poznámku')}
						maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
						showLettersCount
						name={'note'}
						disabled={disabled}
						size={'large'}
					/>
				</Row>
			) : (
				<Col className={'flex'}>
					<Row className={'mx-9 w-full h-full block'} justify='center'>
						<h3 className={'mb-0 mt-3'}>{t('loc:Osobné údaje')}</h3>
						<Divider className={'mb-3 mt-3'} />
						<div className={'flex space-between w-full'}>
							<Field
								className={'m-0 mr-3'}
								component={ImgUploadField}
								name={'avatar'}
								label={t('loc:Avatar')}
								signUrl={URL_UPLOAD_IMAGES}
								multiple={false}
								maxCount={1}
								category={UPLOAD_IMG_CATEGORIES.CUSTOMER}
							/>

							<div className={'flex-1'}>
								<Field component={InputField} label={t('loc:Meno')} placeholder={t('loc:Zadajte meno')} name={'firstName'} size={'large'} required />
								<Field component={InputField} label={t('loc:Priezvisko')} placeholder={t('loc:Zadajte priezvisko')} name={'lastName'} size={'large'} required />
							</div>
						</div>
						<Field
							component={SelectField}
							label={t('loc:Pohlavie')}
							placeholder={t('loc:Vyber pohlavie')}
							options={genders}
							name={'gender'}
							size={'large'}
							allowClear
						/>
						<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
						<PhoneWithPrefixField
							label={'Telefón'}
							placeholder={t('loc:Zadajte telefón')}
							size={'large'}
							prefixName={'phonePrefixCountryCode'}
							phoneName={'phone'}
							formName={FORM.CUSTOMER}
							required
						/>
						<Field
							className={'m-0'}
							uploaderClassName={'overflow-x-auto'}
							component={ImgUploadField}
							name={'gallery'}
							label={t('loc:Fotogaléria')}
							signUrl={URL_UPLOAD_IMAGES}
							multiple
							maxCount={10}
							category={UPLOAD_IMG_CATEGORIES.CUSTOMER}
						/>
						<Row justify={'space-between'}>
							<Field className={'w-4/5'} component={InputField} label={t('loc:Ulica')} placeholder={t('loc:Zadajte ulicu')} name={'street'} size={'large'} />
							<Field
								className={'w-1/6'}
								component={InputField}
								label={t('loc:Popisné číslo')}
								maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
								placeholder={t('loc:Zadajte číslo')}
								name={'streetNumber'}
								size={'large'}
							/>
						</Row>
						<Row justify={'space-between'}>
							<Field className={'w-12/25'} component={InputField} label={t('loc:Mesto')} placeholder={t('loc:Zadajte mesto')} name={'city'} size={'large'} />
							<Field
								className={'w-12/25'}
								component={InputField}
								label={t('loc:PSČ')}
								placeholder={t('loc:Zadajte smerovacie číslo')}
								name={'zipCode'}
								size={'large'}
							/>
						</Row>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithImage(itemData, <GlobeIcon />)}
							label={t('loc:Štát')}
							placeholder={t('loc:Vyber krajinu')}
							options={countries?.enumerationsOptions || []}
							name={'countryCode'}
							size={'large'}
							loading={countries?.isLoading}
							allowClear
						/>
						<Field
							component={TextareaField}
							label={t('loc:Poznámka')}
							placeholder={t('loc:Zadajte poznámku')}
							maxLength={VALIDATION_MAX_LENGTH.LENGTH_1000}
							showLettersCount
							name={'note'}
							size={'large'}
						/>
					</Row>
				</Col>
			)}
		</Form>
	)
}

const form = reduxForm<ICustomerForm, ComponentProps>({
	form: FORM.CUSTOMER,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateCustomerForm
})(withPromptUnsavedChanges(CustomerForm))

export default form
