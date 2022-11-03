import React, { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { change, Field, Fields, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal } from 'antd'

// validate
import { flatten, forEach, map } from 'lodash'
import validateReservationForm from './validateReservationForm'

// reducers
// utils
import { formatLongQueryString, getCountryPrefix, optionRenderWithAvatar, optionRenderWithImage, showErrorNotification } from '../../../../utils/helper'
import { CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW, ENUMERATIONS_KEYS, FORM, SALON_PERMISSION, STRINGS } from '../../../../utils/enums'

// types
import { ICalendarReservationForm, ICustomerForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as ProfileIcon } from '../../../../assets/icons/profile-icon.svg'

// components
import DateField from '../../../../atoms/DateField'
import TextareaField from '../../../../atoms/TextareaField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SelectField from '../../../../atoms/SelectField'
import { getReq, postReq } from '../../../../utils/request'
import CustomerForm from '../../../CustomersPage/components/CustomerForm'
import Permissions from '../../../../utils/Permissions'
import { RootState } from '../../../../reducers'

type ComponentProps = {
	salonID: string
	setCollapsed: (view: CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW) => void
}

type Props = InjectedFormProps<ICalendarReservationForm, ComponentProps> & ComponentProps

const ReservationForm: FC<Props> = (props) => {
	const { handleSubmit, setCollapsed, salonID } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [visibleCustomerModal, setVisibleCustomerModal] = useState(false)
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])

	const serviceOptions = [
		{
			key: 'Odvetvie 1',
			header: 'Odvetvie 1',
			children: [
				{
					key: 'Service 1',
					value: 'service-1-id',
					label: 'Service 1 option'
				},
				{
					key: 'Service 2',
					value: 'service-2-id',
					label: 'Service 2 option'
				}
			]
		},
		{
			key: 'Odvetvie 2',
			header: 'Odvetvie 2',
			children: [
				{
					key: 'Service 3',
					value: 'service-3-id',
					label: 'Service 3 option'
				},
				{
					key: 'Service 4',
					value: 'service-4-id',
					label: 'Service 4 option'
				}
			]
		}
	]

	const searchEmployes = useCallback(
		async (search: string, page: number) => {
			try {
				const { data } = await getReq('/api/b2b/admin/employees/', {
					search: formatLongQueryString(search),
					page,
					salonID
				})
				const selectOptions = map(data.employees, (employee) => ({
					value: employee.id,
					key: employee.id,
					label: employee.firstName && employee.lastName ? `${employee.firstName} ${employee.lastName}` : employee.email,
					thumbNail: employee.image.resizedImages.thumbnail
					// TODO: Available / Non Available hodnoty ak pribudne logika na BE tak doplnit ako extraContent
				}))
				console.log('selectOptions', selectOptions)
				return { pagination: data.pagination, data: selectOptions }
			} catch (e) {
				return { pagination: null, data: [] }
			}
		},
		[salonID]
	)

	const searchServices = useCallback(
		async (search: string, page: number) => {
			try {
				// TODO: vyhladavanie na FE?
				const { data } = await getReq('/api/b2b/admin/services/', {
					salonID
				})
				console.log('servics', data.groupedServicesByCategory)
				// TODO: filter na cekovanie ci je cmplete salon
				const optData = map(data.groupedServicesByCategory, (industry) => {
					return {
						label: industry.category?.name,
						key: industry.category?.id,
						children: flatten(
							map(industry.category?.children, (opt) =>
								map(opt.category?.children, (service) => {
									// TODO: is complete spravit
									return {
										label: service.category.name,
										key: service.category.id
										// disabled: true
									}
								})
							)
						)
					}
				})
				console.log('optData', optData)
				return { pagination: null, data: optData }
			} catch (e) {
				return { pagination: null, data: [] }
			}
		},
		[salonID]
	)

	const searchCustomers = useCallback(
		async (search: string, page: number) => {
			try {
				const { data } = await getReq('/api/b2b/admin/customers/', {
					search: formatLongQueryString(search),
					page,
					salonID
				})
				console.log('data', data)
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
			// TODO: initnut labelInValue shape
			dispatch(change(FORM.CALENDAR_RESERVATION_FORM, 'customer', customer.data.customer?.id))
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
				<div className={'font-semibold'}>{t('loc:Nová rezervácia')}</div>
				<Button className='button-transparent' onClick={() => setCollapsed(CALENDAR_EVENT_MANAGEMENT_SIDER_VIEW.COLLAPSED)}>
					<CloseIcon />
				</Button>
			</div>
			<div className={'nc-sider-event-management-content main-panel'}>
				<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
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
								allowClear
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
						suffixIcon={<ProfileIcon />}
						placeholder={t('loc:Vyber službu')}
						name={'service'}
						size={'large'}
						update={(itemKey: number, ref: any) => ref.blur()}
						filterOption={false}
						allowInfinityScroll
						showSearch
						className={'pb-0'}
						required
						labelInValue
						onSearch={searchServices}
					/>

					{/* <Field */}
					{/*	name={'service'} */}
					{/*	label={t('loc:Služba')} */}
					{/*	component={CalendarSelectField} */}
					{/*	labelInValue */}
					{/*	emptyIcon={<ServicesIcon />} */}
					{/*	entityName={t('loc:službu')} */}
					{/*	options={serviceOptions} */}
					{/*	required */}
					{/* /> */}
					<Field
						name={'date'}
						label={t('loc:Dátum')}
						className={'pb-0'}
						pickerClassName={'w-full'}
						component={DateField}
						disablePast
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
				<Button onClick={() => dispatch(submit(FORM.CALENDAR_RESERVATION_FORM))} htmlType={'submit'} type={'primary'} block className={'noti-btn self-end'}>
					{STRINGS(t).createRecord(t('loc:rezerváciu'))}
				</Button>
			</div>
		</>
	)
}

const form = reduxForm<ICalendarReservationForm, ComponentProps>({
	form: FORM.CALENDAR_RESERVATION_FORM,
	forceUnregisterOnUnmount: true,
	touchOnChange: true,
	destroyOnUnmount: true,
	onSubmitFail: showErrorNotification,
	validate: validateReservationForm
})(ReservationForm)

export default form
