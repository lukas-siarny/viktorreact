import React, { MouseEventHandler, ReactNode, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Collapse, Divider, Form, Row, Spin, Tag } from 'antd'
import { isEmpty, get } from 'lodash'
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
	if (from || to) {
		return (
			<div className={'flex items-center mr-3'}>
				{icon}
				{from}
				{variable && to ? ` - ${to}` : undefined} {extra}
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
	if (parameterValueFormValues?.useParameter && !value) {
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
		showDuration
	} = props

	const genExtra = (index: number, fieldData: any, field: any) => {
		return (
			<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
				<div className={'flex'}>
					{showDuration && renderFromTo(fieldData?.durationFrom, fieldData?.durationTo, fieldData?.variableDuration, <ClockIcon className={'mr-1'} />, t('loc:min'))}
					{renderFromTo(fieldData?.priceFrom, fieldData?.priceTo, fieldData?.variablePrice, <CouponIcon className={'mr-1'} />, salon.data?.currency.symbol)}
					<Field
						className={'mb-0'}
						component={SwitchField}
						onClick={(checked: boolean, event: Event) => event.stopPropagation()}
						name={`${field}.useParameter`}
						size={'middle'}
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
			<Collapse className={cx('collapse-list', { 'error-border': invalid && error })} bordered={false}>
				{fields.map((field: any, index: number) => {
					const fieldData = fields.get(index)
					const variableDuration = fieldData?.variableDuration
					const variablePrice = fieldData?.variablePrice
					const useParameter = fieldData?.useParameter
					return (
						<Panel
							header={
								<div className={'flex align-center'}>
									<div className={'list-title leading-7'}>{fieldData?.name}</div>
								</div>
							}
							key={index}
							extra={genExtra(index, fieldData, field)}
							collapsible={useParameter ? undefined : 'disabled'}
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
											maxChars={3}
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
												maxChars={3}
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
										maxChars={5}
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
											maxChars={5}
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
										{fieldData?.name}
										{fieldData?.hasActiveAccount === false && !fieldData?.inviteEmail ? <QuestionIcon width={20} height={20} /> : undefined}
										{fieldData?.hasActiveAccount === false && fieldData?.inviteEmail ? <CloudOfflineIcon width={20} height={20} /> : undefined}
									</div>
								</div>
							}
							key={index}
							extra={genExtra(index, fieldData)}
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

const ServiceForm = (props: Props) => {
	const { salonID, serviceID, handleSubmit, pristine, addEmployee, backUrl } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM]?.values)
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
		<Spin spinning={isLoading}>
			<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
				{`${service.data?.service?.category?.name} > ${service.data?.service?.category?.child?.name} > ${service.data?.service?.category?.child?.child?.name}`}
				<h3 className={'mb-0 mt-0 flex items-center'}>
					<SettingIcon className={'text-notino-black mr-2'} />
					{t('loc:Nastavenia')}
				</h3>
				<Divider className={'mb-3 mt-3'} />
				<Field className={'mb-0'} component={SwitchField} label={t('loc:Použiť parameter')} name={'useCategoryParameter'} size={'middle'} />
				{formValues?.useCategoryParameter ? (
					<div className={'my-2'}>
						<FieldArray
							component={renderParameterValues}
							name={'serviceCategoryParameter'}
							salon={salon}
							showDuration={formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME}
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
										name='durationTo'
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
										name='priceTo'
										precision={2}
										step={1}
										maxChars={5}
										size={'large'}
										validate={[numberMin0]}
										required
									/>
								</Col>
							)}
						</Row>{' '}
					</div>
				)}
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

					<Button type={'primary'} size={'middle'} className={'self-start noti-btn m-regular md:mt-5'} onClick={addEmployee} disabled={isEmpty(formValues?.employee)}>
						{formValues?.employees && formValues?.employees.length > 1 ? t('loc:Pridať zamestnancov') : t('loc:Pridať zamestnanca')}
					</Button>
				</div>
				<FieldArray component={renderEmployees} name={'employees'} salon={salon} showDuration={formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME} />
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
			</Form>
		</Spin>
	)
}

const form = reduxForm<IServiceForm, ComponentProps>({
	form: FORM.SERVICE_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateServiceForm
})(ServiceForm)

export default form
