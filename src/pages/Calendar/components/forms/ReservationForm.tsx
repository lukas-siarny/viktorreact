import React, { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { change, Field, Fields, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Form, Modal } from 'antd'
import { flatten, map } from 'lodash'

// validate
import validateReservationForm from './validateReservationForm'

// utils
import { formatLongQueryString, getAssignedUserLabel, getCountryPrefix, optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'
import { getReq, postReq } from '../../../../utils/request'
import { CALENDAR_EVENT_TYPE, CALENDAR_EVENTS_VIEW_TYPE, ENUMERATIONS_KEYS, EVENT_TYPE_OPTIONS, FORM, SALON_PERMISSION, STRINGS } from '../../../../utils/enums'

// types
import { ICalendarReservationForm, ICustomerForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profile-icon.svg'
import { ReactComponent as ServiceIcon } from '../../../../assets/icons/services-24-icon.svg'

// components
import DateField from '../../../../atoms/DateField'
import TextareaField from '../../../../atoms/TextareaField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SelectField from '../../../../atoms/SelectField'
import CustomerForm from '../../../CustomersPage/components/CustomerForm'

// redux
import { RootState } from '../../../../reducers'
import DeleteButton from '../../../../components/DeleteButton'

type ComponentProps = {
	salonID: string
	setCollapsed: (view: CALENDAR_EVENT_TYPE | undefined) => void
	onChangeEventType: (type: any) => any
	handleDeleteEvent: () => any
	searchEmployes: (search: string, page: number) => Promise<any>
	eventsViewType: CALENDAR_EVENTS_VIEW_TYPE
	eventId?: string | null
}
const formName = FORM.CALENDAR_RESERVATION_FORM

type Props = InjectedFormProps<ICalendarReservationForm, ComponentProps> & ComponentProps

const ReservationForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed, salonID, onChangeEventType, handleDeleteEvent, searchEmployes, eventsViewType, eventId } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [visibleCustomerModal, setVisibleCustomerModal] = useState(false)
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	const searchServices = useCallback(async () => {
		try {
			const { data } = await getReq('/api/b2b/admin/services/', {
				salonID
			})
			const optData = flatten(
				map(data.groupedServicesByCategory, (industry) =>
					map(industry.category?.children, (category) => {
						return {
							label: category?.category?.name,
							key: category?.category?.id,
							children: map(category.category?.children, (item) => {
								return {
									label: item.category.name,
									key: item.service.id
								}
							})
						}
					})
				)
			)
			return { pagination: null, data: optData }
		} catch (e) {
			return { pagination: null, data: [] }
		}
	}, [salonID])

	const searchCustomers = useCallback(
		async (search: string, page: number) => {
			try {
				const { data } = await getReq('/api/b2b/admin/customers/', {
					search: formatLongQueryString(search),
					page,
					salonID
				})
				const selectOptions = map(data.customers, (customer) => {
					const prefix = getCountryPrefix(countriesData.data, customer?.phonePrefixCountryCode)
					return {
						value: customer.id,
						key: customer.id,
						label: customer.firstName && customer.lastName ? `${customer.firstName} ${customer.lastName}` : customer.email,
						thumbNail: customer.profileImage.resizedImages.thumbnail,
						extraContent: (
							<span className={'text-notino-grayDark text-xs'}>
								{prefix} {customer.phone}
							</span>
						)
					}
				})
				return { pagination: data.pagination, data: selectOptions }
			} catch (e) {
				return { pagination: null, data: [] }
			}
		},
		[salonID]
	)

	const handleSubmitCustomer = async (values: ICustomerForm) => {
		try {
			const customer = await postReq('/api/b2b/admin/customers/', null, {
				firstName: values.firstName,
				lastName: values.lastName,
				salonID,
				phone: values.phone,
				phonePrefixCountryCode: values.phonePrefixCountryCode,
				profileImageID: (values?.avatar?.[0]?.id ?? values?.avatar?.[0]?.uid) || null
			})
			dispatch(
				change(formName, 'customer', {
					id: customer.data.customer?.id,
					key: customer.data.customer?.id,
					value: getAssignedUserLabel({
						id: customer.data.customer?.id as string,
						firstName: customer.data.customer?.firstName,
						lastName: customer.data.customer?.lastName,
						email: customer.data.customer?.email
					})
				})
			)
			setVisibleCustomerModal(false)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	const modals = (
		<Modal
			className='rounded-fields'
			title={t('loc:Pridať nového zákaznika')}
			centered
			destroyOnClose
			onOk={() => dispatch(submit(FORM.CUSTOMER))}
			visible={visibleCustomerModal}
			onCancel={() => setVisibleCustomerModal(false)}
			closeIcon={<CloseIcon />}
		>
			<CustomerForm onSubmit={handleSubmitCustomer} inModal />
		</Modal>
	)

	return (
		<>
			{modals}
			<div className={'nc-sider-event-management-header justify-between'}>
				<div className={'font-semibold'}>{eventId ? STRINGS(t).edit(t('loc:rezerváciu')) : STRINGS(t).createRecord(t('loc:rezerváciu'))}</div>
				<div className={'flex-center'}>
					{eventId && (
						<DeleteButton
							placement={'bottom'}
							entityName={t('loc:rezervácia')}
							className={'bg-transparent mr-4'}
							onConfirm={handleDeleteEvent}
							onlyIcon
							smallIcon
							size={'small'}
						/>
					)}
					<Button
						className='button-transparent'
						onClick={() => {
							setCollapsed(undefined)
						}}
					>
						<CloseIcon />
					</Button>
				</div>
			</div>
			<div className={'nc-sider-event-management-content main-panel'}>
				<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
					{!eventId && (
						<>
							<Field
								component={SelectField}
								label={t('loc:Typ udalosti')}
								placeholder={t('loc:Vyberte typ')}
								name={'eventType'}
								options={EVENT_TYPE_OPTIONS(eventsViewType)}
								size={'large'}
								className={'pb-0'}
								onChange={onChangeEventType}
								filterOption={false}
								allowInfinityScroll
							/>
							<Divider className={'mb-3 mt-3'} />
						</>
					)}
					<Permissions
						allowed={[SALON_PERMISSION.CUSTOMER_CREATE]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Field
								optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
								component={SelectField}
								label={t('loc:Zákazník')}
								placeholder={t('loc:Vyber zákazníka')}
								name={'customer'}
								className={'pb-0'}
								size={'large'}
								suffixIcon={<ProfileIcon />}
								update={(itemKey: number, ref: any) => ref.blur()}
								filterOption={false}
								allowInfinityScroll
								showSearch
								labelInValue
								required
								onSearch={searchCustomers}
								actions={[
									{
										title: t('loc:Nový zákaznik'),
										onAction: hasPermission ? () => setVisibleCustomerModal(true) : openForbiddenModal
									}
								]}
							/>
						)}
					/>

					<Field
						component={SelectField}
						label={t('loc:Služba')}
						suffixIcon={<ServiceIcon />}
						placeholder={t('loc:Vyber službu')}
						name={'service'}
						size={'large'}
						update={(itemKey: number, ref: any) => ref.blur()}
						filterOption={false}
						allowInfinityScroll
						className={'pb-0'}
						required
						labelInValue
						onSearch={searchServices}
					/>
					<Field
						name={'date'}
						label={t('loc:Dátum')}
						className={'pb-0'}
						pickerClassName={'w-full'}
						component={DateField}
						disablePast
						showInReservationDrawer
						placement={'bottomRight'}
						dropdownAlign={{ points: ['tr', 'br'] }}
						required
					/>
					<Fields
						names={['timeFrom', 'timeTo']}
						labels={[t('loc:Začiatok'), t('loc:Koniec')]}
						placeholders={[t('loc:čas od'), t('loc:čas do')]}
						component={TimeRangeField}
						required
						allowClear
						itemClassName={'m-0 pb-0'}
						minuteStep={15}
					/>
					<Field
						component={SelectField}
						optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
						label={t('loc:Zamestnanec')}
						suffixIcon={<ProfileIcon />}
						placeholder={t('loc:Vyber zamestnanca')}
						name={'employee'}
						size={'large'}
						update={(itemKey: number, ref: any) => ref.blur()}
						filterOption={false}
						allowInfinityScroll
						showSearch
						required
						className={'pb-0'}
						labelInValue
						onSearch={searchEmployes}
					/>
					<Field name={'note'} label={t('loc:Poznámka')} className={'pb-0'} component={TextareaField} />
				</Form>
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Button onClick={() => dispatch(submit(formName))} htmlType={'submit'} type={'primary'} block className={'noti-btn self-end'}>
					{eventId ? STRINGS(t).edit(t('loc:rezerváciu')) : STRINGS(t).createRecord(t('loc:rezerváciu'))}
				</Button>
			</div>
		</>
	)
}

const form = reduxForm<ICalendarReservationForm, ComponentProps>({
	form: formName,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateReservationForm
})(ReservationForm)

export default form
