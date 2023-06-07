import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, InjectedFormProps, reduxForm, getFormValues, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Form, Row, Select } from 'antd'

// atoms
import SwitchField from '../../../atoms/SwitchField'
import InputNumberField from '../../../atoms/InputNumberField'
import SelectField from '../../../atoms/SelectField'

// components
import NotificationArrayFields from './NotificationArrayFields'
import CalendarIntegrations from './CalendarIntegrations'
import ImportForm from '../../../components/ImportForm'
import RemainingSmsCredit from '../../../components/Dashboards/RemainingSmsCredit'

// types
import { IDataUploadForm, IReservationSystemSettingsForm, ISelectOptionItem } from '../../../types/interfaces'
import { RootState } from '../../../reducers'

// utils
import {
	FORM,
	NOTIFICATION_CHANNEL,
	RS_NOTIFICATION,
	STRINGS,
	PERMISSION,
	SUBMIT_BUTTON_ID,
	REQUEST_STATUS,
	TEMPLATE_OPTIONS_CUSTOMERS,
	TEMPLATE_OPTIONS_RESERVATIONS
} from '../../../utils/enums'
import { formFieldID, showErrorNotification, validationRequiredNumber } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'
import Permissions, { checkPermissions } from '../../../utils/Permissions'
import { postReq } from '../../../utils/request'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as SettingsIcon } from '../../../assets/icons/setting.svg'
import { ReactComponent as BellIcon } from '../../../assets/icons/bell-24.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import { ReactComponent as UploadIcon } from '../../../assets/icons/upload-icon.svg'
import { ReactComponent as CalendarSyncIcon } from '../../../assets/icons/sync-calendar.svg'

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
	requestStatus: undefined,
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
	const walletID = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.wallet?.id)
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const isPartner = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.PARTNER]), [authUser.data?.uniqPermissions])
	const formValues: Partial<IReservationSystemSettingsForm> = useSelector((state: RootState) => getFormValues(FORM.RESEVATION_SYSTEM_SETTINGS)(state))
	const disabled = !formValues?.enabledReservations

	const [uploadModal, setUploadModal] = useState<{
		visible: boolean
		requestStatus: REQUEST_STATUS | undefined
		uploadType: UPLOAD_TYPE | undefined
		data: { accept: string; label: string; title: string }
	}>(UPLOAD_MODAL_INIT)

	const [templateValue, setTemplateValue] = useState<{ label: string; value: string } | null>(null)

	const handleSubmitImport = async (values: IDataUploadForm) => {
		if (!uploadModal.uploadType) {
			return
		}
		const headers = {
			'Content-Type': 'multipart/form-data'
		}
		const formData = new FormData()
		formData.append('file', values?.file[0])

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

			setUploadModal({ ...uploadModal, requestStatus: REQUEST_STATUS.SUCCESS })
		} catch {
			setUploadModal({ ...uploadModal, requestStatus: REQUEST_STATUS.ERROR })
		} finally {
			setTemplateValue(null)
		}
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
			{/* Time limits */}
			<div className={'flex mt-10'}>
				<h3 className={'mb-0 mt-0 flex items-center'}>
					<SettingsIcon className={'text-notino-black mr-2'} />
					{t('loc:Časové limity')}
				</h3>
			</div>
			<Divider className={'my-3'} />
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
			{/* Integrate RS calendar to: Google, Outlook, iCal */}
			{isPartner && (
				<>
					<div className={'flex mt-10'}>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<CalendarSyncIcon className={'text-notino-black mr-2'} />
							{t('loc:Synchronizácia kalendára')}
						</h3>
					</div>
					<Divider className={'my-3'} />
					<p className='x-regular text-notino-grayDark mb-4'>
						{t('loc:Informácie o vašich rezerváciach sa budú automaticky synchronizovať z Notino Partner App do vybraných kalendárov.')}
					</p>
					<CalendarIntegrations />
				</>
			)}
			<Row justify={'space-between'} className='mt-10'>
				{/* Imports */}
				<div className={'flex'}>
					<h3 className={'mb-0 mt-0 flex items-center'}>
						<UploadIcon className={'text-notino-black mr-2'} />
						{t('loc:Importovať dáta z externých rezervačných systémov')}
					</h3>
				</div>
				<Divider className={'my-3'} />
				<Row>
					<ImportForm
						accept={uploadModal.data.accept}
						title={uploadModal.data.title}
						label={uploadModal.data.label}
						requestStatus={uploadModal.requestStatus}
						setRequestStatus={(status?: REQUEST_STATUS) => setUploadModal({ ...uploadModal, requestStatus: status })}
						onSubmit={handleSubmitImport}
						visible={uploadModal.visible}
						extraContent={
							<>
								<Divider className={'mt-1 mb-3'} />
								<div className={'flex items-center justify-between gap-1'}>
									<div className={'ant-form-item w-full'}>
										<label htmlFor={'noti-template-select'} className={'block mb-2'}>
											{t('loc:Vzorové šablóny súborov')}
										</label>
										<Select
											id={'noti-template-select'}
											style={{ zIndex: 999 }}
											className={'noti-select-input w-full mb-4'}
											size={'large'}
											labelInValue
											options={uploadModal.uploadType === UPLOAD_TYPE.CUSTOMER ? TEMPLATE_OPTIONS_CUSTOMERS() : TEMPLATE_OPTIONS_RESERVATIONS()}
											onChange={(val) => setTemplateValue(val)}
											value={templateValue}
											placeholder={t('loc:Vyberte šablónu na stiahnutie')}
											getPopupContainer={(node) => node.closest('.ant-modal-body') as HTMLElement}
										/>
									</div>

									<Button
										className={'noti-btn'}
										href={`${process.env.PUBLIC_URL}/templates/${templateValue?.value}`}
										target='_blank'
										rel='noopener noreferrer'
										type={'default'}
										disabled={!templateValue}
										htmlType={'button'}
										download
									>
										<div>{t('loc:Stiahnuť')}</div>
									</Button>
								</div>
							</>
						}
						setVisible={() => {
							setTemplateValue(null)
							setUploadModal(UPLOAD_MODAL_INIT)
						}}
					/>
					<Button
						onClick={() => {
							setUploadModal({
								...uploadModal,
								visible: true,
								uploadType: UPLOAD_TYPE.RESERVATION,
								data: {
									accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
									title: t('loc:Importovať rezervácie'),
									label: t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.xlsx' })
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
									accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.csv',
									title: t('loc:Importovať zákazníkov'),
									label: t('loc:Vyberte súbor vo formáte {{ formats }}', { formats: '.csv, .xlsx' })
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
