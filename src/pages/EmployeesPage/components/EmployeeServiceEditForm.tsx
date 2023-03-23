import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm, getFormValues, change, touch, WrappedFieldArrayProps } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Form, Collapse, Button, Spin, Alert } from 'antd'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import i18next from 'i18next'

// utils
import { FORM, PARAMETER_TYPE, STRINGS, SUBMIT_BUTTON_ID } from '../../../utils/enums'
import { arePriceAndDurationDataEmpty, formFieldID, renderPriceAndDurationInfo, showErrorNotification, validationNumberMin } from '../../../utils/helper'

// types
import { IEmployeeServiceEditForm } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// components
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'
import PopConfirmComponent from '../../../components/PopConfirmComponent'
import ServiceBreadcrumbs from '../../ServicesPage/components/ServiceBreadcrumbs'
import AvatarComponents from '../../../components/AvatarComponents'

// validations
import validateEmployeeServiceEditForm from './validateEmployeeServiceEditForm'

// assets
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as BinIcon } from '../../../assets/icons/bin-icon.svg'
import { ReactComponent as QuestionIcon } from '../../../assets/icons/question.svg'
import { ReactComponent as CloudOfflineIcon } from '../../../assets/icons/cloud-offline.svg'

const { Panel } = Collapse

type ComponentProps = {
	loading?: boolean
	onResetData?: () => void
}

type Props = InjectedFormProps<IEmployeeServiceEditForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const validateParameterValues = (_serviceCategoryParameterValues: IEmployeeServiceEditForm['serviceCategoryParameter'], allFormValues: IEmployeeServiceEditForm) => {
	if (!isEmpty(validateEmployeeServiceEditForm(allFormValues).serviceCategoryParameter)) {
		return i18next.t('loc:Je potrebné vyplniť povinné údaje pre všetky hodnoty parametra')
	}
	return undefined
}

type FieldData = NonNullable<IEmployeeServiceEditForm['serviceCategoryParameter']>[0]

type ParameterValuesFieldType = WrappedFieldArrayProps<FieldData> & {
	currencySymbol?: string
	form: any
}

const ParameterValuesField: FC<ParameterValuesFieldType> = (props) => {
	const { fields, currencySymbol, form, meta } = props

	const formValues = form?.values as IEmployeeServiceEditForm

	const showDuration = formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME

	const [t] = useTranslation()

	const categoryParameterErrors = form?.syncErrors?.serviceCategoryParameter || []
	const areAllParametersEmpty = !formValues?.serviceCategoryParameter?.some((parameterValue) => !arePriceAndDurationDataEmpty(parameterValue.employeePriceAndDurationData))

	const genExtra = (fieldData: FieldData) => {
		const salonPriceAndDuration = fieldData?.salonPriceAndDurationData
		const employeePriceAndDuration = fieldData?.employeePriceAndDurationData

		// ked je to empty, tak znamena ze to neni pretazene
		const priceAndDurationDataEmpty = arePriceAndDurationDataEmpty(employeePriceAndDuration)

		return renderPriceAndDurationInfo(salonPriceAndDuration, employeePriceAndDuration, !priceAndDurationDataEmpty, currencySymbol)
	}

	const defaultActiveKeys = fields.map((_, i: number) => i)

	return (
		<>
			{meta.error && <Alert message={meta.error} showIcon type={'error'} className={'noti-alert w-full mb-4'} />}
			<Collapse className={'collapse-list'} bordered={false} defaultActiveKey={defaultActiveKeys}>
				{fields.map((field, index: number) => {
					const fieldData = fields.get(index)
					const variableDuration = fieldData?.employeePriceAndDurationData?.variableDuration
					const variablePrice = fieldData?.employeePriceAndDurationData?.variablePrice
					const hasError = categoryParameterErrors[index]?.error

					return (
						<Panel
							header={
								<div className={'flex align-center'}>
									<div className={'list-title leading-7'}>{fieldData?.name}</div>
								</div>
							}
							key={index}
							forceRender
							extra={genExtra(fieldData)}
							className={cx({ 'collapse-header-has-error': hasError })}
							showArrow={false}
						>
							{showDuration && (
								<div className={'flex w-full gap-2'}>
									<div className={'mt-5 w-50 shrink-0'}>
										<Field
											className={'mb-0'}
											component={SwitchField}
											label={t('loc:Variabilné trvanie')}
											name={`${field}.employeePriceAndDurationData.variableDuration`}
											size={'middle'}
										/>
									</div>
									<div style={{ flex: variableDuration ? '1 1 50%' : '1 1 auto' }}>
										<Field
											component={InputNumberField}
											label={variableDuration ? t('loc:Trvanie od (minúty)') : t('loc:Trvanie (minúty)')}
											placeholder={t('loc:min')}
											name={`${field}.employeePriceAndDurationData.durationFrom`}
											precision={0}
											step={1}
											min={0}
											max={999}
											size={'large'}
											validate={[numberMin0]}
											required={variableDuration}
										/>
									</div>
									{variableDuration && (
										<div style={{ flex: '1 1 50%' }}>
											<Field
												component={InputNumberField}
												label={t('loc:Trvanie do (minúty)')}
												placeholder={t('loc:min')}
												name={`${field}.employeePriceAndDurationData.durationTo`}
												precision={0}
												step={1}
												min={0}
												max={999}
												size={'large'}
												validate={[numberMin0]}
												required={!areAllParametersEmpty}
											/>
										</div>
									)}
								</div>
							)}
							<div className={'flex w-full gap-2'}>
								<div className={'mt-5 w-50 shrink-0'}>
									<Field
										className={'mb-0'}
										component={SwitchField}
										label={t('loc:Variabilná cena')}
										name={`${field}.employeePriceAndDurationData.variablePrice`}
										size={'middle'}
									/>
								</div>
								<div style={{ flex: variablePrice ? '1 1 50%' : '1 1 auto' }}>
									<Field
										component={InputNumberField}
										label={variablePrice ? t('loc:Cena od ({{symbol}})', { symbol: currencySymbol }) : t('loc:Cena ({{symbol}})', { symbol: currencySymbol })}
										placeholder={currencySymbol}
										name={`${field}.employeePriceAndDurationData.priceFrom`}
										precision={2}
										step={1}
										min={0}
										size={'large'}
										validate={[numberMin0]}
										required={!areAllParametersEmpty}
									/>
								</div>
								{variablePrice && (
									<div style={{ flex: '1 1 50%' }}>
										<Field
											component={InputNumberField}
											label={t('loc:Cena do ({{symbol}})', { symbol: currencySymbol })}
											placeholder={currencySymbol}
											name={`${field}.employeePriceAndDurationData.priceTo`}
											precision={2}
											step={1}
											min={0}
											size={'large'}
											validate={[numberMin0]}
											required={!areAllParametersEmpty}
										/>
									</div>
								)}
							</div>
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

const EmployeeServiceEditForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit, loading, pristine, onResetData } = props
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE_SERVICE_EDIT])
	const formValues: Partial<IEmployeeServiceEditForm> = useSelector((state: RootState) => getFormValues(FORM.EMPLOYEE_SERVICE_EDIT)(state))
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const dispatch = useDispatch()

	const variableDuration = formValues?.employeePriceAndDurationData?.variableDuration
	const variablePrice = formValues?.employeePriceAndDurationData?.variablePrice
	const useCategoryParameter = formValues?.useCategoryParameter

	const showResetButton = formValues?.hasOverriddenPricesAndDurationData
	const isRequired = !arePriceAndDurationDataEmpty(formValues?.employeePriceAndDurationData)
	const employee = formValues?.employee

	return (
		<Spin spinning={loading}>
			<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
				<div className={'flex justify-between gap-1 flex-wrap'}>
					<div className={'flex items-center gap-2'}>
						{employee?.image ? (
							<AvatarComponents className='w-5 h-5' src={employee?.image} />
						) : (
							<div className={'w-5 h-5 shrink-0 bg-notino-gray'} style={{ borderRadius: '50%' }} />
						)}
						<span className={'font-bold'}>{employee?.name || employee?.email || employee?.inviteEmail || employee?.id}</span>
						{employee?.hasActiveAccount === false && !employee?.inviteEmail ? <QuestionIcon width={16} height={16} /> : undefined}
						{employee?.hasActiveAccount === false && employee.inviteEmail ? <CloudOfflineIcon width={16} height={16} /> : undefined}
					</div>
					<ServiceBreadcrumbs wrapperClassname={'text-xs'} breadcrumbs={[formValues?.industry, formValues?.name]} />
				</div>
				<div className={'mt-6 mb-6'}>
					{useCategoryParameter ? (
						<FieldArray
							component={ParameterValuesField as any}
							name={'serviceCategoryParameter'}
							showDuration={formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME}
							form={form}
							currencySymbol={salon.data?.currency.symbol}
							validate={validateParameterValues}
						/>
					) : (
						<>
							<div className={'flex w-full gap-2'}>
								<div className={'mt-5 w-50 shrink-0'}>
									<Field
										className={'mb-0'}
										component={SwitchField}
										customOnChange={(checked: boolean) => {
											dispatch(change(FORM.EMPLOYEE_SERVICE_EDIT, 'employeePriceAndDurationData.variableDuration', checked))
											dispatch(touch(FORM.EMPLOYEE_SERVICE_EDIT, 'employeePriceAndDurationData.durationFrom', 'employeePriceAndDurationData.durationTo'))
										}}
										label={t('loc:Variabilné trvanie')}
										name={'employeePriceAndDurationData.variableDuration'}
										size={'large'}
									/>
								</div>
								<div style={{ flex: variableDuration ? '1 1 50%' : '1 1 auto' }}>
									<Field
										component={InputNumberField}
										label={variableDuration ? t('loc:Trvanie od (minúty)') : t('loc:Trvanie (minúty)')}
										placeholder={t('loc:min')}
										name='employeePriceAndDurationData.durationFrom'
										precision={0}
										step={1}
										min={0}
										max={999}
										size={'large'}
										validate={[numberMin0]}
										required={variableDuration}
									/>
								</div>

								{variableDuration && (
									<div style={{ flex: '1 1 50%' }}>
										<Field
											component={InputNumberField}
											label={t('loc:Trvanie do (minúty)')}
											placeholder={t('loc:min')}
											name='employeePriceAndDurationData.durationTo'
											precision={0}
											step={1}
											min={0}
											max={999}
											size={'large'}
											validate={[numberMin0]}
											required={isRequired}
										/>
									</div>
								)}
							</div>
							<div className={'flex w-full gap-2'}>
								<div className={'mt-5 w-50 shrink-0'}>
									<Field
										className={'mb-0'}
										component={SwitchField}
										customOnChange={(checked: boolean) => {
											dispatch(change(FORM.EMPLOYEE_SERVICE_EDIT, 'employeePriceAndDurationData.variablePrice', checked))
											dispatch(touch(FORM.EMPLOYEE_SERVICE_EDIT, 'employeePriceAndDurationData.priceFrom', 'employeePriceAndDurationData.priceTo'))
										}}
										label={t('loc:Variabilná cena')}
										name={'employeePriceAndDurationData.variablePrice'}
										size={'large'}
									/>
								</div>
								<div style={{ flex: variablePrice ? '1 1 50%' : '1 1 auto' }}>
									<Field
										component={InputNumberField}
										label={
											variablePrice
												? t('loc:Cena od ({{symbol}})', { symbol: salon.data?.currency.symbol })
												: t('loc:Cena ({{symbol}})', { symbol: salon.data?.currency.symbol })
										}
										placeholder={salon.data?.currency.symbol}
										name='employeePriceAndDurationData.priceFrom'
										precision={2}
										step={1}
										min={0}
										size={'large'}
										validate={[numberMin0]}
										required={isRequired}
									/>
								</div>
								{variablePrice && (
									<div style={{ flex: '1 1 50%' }}>
										<Field
											component={InputNumberField}
											label={t('loc:Cena do ({{symbol}})', { symbol: salon.data?.currency.symbol })}
											placeholder={salon.data?.currency.symbol}
											name='employeePriceAndDurationData.priceTo'
											precision={2}
											step={1}
											min={0}
											size={'large'}
											validate={[numberMin0]}
											required={isRequired}
										/>
									</div>
								)}
							</div>
						</>
					)}
				</div>
				<div className={'flex gap-4'}>
					{showResetButton && (
						<PopConfirmComponent
							title={t('loc:Naozaj chcete vymazať nastavenia služby pre zamestnanca? Zamestnanocvi sa nastavia hodnoty podľa nastavania služby salónu.')}
							onConfirm={onResetData}
							okText={t('loc:Pokračovať')}
							style={{ maxWidth: 500 }}
							allowedButton={
								<Button className='noti-btn w-1/2' size='large' type='dashed' htmlType='button' icon={<BinIcon />} disabled={loading} loading={loading}>
									{STRINGS(t).delete(t('loc:nastavenia'))}
								</Button>
							}
						/>
					)}
					<Button
						id={formFieldID(FORM.EMPLOYEE_SERVICE_EDIT, SUBMIT_BUTTON_ID)}
						className={cx('noti-btn', { 'w-1/2': showResetButton, 'w-full': !showResetButton })}
						size='large'
						type='primary'
						htmlType='submit'
						disabled={pristine || loading}
						loading={loading}
						icon={<EditIcon />}
					>
						{STRINGS(t).save(t('loc:nastavenia'))}
					</Button>
				</div>
			</Form>
		</Spin>
	)
}

const form = reduxForm<IEmployeeServiceEditForm, ComponentProps>({
	form: FORM.EMPLOYEE_SERVICE_EDIT,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateEmployeeServiceEditForm
})(EmployeeServiceEditForm)

export default form
