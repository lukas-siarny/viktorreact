import React, { FC, MouseEventHandler } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm, getFormValues, initialize } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Space, Collapse, Button } from 'antd'
import cx from 'classnames'
import { isEmpty } from 'lodash'

// utils
import i18next from 'i18next'
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { renderFromTo, renderPriceAndDurationInfo, showErrorNotification, validationNumberMin } from '../../../utils/helper'

// types
import { EmployeeServiceData, FormPriceAndDurationData, IEmployeeForm } from '../../../types/interfaces'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import SelectField from '../../../atoms/SelectField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import DeleteButton from '../../../components/DeleteButton'

// validations
import validateEmployeeForm from './validateEmployeeForm'

// assets
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon-16.svg'

// reducers
import { RootState } from '../../../reducers'

const { Panel } = Collapse

type ComponentProps = {
	salonID: string
	addService: MouseEventHandler<HTMLElement>
	setVisibleServiceEditModal?: (visible: boolean) => void
}

type Props = InjectedFormProps<IEmployeeForm, ComponentProps> & ComponentProps

const ListFields: FC<any> = (props) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [t] = useTranslation()
	const { fields, salon, setVisibleServiceEditModal } = props
	const dispatch = useDispatch()

	const genExtra = (index: number, field: EmployeeServiceData) => {
		const salonPriceAndDuration = field?.salonPriceAndDurationData
		const employeePriceAndDuration = field?.employeePriceAndDurationData
		const hasOverridenData = field?.hasOverriddenPricesAndDurationData

		return (
			<div className={'flex gap-1 items-center'}>
				{field?.useCategoryParameter ? (
					<div>{field?.serviceCategoryParameterName}</div>
				) : (
					renderPriceAndDurationInfo(salonPriceAndDuration, employeePriceAndDuration, hasOverridenData, salon.data?.currency.symbol)
				)}
				<Button
					htmlType={'button'}
					className={'ant-btn noti-btn'}
					size={'small'}
					icon={<EditIcon />}
					onClick={(e) => {
						e.stopPropagation()
						dispatch(initialize(FORM.EMPLOYEE_SERVICE_EDIT, field))
						setVisibleServiceEditModal(true)
					}}
					onKeyDown={(e) => e.stopPropagation()}
				/>
				<DeleteButton
					onConfirm={(e) => {
						e?.stopPropagation()
						fields.remove(index)
					}}
					onCancel={(e) => e?.stopPropagation()}
					smallIcon
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					size={'small'}
					entityName={t('loc:službu')}
					type={'default'}
					getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
					onlyIcon
				/>
			</div>
		)
	}

	const defaultActiveKeys = fields.reduce((acc: any, _cv: any, index: number) => {
		const fieldData = fields.get(index) as EmployeeServiceData
		if (fieldData?.hasOverriddenPricesAndDurationData) {
			return acc
		}
		return [fieldData.id, ...acc]
	}, [] as string[])

	return (
		<>
			<Collapse className={'collapse-list'} bordered={false} defaultActiveKey={defaultActiveKeys}>
				{fields.map((_field: any, index: number) => {
					const fieldData = fields.get(index) as EmployeeServiceData
					const categoryParameter = fieldData?.serviceCategoryParameter

					return (
						<Panel
							header={
								<div className={'flex items-center gap-2'}>
									<div className={'font-bold'}>{fieldData?.name}</div>
									<span className={'service-badge font-normal text-xxs p-1 leading-3'}>{fieldData?.category}</span>
								</div>
							}
							key={index}
							extra={genExtra(index, fieldData)}
							className={'employee-collapse-panel'}
							showArrow={false}
							collapsible={fieldData?.useCategoryParameter ? undefined : 'disabled'}
						>
							{fieldData?.useCategoryParameter ? (
								<div className={'flex flex-col pb-4'}>
									{categoryParameter?.map((parameterValue) => {
										const employeePriceAndDurationData = parameterValue?.employeePriceAndDurationData
										const salonPriceAndDurationData = parameterValue?.salonPriceAndDurationData

										return (
											<>
												<div className={'flex items-center justify-between px-2 py-1 min-h-10'} key={fieldData?.id}>
													<span>{parameterValue?.name}</span>
													{renderPriceAndDurationInfo(
														salonPriceAndDurationData,
														employeePriceAndDurationData,
														fieldData?.hasOverriddenPricesAndDurationData,
														salon.data?.currency.symbol
													)}
												</div>
												<Divider className={'m-0'} />
											</>
										)
									})}
								</div>
							) : null}
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

const EmployeeForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, addService, setVisibleServiceEditModal } = props
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
								{formValues?.services && formValues?.services.length > 1 ? t('loc:Pridať služby') : t('loc:Pridať službu')}
							</Button>
						</div>
						<FieldArray component={ListFields} name={'services'} salon={salon} setVisibleServiceEditModal={setVisibleServiceEditModal} />
					</div>
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
