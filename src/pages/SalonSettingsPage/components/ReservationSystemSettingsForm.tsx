import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldArray, getFormValues, InjectedFormProps, reduxForm } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Collapse, Divider, Form, Row, Tooltip } from 'antd'

// atoms
import { map } from 'lodash'
import SwitchField from '../../../atoms/SwitchField'
import InputNumberField from '../../../atoms/InputNumberField'
import SelectField from '../../../atoms/SelectField'

// types
import { IReservationSystemSettingsForm, ISelectOptionItem } from '../../../types/interfaces'

// utils
import { FORM, UPLOAD_IMG_CATEGORIES, URL_UPLOAD_IMAGES } from '../../../utils/enums'
import { showErrorNotification /* , showServiceCategory, validationNumberMin */ } from '../../../utils/helper'
import { withPromptUnsavedChanges } from '../../../utils/promptUnsavedChanges'

// validations
import validateReservationSystemSettingsForm from './validateReservationSystemSettingsForm'

// assets
import { ReactComponent as GlobeIcon } from '../../../assets/icons/globe-24.svg'
import { ReactComponent as SettingsIcon } from '../../../assets/icons/setting.svg'
import { ReactComponent as BellIcon } from '../../../assets/icons/bell-24.svg'
import { ReactComponent as ServiceIcon } from '../../../assets/icons/services-24-icon.svg'
import { ReactComponent as InfoIcon } from '../../../assets/icons/info-icon-32.svg'

// redux
import { RootState } from '../../../reducers'
import { ReactComponent as EditIcon } from '../../../assets/icons/edit-icon.svg'
import InputsArrayField from '../../../atoms/InputsArrayField'
import CheckboxGroupNestedField from '../../IndustriesPage/components/CheckboxGroupNestedField'

type ComponentProps = {
	salonID: string
}

type Props = InjectedFormProps<IReservationSystemSettingsForm, ComponentProps> & ComponentProps

const getFrequencyOption = (minutes: number): ISelectOptionItem => {
	return { label: `${minutes}`, key: minutes, value: minutes }
}

const FREQUENCIES: ISelectOptionItem[] = [getFrequencyOption(15), getFrequencyOption(20), getFrequencyOption(30), getFrequencyOption(60)]

// TODO: otifikacia fieldy
const NotificationFields = (param: any) => {
	const [t] = useTranslation()
	const disabled = false
	const items = param.fields.map((field: any, index: any) => (
		<div key={field} className={'flex items-center bg-gray-50 rounded mr-2 px-1'}>
			<Field component={SwitchField} label={t('loc:SMS')} name={`${field}.sms`} size={'middle'} disabled={disabled} />
		</div>
	))

	return <div className={'flex items-center'}>{items}</div>
}
const ReservationSystemSettingsForm = (props: Props) => {
	const { salonID, handleSubmit, pristine, submitting } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const disabled = submitting
	const hasPermission = true // TODO: permissions?
	const groupedServicesByCategory = useSelector((state: RootState) => state.service.services.data?.groupedServicesByCategory)
	// const { enabledReservations } = useSelector((state: RootState) => getFormValues(FORM.RESEVATION_SYSTEM_SETTINGS)(state)) as any
	// const disabled = false // enabledReservations !== true

	const treeData = map(groupedServicesByCategory, (level1) => {
		return {
			title: level1.category?.name,
			id: level1.category?.id,
			children: map(level1.category?.children, (level2) => {
				return {
					id: level2.category?.id,
					title: level2.category?.name,
					children: map(level2.category?.children, (level3) => {
						return {
							id: level3.category.id,
							title: level3.category.name
						}
					})
				}
			})
		}
	})

	const getNotificationTitle = useCallback((title: string, tooltip: string) => {
		return (
			<div className={'flex my-6'}>
				<div className={'mb-0 mt-0 flex items-center justify-between'}>
					<span className='base-semibold'>{title}</span>
					<Tooltip title={tooltip} className={'cursor-pointer'}>
						<InfoIcon width={16} height={16} className={'text-notino-grayDark'} />
					</Tooltip>
				</div>
			</div>
		)
	}, [])

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
							name={'minHoursB2cCancelReservationBeforeStart'}
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
					<div className={'flex'}>
						<div className='w-full s-regular flex items-center bg-notino-red bg-opacity-5 p-2'>
							<InfoIcon className={'text-notino-red mr-2'} width={16} height={16} />
							<span>{t('loc:SMS notifikácie sú spoplatnené podľa aktuálneho cenníka Notino.')}</span>
						</div>
					</div>
					<Row justify={'space-between'} className='mt-7'>
						{/* Client's notifications */}
						<div className={'w-9/20'}>
							<h4 className={'mb-0 mt-0 '}>{t('loc:Zákaznícke notifikácie')}</h4>
							<Divider className={'mt-3'} />
							{getNotificationTitle(
								t('loc:Rezervácie čakajúce na schválenie'),
								t('loc:Zákazník dostane notifikáciu, že jeho rezervácia čaká na schválenie salónom.')
							)}
						</div>

						{/* Internal notifications */}
						<div className={'w-9/20'}>
							<h4 className={'mb-0 mt-0 '}>{t('loc:Interné notifikácie')}</h4>
							<Divider className={'mt-3'} />
							{getNotificationTitle(
								t('loc:Rezervácie čakajúce na schválenie'),
								t('loc:Zákazník dostane notifikáciu, že jeho rezervácia čaká na schválenie salónom.')
							)}
							{/* // TODO: doriesit array field */}
							<FieldArray component={NotificationFields} name={'emails'} />
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
					<Field name={'categoryIDs'} component={CheckboxGroupNestedField} dataTree={treeData} />
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
