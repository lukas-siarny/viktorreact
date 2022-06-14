import React, { FC, MouseEventHandler, ReactNode, useCallback, useEffect, useState } from 'react'
import { change, Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Collapse, Button, Tag, Popconfirm } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { showErrorNotification, showServiceCategory, validationNumberMin } from '../../../utils/helper'

// types
import { IEmployeeForm } from '../../../types/interfaces'

// atoms
import InputField from '../../../atoms/InputField'
import SelectField from '../../../atoms/SelectField'
import ImgUploadField from '../../../atoms/ImgUploadField'

// components
import PhoneWithPrefixField from '../../../components/PhoneWithPrefixField'

// validations
import validateEmployeeForm from './validateEmployeeForm'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'
import { getServices } from '../../../reducers/services/serviceActions'
import DeleteButton from '../../../components/DeleteButton'
import { RootState } from '../../../reducers'
import { searchSalonWrapper, searchServiceWrapper } from '../../../utils/filters'

// assets
import { ReactComponent as ClockIcon } from '../../../assets/icons/clock-icon.svg'
import { ReactComponent as CouponIcon } from '../../../assets/icons/coupon.svg'

const { Panel } = Collapse

type ComponentProps = {
	salonID: number | null | any
	addService: MouseEventHandler<HTMLElement>
}

type Props = InjectedFormProps<IEmployeeForm, ComponentProps> & ComponentProps

const numberMin0 = validationNumberMin(0)

const renderListFields = (props: any) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [t] = useTranslation()
	const { fields } = props

	const renderFromTo = (form: number | undefined | null, to: number | undefined | null, variable: boolean, icon: ReactNode) => (
		<div className={'flex items-center mr-3'}>
			{icon}
			{form}
			{variable && to ? ` - ${to}` : undefined}
		</div>
	)

	const genExtra = (index: number, field: any) => (
		<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
			<div className={'flex'}>
				{renderFromTo(field?.salonData?.durationFrom, field?.salonData?.durationTo, field?.variableDuration, <ClockIcon />)}
				{renderFromTo(field?.salonData?.priceFrom, field?.salonData?.priceTo, field?.variablePrice, <CouponIcon />)}
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
			<h3>{t('loc:Zoznam priradených služieb')}</h3>
			<Divider className={'mb-3 mt-3'} />
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
									<div className={'list-title leading-7'}>{fieldData?.name}</div>
									<Tag className={'ml-5'}>{category}</Tag>
								</div>
							}
							key={index}
							extra={genExtra(index, fieldData)}
						>
							<Row gutter={8}>
								<Col span={variableDuration ? 12 : 24}>
									<Field
										component={InputNumberField}
										label={variableDuration ? t('loc:Trvanie od') : t('loc:Trvanie')}
										placeholder={t('loc:min')}
										name={`${field}.salonData.durationFrom`}
										precision={0}
										step={1}
										maxChars={3}
										size={'large'}
										validate={[numberMin0]}
										required
									/>
								</Col>

								{variableDuration && (
									<Col span={12}>
										<Field
											component={InputNumberField}
											label={t('loc:Trvanie do')}
											placeholder={t('loc:min')}
											name={`${field}.salonData.durationTo`}
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
							<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilné trvanie')} name={`${field}.variableDuration`} size={'middle'} />
							<Divider />
							<Row gutter={8}>
								<Col span={variablePrice ? 12 : 24}>
									<Field
										component={InputNumberField}
										label={variablePrice ? t('loc:Cena od') : t('loc:Cena')}
										// TODO add currency
										// placeholder={t('loc:min')}
										name={`${field}.salonData.priceFrom`}
										precision={2}
										step={1}
										maxChars={5}
										size={'large'}
										validate={[numberMin0]}
										required
									/>
								</Col>
								{variablePrice && (
									<Col span={12}>
										<Field
											component={InputNumberField}
											label={t('loc:Cena do')}
											// TODO add currency
											// placeholder={t('loc:min')}
											name={`${field}.salonData.priceTo`}
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
							<Field className={'mb-0'} component={SwitchField} label={t('loc:Variabilná cena')} name={`${field}.variablePrice`} size={'middle'} />
						</Panel>
					)
				})}
			</Collapse>
		</>
	)
}

export const parseSalonID = (salonID: any) => {
	if (salonID?.value) {
		return salonID?.value
	}
	return salonID
}

const EmployeeForm: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { handleSubmit, salonID, addService } = props
	const [confVisibility, setConfVisibility] = useState<boolean>(false)
	const [initSalonId, setInitSalonId] = useState<number>()
	const [prevSalonID, setPrevSalonID] = useState<number>()

	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE]?.values)
	const services = useSelector((state: RootState) => state.service.services)
	const employee = useSelector((state: RootState) => state.employees.employee)
	const salons = useSelector((state: RootState) => state.salons.salons)

	const parsedSalonID = parseSalonID(salonID)

	const getSalonName = (id: number) => {
		const filteredSalon: any = salons?.data?.salons?.filter((salon) => salon?.id === id)
		return filteredSalon?.name
	}

	// parser salon option, when user cancel options selection
	const parseSalonOption = (salon: any) => {
		if (salon?.label) {
			return salon
		}
		const salonLabel = getSalonName(salon)
		return { label: salonLabel, value: salon }
	}

	useEffect(() => {
		// save init salon id
		setInitSalonId(employee?.data?.employee?.salon?.id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// check when conf modal is showed to user
		if (parsedSalonID && initSalonId && initSalonId !== parsedSalonID && parseSalonID(prevSalonID) !== parsedSalonID && formValues?.services?.length > 0) {
			setConfVisibility(true)
			// clear init salon value
			setInitSalonId(-1)
		} else {
			// save prev value
			setPrevSalonID(parseSalonOption(salonID))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salonID])

	const searchSalon = useCallback(
		async (search: string, page: number) => {
			return searchSalonWrapper(dispatch, { search, page })
		},
		[dispatch]
	)

	const searchService = useCallback(
		async (search: string, page: number) => {
			return searchServiceWrapper(dispatch, { page, search, salonID: parsedSalonID })
		},
		[dispatch, parsedSalonID]
	)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
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
					<PhoneWithPrefixField label={'Telefón'} placeholder={t('loc:Zadajte telefón')} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} />
					<Popconfirm
						visible={confVisibility}
						placement={'bottom'}
						title={t('loc:V prípade ak potvrdíte výber salónu, všetky priradené služby budú vymazané.')}
						okButtonProps={{
							type: 'default',
							className: 'noti-btn'
						}}
						cancelButtonProps={{
							type: 'primary',
							className: 'noti-btn'
						}}
						okText={t('loc:Potvrdiť')}
						onConfirm={() => {
							dispatch(getServices({ page: 1, salonID: parsedSalonID }))
							// clear services after change salon
							dispatch(change(FORM.EMPLOYEE, 'services', null))
							// save prev value
							setPrevSalonID(parseSalonOption(salonID))
							setConfVisibility(false)
						}}
						cancelText={t('loc:Zrušiť')}
						onCancel={() => {
							setConfVisibility(false)
							dispatch(change(FORM.EMPLOYEE, 'salonID', prevSalonID))
						}}
						getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
					>
						<Field
							label={t('loc:Salón')}
							size={'large'}
							component={SelectField}
							allowClear
							placeholder={t('loc:Vyberte salón')}
							name={'salonID'}
							onSearch={searchSalon}
							filterOption={true}
							showSearch
							allowInfinityScroll
							required
						/>
					</Popconfirm>
					<div className={'flex w-full justify-between'}>
						<Field
							label={t('loc:Služby')}
							className={'w-4/5'}
							size={'large'}
							component={SelectField}
							allowClear
							placeholder={t('loc:Vyberte služby')}
							name={'service'}
							onSearch={searchService}
							filterOption={true}
							mode={'multiple'}
							options={services?.servicesOptions}
							showSearch
							allowInfinityScroll
							disabled={!formValues?.salonID}
							formName={FORM.EMPLOYEE}
						/>
						<Button type={'primary'} block size={'middle'} className={'noti-btn m-regular w-2/12 mt-4'} onClick={addService} disabled={!formValues?.salonID}>
							{t('loc:Pridať službu')}
						</Button>
					</div>
					<FieldArray component={renderListFields} name={'services'} />
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
