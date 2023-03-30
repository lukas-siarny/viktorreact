import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { change, Field, FieldArray, FormSection, InjectedFormProps, reduxForm, getFormValues, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Form, Row, Spin } from 'antd'
import { forEach, includes, isEmpty, map } from 'lodash'
import { DataNode } from 'antd/lib/tree'
import { useNavigate } from 'react-router-dom'

// atoms
import SwitchField from '../../../atoms/SwitchField'
import InputNumberField from '../../../atoms/InputNumberField'
import SelectField from '../../../atoms/SelectField'
import CheckboxField from '../../../atoms/CheckboxField'

// components
import NotificationArrayFields from './NotificationArrayFields'
import CheckboxGroupNestedField from '../../IndustriesPage/components/CheckboxGroupNestedField'
import ImportForm from '../../../components/ImportForm'
import RemainingSmsCredit from '../../../components/Dashboards/RemainingSmsCredit'

// types
import { IDataUploadForm, IReservationSystemSettingsForm, ISelectOptionItem } from '../../../types/interfaces'

// utils
import { FORM, NOTIFICATION_CHANNEL, RS_NOTIFICATION, SERVICE_TYPE, STRINGS, PERMISSION, SUBMIT_BUTTON_ID, UPLOAD_STATUS } from '../../../utils/enums'
import { formFieldID, optionRenderNotiPinkCheckbox, showErrorNotification, validationRequiredNumber } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'
import Permissions from '../../../utils/Permissions'
import { postReq } from '../../../utils/request'

// assets
import { ReactComponent as ChevronDown } from '../../../assets/icons/chevron-down.svg'
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as SettingsIcon } from '../../../assets/icons/setting.svg'
import { ReactComponent as BellIcon } from '../../../assets/icons/bell-24.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload-icon.svg'

// redux
import { RootState } from '../../../reducers'

type Props = InjectedFormProps<IReservationSystemSettingsForm, ComponentProps> & ComponentProps

const getFrequencyOption = (minutes: number): ISelectOptionItem => {
	return { label: `${minutes}`, key: minutes, value: minutes }
}

const FREQUENCIES: ISelectOptionItem[] = [getFrequencyOption(15), getFrequencyOption(20), getFrequencyOption(30), getFrequencyOption(60)]

const NOTIFICATIONS = Object.keys(RS_NOTIFICATION)

type ComponentProps = {
	salonID: string
	excludedB2BNotifications: string[]
	parentPath?: string
}

const UPLOAD_MODAL_INIT = {
	visible: false,
	uploadStatus: undefined,
	uploadType: undefined,
	data: {
		accept: '',
		title: '',
		label: ''
	}
}

enum UPLOAD_TYPE {
	RESERVATION = 'reservation',
	CUSTOMER = 'customer'
}

const ReservationSystemSettingsForm = (props: Props) => {
	const { pristine, submitting, excludedB2BNotifications, parentPath, salonID } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const groupedServicesByCategory = useSelector((state: RootState) => state.service.services.data?.groupedServicesByCategory)
	const groupedServicesByCategoryLoading = useSelector((state: RootState) => state.service.services.isLoading)
	const walletID = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.wallet?.id)
	const formValues: Partial<IReservationSystemSettingsForm> = useSelector((state: RootState) => getFormValues(FORM.RESEVATION_SYSTEM_SETTINGS)(state))
	const navigate = useNavigate()
	const disabled = !formValues?.enabledReservations
	const disabledOnlineB2cReservations = !formValues?.enabledB2cReservations
	const defaultExpandedKeys: any = []
	forEach(groupedServicesByCategory, (level1) => forEach(level1.category?.children, (level2) => defaultExpandedKeys.push(level2?.category?.id)))

	const [uploadModal, setUploadModal] = useState<{
		visible: boolean
		uploadStatus: UPLOAD_STATUS | undefined
		uploadType: UPLOAD_TYPE | undefined
		data: { accept: string; label: string; title: string }
	}>(UPLOAD_MODAL_INIT)
	// https://ant.design/components/tree/#Note - nastava problem, ze pokial nie je vygenerovany strom, tak sa vyrendruje collapsnuty, aj ked je nastavena propa defaultExpandAll
	// preto sa strom setuje cez state az po tom, co sa vytvoria data pre strom (vid useEffect nizzsie)
	// cize pokial je null, znamena ze strom este nebol vygenerovany a zobrazuje sa loading state
	const [servicesDataTree, setServicesDataTree] = useState<DataNode[] | null>(null)
	const isLoadingTree = servicesDataTree === null

	const onChangeCheckAll = (checked: boolean, type: SERVICE_TYPE) => {
		forEach(groupedServicesByCategory, (level1) => {
			forEach(level1.category?.children, (level2) => {
				forEach(level2.category?.children, (level3) => {
					// Ak je ONLINE_BOOKING false tak sa nastavi na false aj AUTO_CONFIRM
					if (type === SERVICE_TYPE.ONLINE_BOOKING && !checked) {
						dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, `servicesSettings[${SERVICE_TYPE.ONLINE_BOOKING}][${level3.service.id}]`, false))
						dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, `servicesSettings[${SERVICE_TYPE.AUTO_CONFIRM}][${level3.service.id}]`, false))
						// Ak je AUTO_CONFIRM true tak sa nastavi aj ONINE_BOOKING na true
					} else if (type === SERVICE_TYPE.AUTO_CONFIRM && checked) {
						dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, `servicesSettings[${SERVICE_TYPE.ONLINE_BOOKING}][${level3.service.id}]`, true))
						dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, `servicesSettings[${SERVICE_TYPE.AUTO_CONFIRM}][${level3.service.id}]`, true))
					} else {
						dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, `servicesSettings[${type}][${level3.service.id}]`, checked))
					}
				})
			})
		})
	}

	useEffect(() => {
		if (formValues?.servicesSettings) {
			const onlineBookingValues = Object.values(formValues?.servicesSettings?.[SERVICE_TYPE.ONLINE_BOOKING] as any)
			const autoConfirmValues = Object.values(formValues?.servicesSettings?.[SERVICE_TYPE.AUTO_CONFIRM] as any)
			// Najnizzsi children ci ma false hodnotu
			const hasOnlineBookingFalsyValue = includes(onlineBookingValues, false)
			const hasAutoConfirmFalsyValue = includes(autoConfirmValues, false)
			// Nastavenie true false hodnot pre check all parentov podla toho ked ma children true / false Level 1 + Level 2
			// SERVICE_TYPE.ONLINE_BOOKING
			if (!hasOnlineBookingFalsyValue) {
				dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, 'onlineBookingAll', true))
			} else {
				dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, 'onlineBookingAll', false))
			}
			// AUTO_CONFIRM
			if (!hasAutoConfirmFalsyValue) {
				dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, 'autoConfirmAll', true))
			} else {
				dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, 'autoConfirmAll', false))
			}
		}
	}, [dispatch, formValues?.servicesSettings])

	useEffect(() => {
		if (!groupedServicesByCategoryLoading && groupedServicesByCategory) {
			const onChangeServiceCheck = (checked: boolean, type: SERVICE_TYPE, id: string) => {
				// Ak je BOOKING false tak sa musi aj CONFIRM dat na false
				if (type === SERVICE_TYPE.ONLINE_BOOKING && !checked) {
					dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, `servicesSettings.${SERVICE_TYPE.AUTO_CONFIRM}.${id}`, false))
					// Ak je CONFIRM true tak BOOKING sa da tiez na true
				} else if (type === SERVICE_TYPE.AUTO_CONFIRM && checked) {
					dispatch(change(FORM.RESEVATION_SYSTEM_SETTINGS, `servicesSettings.${SERVICE_TYPE.ONLINE_BOOKING}.${id}`, true))
				}
			}
			const treeData = groupedServicesByCategory?.reduce((firstLevelNodes, level1) => {
				if (!isEmpty(level1.category?.children)) {
					return [
						...firstLevelNodes,
						{
							// LEVEL 1
							title: level1.category?.name,
							className: 'noti-tree-node-1 text-lg',
							switcherIcon: (propsLevel1: any) => {
								return propsLevel1?.expanded ? <ChevronDown style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown />
							},
							id: level1.category?.id,
							key: level1.category?.id as string,
							children: level1.category?.children?.reduce((secondLevelNodes, level2) => {
								if (!isEmpty(level2.category?.children)) {
									return [
										...secondLevelNodes,
										{
											// LEVEL 2
											id: level2.category?.id,
											key: level2.category?.id as string,
											className: 'noti-tree-node-1 font-semibold ml-6',
											title: level2.category?.name,
											switcherIcon: (propsLevel2: any) => {
												return propsLevel2?.expanded ? <ChevronDown style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown />
											},
											children: map(level2.category?.children, (level3) => {
												return {
													// LEVEL 3
													id: level3.category.id,
													key: level3.category.id,
													className: 'noti-tree-node-2 ml-6 hover:cursor-default',
													title: (
														<div id={`level3-${level3.category?.id}`} className={'flex justify-between'}>
															<div>{level3.category?.name}</div>
															<div className={'flex'}>
																<FormSection name={SERVICE_TYPE.ONLINE_BOOKING}>
																	<Field
																		component={CheckboxField}
																		key={`${SERVICE_TYPE.ONLINE_BOOKING}-${level3.service.id}`}
																		name={level3.service.id}
																		disabled={disabled || disabledOnlineB2cReservations}
																		hideChecker
																		onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
																			onChangeServiceCheck(e.target.checked, SERVICE_TYPE.ONLINE_BOOKING, level3.service.id)
																		}}
																		optionRender={optionRenderNotiPinkCheckbox}
																		className={'p-0 h-6 mr-8'}
																	/>
																</FormSection>
																<FormSection name={SERVICE_TYPE.AUTO_CONFIRM}>
																	<Field
																		component={CheckboxField}
																		key={`${SERVICE_TYPE.AUTO_CONFIRM}-${level3.service.id}`}
																		name={level3.service.id}
																		disabled={disabled || disabledOnlineB2cReservations}
																		hideChecker
																		onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
																			onChangeServiceCheck(e.target.checked, SERVICE_TYPE.AUTO_CONFIRM, level3.service.id)
																		}}
																		optionRender={optionRenderNotiPinkCheckbox}
																		className={'p-0 h-6'}
																	/>
																</FormSection>
															</div>
														</div>
													)
												}
											})
										}
									]
								}
								return secondLevelNodes
							}, [] as DataNode[])
						}
					]
				}
				return firstLevelNodes
			}, [] as DataNode[])
			setServicesDataTree(treeData)
		}
	}, [groupedServicesByCategory, groupedServicesByCategoryLoading, dispatch, disabled, disabledOnlineB2cReservations])

	const handleSubmitImport = async (values: IDataUploadForm) => {
		if (!uploadModal.uploadType) {
			return
		}
		const headers = {
			'Content-Type': 'multipart/form-data'
		}
		const formData = new FormData()
		formData.append('file', values?.file)

		try {
			if (uploadModal.uploadType === UPLOAD_TYPE.RESERVATION) {
				await postReq('/api/b2b/admin/imports/salons/{salonID}/calendar-events', { salonID }, formData, {
					headers
				})
			} else {
				await postReq('/api/b2b/admin/imports/salons/{salonID}/customers', { salonID }, formData, {
					headers
				})
			}

			setUploadModal({ ...uploadModal, uploadStatus: UPLOAD_STATUS.SUCCESS })
		} catch {
			setUploadModal({ ...uploadModal, uploadStatus: UPLOAD_STATUS.ERROR })
		}
	}

	const getServicesSettingsContent = () => {
		if (isLoadingTree) {
			return <Spin className={'w-full m-auto mt-20'} />
		}

		if (isEmpty(servicesDataTree)) {
			return (
				<div className={'flex flex-col items-center mt-10'}>
					<p className={'text-notino-grayDark mb-6 text-center'}>{t('loc:V salóne zatiaľ nemáte priradené žiadne služby')}</p>
					<Button type={'primary'} htmlType={'button'} className={'noti-btn'} onClick={() => navigate(`${parentPath}${t('paths:industries-and-services')}`)}>
						{t('loc:Priradiť služby')}
					</Button>
				</div>
			)
		}

		return (
			<>
				<p className='x-regular text-notino-grayDark'>{t('loc:Vyberte služby, ktoré bude možné rezervovať si online a ktoré budú automaticky potvrdené.')}</p>
				<p className='x-regular text-notino-grayDark'>{t('loc:Nastavte službám možnosť online rezervácie, automatického potvrdenia a zadávania poznámok.')}</p>
				<Row justify={'space-between'} className='mt-7'>
					<div className={'w-full'}>
						<div className={'flex items-center'}>
							<Field
								name={'enabledCustomerReservationNotes'}
								disabled={disabled}
								className={'w-full pb-1'}
								component={SwitchField}
								label={t('loc:Klientske poznámky')}
							/>
						</div>
						<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Povoliť klientom zadávať poznámky k rezerváciám.')}</p>
					</div>
				</Row>
				<Row className='mt-7'>
					<div className={'w-full'}>
						<div className={'flex items-center'}>
							<Field
								tooltipText={t(
									'loc:Hlavné nastavenie pre možnosť online rezervácií. Ak táto možnosť je vypnutá, nebude možné vytvoriť žiadnu online rezerváciu pre službu, bez ohľadu na to, či má služba danú možnosť povolenú v sekcii nižšie.'
								)}
								name={'enabledB2cReservations'}
								disabled={disabled}
								className={'w-full pb-1'}
								component={SwitchField}
								label={t('loc:Online rezervácie')}
							/>
						</div>
						<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Povoliť online rezervácie pre služby.')}</p>
					</div>
				</Row>
				<div>
					<div className={'flex w-full justify-end mb-4 mt-7'}>
						<div style={{ width: 140 }} className={'flex text-xs'}>
							<div className={'mr-2 text-center'}>{t('loc:Online rezervácia')}</div>
							<div className={'text-center'}>{t('loc:Automatické potvrdenie')}</div>
						</div>
					</div>
					<div className={'flex justify-end pr-4'}>
						<Field
							component={CheckboxField}
							key={'onlineBookingAll'}
							name={'onlineBookingAll'}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeCheckAll(e.target.checked, SERVICE_TYPE.ONLINE_BOOKING)}
							disabled={disabled || disabledOnlineB2cReservations}
							hideChecker
							optionRender={optionRenderNotiPinkCheckbox}
							className={'p-0 h-6 mr-8 check-all'}
						/>

						<Field
							component={CheckboxField}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeCheckAll(e.target.checked, SERVICE_TYPE.AUTO_CONFIRM)}
							key={'autoConfirmAll'}
							name={'autoConfirmAll'}
							disabled={disabled || disabledOnlineB2cReservations}
							hideChecker
							optionRender={optionRenderNotiPinkCheckbox}
							className={'p-0 h-6'}
						/>
					</div>
				</div>

				<FormSection name={'servicesSettings'}>
					<Field
						name={'services'}
						className={'rs-services-settings-tree'}
						disabled={disabled || disabledOnlineB2cReservations}
						component={CheckboxGroupNestedField}
						defaultExpandedKeys={defaultExpandedKeys}
						dataTree={servicesDataTree}
						checkable={false}
					/>
				</FormSection>
			</>
		)
	}

	return (
		<Form layout='vertical' className='w-full'>
			<div className={'flex'}>
				<h3 className={'mb-0 mt-0 flex items-center'}>
					<GlobeIcon className={'text-notino-black mr-2'} />
					{t('loc:Rezervačný systém')}

					<Field
						className='mb-0 pb-0 ml-2'
						component={SwitchField}
						disabled={submitting}
						onClick={(_checked: boolean, event: Event) => event.stopPropagation()}
						name='enabledReservations'
						size='middle'
					/>
				</h3>
			</div>
			<Divider className={'my-3'} />
			<p className='x-regular text-notino-grayDark mb-0'>
				{t('loc:Zapína a vypína rezervačný systém, cez ktorý je možné v kalendári spravovať salónové rezervácie a smeny zamestnancov.')}
			</p>
			<div className={'flex mt-10'}>
				<h3 className={'mb-0 mt-0 flex items-center'}>
					<SettingsIcon className={'text-notino-black mr-2'} />
					{t('loc:Časové limity')}
				</h3>
			</div>
			<Divider className={'my-3'} />
			{/* Time limits */}
			<Row justify={'space-between'}>
				<div className={'w-12/25'}>
					<div className={'flex items-center'}>
						<Field
							component={InputNumberField}
							label={t('loc:Dostupnoť rezervačného kalendára')}
							placeholder={t('loc:Zadajte počet dní vopred')}
							name={'maxDaysB2cCreateReservation'}
							size={'large'}
							disabled={disabled}
							min={0}
							className='flex-1 pb-1'
							required
							validate={validationRequiredNumber}
						/>
						<div className='s-regular ml-2 mt-1 min-w-100px'>{t('loc:Dni vopred')}</div>
					</div>
					<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Počet dní vopred, kedy sa zákazník bude môcť objednať online.')}</p>
				</div>

				<div className={'w-12/25'}>
					<div className={'flex items-center'}>
						<Field
							component={InputNumberField}
							label={t('loc:Vytvorenie rezervácie')}
							placeholder={t('loc:Zadajte počet hodín pred termínom')}
							name={'maxHoursB2cCreateReservationBeforeStart'}
							size={'large'}
							disabled={disabled}
							min={0}
							className='flex-1 pb-1'
							required
							validate={validationRequiredNumber}
						/>
						<div className='s-regular ml-2 mt-1 min-w-100px'>{t('loc:Hodiny vopred')}</div>
					</div>
					<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Koľko hodín pred termínom sa zákazník bude môcť objednať online.')}</p>
				</div>
			</Row>
			<Row justify={'space-between'} className='mt-7'>
				<div className={'w-12/25'}>
					<div className={'flex items-center'}>
						<Field
							component={InputNumberField}
							label={t('loc:Zrušenie rezervácie')}
							placeholder={t('loc:Zadajte počet hodín pred termínom')}
							name={'maxHoursB2cCancelReservationBeforeStart'}
							size={'large'}
							disabled={disabled}
							min={0}
							className='flex-1 pb-1'
							required
							validate={validationRequiredNumber}
						/>
						<div className='s-regular ml-2 mt-1 min-w-100px'>{t('loc:Hodiny vopred')}</div>
					</div>
					<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Koľko hodín pred termínom ho bude môcť zákazník zrušiť.')}</p>
				</div>

				<div className={'w-12/25'}>
					<div className={'flex items-center'}>
						<Field
							component={SelectField}
							label={t('loc:Intervaly medzi online rezerváciami')}
							placeholder={t('loc:Vyberte interval')}
							options={FREQUENCIES}
							name={'minutesIntervalB2CReservations'}
							size={'large'}
							allowClear
							disabled={disabled}
							className='flex-1 pb-1'
							required
							validate={validationRequiredNumber}
						/>
						<div className='s-regular ml-2 mt-1 min-w-100px'>{t('loc:Minúty')}</div>
					</div>
					<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Časové intervaly medzi rezerváciami.')}</p>
				</div>
			</Row>
			<Row justify={'space-between'} className='mt-10'>
				{/* Imports */}
				<div className={'flex'}>
					<h3 className={'mb-0 mt-0 flex items-center'}>
						<UploadIcon className={'text-notino-black mr-2'} />
						{t('loc:Importovať dáta z externých služieb')}
					</h3>
				</div>
				<Divider className={'my-3'} />
				<div>
					<p className={'text-notino-grayDark'}>{t('loc:Importujte si dáta z externých služieb ako Reservanto, Reservio, …')}</p>
					<Row>
						<ImportForm
							accept={uploadModal.data.accept}
							title={uploadModal.data.title}
							label={uploadModal.data.label}
							uploadStatus={uploadModal.uploadStatus}
							setUploadStatus={(status: any) => setUploadModal({ ...uploadModal, uploadStatus: status })}
							onSubmit={handleSubmitImport}
							visible={uploadModal.visible}
							setVisible={() => setUploadModal(UPLOAD_MODAL_INIT)}
						/>
						<Button
							onClick={() => {
								setUploadModal({
									...uploadModal,
									visible: true,
									uploadType: UPLOAD_TYPE.RESERVATION,
									data: {
										accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv,.ics',
										title: t('loc:Importovať rezervácie'),
										label: t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.xlsx, .csv, .ics' })
									}
								})
							}}
							disabled={disabled}
							type='primary'
							htmlType='button'
							className={'noti-btn mr-2'}
							icon={<UploadIcon />}
						>
							{t('loc:Importovať rezervácie')}
						</Button>
						<Button
							onClick={() => {
								setUploadModal({
									...uploadModal,
									visible: true,
									uploadType: UPLOAD_TYPE.CUSTOMER,
									data: {
										accept: '.csv',
										title: t('loc:Importovať zákazníkov'),
										label: t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.csv' })
									}
								})
							}}
							disabled={disabled}
							type='primary'
							htmlType='button'
							className={'noti-btn'}
							icon={<UploadIcon />}
						>
							{t('loc:Importovať zákazníkov')}
						</Button>
					</Row>
				</div>
			</Row>
			<Row justify={'space-between'} className='mt-10'>
				{/* Notifications */}
				<div className={'w-12/25'}>
					<div className={'flex'}>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<BellIcon className={'text-notino-black mr-2'} />
							{t('loc:SMS a notifikácie')}
						</h3>
					</div>
					<Divider className={'mt-1 mb-3'} />
					<p className={'text-notino-grayDark'}>
						{t('loc:SMS notifikácie sú spoplatnené podľa aktuálneho cenníka Notino. Suma za SMS sa vám bude odrátavať z celkového SMS kreditu.')}
					</p>

					{/* wallet */}
					<Permissions allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.READ_WALLET]}>
						{walletID && <RemainingSmsCredit walletID={walletID} salonID={salonID} parentPath={parentPath} className={'lg:w-full mb-6 !bg-notino-grayLighter'} link />}
					</Permissions>

					<Row justify={'space-between'} className='mt-7'>
						{/* Client's notifications */}
						<div className={'w-9/20'}>
							<h4 className={'mb-0 mt-0 '}>{t('loc:Zákaznícke notifikácie')}</h4>
							<Divider className={'mt-3 mb-1-5'} />
							{NOTIFICATIONS.map((key, index) => (
								<FieldArray
									key={index}
									disabled={disabled}
									name={`disabledNotifications[${key}].b2cChannels` as string}
									component={NotificationArrayFields as any}
									notificationType={key}
									channel={NOTIFICATION_CHANNEL.B2C}
								/>
							))}
						</div>

						{/* Internal notifications */}
						<div className={'w-9/20'}>
							<h4 className={'mb-0 mt-0 '}>{t('loc:Interné notifikácie')}</h4>
							<Divider className={'mt-3 mb-1-5'} />
							{NOTIFICATIONS.flatMap((key) => {
								return excludedB2BNotifications.includes(key)
									? []
									: [
											<FieldArray
												key={key}
												name={`disabledNotifications[${key}].b2bChannels` as string}
												component={NotificationArrayFields as any}
												notificationType={key}
												disabled={disabled}
												channel={NOTIFICATION_CHANNEL.B2B}
											/>
									  ]
							})}
						</div>
					</Row>
				</div>

				{/* Services */}
				<div className={'w-12/25'}>
					<div className={'flex'}>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<ServiceIcon className={'text-notino-black mr-2'} />
							{t('loc:Služby')}
						</h3>
					</div>
					<Divider className={'mt-1 mb-3'} />
					{getServicesSettingsContent()}
				</div>
			</Row>

			<div className={'content-footer'}>
				<Row className='justify-center'>
					<Permissions
						allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_UPDATE]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Button
								type={'primary'}
								id={formFieldID(FORM.RESEVATION_SYSTEM_SETTINGS, SUBMIT_BUTTON_ID)}
								className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
								icon={<EditIcon />}
								disabled={submitting || pristine}
								loading={submitting}
								onClick={(e) => {
									if (hasPermission) {
										dispatch(submit(FORM.RESEVATION_SYSTEM_SETTINGS))
									} else {
										e.preventDefault()
										openForbiddenModal()
									}
								}}
							>
								{STRINGS(t).save(t('loc:nastavenia'))}
							</Button>
						)}
					/>
				</Row>
			</div>
		</Form>
	)
}

const form = reduxForm<IReservationSystemSettingsForm, ComponentProps>({
	form: FORM.RESEVATION_SYSTEM_SETTINGS,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification
})(withPromptUnsavedChanges(ReservationSystemSettingsForm))

export default form
