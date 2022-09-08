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
import { PERMISSION, SALON_PERMISSION, FORM } from '../../../utils/enums'
import Permissions from '../../../utils/Permissions'
import { showErrorNotification } from '../../../utils/helper'

// types
import { IBillingForm } from '../../../types/interfaces'

type ComponentProps = {}

type Props = InjectedFormProps<IBillingForm, ComponentProps> & ComponentProps

const BillingInfoForm = (props: Props) => {
	const { handleSubmit, submitting, pristine } = props
	const [t] = useTranslation()

	return (
		<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
			<Permissions
				allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_BILLING_UPDATE]}
				render={(hasPermission) => (
					<Space className={'w-full'} direction='vertical' size={36}>
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
									<Field className={'w-4/5'} component={InputField} label={t('loc:Ulica')} placeholder={t('loc:Zadajte ulicu')} name={'street'} size={'large'} />
									<Field
										className={'w-1/6'}
										component={InputField}
										label={t('loc:Popisné číslo')}
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
							</Col>
						</Row>
						{hasPermission && (
							<div className={'content-footer pt-0'}>
								<Row className='justify-center w-full'>
									<Button
										type={'primary'}
										className={'noti-btn mt-2-5 w-52 xl:w-60'}
										htmlType={'submit'}
										icon={<EditIcon />}
										disabled={submitting || pristine}
										loading={submitting}
									>
										{t('loc:Upraviť')}
									</Button>
								</Row>
							</div>
						)}
					</Space>
				)}
			/>
		</Form>
	)
}

const form = reduxForm<IBillingForm, ComponentProps>({
	form: FORM.SALON_BILLING_INFO,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateBillingInfoForm
})(BillingInfoForm)

export default form
