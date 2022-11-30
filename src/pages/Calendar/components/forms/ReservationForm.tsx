import React, { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { change, Field, Fields, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Form, Modal, Spin } from 'antd'
import { flatten, map } from 'lodash'

// validate
import validateReservationForm from './validateReservationForm'

// utils
import { formatLongQueryString, getAssignedUserLabel, getCountryPrefix, optionRenderWithAvatar, showErrorNotification } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'
import { getReq, postReq } from '../../../../utils/request'
import { CREATE_EVENT_PERMISSIONS, ENUMERATIONS_KEYS, FORM, SALON_PERMISSION, STRINGS, UPDATE_EVENT_PERMISSIONS } from '../../../../utils/enums'

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

type ComponentProps = {
	salonID: string
	searchEmployes: (search: string, page: number) => Promise<any>
	eventId?: string | null
}
const formName = FORM.CALENDAR_RESERVATION_FORM

type Props = InjectedFormProps<ICalendarReservationForm, ComponentProps> & ComponentProps

const ReservationForm: FC<Props> = (props) => {
	const { handleSubmit, salonID, searchEmployes, eventId } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [visibleCustomerModal, setVisibleCustomerModal] = useState(false)
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)

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
			<div className={'nc-sider-event-management-content main-panel'}>
				<Spin spinning={eventDetail.isLoading} size='large'>
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
									optionLabelProp={'label'}
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
							disablePast
							showInReservationDrawer
							placement={'bottomRight'}
							dropdownAlign={{ points: ['tr', 'br'] }}
							size={'large'}
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
							size={'large'}
						/>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
							label={t('loc:Zamestnanec')}
							suffixIcon={<ProfileIcon />}
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
							htmlType={'submit'}
							type={'primary'}
							block
							className={'noti-btn self-end'}
						>
							{eventId ? STRINGS(t).edit(t('loc:rezerváciu')) : STRINGS(t).createRecord(t('loc:rezerváciu'))}
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
