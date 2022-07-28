import React, { FC, MouseEventHandler, ReactNode, useCallback, useEffect } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Collapse, Button, Tag } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'

// utils
import { isEmpty } from 'lodash'
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES, FILTER_ENTITY } from '../../../utils/enums'
import { showErrorNotification, showServiceCategory, validationNumberMin, checkUploadingBeforeSubmit } from '../../../utils/helper'
import searchWrapper from '../../../utils/filters'

// types
import { IEmployeeForm } from '../../../types/interfaces'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'
import ImgUploadField from '../../../atoms/ImgUploadField'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
import DeleteButton from '../../../components/DeleteButton'

// validations
import validateEmployeeForm from './validateEmployeeForm'

// reducers
import { getServices } from '../../../reducers/services/serviceActions'
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../assets/icons/coupon.svg'

const { Panel } = Collapse

type ComponentProps = {
	salonID: number
	addService: MouseEventHandler<HTMLElement>
}

type Props = InjectedFormProps<IEmployeeForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const renderListFields = (props: any) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [t] = useTranslation()
	const { fields, salon } = props

	const renderFromTo = (from: number | undefined | null, to: number | undefined | null, variable: boolean, icon: ReactNode, extra?: string) => (
		<div className={'flex items-center mr-3'}>
			{icon}
			{from}
			{variable && to ? ` - ${to}` : undefined} {extra}
		</div>
	)

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

	const genExtra = (index: number, field: any) => (
		<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
			<div className={'flex'}>
				{renderFromTo(field?.employeeData?.durationFrom, field?.employeeData?.durationTo, field?.variableDuration, <ClockIcon className={'mr-1'} />, t('loc:min'))}
				{renderFromTo(field?.employeeData?.priceFrom, field?.employeeData?.priceTo, field?.variablePrice, <CouponIcon className={'mr-1'} />, salon.data?.currency.symbol)}
			</div>
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

	return (
		<>
			<Collapse className={'collapse-list'} bordered={false}>
				{fields.map((field: any, index: number) => {
					const fieldData = fields.get(index)
					const variableDuration = fieldData?.variableDuration
					const variablePrice = fieldData?.variablePrice
					const category = fieldData?.category?.child ? showServiceCategory(fieldData?.category) : fieldData?.category?.name
					return (
						<Panel
							header={
								<div className={'flex align-center'}>
									<div
										className={cx('list-title leading-7', {
											'changed-service-title': compareSalonAndEmployeeData(fieldData)
										})}
									>
										{fieldData?.name}
									</div>
									<Tag className={'ml-5'}>{category}</Tag>
								</div>
							}
							key={index}
							extra={genExtra(index, fieldData)}
						>
							<Row gutter={8} align='middle'>
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
							</Row>
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

const EmployeeForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, salonID, addService } = props

	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE].values)
	const services = useSelector((state: RootState) => state.service.services)
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	useEffect(() => {
		dispatch(getServices({ page: 1, salonID }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salonID])

	const searchService = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search, salonID } as any, FILTER_ENTITY.SERVICE)
		},
		[dispatch, salonID]
	)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit(checkUploadingBeforeSubmit)}>
			<Col className={'flex'}>
				<Row className={'mx-9 w-full h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Osobné údaje')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<div className={'flex space-between w-full'}>
						<div className={'w-1/5'}>
							<Field
								className={'m-0'}
								component={ImgUploadField}
								name={'avatar'}
								label={t('loc:Avatar')}
								signUrl={URL_UPLOAD_IMAGES}
								category={UPLOAD_IMG_CATEGORIES.EMPLOYEE}
								multiple={false}
								maxCount={1}
							/>
						</div>

						<div className={'w-full'}>
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
					<h3>{t('loc:Zoznam priradených služieb')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<div className={'flex w-full flex-col md:flex-row md:gap-2'}>
						<Field
							label={t('loc:Služby')}
							className={'flex-1'}
							size={'large'}
							component={SelectField}
							allowClear
							placeholder={t('loc:Vyberte služby')}
							name={'service'}
							onSearch={searchService}
							filterOption={true}
							mode={'multiple'}
							options={services?.options}
							showSearch
							allowInfinityScroll
							formName={FORM.EMPLOYEE}
						/>
						<Button type={'primary'} size={'middle'} className={'self-start noti-btn m-regular md:mt-5'} onClick={addService} disabled={isEmpty(formValues?.service)}>
							{t('loc:Pridať službu')}
						</Button>
					</div>
					<FieldArray component={renderListFields} name={'services'} salon={salon} />
				</Row>
			</Col>
		</Form>
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
