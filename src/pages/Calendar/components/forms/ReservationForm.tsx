import React, { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { change, Field, Fields, getFormValues, initialize, InjectedFormProps, reduxForm, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Form, Modal, Spin } from 'antd'
import cx from 'classnames'
import { flatten, isEmpty, isNil, map } from 'lodash'
import dayjs from 'dayjs'

// utils
import { formatLongQueryString, getAssignedUserLabel, getCountryPrefix, optionRenderWithAvatar, showErrorNotification, findNodeInTree } from '../../../../utils/helper'
import Permissions from '../../../../utils/Permissions'
import { getReq, postReq } from '../../../../utils/request'
import { CALENDAR_EVENT_TYPE, DEFAULT_TIME_FORMAT, ENUMERATIONS_KEYS, FORM, PERMISSION, CREATE_EVENT_PERMISSIONS, UPDATE_EVENT_PERMISSIONS } from '../../../../utils/enums'

// types
import { EmployeeService, ICalendarEmployeesPayload, ServiceType } from '../../../../types/interfaces'
import { ICustomerForm } from '../../../../schemas/customer'

// assets
import { ReactComponent as CloseIcon } from '../../../../assets/icons/close-icon-modal.svg'
import { ReactComponent as ServiceIcon } from '../../../../assets/icons/services-24-icon.svg'
import { ReactComponent as CustomerIcon } from '../../../../assets/icons/customer-24-icon.svg'
import { ReactComponent as EmployeesIcon } from '../../../../assets/icons/employees-16-current-color.svg'
import { ReactComponent as TimerIcon } from '../../../../assets/icons/clock-icon.svg'
import { ReactComponent as DateSuffixIcon } from '../../../../assets/icons/date-suffix-icon.svg'
import { ReactComponent as LoadingIcon } from '../../../../assets/icons/loading-icon.svg'

// components
import DateField from '../../../../atoms/DateField'
import TextareaField from '../../../../atoms/TextareaField'
import TimeRangeField from '../../../../atoms/TimeRangeField'
import SelectField from '../../../../atoms/SelectField'
import CustomerForm from '../../../CustomersPage/components/CustomerForm'
import CalendarDetailPopover from '../popovers/CustomerDetailPopover'
import ConfirmModal from '../../../../atoms/ConfirmModal'

// redux
import { RootState } from '../../../../reducers'
import { getEmployee } from '../../../../reducers/employees/employeesActions'

// schemas
import { ICalendarReservationForm, validationReservationsFn } from '../../../../schemas/reservation'

type ComponentProps = {
	salonID: string
	eventId?: string | null
	phonePrefix?: string
	loadingData?: boolean
	employeesLoading?: boolean
	sidebarView?: CALENDAR_EVENT_TYPE
	employeesOptions: ICalendarEmployeesPayload['options']
}
const formName = FORM.CALENDAR_RESERVATION_FORM

type Props = InjectedFormProps<ICalendarReservationForm, ComponentProps> & ComponentProps

type DurationData = Omit<ServiceType['rangePriceAndDurationData'], 'priceFrom' | 'priceTo'>

const getDurationData = (
	priceAndDurationData?: ServiceType['priceAndDurationData'],
	useCategoryParameter?: boolean,
	serviceCategoryParameter?: ServiceType['serviceCategoryParameter']
) => {
	let durationData = {} as DurationData

	const durationDataToCheck = {} as DurationData
	if (!isNil(priceAndDurationData?.durationFrom)) {
		durationDataToCheck.durationFrom = priceAndDurationData?.durationFrom
	}
	if (!isNil(priceAndDurationData?.durationTo)) {
		durationDataToCheck.durationTo = priceAndDurationData?.durationTo
	}

	if (useCategoryParameter && !isEmpty(serviceCategoryParameter?.values)) {
		const employeeDurationData = serviceCategoryParameter?.values.reduce((duration, cv) => {
			let newDurationData = { ...duration }
			const durationTo = cv.priceAndDurationData.durationTo || cv.priceAndDurationData.durationFrom || 0

			if (durationTo && durationTo > (duration.durationTo || 0)) {
				newDurationData = {
					...newDurationData,
					durationTo
				}
			}
			return newDurationData
		}, {} as DurationData)
		if (!isEmpty(employeeDurationData)) {
			durationData = {
				durationTo: employeeDurationData?.durationTo
			}
		}
	} else if (!isEmpty(durationDataToCheck)) {
		const durationTo = durationDataToCheck?.durationTo || durationDataToCheck?.durationFrom || 0
		durationData = {
			durationTo
		}
	}
	return durationData
}

const getCategoryById = (category: any, serviceCategoryID?: string): EmployeeService | null => {
	let result = null
	if (category?.category?.id === serviceCategoryID) {
		return category
	}
	if (category?.children) {
		// eslint-disable-next-line no-return-assign
		category.children.some((node: any) => (result = getCategoryById(node, serviceCategoryID)))
	}
	return result
}

const ReservationForm: FC<Props> = (props) => {
	const { handleSubmit, salonID, eventId, phonePrefix, pristine, submitting, loadingData, sidebarView, employeesOptions, employeesLoading } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [visibleCustomerCreateModal, setVisibleCustomerCreateModal] = useState(false)
	const [visibleCustomerDetailModal, setVisibleCustomerDetailModal] = useState(false)
	const [isSettingTime, setIsSettingTime] = useState(false)
	const countriesData = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES])
	const eventDetail = useSelector((state: RootState) => state.calendar.eventDetail)
	const formValues: Partial<ICalendarReservationForm> = useSelector((state: RootState) => getFormValues(formName)(state))
	const services = useSelector((state: RootState) => state.service.services)
	const isDeletedEmployee = !!formValues?.employee?.extra?.isDeleted
	const servicesOptions = flatten(
		map(services?.data?.groupedServicesByCategory, (industry) =>
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
							title: undefined,
							extra: {
								priceAndDurationData: item.service.priceAndDurationData,
								useCategoryParameter: item.service.useCategoryParameter,
								serviceCategoryParameter: item.service.serviceCategoryParameter,
								categoryId: item.category.id
							}
						}
					})
				}
			})
		)
	)

	// NOTE: pristine pouzivat len pri UPDATE eventu a pri CREATE povlit akciu vzdy
	const disabledSubmitButton = !!(eventId && pristine) || submitting || loadingData

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
						extra: {
							thumbnail: customer?.profileImage?.resizedImages?.thumbnail,
							extraContent: (
								<span className={'text-notino-grayDark text-xs'}>
									{prefix} {customer.phone}
								</span>
							)
						}
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
				email: values.email,
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

	const setReservationTime = async (serviceId?: string, employeeId?: string) => {
		let durationData: DurationData = {}

		const service = findNodeInTree({ children: servicesOptions }, serviceId) as ICalendarReservationForm['service'] | undefined

		if (employeeId) {
			setIsSettingTime(true)
			try {
				const { data: employeeData } = await dispatch(getEmployee(employeeId))
				const employeeCategory = getCategoryById(
					{
						children: employeeData?.employee?.categories
					},
					service?.extra?.categoryId
				)

				// check if employee has overriden duration data of selected service
				if (employeeCategory) {
					const employeeDurationData = getDurationData(
						employeeCategory.priceAndDurationData,
						employeeCategory.useCategoryParameter,
						employeeCategory.serviceCategoryParameter
					)
					if (!isEmpty(employeeDurationData)) {
						durationData = {
							durationTo: employeeDurationData?.durationTo
						}
					}
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			}
		}

		// if employee doesn't have overriden duration data, check duration data of selected service
		if (isEmpty(durationData)) {
			const serviceDurationData = getDurationData(service?.extra?.priceAndDurationData, service?.extra?.useCategoryParameter, service?.extra?.serviceCategoryParameter)
			if (!isEmpty(serviceDurationData)) {
				durationData = {
					durationTo: serviceDurationData?.durationTo
				}
			}
		}

		// set event time based on service duration data
		if (!isNil(durationData.durationTo)) {
			const timeFrom = formValues?.timeFrom ?? dayjs().format(DEFAULT_TIME_FORMAT)
			const [hoursFrom, minutesFrom] = timeFrom.split(':')
			let timeTo = dayjs().startOf('day').add(Number(hoursFrom), 'hours').add(Number(minutesFrom), 'minutes').add(durationData.durationTo, 'minutes')
			const endOfADay = dayjs().startOf('day').add(23, 'hours').add(59, 'minutes')
			if (!dayjs(timeTo).isSameOrBefore(endOfADay)) {
				timeTo = endOfADay
			}
			if (!formValues?.timeFrom) {
				dispatch(change(formName, 'timeFrom', timeFrom))
			}
			dispatch(change(formName, 'timeTo', timeTo.format(DEFAULT_TIME_FORMAT)))
		}
		setIsSettingTime(false)
	}

	const onChangeService = async (service?: any) => {
		const selectedEmployeeId = formValues?.employee?.value as string | undefined
		const selectedServiceId = service?.value

		if (selectedServiceId) {
			setReservationTime(selectedServiceId, selectedEmployeeId)
		}
	}

	const onChangeEmployee = async (emp?: any) => {
		const selectedEmployeeId = emp?.value
		const selectedServiceId = formValues?.service?.value

		// check service / employee duration data and change event time only when there is alerady a service selected
		if (selectedEmployeeId && selectedServiceId) {
			setReservationTime(selectedServiceId as string, selectedEmployeeId)
		}
	}

	const modals = (
		<>
			<ConfirmModal
				className='rounded-fields'
				title={t('loc:Pridať nového zákaznika')}
				centered
				destroyOnClose
				onOk={() => dispatch(submit(FORM.CUSTOMER))}
				open={visibleCustomerCreateModal}
				onCancel={() => setVisibleCustomerCreateModal(false)}
				closeIcon={<CloseIcon />}
			>
				<CustomerForm onSubmit={handleSubmitCustomer} inModal />
			</ConfirmModal>
			<Modal
				className='rounded-fields'
				title={t('loc:Detail klienta')}
				centered
				destroyOnClose
				open={visibleCustomerDetailModal}
				onCancel={() => setVisibleCustomerDetailModal(false)}
				closeIcon={<CloseIcon />}
				footer={null}
			>
				<CustomerForm inModal disabled />
			</Modal>
		</>
	)

	return (
		<>
			{modals}
			<div className={'nc-sider-event-management-content'} key={`${eventId}${sidebarView}`}>
				<Spin spinning={eventDetail.isLoading || employeesLoading} size='large'>
					<Form layout='vertical' className='w-full h-full flex flex-col gap-4' onSubmitCapture={handleSubmit}>
						{isDeletedEmployee && <Alert message={t('loc:Priradený kolega je vymazaný zo salónu')} showIcon type={'warning'} className={'noti-alert w-full'} />}
						<Permissions
							allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.CUSTOMER_CREATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<div className='relative'>
									<CalendarDetailPopover />
									<Field
										optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
										component={SelectField}
										label={t('loc:Zákazník')}
										placeholder={t('loc:Vyber zákazníka')}
										name={'customer'}
										className={cx('pb-0', { 'customer-with-info-icon': formValues?.customer?.value })}
										size={'large'}
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
							options={servicesOptions}
							className={'pb-0'}
							required
							labelInValue
							onChange={onChangeService}
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
							suffixIcon={isSettingTime ? <LoadingIcon className={'animate-spin-2s'} /> : <TimerIcon className={'text-notino-grayDark'} />}
							size={'large'}
						/>
						<Field
							component={SelectField}
							optionRender={(itemData: any) => optionRenderWithAvatar(itemData)}
							options={employeesOptions}
							label={t('loc:Zamestnanec')}
							suffixIcon={<EmployeesIcon className={'text-notino-grayDark'} />}
							placeholder={t('loc:Vyber zamestnanca')}
							name={'employee'}
							optionLabelProp={'label'}
							size={'large'}
							update={(_itemKey: number, ref: any) => ref.blur()}
							required
							className={'pb-0'}
							labelInValue
							onChange={onChangeEmployee}
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
	validate: validationReservationsFn
})(ReservationForm)

export default form
