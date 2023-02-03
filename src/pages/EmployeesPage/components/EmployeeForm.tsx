import React, { FC, MouseEventHandler } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm, getFormValues } from 'redux-form'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Space, Button } from 'antd'
import { isEmpty } from 'lodash'

// utils
import { FORM, STRINGS, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { showErrorNotification } from '../../../utils/helper'

// types
import { IEmployeeForm } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import SelectField from '../../../atoms/SelectField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import ServicesListField from './ServicesListField'

// validations
import validateEmployeeForm from './validateEmployeeForm'

// assets
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'

type ComponentProps = {
	salonID: string
	isEdit?: boolean
	addService?: MouseEventHandler<HTMLElement>
	setVisibleServiceEditModal?: (visible: boolean) => void
}

type Props = InjectedFormProps<IEmployeeForm, ComponentProps> & ComponentProps

const EmployeeForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, addService, setVisibleServiceEditModal, isEdit, pristine } = props
	const formValues: Partial<IEmployeeForm> = useSelector((state: RootState) => getFormValues(FORM.EMPLOYEE)(state))
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const services = useSelector((state: RootState) => state.service.services)

	return (
		<>
			<Form id={`${FORM.EMPLOYEE}-form`} layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
				<Space className={'w-full px-9'} direction='vertical' size={36}>
					<div>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<InfoIcon className={'text-notino-black mr-2'} /> {t('loc:Osobné údaje')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<div className={'flex space-between w-full'}>
							<Field
								className={'m-0 mr-3'}
								component={ImgUploadField}
								name={'avatar'}
								label={t('loc:Avatar')}
								signUrl={URL_UPLOAD_IMAGES}
								category={UPLOAD_IMG_CATEGORIES.EMPLOYEE}
								multiple={false}
								maxCount={1}
							/>
							<div className={'flex-1'}>
								<Field component={InputField} label={t('loc:Meno')} placeholder={t('loc:Zadajte meno')} name={'firstName'} size={'large'} required />
								<Field component={InputField} label={t('loc:Priezvisko')} placeholder={t('loc:Zadajte priezvisko')} name={'lastName'} size={'large'} required />
							</div>
						</div>
						<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
						<PhoneWithPrefixField
							label={'Telefón'}
							placeholder={t('loc:Zadajte telefón')}
							size={'large'}
							prefixName={'phonePrefixCountryCode'}
							phoneName={'phone'}
							formName={FORM.EMPLOYEE}
						/>
					</div>
					{isEdit && (
						<div>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<ServiceIcon className={'text-notino-black mr-2'} /> {t('loc:Priradené služby')}
							</h3>
							<Divider className={'mb-3 mt-3'} />
							<div className={'flex w-full flex-col md:flex-row md:gap-2'}>
								<Field
									label={t('loc:Služby')}
									size={'large'}
									className={'flex-1'}
									component={SelectField}
									filterOption={true}
									allowClear
									placeholder={t('loc:Vyberte službu')}
									name={'service'}
									options={services?.options}
									mode={'multiple'}
									allowInfinityScroll
									showSearch
									loading={services.isLoading}
								/>
								<Button
									type={'primary'}
									size={'middle'}
									className={'self-start noti-btn m-regular md:mt-5'}
									onClick={addService}
									disabled={isEmpty(formValues?.service)}
								>
									{formValues?.services && formValues?.services.length > 1 ? STRINGS(t).addRecord(t('loc:služby')) : STRINGS(t).addRecord(t('loc:službu'))}
								</Button>
							</div>
							<FieldArray
								component={ServicesListField as any}
								name={'services'}
								currencySymbol={salon.data?.currency.symbol}
								isEmployeeDetail
								setVisibleServiceEditModal={setVisibleServiceEditModal}
								disabledEditButton={!pristine}
							/>
						</div>
					)}
				</Space>
			</Form>
		</>
	)
}

const form = reduxForm<IEmployeeForm, ComponentProps>({
	form: FORM.EMPLOYEE,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateEmployeeForm
})(EmployeeForm)

export default form
