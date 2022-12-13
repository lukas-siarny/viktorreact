import React, { FC, MouseEventHandler, ReactNode, useState } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm, getFormValues } from 'redux-form'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Space, Collapse, Tag, Button, Row, Col, Modal } from 'antd'
import cx from 'classnames'
import { isEmpty } from 'lodash'

// utils
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { renderFromTo, showErrorNotification, validationNumberMin } from '../../../utils/helper'

// types
import { IEmployeeForm, IEmployeeServiceEditForm } from '../../../types/interfaces'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'
import SelectField from '../../../atoms/SelectField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import DeleteButton from '../../../components/DeleteButton'

// validations
import validateEmployeeForm from './validateEmployeeForm'

// assets
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../assets/icons/coupon.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon-16.svg'

// reducers
import { RootState } from '../../../reducers'
import EmployeeServiceEditForm from './EmployeeServiceEditForm'
import { patchReq } from '../../../utils/request'
import { Paths } from '../../../types/api'
import { ServiceData2 } from '../EmployeePage'

const { Panel } = Collapse

type ComponentProps = {
	salonID: string
	addService: MouseEventHandler<HTMLElement>
}

type Props = InjectedFormProps<IEmployeeForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const renderListFields = (props: any) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [t] = useTranslation()
	const { fields, salon, setVisibleServiceEditModal } = props

	const compareSalonAndEmployeeData = (data: any): boolean => {
		const salonData = data?.salonData
		const employeeData = data?.employeeData
		let checkVariableDuration = true
		let checkVariablePrice = true
		if (data?.variableDuration) {
			checkVariableDuration = salonData?.durationTo === employeeData?.durationTo
		}
		if (data?.variablePrice) {
			checkVariablePrice = salonData?.priceTo === employeeData?.priceTo
		}
		return !(salonData?.durationFrom === employeeData?.durationFrom && salonData?.priceFrom === employeeData?.priceFrom && checkVariableDuration && checkVariablePrice)
	}

	const editButton = <Button htmlType={'button'} className={'ant-btn noti-btn'} size={'small'} icon={<EditIcon />} onClick={() => setVisibleServiceEditModal(true)} />

	const genExtra = (index: number, field: ServiceData2) => {
		return (
			<div className={'flex gap-1'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
				{field?.hasCategoryParameter ? (
					<div>{field?.categoryParameter?.name}</div>
				) : (
					<>
						<div className={'flex gap-1'}>
							{renderFromTo(field?.employeeData?.durationFrom, field?.employeeData?.durationTo, !!field?.variableDuration, <ClockIcon />, t('loc:min'))}
							{renderFromTo(field?.employeeData?.priceFrom, field?.employeeData?.priceTo, !!field?.variablePrice, <CouponIcon />, salon.data?.currency.symbol)}
						</div>
						{editButton}
					</>
				)}
				<DeleteButton
					onConfirm={() => {
						fields.remove(index)
					}}
					smallIcon
					size={'small'}
					entityName={t('loc:službu')}
					type={'default'}
					getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
					onlyIcon
				/>
			</div>
		)
	}

	const activeKeys = fields.map((_: any, i: number) => i)

	return (
		<>
			<Collapse className={'collapse-list'} bordered={false} activeKey={activeKeys}>
				{fields.map((field: any, index: number) => {
					const fieldData = fields.get(index) as ServiceData2
					const categoryParameter = fieldData?.categoryParameter

					return (
						<Panel
							header={
								<div className={'flex items-center gap-2'}>
									<div
										className={cx('font-bold', {
											'changed-service-title': compareSalonAndEmployeeData(fieldData)
										})}
									>
										{fieldData?.name}
									</div>
									<span className={'service-badge font-normal text-xs'}>{fieldData?.category}</span>
								</div>
							}
							key={index}
							extra={genExtra(index, fieldData)}
							className={'employee-collapse-panel'}
							showArrow={false}
							collapsible={'disabled'}
						>
							{fieldData?.hasCategoryParameter ? (
								<div className={'flex flex-col pb-4'}>
									{categoryParameter?.values?.map((parameterValue, i) => {
										const parameterDurationPrice = parameterValue.priceAndDurationData
										return (
											<div className={cx('flex items-center justify-between p-2 rounded', { 'bg-notino-white': i % 2 === 0 })}>
												<span className={''}>{parameterValue?.value}</span>
												<div className={'flex gap-3'}>
													{renderFromTo(
														parameterDurationPrice?.durationFrom,
														parameterDurationPrice?.durationTo,
														!!parameterValue.variableDuration,
														<ClockIcon />,
														t('loc:min')
													)}
													{renderFromTo(
														parameterDurationPrice?.priceFrom,
														parameterDurationPrice?.priceTo,
														!!parameterValue?.variablePrice,
														<CouponIcon />,
														salon.data?.currency.symbol
													)}
													{editButton}
												</div>
											</div>
										)
									})}
								</div>
							) : null}
							{/* TODO - for change duration and price in employee detail */}
							{/* <Row gutter={8} align='middle'>
								<Col span={8}>
									<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilné trvanie')} name={`${field}.variableDuration`} size={'middle'} />
								</Col>
								<Col span={variableDuration ? 8 : 16}>
									<Field
										component={InputNumberField}
										label={variableDuration ? t('loc:Trvanie od (minúty)') : t('loc:Trvanie (minúty)')}
										placeholder={t('loc:min')}
										name={`${field}.employeeData.durationFrom`}
										precision={0}
										step={1}
										maxChars={3}
										size={'large'}
										validate={[numberMin0]}
										required
									/>
								</Col>

								{variableDuration && (
									<Col span={8}>
										<Field
											component={InputNumberField}
											label={t('loc:Trvanie do (minúty)')}
											placeholder={t('loc:min')}
											name={`${field}.employeeData.durationTo`}
											precision={0}
											step={1}
											maxChars={3}
											size={'large'}
											validate={[numberMin0]}
											required
										/>
									</Col>
								)}
							</Row>
							<Divider />
							<Row gutter={8} align='middle'>
								<Col span={8}>
									<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilná cena')} name={`${field}.variablePrice`} size={'middle'} />
								</Col>
								<Col span={variablePrice ? 8 : 16}>
									<Field
										component={InputNumberField}
										label={
											variablePrice
												? t('loc:Cena od ({{symbol}})', { symbol: salon.data?.currency.symbol })
												: t('loc:Cena ({{symbol}})', { symbol: salon.data?.currency.symbol })
										}
										placeholder={salon.data?.currency.symbol}
										name={`${field}.employeeData.priceFrom`}
										precision={2}
										step={1}
										maxChars={5}
										size={'large'}
										validate={[numberMin0]}
										required
									/>
								</Col>
								{variablePrice && (
									<Col span={8}>
										<Field
											component={InputNumberField}
											label={t('loc:Cena do ({{symbol}})', { symbol: salon.data?.currency.symbol })}
											placeholder={salon.data?.currency.symbol}
											name={`${field}.employeeData.priceTo`}
											precision={2}
											step={1}
											maxChars={5}
											size={'large'}
											validate={[numberMin0]}
											required
										/>
									</Col>
								)}
								</Row> */}
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

export type ServicePatchBody = Paths.PatchApiB2BAdminEmployeesEmployeeIdServicesServiceId.RequestBody

const EmployeeForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, addService } = props
	const formValues: Partial<IEmployeeForm> = useSelector((state: RootState) => getFormValues(FORM.EMPLOYEE)(state))
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const services = useSelector((state: RootState) => state.service.services)

	const [visibleServiceEditModal, setVisibleServiceEditModal] = useState(false)

	const editEmployeeService = async (values: IEmployeeServiceEditForm) => {
		const serviceID = ''
		const employeeID = ''
		const serviceData: ServicePatchBody = {}
		await patchReq('/api/b2b/admin/employees/{employeeID}/services/{serviceID}', { employeeID, serviceID }, serviceData)
	}

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
						<FieldArray component={renderListFields} name={'services'} salon={salon} setVisibleServiceEditModal={setVisibleServiceEditModal} />
					</div>
				</Space>
			</Form>
			<Modal title={t('loc:Upraviť službu zamestnancovi')} width={500} visible={visibleServiceEditModal} onCancel={() => setVisibleServiceEditModal(false)} footer={null}>
				<EmployeeServiceEditForm onSubmit={editEmployeeService} />
			</Modal>
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
