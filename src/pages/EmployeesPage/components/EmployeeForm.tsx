import React, { FC, MouseEventHandler, useCallback, useEffect } from 'react'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Divider, Form, Row, Collapse, Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

// utils
import { FORM, URL_UPLOAD_IMAGES, FILTER_ENTITY } from '../../../utils/enums'
import { showErrorNotification, validationNumberMin } from '../../../utils/helper'
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

	const genExtra = (index: number) => (
		<div className={'flex'} role={'link'} onKeyDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()} tabIndex={0}>
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
				{fields.map((field: any, index: any) => {
					const variableDuration = fields.get(index)?.variableDuration
					const variablePrice = fields.get(index)?.variablePrice
					return (
						<Panel header={fields.get(index)?.name} key={index} extra={genExtra(index)}>
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

	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE]?.values)
	const services = useSelector((state: RootState) => state.service.services)

	useEffect(() => {
		dispatch(getServices({ page: 1, salonID: parseSalonID(salonID) }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salonID])

	const searchSalon = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search }, FILTER_ENTITY.SALON)
		},
		[dispatch]
	)

	const searchService = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search, salonID: parseSalonID(salonID) } as any, FILTER_ENTITY.SERVICE)
		},
		[dispatch, salonID]
	)

	return (
		<Form layout={'vertical'} className={'form'} onSubmitCapture={handleSubmit}>
			<Col className={'flex'}>
				<Row className={'mx-9 w-full h-full block'} justify='center'>
					<h3 className={'mb-0 mt-3'}>{t('loc:Osobné údaje')}</h3>
					<Divider className={'mb-3 mt-3'} />
					<div className={'flex space-between w-full'}>
						<div className={'w-1/5'}>
							<Field className={'m-0'} component={ImgUploadField} name={'avatar'} label={t('loc:Avatar')} signUrl={URL_UPLOAD_IMAGES} multiple={false} maxCount={1} />
						</div>

						<div className={'w-full'}>
							<Field component={InputField} label={t('loc:Meno')} placeholder={t('loc:Zadajte meno')} name={'firstName'} size={'large'} required />
							<Field component={InputField} label={t('loc:Priezvisko')} placeholder={t('loc:Zadajte priezvisko')} name={'lastName'} size={'large'} required />
						</div>
					</div>
					<Field component={InputField} label={t('loc:Email')} placeholder={t('loc:Zadajte email')} name={'email'} size={'large'} />
					<PhoneWithPrefixField label={'Telefón'} placeholder={t('loc:Zadajte telefón')} size={'large'} prefixName={'phonePrefixCountryCode'} phoneName={'phone'} />
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
							options={services?.options}
							showSearch
							allowInfinityScroll
							disabled={!formValues?.salonID}
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
