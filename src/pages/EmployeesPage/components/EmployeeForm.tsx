import React, { FC, MouseEventHandler /* , ReactNode */ } from 'react'
import { Field, /* FieldArray, */ InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row /* , Collapse, Tag */, Space } from 'antd'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
// import cx from 'classnames'

// utils
import { ENUMERATIONS_KEYS, FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { getCountryPrefix, showErrorNotification /* , showServiceCategory, validationNumberMin */ } from '../../../utils/helper'

// types
import { IEmployeeForm } from '../../../types/interfaces'

// atoms
import InputField from '../../../atoms/InputField'
import ImgUploadField from '../../../atoms/ImgUploadField'
// import InputNumberField from '../../../atoms/InputNumberField'
// import SwitchField from '../../../atoms/SwitchField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'
// import DeleteButton from '../../../components/DeleteButton'

// validations
import validateEmployeeForm from './validateEmployeeForm'

// reducers
import { RootState } from '../../../reducers'

// assets
/* import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../assets/icons/coupon.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg' */
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon.svg'
import { ReactComponent as UserIcon } from '../../../assets/icons/user-icon.svg'

// const { Panel } = Collapse

type ComponentProps = {
	salonID: string
	addService: MouseEventHandler<HTMLElement>
}

type Props = InjectedFormProps<IEmployeeForm, ComponentProps> & ComponentProps
/**
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
} */

const EmployeeForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { handleSubmit } = props

	// const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE]?.values) as any
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	const phonePrefix = getCountryPrefix(countriesData.data, formValues?.user?.phonePrefixCountryCode)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Space className={'w-full px-9'} direction='vertical' size={36}>
				{!isEmpty(formValues?.user) && (
					<div>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<UserIcon className={'text-notino-black mr-2'} />
							{t('loc:Používateľský profil')}
						</h3>
						<Divider className={'mb-3 mt-3'} />
						<div className={'flex space-between w-full flex-wrap'}>
							<Field
								className={'m-0 mr-5'}
								component={ImgUploadField}
								name={'user.image'}
								label={t('loc:Avatar')}
								signUrl={URL_UPLOAD_IMAGES}
								category={UPLOAD_IMG_CATEGORIES.EMPLOYEE}
								multiple={false}
								maxCount={1}
								disabled
							/>
							<div className={'flex-1 mt-5'}>
								<ul className='list-none pl-0'>
									<li className='mb-2'>
										<strong>{t('loc:Meno a Priezvisko')}:</strong> {formValues?.user?.fullName}
										<Divider className={'mb-0 mt-2'} />
									</li>
									<li className='mb-2'>
										<strong>{t('loc:Email')}:</strong>{' '}
										<span className='break-all'>
											{formValues?.user?.email ? <a href={`mailto:${formValues?.user?.email}`}>{formValues?.user?.email}</a> : '-'}
										</span>
										<Divider className={'mb-0 mt-2'} />
									</li>
									<li>
										<strong>{t('loc:Telefón')}:</strong>{' '}
										{phonePrefix && formValues?.user?.phone ? (
											<a href={`tel:${phonePrefix}${formValues?.user?.phone}`}>
												{phonePrefix} {formValues?.user?.phone}
											</a>
										) : (
											'-'
										)}
									</li>
								</ul>
							</div>
						</div>
					</div>
				)}

				<div>
					<h3 className={'mb-0 mt-0 flex items-center'}>
						<InfoIcon className={'text-notino-black mr-2'} /> {t('loc:Osobné údaje zamestnanca')}
					</h3>
					<Divider className={'mb-3 mt-3'} />
					<div className={'flex space-between w-full'}>
						<Field
							className={'m-0 mr-5'}
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
					{/* TODO - refactor assigned services
					<h3 className={'mb-0 mt-0 flex items-center'}>
						<ServiceIcon className={'text-notino-black mr-2'} /> {t('loc:Priradené služby')}
					</h3>
					<Divider className={'mb-3 mt-3'} />
					<FieldArray component={renderListFields} name={'services'} salon={salon} /> */}
				</div>
			</Space>
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
