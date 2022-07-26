import React, { MouseEventHandler, ReactNode, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, InjectedFormProps, reduxForm } from 'redux-form'
import { Button, Col, Divider, Form, Row, Spin } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import cx from 'classnames'

// atoms
import SelectField from '../../../atoms/SelectField'
import validateServiceForm from './validateServiceForm'
import InputNumberField from '../../../atoms/InputNumberField'
import SwitchField from '../../../atoms/SwitchField'

// components
import DeleteButton from '../../../components/DeleteButton'
import CategoryFields from './CategoryFields'
import AvatarComponents from '../../../components/AvatarComponents'

// reducers
import { RootState } from '../../../reducers'

// utils
import { showErrorNotification, validationNumberMin } from '../../../utils/helper'
import { FILTER_ENTITY, FORM, NOTIFICATION_TYPE, SALON_PERMISSION, STRINGS } from '../../../utils/enums'
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

const numberMin0 = validationNumberMin(0)

type ComponentProps = {
	serviceID?: number
	parentPath?: string
	salonID: number
	addEmployee: MouseEventHandler<HTMLElement>
}

type Props = InjectedFormProps<IServiceForm, ComponentProps> & ComponentProps

export const renderListFields = (props: any) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [t] = useTranslation()
	const { fields } = props

	const renderFromTo = (from: number | undefined | null, to: number | undefined | null, icon: ReactNode) => {
		if (from || to) {
			return (
				<div className={'flex items-center mr-3'}>
					{icon}
					{from}
					{to ? ` - ${to}` : undefined}
				</div>
			)
		}
		return undefined
	}

	return (
		<>
			<div className={'employee-list'}>
				{fields.map((field: any, index: number) => {
					const fieldData = fields.get(index)
					return (
						<div className={'employee-list-item flex items-center justify-between'} key={index}>
							<div className={'title flex items-center'}>
								<AvatarComponents className='mr-2-5 w-7 h-7' src={fieldData?.image?.resizedImages?.small} fallBackSrc={fieldData?.image?.original} />
								{fieldData?.name}
								{fieldData?.hasActiveAccount === false && !fieldData?.inviteEmail ? <QuestionIcon width={20} height={20} /> : undefined}
								{fieldData?.hasActiveAccount === false && fieldData?.inviteEmail ? <CloudOfflineIcon width={20} height={20} /> : undefined}
							</div>
							<div className={'flex items-center'}>
								<div className={'flex items-center'}>
									{renderFromTo(fieldData?.employeeData?.durationFrom, fieldData?.employeeData?.durationTo, <ClockIcon className={'mr-1'} />)}
									{renderFromTo(fieldData?.employeeData?.priceFrom, fieldData?.employeeData?.priceTo, <CouponIcon className={'mr-1'} />)}
								</div>
								<DeleteButton
									onConfirm={() => {
										fields.remove(index)
									}}
									smallIcon
									size={'small'}
									entityName={t('loc:službu')}
									type={'default'}
									onlyIcon
								/>
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}

const ServiceForm = (props: Props) => {
	const { salonID, serviceID, handleSubmit, pristine, addEmployee, parentPath } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM].values)
	const employees = useSelector((state: RootState) => state.employees.employees)
	const serviceLoading = useSelector((state: RootState) => state.service.service.isLoading) // update
	const categoriesLoading = useSelector((state: RootState) => state.categories.categories.isLoading) // update
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const isLoading = serviceLoading || categoriesLoading || isRemoving || salon.isLoading
	const submitting = false

	const variableDuration = formValues?.variableDuration
	const variablePrice = formValues?.variablePrice

	const onConfirmDelete = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq(`/api/b2b/admin/services/{serviceID}`, { serviceID: serviceID || -1 }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			setIsRemoving(false)
			history.push(parentPath + t('paths:services'))
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
				<CategoryFields />
				<Row gutter={8} align='middle'>
					<Col span={8}>
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

				<Row gutter={8} align='middle'>
					<Col span={8}>
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
				</Row>
				<h3>{t('loc:Zoznam priradených zamestnancov')}</h3>
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
				<FieldArray component={renderListFields} name={'employees'} />
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
