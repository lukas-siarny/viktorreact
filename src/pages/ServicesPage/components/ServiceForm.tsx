import React, { MouseEventHandler, ReactNode, useCallback, useState, FC } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Collapse, Divider, Form, Row, Space, Spin, Tag } from 'antd'
import { isEmpty, get, isNil } from 'lodash'
import cx from 'classnames'

// atoms
import SelectField from '../../../atoms/SelectField'
import validateServiceForm from './validateServiceForm'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'

// components
import DeleteButton from '../../../components/DeleteButton'
import AvatarComponents from '../../../components/AvatarComponents'

// reducers
import { RootState } from '../../../reducers'

// utils
import { showErrorNotification, validationNumberMin } from '../../../utils/helper'
import { FILTER_ENTITY, FORM, NOTIFICATION_TYPE, PARAMETER_TYPE, SALON_PERMISSION, STRINGS } from '../../../utils/enums'
import { deleteReq } from '../../../utils/request'
import { history } from '../../../utils/history'
import searchWrapper from '../../../utils/filters'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// types
import { IServiceForm } from '../../../types/interfaces'

// assets
import { ReactComponent as CreateIcon } from '../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../assets/icons/coupon.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/icons/question.svg'
import { ReactComponent as CloudOfflineIcon } from '../../../assets/icons/cloud-offline.svg'
import { ReactComponent as EmployeesIcon } from '../../../assets/icons/employees.svg'
import { ReactComponent as SettingIcon } from '../../../assets/icons/setting.svg'

const { Panel } = Collapse

const numberMin0 = validationNumberMin(0)

type ComponentProps = {
	serviceID?: string
	backUrl?: string
	salonID: string
	addEmployee: MouseEventHandler<HTMLElement>
}

type Props = InjectedFormProps<IServiceForm, ComponentProps> & ComponentProps

const renderFromTo = (from: number | undefined | null, to: number | undefined | null, variable: boolean, icon: ReactNode, extra?: string) => {
	if (!isNil(from) || !isNil(to)) {
		return (
			<div className={'flex items-center mr-3'}>
				{icon}
				{from}
				{variable && !isNil(to) && from !== to ? ` - ${to}` : undefined} {extra}
			</div>
		)
	}
	return undefined
}

const validateParameterValuePriceAndDuration = (value: string, allValues: any, props: any, name: string) => {
	const [pathToParameterValue, key] = name.split('.')
	const parameterValueFormValues = get(allValues, pathToParameterValue)
	if ((!parameterValueFormValues?.variablePrice && key === 'priceTo') || (!parameterValueFormValues?.variableDuration && key === 'durationTo')) {
		return undefined
	}
	if (parameterValueFormValues?.useParameter && isNil(value)) {
		return i18next.t('loc:Toto pole je povinné')
	}
	return undefined
}

const renderParameterValues = (props: any) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [t] = useTranslation()
	const {
		fields,
		meta: { error, invalid },
		salon,
		showDuration,
		form
		// NOTE: DEFAULT_ACTIVE_KEYS_SERVICES - najdi vsetky komenty s tymto klucom pre spojazdnenie funkcionality
		// dispatch
	} = props

	// NOTE: DEFAULT_ACTIVE_KEYS_SERVICES - najdi vsetky komenty s tymto klucom pre spojazdnenie funkcionality
	// const formValues = form?.values
	const formErrors = form?.syncErrors?.serviceCategoryParameter || []
	const formFields = form?.fields?.serviceCategoryParameter || []

	const genExtra = (index: number, fieldData: any, field: any) => {
		return (
			<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
				<div className={'flex'}>
					{showDuration && renderFromTo(fieldData?.durationFrom, fieldData?.durationTo, fieldData?.variableDuration, <ClockIcon className={'mr-1'} />, t('loc:min'))}
					{renderFromTo(fieldData?.priceFrom, fieldData?.priceTo, fieldData?.variablePrice, <CouponIcon className={'mr-1'} />, salon.data?.currency.symbol)}
					<Field
						className={'mb-0 pb-0'}
						component={SwitchField}
						onClick={(checked: boolean, event: Event) => event.stopPropagation()}
						name={`${field}.useParameter`}
						size={'middle'}
						// NOTE: DEFAULT_ACTIVE_KEYS_SERVICES - najdi vsetky komenty s tymto klucom pre spojazdnenie funkcionality
						/* customOnChange={(checked: boolean) => {
							const keys = formValues?.activeKeys || []
							const newActiveKeys = checked ? [...keys, fieldData.id] : keys.filter((key: string) => key !== fieldData.id)
							dispatch(change(FORM.SERVICE_FORM, `serviceCategoryParameter[${index}]useParameter`, checked))
							dispatch(change(FORM.SERVICE_FORM, 'activeKeys', newActiveKeys))
						}} */
					/>
				</div>
			</div>
		)
	}

	return (
		<>
			{invalid && error && (
				<div role='alert' className='ant-form-item-explain-error'>
					{error}
				</div>
			)}
			<Collapse
				className={cx('collapse-list', { 'error-border': invalid && error })}
				bordered={false}
				// NOTE: DEFAULT_ACTIVE_KEYS_SERVICES - najdi vsetky komenty s tymto klucom pre spojazdnenie funkcionality
				/* activeKey={formValues?.activeKeys}
				onChange={(keys) => {
					dispatch(change(FORM.SERVICE_FORM, 'activeKeys', keys))
				}} */
			>
				{fields.map((field: any, index: number) => {
					const fieldData = fields.get(index)
					const variableDuration = fieldData?.variableDuration
					const variablePrice = fieldData?.variablePrice
					const useParameter = fieldData?.useParameter
					const hasError = !isEmpty(formErrors[index])
					const isTouched = !isEmpty(formFields[index])

					return (
						<Panel
							header={
								<div className={'flex align-center'}>
									<div className={'list-title leading-7'}>{fieldData?.name}</div>
								</div>
							}
							// NOTE: DEFAULT_ACTIVE_KEYS_SERVICES - najdi vsetky komenty s tymto klucom pre spojazdnenie funkcionality
							// key={fieldData.id}
							key={index}
							forceRender
							extra={genExtra(index, fieldData, field)}
							collapsible={useParameter ? undefined : 'disabled'}
							className={cx({ 'collapse-header-has-error': hasError && isTouched })}
						>
							{showDuration && (
								<Row gutter={8} align='top' justify='center'>
									<Col className={'mt-5'} span={8}>
										<Field
											className={'mb-0'}
											component={SwitchField}
											label={t('loc:Variabilné trvanie')}
											name={`${field}.variableDuration`}
											size={'middle'}
											disabled={!useParameter}
										/>
									</Col>
									<Col span={variableDuration ? 8 : 16}>
										<Field
											component={InputNumberField}
											label={variableDuration ? t('loc:Trvanie od (minúty)') : t('loc:Trvanie (minúty)')}
											placeholder={t('loc:min')}
											name={`${field}.durationFrom`}
											precision={0}
											step={1}
											min={0}
											max={999}
											size={'large'}
											validate={[numberMin0, validateParameterValuePriceAndDuration]}
											disabled={!useParameter}
											required
										/>
									</Col>
									{variableDuration && (
										<Col span={8}>
											<Field
												component={InputNumberField}
												label={t('loc:Trvanie do (minúty)')}
												placeholder={t('loc:min')}
												name={`${field}.durationTo`}
												precision={0}
												step={1}
												min={0}
												max={999}
												size={'large'}
												validate={[numberMin0, validateParameterValuePriceAndDuration]}
												disabled={!useParameter}
												required
											/>
										</Col>
									)}
								</Row>
							)}
							<Row gutter={8} align='top' justify='center'>
								<Col className={'mt-5'} span={8}>
									<Field
										className={'mb-0'}
										component={SwitchField}
										label={t('loc:Variabilná cena')}
										name={`${field}.variablePrice`}
										size={'middle'}
										disabled={!useParameter}
									/>
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
										name={`${field}.priceFrom`}
										precision={2}
										step={1}
										min={0}
										// max={99999}
										size={'large'}
										validate={[numberMin0, validateParameterValuePriceAndDuration]}
										disabled={!useParameter}
										required
									/>
								</Col>
								{variablePrice && (
									<Col span={8}>
										<Field
											component={InputNumberField}
											label={t('loc:Cena do ({{symbol}})', { symbol: salon.data?.currency.symbol })}
											placeholder={salon.data?.currency.symbol}
											name={`${field}.priceTo`}
											precision={2}
											step={1}
											min={0}
											// max={99999}
											size={'large'}
											validate={[numberMin0, validateParameterValuePriceAndDuration]}
											disabled={!useParameter}
											required
										/>
									</Col>
								)}
							</Row>
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

export const renderEmployees = (props: any) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [t] = useTranslation()
	const { fields, salon, showDuration } = props

	const genExtra = (index: number, field: any) => (
		<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
			<div className={'flex'}>
				{field?.serviceCategoryParameter && field?.serviceCategoryParameter?.length >= 1 ? (
					<div className={'flex items-center justify-center mr-2'}>
						<div className={'title mr-2'}>{field?.serviceCategoryParameter[0]?.name}</div>
						{showDuration &&
							renderFromTo(
								field?.serviceCategoryParameter[0]?.durationFrom,
								field?.serviceCategoryParameter[0]?.durationTo,
								field?.serviceCategoryParameter[0]?.variableDuration,
								<ClockIcon className={'mr-1'} />
							)}
						{renderFromTo(
							field?.serviceCategoryParameter[0]?.priceFrom,
							field?.serviceCategoryParameter[0]?.priceTo,
							field?.serviceCategoryParameter[0]?.variablePrice,
							<CouponIcon className={'mr-1'} />,
							salon.data?.currency.symbol
						)}
						{field?.serviceCategoryParameter?.length > 1 && '...'}
					</div>
				) : (
					<>
						{showDuration && renderFromTo(field?.durationFrom, field?.durationTo, field?.variableDuration, <ClockIcon className={'mr-1'} />, t('loc:min'))}
						{renderFromTo(field?.priceFrom, field?.priceTo, field?.variablePrice, <CouponIcon className={'mr-1'} />, salon.data?.currency.symbol)}
					</>
				)}
				<DeleteButton
					onConfirm={() => {
						fields.remove(index)
					}}
					smallIcon
					size={'small'}
					entityName={t('loc:zamestnanca')}
					type={'default'}
					onlyIcon
				/>
			</div>
		</div>
	)

	return (
		<>
			<Collapse className={'collapse-list'} bordered={false} accordion={true}>
				{fields.map((field: any, index: number) => {
					const fieldData = fields.get(index)
					const collapsible = (fieldData?.durationFrom && fieldData?.priceFrom) || fieldData?.serviceCategoryParameter?.length > 1 ? undefined : 'disabled'

					return (
						<Panel
							header={
								<div className={'flex align-center'}>
									<div className={'title flex items-center'}>
										<AvatarComponents className='mr-2-5 w-7 h-7' src={fieldData?.image?.resizedImages?.small} fallBackSrc={fieldData?.image?.original} />
										{fieldData?.name || fieldData?.email || fieldData?.inviteEmail || fieldData?.id}
										{fieldData?.hasActiveAccount === false && !fieldData?.inviteEmail ? <QuestionIcon className='ml-4' width={20} height={20} /> : undefined}
										{fieldData?.hasActiveAccount === false && fieldData?.inviteEmail ? <CloudOfflineIcon className='ml-4' width={20} height={20} /> : undefined}
									</div>
								</div>
							}
							key={index}
							extra={genExtra(index, fieldData)}
							className={cx({ hideIcon: collapsible })}
							collapsible={collapsible}
						>
							{fieldData?.serviceCategoryParameter?.length > 1 &&
								fieldData?.serviceCategoryParameter?.map((parameterValue: any) => (
									<Tag className={'my-1'}>
										<div className={'title mr-2'}>{parameterValue?.name}</div>
										{showDuration &&
											renderFromTo(
												parameterValue?.durationFrom,
												parameterValue?.durationTo,
												parameterValue?.variableDuration,
												<ClockIcon className={'mr-1'} />
											)}
										{renderFromTo(
											parameterValue?.priceFrom,
											parameterValue?.priceTo,
											parameterValue?.variablePrice,
											<CouponIcon className={'mr-1'} />,
											salon.data?.currency.symbol
										)}
									</Tag>
								))}
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

const ServiceForm: FC<Props> = (props) => {
	const { salonID, serviceID, handleSubmit, pristine, addEmployee, backUrl } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])
	const formValues = form?.values
	const employees = useSelector((state: RootState) => state.employees.employees)
	const service = useSelector((state: RootState) => state.service.service)
	const categoriesLoading = useSelector((state: RootState) => state.categories.categories.isLoading)
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const isLoading = service.isLoading || categoriesLoading || isRemoving || salon.isLoading
	const submitting = false

	const variableDuration = formValues?.variableDuration
	const variablePrice = formValues?.variablePrice

	const onConfirmDelete = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			// toto 'undefined' je divne
			await deleteReq(`/api/b2b/admin/services/{serviceID}`, { serviceID: serviceID || 'undefined' }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			setIsRemoving(false)
			history.push(backUrl)
		} catch (e) {
			setIsRemoving(false)
		}
	}

	const searchEmployees = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search, salonID } as any, FILTER_ENTITY.EMPLOYEE)
		},
		[dispatch, salonID]
	)

	return (
		<div className='content-body small'>
			<Spin spinning={isLoading}>
				<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
					<div className={'flex items-center flex-wrap gap-1 mb-4'}>
						<div className={'service-badge'}>{service.data?.service?.category?.name}</div>
						<div className={'service-badge'}>{service.data?.service?.category?.child?.name}</div>
						<div className={'service-badge'}>{service.data?.service?.category?.child?.child?.name}</div>
					</div>
					<Space className={'w-full'} direction='vertical' size={36}>
						<div>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<SettingIcon className={'text-notino-black mr-2'} />
								{t('loc:Nastavenia')}
							</h3>
							<Divider className={'mb-3 mt-3'} />
							{!isEmpty(formValues?.serviceCategoryParameter) && (
								<Field className={'mb-0'} component={SwitchField} label={t('loc:Použiť parameter')} name={'useCategoryParameter'} size={'middle'} />
							)}
							{formValues?.useCategoryParameter ? (
								<div className={'my-2'}>
									<FieldArray
										component={renderParameterValues}
										name={'serviceCategoryParameter'}
										salon={salon}
										showDuration={formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME}
										form={form}
										// NOTE: DEFAULT_ACTIVE_KEYS_SERVICES - najdi vsetky komenty s tymto klucom pre spojazdnenie funkcionality
										// dispatch={dispatch}
									/>
								</div>
							) : (
								<div className={'mt-2'}>
									<Row gutter={8} align='top' justify='center'>
										<Col className={'mt-5'} span={8}>
											<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilné trvanie')} name={'variableDuration'} size={'middle'} />
										</Col>
										<Col span={variableDuration ? 8 : 16}>
											<Field
												component={InputNumberField}
												label={variableDuration ? t('loc:Trvanie od (minúty)') : t('loc:Trvanie (minúty)')}
												placeholder={t('loc:min')}
												name='durationFrom'
												precision={0}
												step={1}
												min={0}
												max={999}
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
													name='durationTo'
													precision={0}
													step={1}
													min={0}
													max={999}
													size={'large'}
													validate={[numberMin0]}
													required
												/>
											</Col>
										)}
									</Row>
									<Row gutter={8} align='top' justify='center'>
										<Col className={'mt-5'} span={8}>
											<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilná cena')} name={'variablePrice'} size={'middle'} />
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
												name='priceFrom'
												precision={2}
												step={1}
												min={0}
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
													name='priceTo'
													precision={2}
													step={1}
													min={0}
													size={'large'}
													validate={[numberMin0]}
													required
												/>
											</Col>
										)}
									</Row>{' '}
								</div>
							)}
						</div>
						<div>
							<h3 className={'mb-0 mt-0 flex items-center'}>
								<EmployeesIcon className={'text-notino-black mr-2'} />
								{t('loc:Priradení zamestnanci')}
							</h3>
							<Divider className={'mb-3 mt-3'} />
							<div className={'flex w-full flex-col md:flex-row md:gap-2'}>
								<Field
									label={t('loc:Zamestnanci')}
									size={'large'}
									className={'flex-1'}
									component={SelectField}
									allowClear
									placeholder={t('loc:Vyberte zamestnancov')}
									name={'employee'}
									onSearch={searchEmployees}
									filterOption={true}
									options={employees?.options}
									mode={'multiple'}
									showSearch
									allowInfinityScroll
								/>

								<Button
									type={'primary'}
									size={'middle'}
									className={'self-start noti-btn m-regular md:mt-5'}
									onClick={addEmployee}
									disabled={isEmpty(formValues?.employee)}
								>
									{formValues?.employees && formValues?.employees.length > 1 ? t('loc:Pridať zamestnancov') : t('loc:Pridať zamestnanca')}
								</Button>
							</div>
							<FieldArray
								component={renderEmployees}
								name={'employees'}
								salon={salon}
								showDuration={formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME}
							/>
							<div className={'content-footer pt-0'} id={'content-footer-container'}>
								<Row className={cx({ 'justify-between': serviceID, 'justify-center': !serviceID }, 'w-full')}>
									{serviceID ? (
										<DeleteButton
											className={'noti-btn mt-2-5 w-52 xl:w-60'}
											getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
											onConfirm={onConfirmDelete}
											entityName={t('loc:službu')}
											permissions={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SERVICE_DELETE]}
										/>
									) : null}

									<Button
										type={'primary'}
										className={'noti-btn mt-2-5 w-52 xl:w-60'}
										htmlType={'submit'}
										icon={serviceID ? <EditIcon /> : <CreateIcon />}
										disabled={submitting || pristine}
										loading={submitting}
									>
										{serviceID ? STRINGS(t).save(t('loc:službu')) : STRINGS(t).createRecord(t('loc:službu'))}
									</Button>
								</Row>
							</div>
						</div>
					</Space>
				</Form>
			</Spin>
		</div>
	)
}

const form = reduxForm<IServiceForm, ComponentProps>({
	form: FORM.SERVICE_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateServiceForm
})(withPromptUnsavedChanges(ServiceForm))

export default form
