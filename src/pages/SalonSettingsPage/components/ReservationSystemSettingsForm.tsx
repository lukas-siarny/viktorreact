import React from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, FormSection, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Form, Row } from 'antd'

// atoms
import { map } from 'lodash'
import SwitchField from '../../../atoms/SwitchField'
import InputNumberField from '../../../atoms/InputNumberField'
import SelectField from '../../../atoms/SelectField'

// components
import NotificationArrayFields from './NotificationArrayFields'
import CheckboxGroupNestedField from '../../IndustriesPage/components/CheckboxGroupNestedField'

// types
import { IReservationSystemSettingsForm, ISelectOptionItem } from '../../../types/interfaces'

// utils
import { FORM, NOTIFICATION_CHANNEL, RS_NOTIFICATION, SERVICE_TYPE } from '../../../utils/enums'
import { optionRenderNotiPinkCheckbox, showErrorNotification } from '../../../utils/helper'

// validations
import validateReservationSystemSettingsForm from './validateReservationSystemSettingsForm'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as SettingsIcon } from '../../../assets/icons/setting.svg'
import { ReactComponent as BellIcon } from '../../../assets/icons/bell-24.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'

// redux
import { RootState } from '../../../reducers'
import CheckboxField from '../../../atoms/CheckboxField'
import { ReactComponent as ChevronDown } from '../../../assets/icons/chevron-down.svg'

type Props = InjectedFormProps<IReservationSystemSettingsForm, ComponentProps> & ComponentProps

const getFrequencyOption = (minutes: number): ISelectOptionItem => {
	return { label: `${minutes}`, key: minutes, value: minutes }
}

const FREQUENCIES: ISelectOptionItem[] = [getFrequencyOption(15), getFrequencyOption(20), getFrequencyOption(30), getFrequencyOption(60)]

const NOTIFICATIONS = Object.keys(RS_NOTIFICATION)

type ComponentProps = {
	salonID: string
	excludedB2BNotifications: string[]
}

const ReservationSystemSettingsForm = (props: Props) => {
	const { salonID, handleSubmit, pristine, submitting, excludedB2BNotifications } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const disabled = submitting
	const hasPermission = true // TODO: permissions?
	const groupedServicesByCategory = useSelector((state: RootState) => state.service.services.data?.groupedServicesByCategory)
	// const { enabledReservations } = useSelector((state: RootState) => getFormValues(FORM.RESEVATION_SYSTEM_SETTINGS)(state)) as any
	// const disabled = false // enabledReservations !== true

	const treeData = map(groupedServicesByCategory, (level1) => {
		// LEVEL 1
		return {
			title: level1.category?.name,
			className: `noti-tree-node-${1} text-lg`,
			switcherIcon: (props2: any) => {
				return props2?.expanded ? <ChevronDown style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown />
			},
			id: level1.category?.id,
			// LEVEL 2
			children: map(level1.category?.children, (level2) => {
				return {
					id: level2.category?.id,
					className: `noti-tree-node-${1} font-semibold ml-6`,
					title: level2.category?.name,
					switcherIcon: (props2: any) => {
						return props2?.expanded ? <ChevronDown style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown />
					},
					// LEVEL 3
					children: map(level2.category?.children, (level3) => {
						return {
							id: level3.category.id,
							className: `noti-tree-node-${2} ml-6`,
							// switcherIcon: (props2: any) => {
							// 	return props2?.expanded ? <ChevronDown style={{ transform: 'rotate(180deg)' }} /> : <ChevronDown />
							// },
							title: (
								<div id={`level3-${level3.category?.id}`} className={'flex justify-between'}>
									<div>{level3.category?.name}</div>
									<div className={'flex'}>
										<FormSection name={SERVICE_TYPE.ONLINE_BOOKING}>
											<Field
												component={CheckboxField}
												key={`level3-${SERVICE_TYPE.ONLINE_BOOKING}-${level3.service.id}`}
												name={level3.service.id}
												disabled={disabled}
												hideChecker
												optionRender={optionRenderNotiPinkCheckbox}
												className={'p-0 h-6'}
											/>
										</FormSection>
										<FormSection name={SERVICE_TYPE.AUTO_CONFIRM}>
											<Field
												component={CheckboxField}
												key={`level3-${SERVICE_TYPE.AUTO_CONFIRM}-${level3.service.id}`}
												name={level3.service.id}
												disabled={disabled}
												hideChecker
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
			})
		}
	})

	return (
		<Form layout='vertical' className='w-full' onSubmitCapture={handleSubmit}>
			<div className={'flex'}>
				<h3 className={'mb-0 mt-0 flex items-center'}>
					<GlobeIcon className={'text-notino-black mr-2'} />
					{t('loc:Rezervačný systém')}

					<Field
						className='mb-0 pb-0 ml-2'
						component={SwitchField}
						onClick={(checked: boolean, event: Event) => event.stopPropagation()}
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
							min={1}
							className='flex-1'
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
							className='flex-1'
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
							className='flex-1'
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
							name={'minutesIntervalBetweenB2CReservations'}
							size={'large'}
							allowClear
							className='flex-1'
						/>
						<div className='s-regular ml-2 mt-1 min-w-100px'>{t('loc:Minúty')}</div>
					</div>
					<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Časové intervaly medzi rezerváciami.')}</p>
				</div>
			</Row>
			<Row justify={'space-between'} className='mt-10'>
				{/* Notifications */}
				<div className={'w-12/25'}>
					<div className={'flex'}>
						<h3 className={'mb-0 mt-0 flex items-center'}>
							<BellIcon className={'text-notino-black mr-2'} />
							{t('loc:Notifikácie')}
						</h3>
					</div>
					<Divider className={'mt-1 mb-3'} />
					{/* NOTE: ready for future implementation when SMS will be supported */}
					{/* <div className={'flex'}>
						<div className='w-full s-regular flex items-center bg-notino-red bg-opacity-5 p-2'>
							<InfoIcon className={'text-notino-red mr-2'} width={16} height={16} />
							<span>{t('loc:SMS notifikácie sú spoplatnené podľa aktuálneho cenníka Notino.')}</span>
						</div>
					</div> */}
					<Row justify={'space-between'} className='mt-7'>
						{/* Client's notifications */}
						<div className={'w-9/20'}>
							<h4 className={'mb-0 mt-0 '}>{t('loc:Zákaznícke notifikácie')}</h4>
							<Divider className={'mt-3 mb-1-5'} />
							{NOTIFICATIONS.map((key, index) => (
								<FieldArray
									key={index}
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
					<p className='x-regular text-notino-grayDark mb-0'>{t('loc:Vyberte služby, ktoré bude možné rezervovať si online a ktoré budú automaticky potvrdené.')}</p>
					<div className={'text-xs flex'}>
						<div>Online booking</div>
						<div>Auto confirm</div>
					</div>
					<FormSection name={'servicesSettings'}>
						<Field name={'services'} component={CheckboxGroupNestedField} dataTree={treeData} checkable={false} />
					</FormSection>
				</div>
			</Row>
			{hasPermission && (
				<div className={'content-footer'}>
					<Row className='justify-end'>
						<Button type={'primary'} className={'noti-btn'} htmlType={'submit'} icon={<EditIcon />} disabled={submitting || pristine} loading={submitting}>
							{t('loc:Uložiť')}
						</Button>
					</Row>
				</div>
			)}
		</Form>
	)
}

const form = reduxForm<IReservationSystemSettingsForm, ComponentProps>({
	form: FORM.RESEVATION_SYSTEM_SETTINGS,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateReservationSystemSettingsForm
})(ReservationSystemSettingsForm)
// })(withPromptUnsavedChanges(ReservationSystemSettingsForm))

export default form
