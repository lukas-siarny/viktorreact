import React from 'react'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Form, Row, Space } from 'antd'

// atoms
import InputField from '../../../atoms/InputField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import validateBillingInfoForm from './validateBillingInfoForm'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as CompanyIcon } from '../../../assets/icons/companies-icon.svg'
import { ReactComponent as UserIcon } from '../../../assets/icons/user-icon.svg'
import { ReactComponent as LocationIcon } from '../../../assets/icons/location-16.svg'

// utils
import { PERMISSION, FORM, SUBMIT_BUTTON_ID, VALIDATION_MAX_LENGTH } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import { formFieldID, showErrorNotification } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// types
import { IBillingForm } from '../../../types/interfaces'

type ComponentProps = {}

type Props = InjectedFormProps<IBillingForm, ComponentProps> & ComponentProps

const BillingInfoForm = (props: Props) => {
	const { handleSubmit, submitting, pristine } = props
	const [t] = useTranslation()

	return (
		<Permissions
			allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_BILLING_UPDATE]}
			render={(hasPermission) => (
				<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
					<Space className={'w-full'} direction='vertical' size={20}>
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
										name={'companyName'}
										size={'large'}
										disabled={!hasPermission}
									/>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:IČO')}
										placeholder={t('loc:Zadajte IČO')}
										name={'businessID'}
										size={'large'}
										disabled={!hasPermission}
									/>
								</Row>
								<Row justify={'space-between'}>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:IČ DPH')}
										placeholder={t('loc:Zadajte IČ DPH')}
										name={'vatID'}
										size={'large'}
										disabled={!hasPermission}
									/>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:DIČ')}
										placeholder={t('loc:Zadajte DIČ')}
										name={'taxID'}
										size={'large'}
										disabled={!hasPermission}
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
										name={'firstName'}
										size={'large'}
										disabled={!hasPermission}
									/>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:Priezvisko')}
										placeholder={t('loc:Zadajte priezvisko')}
										name={'lastName'}
										size={'large'}
										disabled={!hasPermission}
									/>
								</Row>
								<Row justify={'space-between'}>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:Email')}
										placeholder={t('loc:Zadajte email')}
										name={'email'}
										size={'large'}
										disabled={!hasPermission}
									/>
									<PhoneWithPrefixField
										label={'Telefón'}
										placeholder={t('loc:Zadajte telefón')}
										size={'large'}
										prefixName={'phonePrefixCountryCode'}
										phoneName={'phone'}
										disabled={!hasPermission}
										className='w-12/25'
										formName={FORM.SALON_BILLING_INFO}
									/>
								</Row>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<h3 className={'mb-0 flex items-center'}>
									<LocationIcon width={20} height={20} className={'text-notino-black mr-2'} />
									{t('loc:Fakturačná adresa')}
								</h3>

								<Divider className={'mb-3 mt-3'} />
								<Row justify={'space-between'}>
									<Field
										className={'w-4/6'}
										component={InputField}
										label={t('loc:Ulica')}
										placeholder={t('loc:Zadajte ulicu')}
										name={'street'}
										size={'large'}
										disabled={!hasPermission}
									/>
									<Field
										className={'w-3/10'}
										component={InputField}
										label={t('loc:Popisné číslo')}
										maxLength={VALIDATION_MAX_LENGTH.LENGTH_10}
										placeholder={t('loc:Zadajte číslo')}
										name={'streetNumber'}
										size={'large'}
										disabled={!hasPermission}
									/>
								</Row>
								<Row justify={'space-between'}>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:Mesto')}
										placeholder={t('loc:Zadajte mesto')}
										name={'city'}
										size={'large'}
										disabled={!hasPermission}
									/>
									<Field
										className={'w-12/25'}
										component={InputField}
										label={t('loc:PSČ')}
										placeholder={t('loc:Zadajte smerovacie číslo')}
										name={'zipCode'}
										size={'large'}
										disabled={!hasPermission}
									/>
								</Row>
							</Col>
						</Row>
					</Space>
					{hasPermission && (
						<div className={'content-footer'}>
							<Row className='justify-center w-full'>
								<Button
									id={formFieldID(FORM.SALON_BILLING_INFO, SUBMIT_BUTTON_ID)}
									type={'primary'}
									className={'noti-btn w-full md:w-auto md:min-w-50 xl:min-w-60'}
									htmlType={'submit'}
									icon={<EditIcon />}
									disabled={submitting || pristine}
									loading={submitting}
								>
									{t('loc:Uložiť')}
								</Button>
							</Row>
						</div>
					)}
				</Form>
			)}
		/>
	)
}

const form = reduxForm<IBillingForm, ComponentProps>({
	form: FORM.SALON_BILLING_INFO,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateBillingInfoForm
})(withPromptUnsavedChanges(BillingInfoForm))

export default form
