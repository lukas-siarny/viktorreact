import React, { FC } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm, getFormValues, change, touch } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Form, Collapse, Button, Spin, Alert } from 'antd'
import cx from 'classnames'
import { isEmpty } from 'lodash'

// utils
import { FORM, PARAMETER_TYPE, STRINGS } from '../../../utils/enums'
import { arePriceAndDurationDataEmpty, renderPriceAndDurationInfo, showErrorNotification, validationNumberMin } from '../../../utils/helper'

// types
import { IEmployeeServiceEditForm } from '../../../types/interfaces'

// components
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'
import PopConfirmComponent from '../../../components/PopConfirmComponent'

// validations
import validateEmployeeServiceEditForm from './validateEmployeeServiceEditForm'

// assets
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../assets/icons/coupon.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'

// reducers
import { RootState } from '../../../reducers'

const { Panel } = Collapse

type ComponentProps = {
	loading?: boolean
	onResetData?: () => void
}

type Props = InjectedFormProps<IEmployeeServiceEditForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

type FieldData = NonNullable<IEmployeeServiceEditForm['serviceCategoryParameter']>[0]

const ParameterValues: FC<any> = (props) => {
	const { fields, salon, showDuration, form } = props

	const [t] = useTranslation()

	const categoryParameterErrors = form?.syncErrors?.serviceCategoryParameter || []
	const areAllParametersEmpty = !form?.values?.serviceCategoryParameter?.some((parameterValue: any) => !arePriceAndDurationDataEmpty(parameterValue.employeePriceAndDurationData))

	const genExtra = (fieldData: FieldData) => {
		const salonPriceAndDuration = fieldData?.salonPriceAndDurationData
		const employeePriceAndDuration = fieldData?.employeePriceAndDurationData

		// ked je to empty, tak znamena ze to neni pretazene
		const priceAndDurationDataEmpty = arePriceAndDurationDataEmpty(employeePriceAndDuration)

		return renderPriceAndDurationInfo(salonPriceAndDuration, employeePriceAndDuration, !priceAndDurationDataEmpty, salon.data?.currency.symbol)
	}

	const defaultActiveKeys = fields.map((_: any, i: number) => i)
	let parameterError = ''

	if (!isEmpty(categoryParameterErrors)) {
		parameterError = t('loc:Je potrebné vyplniť povinné údaje pre všetky hodnoty parametra')
	}

	return (
		<>
			{parameterError && <Alert message={parameterError} showIcon type={'error'} className={'noti-alert w-full mb-4'} />}
			<Collapse className={'collapse-list'} bordered={false} defaultActiveKey={defaultActiveKeys}>
				{fields.map((field: any, index: number) => {
					const fieldData = fields.get(index) as FieldData
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
											disabled={props.disabled}
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
											disabled={props.disabled}
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
												disabled={props.disabled}
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
										disabled={props.disabled}
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
										name={`${field}.employeePriceAndDurationData.priceFrom`}
										precision={2}
										step={1}
										min={0}
										size={'large'}
										validate={[numberMin0]}
										disabled={props.disabled}
										required={!areAllParametersEmpty}
									/>
								</div>
								{variablePrice && (
									<div style={{ flex: '1 1 50%' }}>
										<Field
											component={InputNumberField}
											label={t('loc:Cena do ({{symbol}})', { symbol: salon.data?.currency.symbol })}
											placeholder={salon.data?.currency.symbol}
											name={`${field}.employeePriceAndDurationData.priceTo`}
											precision={2}
											step={1}
											min={0}
											size={'large'}
											validate={[numberMin0]}
											disabled={props.disabled}
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

	const hasPermission = true
	const showResetButton = (!useCategoryParameter && formValues?.hasOverriddenPricesAndDurationData) || (useCategoryParameter && false)
	const isRequired = !arePriceAndDurationDataEmpty(formValues?.employeePriceAndDurationData)

	return (
		<Spin spinning={loading}>
			<Form id={`${FORM.EMPLOYEE}-form`} layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
				<div className={'mt-2 mb-4'}>
					{useCategoryParameter ? (
						<FieldArray
							component={ParameterValues}
							name={'serviceCategoryParameter'}
							salon={salon}
							disabled={!hasPermission}
							showDuration={formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME}
							form={form}
						/>
					) : (
						<>
							<div className={'flex w-full gap-2'}>
								<div className={'mt-5 w-50 shrink-0'}>
									<Field
										disabled={!hasPermission}
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
										disabled={!hasPermission}
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
											disabled={!hasPermission}
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
										disabled={!hasPermission}
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
											disabled={!hasPermission}
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
					{/* TODO: dorobit logiku potom ked budu z BE chodit data aj pre paramater + ikonky */}
					{showResetButton && (
						<PopConfirmComponent
							title={t('loc:Naozaj chcete vymazať nastavenia služby pre zamestnanca? Zamestnanocvi sa nastavia hodnoty podľa nastavania služby salónu.')}
							onConfirm={onResetData}
							okText={t('loc:Pokračovať')}
							style={{ maxWidth: 500 }}
							allowedButton={
								<Button className='noti-btn w-1/2' size='large' type='dashed' htmlType='button' disabled={loading} loading={loading}>
									{t('loc:Vymazať nastavenia')}
								</Button>
							}
						/>
					)}
					<Button
						className={cx('noti-btn', { 'w-1/2': showResetButton, 'w-full': !showResetButton })}
						size='large'
						type='primary'
						htmlType='submit'
						disabled={pristine || loading}
						loading={loading}
					>
						{STRINGS(t).save(t('nastavenia'))}
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
