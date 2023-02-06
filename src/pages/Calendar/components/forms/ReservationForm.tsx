import React, { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { change, Field, Fields, getFormValues, initialize, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal, Spin } from 'antd'
import { flatten, map } from 'lodash'
import cx from 'classnames'

// validate
import validateReservationForm from './validateReservationForm'

// utils
import { formatLongQueryString, getAssignedUserLabel, getCountryPrefix, optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'
import { getReq, postReq } from '../../../../utils/request'
import { CREATE_EVENT_PERMISSIONS, ENUMERATIONS_KEYS, FORM, SALON_PERMISSION, UPDATE_EVENT_PERMISSIONS } from '../../../../utils/enums'

// types
import { ICalendarReservationForm, ICustomerForm } from '../../../../types/interfaces'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon.svg'
import { ReactComponent as ServiceIcon } from '../../../../assets/icons/services-24-icon.svg'
import { ReactComponent as CustomerIcon } from '../../../../assets/icons/customer-24-icon.svg'
import { ReactComponent as EmployeesIcon } from '../../../../assets/icons/employees-16-current-color.svg'
import { ReactComponent as TimerIcon } from '../../../../assets/icons/clock-icon.svg'
import { ReactComponent as DateSuffixIcon } from '../../../../assets/icons/date-suffix-icon.svg'

// components
import DateField from '../../../../atoms/DateField'
import TextareaField from '../../../../atoms/TextareaField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SelectField from '../../../../atoms/SelectField'
import CustomerForm from '../../../CustomersPage/components/CustomerForm'

// redux
import { RootState } from '../../../../reducers'
import { getCustomer } from '../../../../reducers/customers/customerActions'
import CalendarDetailPopover from '../CustomerDetailPopover'

type ComponentProps = {
	salonID: string
	searchEmployes: (search: string, page: number) => Promise<any>
	eventId?: string | null
	phonePrefix?: string
}
const formName = FORM.CALENDAR_RESERVATION_FORM

type Props = InjectedFormProps<ICalendarReservationForm, ComponentProps> & ComponentProps

const ReservationForm: FC<Props> = (props) => {
	const { handleSubmit, salonID, searchEmployes, eventId, phonePrefix, pristine, submitting } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [visibleCustomerCreateModal, setVisibleCustomerCreateModal] = useState(false)
	const [visibleCustomerDetailModal, setVisibleCustomerDetailModal] = useState(false)
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)
	const reservationFormValues: Partial<ICalendarReservationForm> = useSelector((state: RootState) => getFormValues(FORM.CALENDAR_RESERVATION_FORM)(state))

	// NOTE: pristine pouzivat len pri UPDATE eventu a pri CREATE povlit akciu vzdy
	const disabledSubmitButton = !!(eventId && pristine) || submitting
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
									id: item.service.id,
									label: item.category.name,
									key: item.service.id,
									disabled: undefined,
									title: undefined
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
						thumbNail: customer?.profileImage?.resizedImages?.thumbnail,
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
		[countriesData?.data, salonID]
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
			setVisibleCustomerCreateModal(false)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}
	const onChangeCustomer = async (customer: any) => {
		/* const { data } = await dispatch(getCustomer(customer.key))
		dispatch(
			initialize(FORM.CUSTOMER, {
				...data?.customer,
				avatar: data?.customer?.profileImage
					? [{ url: data?.customer?.profileImage?.original, thumbnail: data?.customer?.profileImage?.resizedImages?.thumbnail, uid: data?.customer?.profileImage?.id }]
					: null
			})
		)
		setVisibleCustomerDetailModal(true) */
	}

	const modals = (
		<>
			<Modal
				className='rounded-fields'
				title={t('loc:Pridať nového zákaznika')}
				centered
				destroyOnClose
				onOk={() => dispatch(submit(FORM.CUSTOMER))}
				visible={visibleCustomerCreateModal}
				onCancel={() => setVisibleCustomerCreateModal(false)}
				closeIcon={<CloseIcon />}
			>
				<CustomerForm onSubmit={handleSubmitCustomer} inModal />
			</Modal>
			<Modal
				className='rounded-fields'
				title={t('loc:Detail klienta')}
				centered
				destroyOnClose
				visible={visibleCustomerDetailModal}
				onCancel={() => setVisibleCustomerDetailModal(false)}
				closeIcon={<CloseIcon />}
				footer={[
					<Button type={'dashed'} className={'noti-btn'} size={'middle'} onClick={() => setVisibleCustomerDetailModal(false)}>
						{t('loc:Zatvoriť')}
					</Button>
				]}
			>
				<CustomerForm inModal disabled />
			</Modal>
		</>
	)

	return (
		<>
			{modals}
			<div className={'nc-sider-event-management-content'}>
				<Spin spinning={eventDetail.isLoading} size='large'>
					<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
						<Permissions
							allowed={[SALON_PERMISSION.CUSTOMER_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<div className='relative'>
									<CalendarDetailPopover />
									<Field
										optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
										component={SelectField}
										label={t('loc:Zákazník')}
										placeholder={t('loc:Vyber zákazníka')}
										name={'customer'}
										className={cx('pb-0', { 'customer-with-info-icon': reservationFormValues?.customer?.value })}
										size={'large'}
										onChange={onChangeCustomer}
										optionLabelProp={'label'}
										suffixIcon={<CustomerIcon className={'text-notino-grayDark'} width={16} height={16} />}
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
												onAction: hasPermission
													? () => {
															dispatch(initialize(FORM.CUSTOMER, { phonePrefixCountryCode: phonePrefix }))
															setVisibleCustomerCreateModal(true)
													  }
													: openForbiddenModal
											}
										]}
									/>
								</div>
							)}
						/>
						<Field
							component={SelectField}
							label={t('loc:Služba')}
							suffixIcon={<ServiceIcon className={'text-notino-grayDark'} width={16} height={16} />}
							placeholder={t('loc:Vyber službu')}
							name={'service'}
							size={'large'}
							update={(_itemKey: number, ref: any) => ref.blur()}
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
							showInReservationDrawer
							placement={'bottomRight'}
							dropdownAlign={{ points: ['tr', 'br'] }}
							size={'large'}
							suffixIcon={<DateSuffixIcon className={'text-notino-grayDark'} />}
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
							suffixIcon={<TimerIcon className={'text-notino-grayDark'} />}
							size={'large'}
						/>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
							label={t('loc:Zamestnanec')}
							suffixIcon={<EmployeesIcon className={'text-notino-grayDark'} />}
							placeholder={t('loc:Vyber zamestnanca')}
							name={'employee'}
							optionLabelProp={'label'}
							size={'large'}
							update={(_itemKey: number, ref: any) => ref.blur()}
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
				</Spin>
			</div>
			<div className={'nc-sider-event-management-footer'}>
				<Permissions
					allowed={eventId ? UPDATE_EVENT_PERMISSIONS : CREATE_EVENT_PERMISSIONS}
					render={(hasPermission, { openForbiddenModal }) => (
						<Button
							onClick={(e) => {
								if (hasPermission) {
									dispatch(submit(formName))
								} else {
									e.preventDefault()
									openForbiddenModal()
								}
							}}
							disabled={disabledSubmitButton}
							htmlType={'submit'}
							type={'primary'}
							block
							className={'noti-btn self-end'}
						>
							{eventId ? t('loc:Upraviť') : t('loc:Vytvoriť')}
						</Button>
					)}
				/>
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
