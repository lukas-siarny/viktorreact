import React, { FC, MouseEventHandler, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, FormSection, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Divider, Form, Row, Space, Spin } from 'antd'
import { isEmpty } from 'lodash'
import cx from 'classnames'

// atoms
import { useNavigate } from 'react-router-dom'
import SelectField from '../../../../atoms/SelectField'
import InputNumberField from '../../../../atoms/InputNumberField'
import SwitchField from '../../../../atoms/SwitchField'
import TextareaField from '../../../../atoms/TextareaField'

// components
import DeleteButton from '../../../../components/DeleteButton'
import ServicesListField from '../../../EmployeesPage/components/ServicesListField'
import ParameterValuesList from './ParameterValuesList'
import ServiceBreadcrumbs from './ServiceBreadcrumbs'

// utils
import { formFieldID, showErrorNotification, validationNumberMin, validationString } from '../../../../utils/helper'
import { DELETE_BUTTON_ID, FILTER_ENTITY, FORM, NOTIFICATION_TYPE, PARAMETER_TYPE, PERMISSION, STRINGS, SUBMIT_BUTTON_ID, VALIDATION_MAX_LENGTH } from '../../../../utils/enums'
import { deleteReq } from '../../../../utils/request'
import searchWrapper from '../../../../utils/filters'
import { withPromptUnsavedChanges } from '../../../../utils/promptUnsavedChanges'
import Permissions from '../../../../utils/Permissions'
import { checkConditions, getConditionIcon } from '../../serviceUtils'

// types
import { RootState } from '../../../../reducers'

// assets
import { ReactComponent as PencilIcon } from '../../../../assets/icons/pencil-icon-16.svg'
import { ReactComponent as CreateIcon } from '../../../../assets/icons/plus-icon.svg'
import { ReactComponent as EditIcon } from '../../../../assets/icons/edit-icon.svg'
import { ReactComponent as EmployeesIcon } from '../../../../assets/icons/employees.svg'
import { ReactComponent as GlobeIcon } from '../../../../assets/icons/globe-24.svg'
import { ReactComponent as SettingIcon } from '../../../../assets/icons/setting.svg'

// schema
import { validationServiceFn, IServiceForm } from '../../../../schemas/service'

const numberMin0 = validationNumberMin(0)
const fixLength1500 = validationString(VALIDATION_MAX_LENGTH.LENGTH_1500)

type ComponentProps = {
	serviceID?: string
	backUrl?: string
	salonID: string
	addEmployee: MouseEventHandler<HTMLElement>
	setVisibleServiceEditModal?: (visible: boolean) => void
}

type Props = InjectedFormProps<IServiceForm, ComponentProps> & ComponentProps

const ServiceForm: FC<Props> = (props) => {
	const { salonID, serviceID, handleSubmit, pristine, addEmployee, backUrl, setVisibleServiceEditModal, submitting } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const form = useSelector((state: RootState) => state.form?.[FORM.SERVICE_FORM])
	const formValues = form?.values as IServiceForm
	const initialFormValues = (form as any)?.initial as IServiceForm
	const service = useSelector((state: RootState) => state.service.service)
	const categoriesLoading = useSelector((state: RootState) => state.categories.categories.isLoading)
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const isLoading = service.isLoading || categoriesLoading || isRemoving || salon.isLoading || submitting

	const variableDuration = formValues?.variableDuration
	const variablePrice = formValues?.variablePrice

	const { hasDurationFilledIn, hasPriceFilledIn, hasEmployee } = checkConditions(initialFormValues)
	const disabledRsSettings = !(hasDurationFilledIn && hasPriceFilledIn && hasEmployee)

	const onConfirmDelete = async () => {
		if (isRemoving || !serviceID) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq(`/api/b2b/admin/services/{serviceID}`, { serviceID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			setIsRemoving(false)
			navigate(backUrl as string)
		} catch (e) {
			setIsRemoving(false)
		}
	}

	const searchEmployees = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search, salonID } as any, FILTER_ENTITY.EMPLOYEE, undefined, true)
		},
		[dispatch, salonID]
	)
	return (
		<Permissions
			allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<div className='content-body small'>
					<Spin spinning={isLoading}>
						<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
							<ServiceBreadcrumbs
								wrapperClassname={'mb-4'}
								breadcrumbs={[
									service.data?.service?.category?.name,
									service.data?.service?.category?.child?.name,
									service.data?.service?.category?.child?.child?.name
								]}
							/>
							<Space className={'w-full'} direction={'vertical'} size={36}>
								<div>
									<h3 className={'mb-0 mt-0 flex items-center'}>
										<SettingIcon className={'text-notino-black mr-2'} />
										{t('loc:Nastavenia')}
									</h3>
									<Divider className={'mb-3 mt-3'} />
									{!isEmpty(formValues?.serviceCategoryParameter) && (
										<Field
											className={'mb-0'}
											disabled={!hasPermission}
											component={SwitchField}
											customLabel={
												<div className={'truncate min-w-0 max-w-full inline-block mr-3'} style={{ gap: 2 }}>
													{t('loc:Použiť parameter')}: <strong>{formValues?.serviceCategoryParameterName}</strong>
												</div>
											}
											name={'useCategoryParameter'}
											size={'middle'}
										/>
									)}
									<>
										{formValues?.useCategoryParameter ? (
											<div className={'my-2'}>
												<FieldArray
													component={ParameterValuesList as any}
													name={'serviceCategoryParameter'}
													currencySymbol={salon.data?.currency.symbol}
													disabled={!hasPermission}
													showDuration={formValues?.serviceCategoryParameterType !== PARAMETER_TYPE.TIME}
													form={form}
												/>
											</div>
										) : (
											<div className={'mt-2'}>
												<Row gutter={8} align='top' justify='center'>
													<Col className={'mt-5'} span={8}>
														<Field
															disabled={!hasPermission}
															className={'mb-0'}
															component={SwitchField}
															label={t('loc:Variabilné trvanie')}
															name={'variableDuration'}
															size={'middle'}
														/>
													</Col>
													<Col span={variableDuration ? 8 : 16}>
														<Field
															disabled={!hasPermission}
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
																disabled={!hasPermission}
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
														<Field
															disabled={!hasPermission}
															className={'mb-0'}
															component={SwitchField}
															label={t('loc:Variabilná cena')}
															name={'variablePrice'}
															size={'middle'}
														/>
													</Col>
													<Col span={variablePrice ? 8 : 16}>
														<Field
															disabled={!hasPermission}
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
																disabled={!hasPermission}
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
												</Row>
											</div>
										)}
									</>
								</div>
								<div>
									<h3 className={'mb-0 mt-0 flex items-center'}>
										<PencilIcon className={'text-notino-black mr-2 w-6 h-6'} />
										{t('loc:Popis služby')}
									</h3>
									<Divider className={'mb-3 mt-3'} />
									<FormSection name={'descriptionLocalizations'}>
										<Field
											className={'mb-0 pb-2'}
											disabled={!hasPermission}
											component={SwitchField}
											label={t('loc:Vlastný popis služby')}
											name={'use'}
											size={'middle'}
										/>
										<p className={'text-notino-grayDark text-xs mb-4'}>{t('loc:Tento text služby uvidia používatelia v zákazníckej aplikácii Notino.')}</p>
										{formValues?.descriptionLocalizations?.use && (
											<>
												<Field
													component={TextareaField}
													label={`${t('loc:Vlastný popis')} ${salon.data?.address?.countryCode ? `(${salon.data.address.countryCode})` : ''}`.trim()}
													placeholder={t('loc:Vysvetlite, čo služba zahŕňa')}
													maxLength={VALIDATION_MAX_LENGTH.LENGTH_1500}
													showLettersCount
													name={'defualtLanguage'}
													size={'middle'}
													rows={4}
													validate={fixLength1500}
													required
												/>
												<Field
													component={TextareaField}
													label={`${t('loc:Vlastný popis')} (EN)`}
													placeholder={t('loc:Vysvetlite, čo služba zahŕňa')}
													maxLength={VALIDATION_MAX_LENGTH.LENGTH_1500}
													showLettersCount
													name={'enLanguage'}
													size={'middle'}
													rows={4}
													className={'pb-0'}
													validate={fixLength1500}
												/>
											</>
										)}
									</FormSection>
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
											optionLabelProp={'label'}
											onSearch={searchEmployees}
											filterOption={false}
											mode={'multiple'}
											showSearch
											allowInfinityScroll
											onDidMountSearch
											disabled={!hasPermission}
											tooltipSelect={!hasPermission ? t('loc:Pre túto akciu nemáte dostatočné oprávnenia.') : null}
										/>
										<Button
											id={`${FORM.SERVICE_FORM}-add-employee`}
											type={'primary'}
											size={'middle'}
											className={'self-start noti-btn m-regular md:mt-5'}
											onClick={(e) => {
												e.stopPropagation()
												if (hasPermission) {
													addEmployee(e)
												} else {
													openForbiddenModal()
												}
											}}
											disabled={isEmpty(formValues?.employee)}
										>
											{formValues?.employees && formValues?.employees.length > 1 ? t('loc:Pridať zamestnancov') : t('loc:Pridať zamestnanca')}
										</Button>
									</div>
									<FieldArray
										component={ServicesListField as any}
										name={'employees'}
										currencySymbol={salon.data?.currency.symbol}
										isEmployeeDetail={false}
										setVisibleServiceEditModal={setVisibleServiceEditModal}
										disabledEditButton={!pristine}
										disabled={!hasPermission}
									/>
								</div>
								<div>
									<h3 className={'mb-0 mt-0 flex items-center'}>
										<GlobeIcon className={'text-notino-black mr-2'} />
										{t('loc:Online rezervácia')}
									</h3>
									<Divider className={'mb-3 mt-3'} />
									<FormSection name={'settings'}>
										<div className={'text-xs text-notino-grayDark'}>
											<p className={'mb-3'}>
												{t('loc:Keď službe zapnete možnosť online rezervácie, vaši klienti si ju budú môcť rezervovať v zákazníckej aplikácii.')}
											</p>
											<p className={'mb-2'}>{t('loc:Na zapnutie online rezervácie je najprv potrebné splniť a mať uložené nasledujúce')}:</p>
											<ul className={'p-0 list-none'}>
												<li className={'flex items-start gap-3'}>
													{getConditionIcon(hasDurationFilledIn)} {t('loc:Zadať dĺžku trvania')}
												</li>
												<li className={'flex items-start gap-3'}>
													{getConditionIcon(hasPriceFilledIn)}
													{t('loc:Zadať cenu')}
												</li>
												<li className={'flex items-start gap-3'}>
													{getConditionIcon(hasEmployee)}
													{t('loc:Priradiť k službe aspoň 1 kolegu')}
												</li>
											</ul>
										</div>
										<Field
											disabled={!hasPermission || disabledRsSettings}
											className={'w-full'}
											component={SwitchField}
											label={t('loc:Online rezervácia')}
											name={'enabledB2cReservations'}
											size={'middle'}
										/>

										<Field
											disabled={!hasPermission || !formValues?.settings?.enabledB2cReservations}
											className={'pb-2 w-full'}
											component={SwitchField}
											label={t('loc:Automatické potvrdenie')}
											name={'autoApproveReservations'}
											size={'middle'}
										/>
										<p className={'text-xs text-notino-grayDark mb-0'}>
											{t(
												'loc:Online rezervácia bude automaticky schválená, už ju nemusíte potvrdzovať ručne. Rezervácia sa zobrazí vo vašom kalendári ako potvrdená.'
											)}
										</p>
									</FormSection>
								</div>
							</Space>
							{hasPermission && (
								<div className={'content-footer pt-0'} id={'content-footer-container'}>
									<Row className={cx({ 'justify-between': serviceID, 'justify-center': !serviceID }, 'w-full')}>
										{serviceID ? (
											<DeleteButton
												className={'noti-btn mt-2-5 w-52 xl:w-60'}
												getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
												onConfirm={onConfirmDelete}
												entityName={t('loc:službu')}
												permissions={[PERMISSION.PARTNER_ADMIN, PERMISSION.SERVICE_DELETE]}
												id={formFieldID(FORM.SERVICE_FORM, DELETE_BUTTON_ID)}
											/>
										) : null}

										<Button
											type={'primary'}
											className={'noti-btn mt-2-5 w-52 xl:w-60'}
											htmlType={'submit'}
											icon={serviceID ? <EditIcon /> : <CreateIcon />}
											disabled={submitting || pristine}
											loading={submitting}
											id={formFieldID(FORM.SERVICE_FORM, SUBMIT_BUTTON_ID)}
										>
											{serviceID ? STRINGS(t).save(t('loc:službu')) : STRINGS(t).createRecord(t('loc:službu'))}
										</Button>
									</Row>
								</div>
							)}
						</Form>
					</Spin>
				</div>
			)}
		/>
	)
}

const form = reduxForm<IServiceForm, ComponentProps>({
	form: FORM.SERVICE_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validationServiceFn
})(withPromptUnsavedChanges(ServiceForm))

export default form
