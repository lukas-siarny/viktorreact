import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Action, compose, Dispatch } from 'redux'
import { Button, Modal, notification, Row } from 'antd'
import { get, forEach } from 'lodash'
import { change, initialize, isPristine, isSubmitting, submit } from 'redux-form'
import cx from 'classnames'
import i18next from 'i18next'

// components
import EmployeeForm, { parseSalonID } from './components/EmployeeForm'
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'
import InviteForm from './components/InviteForm'

// types
import { IBreadcrumbs, IComputedMatch, IEmployeeForm, IInviteEmployeeForm, ILoadingAndFailure, SalonSubPageProps } from '../../types/interfaces'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'
import { decodePrice, encodePrice } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getEmployee } from '../../reducers/employees/employeesActions'
import { IServicesPayload } from '../../reducers/services/serviceActions'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{ employeeID: number }>
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

export const parseServicesForCreateAndUpdate = (oldServices: any[]) => {
	return oldServices.map((service: any) => {
		return {
			id: service?.id,
			employeeData: {
				durationFrom: service?.employeeData?.durationFrom,
				durationTo: service?.variableDuration ? service?.employeeData?.durationTo : undefined,
				priceFrom: encodePrice(service?.employeeData?.priceFrom),
				priceTo: service?.variablePrice ? encodePrice(service?.employeeData?.priceTo) : undefined
			}
		}
	})
}

export const addService = (services: IServicesPayload & ILoadingAndFailure, form: any, dispatch: Dispatch<Action>) => {
	const selectedServiceIDs = form?.values?.service
	const updatedServices: any[] = []
	// go through selected services
	forEach(selectedServiceIDs, (serviceId) => {
		const serviceData = services?.data?.services?.find((service: any) => service?.id === serviceId)
		if (form?.values?.services?.find((service: any) => service?.id === serviceId)) {
			notification.warning({
				message: i18next.t('loc:Upozornenie'),
				description: i18next.t(`Služba ${serviceData?.name} je už priradená!`)
			})
		} else if (serviceData) {
			let newServiceData = {
				id: serviceData?.id,
				name: serviceData?.name,
				salonData: {
					durationFrom: serviceData?.durationFrom,
					durationTo: serviceData?.durationTo,
					priceFrom: decodePrice(serviceData?.priceFrom),
					priceTo: serviceData?.priceTo && serviceData?.priceFrom ? decodePrice(serviceData?.priceTo) : undefined
				},
				employeeData: {
					durationFrom: serviceData?.durationFrom,
					durationTo: serviceData?.durationTo,
					priceFrom: decodePrice(serviceData?.priceFrom),
					priceTo: serviceData?.priceTo && serviceData?.priceFrom ? decodePrice(serviceData?.priceTo) : undefined
				},
				variableDuration: false,
				variablePrice: false,
				category: serviceData?.category
			}
			if (serviceData?.durationFrom && serviceData?.durationTo) {
				newServiceData = {
					...newServiceData,
					variableDuration: true
				}
			}
			if (serviceData?.priceFrom && serviceData?.priceTo) {
				newServiceData = {
					...newServiceData,
					variablePrice: true
				}
			}
			updatedServices.push(newServiceData)
		}
	})
	// update filed array services with new added service
	if (form?.values?.services) {
		dispatch(change(FORM.EMPLOYEE, 'services', [...form.values.services, ...updatedServices]))
	} else {
		dispatch(change(FORM.EMPLOYEE, 'services', [...updatedServices]))
	}
	// clear selected value
	dispatch(change(FORM.EMPLOYEE, 'service', null))
}

const EmployeePage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID } = props
	const { employeeID } = props.computedMatch.params
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)

	const employee = useSelector((state: RootState) => state.employees.employee)
	const services = useSelector((state: RootState) => state.service.services)
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE])
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))
	const isInviteFromSubmitting = useSelector(isSubmitting(FORM.INVITE_EMPLOYEE))

	const showDeleteBtn = !!employee?.data?.employee?.id

	useEffect(() => {
		dispatch(getEmployee(employeeID))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employeeID])

	const checkAndParseServices = (ser: any[]) => {
		return ser.map((service) => {
			let updatedService = {
				id: service?.id,
				name: service?.name,
				variableDuration: false,
				variablePrice: false,
				salonData: {
					...service.salonData,
					// decode and set price
					priceFrom: decodePrice(service?.salonData?.priceFrom),
					priceTo: decodePrice(service?.salonData?.priceTo)
				},
				employeeData: {
					...service.employeeData,
					// decode and set price
					priceFrom: decodePrice(service?.employeeData?.priceFrom),
					priceTo: decodePrice(service?.employeeData?.priceTo)
				},
				category: service?.category
			}
			// get data from employeeData
			if (service?.employeeData?.durationFrom && service?.employeeData?.durationTo) {
				updatedService = {
					...updatedService,
					variableDuration: true
				}
			}
			if (service?.employeeData?.priceFrom && service?.employeeData?.priceTo) {
				updatedService = {
					...updatedService,
					variablePrice: true
				}
			}
			return updatedService
		})
	}

	useEffect(() => {
		if (employee.data?.employee) {
			dispatch(
				initialize(FORM.EMPLOYEE, {
					...employee.data?.employee,
					avatar: employee.data?.employee?.image ? [{ url: employee.data?.employee?.image?.resizedImages?.thumbnail, uid: employee.data?.employee?.image?.id }] : [],
					services: checkAndParseServices(employee.data?.employee?.services),
					salonID: { label: employee.data?.employee?.salon?.name, value: employee.data?.employee?.salon?.id }
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employee.data])

	const updateEmployee = async (data: IEmployeeForm) => {
		try {
			setSubmitting(true)
			await patchReq(
				'/api/b2b/admin/employees/{employeeID}',
				{ employeeID },
				{
					firstName: data?.firstName,
					lastName: data?.lastName,
					email: data?.email,
					phonePrefixCountryCode: data?.phonePrefixCountryCode,
					phone: data?.phone,
					services: parseServicesForCreateAndUpdate(data?.services),
					imageID: data?.imageID
				}
			)
			dispatch(getEmployee(employeeID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	const deleteEmployee = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/employees/{employeeID}', { employeeID })
			history.push(t('paths:employees'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zamestnancov'),
				link: t('paths:employees')
			},
			{
				name: t('loc:Detail zamestnanca'),
				titleName: `${get(employee.data?.employee, 'firstName')} ${get(employee.data?.employee, 'lastName')}`
			}
		]
	}

	const inviteEmployee = async (formData: IInviteEmployeeForm) => {
		try {
			await postReq(
				'/api/b2b/admin/employees/invite',
				{},
				{
					inviteEmail: formData?.email,
					employeeID,
					salonID: parseSalonID(form?.values?.salonID),
					// TODO add roleID
					roleID: 0
				}
			)
			dispatch(getEmployee(employeeID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setVisible(false)
		}
	}

	const rowClass = cx({
		'justify-between': showDeleteBtn,
		'justify-center': !showDeleteBtn
	})

	const isProfileInActive: boolean = form?.values?.hasActiveAccount === false

	const buttonWidthClass = cx({
		'w-12/25': isProfileInActive
	})

	const wrapperWidthClass = cx({
		'w-1/2': isProfileInActive,
		'w-1/3': !isProfileInActive
	})

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:employees')} />
			</Row>
			<div className='content-body small mt-2'>
				<EmployeeForm addService={() => addService(services, form, dispatch)} salonID={form?.values?.salonID} onSubmit={updateEmployee} />
				<div className={'content-footer'}>
					<Row className={rowClass}>
						{showDeleteBtn ? (
							<DeleteButton
								permissions={permissions}
								className={'w-1/3'}
								onConfirm={deleteEmployee}
								entityName={t('loc:zamestnanca')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						) : undefined}
						<Permissions
							allowed={[...permissions, PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_UPDATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<div className={`flex justify-between ${wrapperWidthClass}`}>
									{isProfileInActive ? (
										<Button
											type={'primary'}
											block
											size={'middle'}
											className={'noti-btn m-regular w-12/25'}
											htmlType={'submit'}
											onClick={(e) => {
												if (hasPermission) {
													setVisible(true)
													dispatch(initialize(FORM.INVITE_EMPLOYEE, { email: form?.values?.inviteEmail }))
												} else {
													e.preventDefault()
													openForbiddenModal()
												}
											}}
											disabled={isInviteFromSubmitting}
											loading={isInviteFromSubmitting}
										>
											{t('loc:Pozvať do tímu')}
										</Button>
									) : undefined}
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={`noti-btn m-regular ${buttonWidthClass}`}
										htmlType={'submit'}
										onClick={(e) => {
											if (hasPermission) {
												dispatch(submit(FORM.EMPLOYEE))
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={submitting || isFormPristine}
										loading={submitting}
									>
										{t('loc:Uložiť')}
									</Button>
								</div>
							)}
						/>
						<Modal
							className='rounded-fields'
							title={t('loc:Pozvať do tímu')}
							centered
							visible={visible}
							footer={null}
							onCancel={() => setVisible(false)}
							closeIcon={<CloseIcon />}
							width={394}
						>
							<InviteForm onSubmit={inviteEmployee} />
						</Modal>
					</Row>
				</div>
			</div>
		</>
	)
}

export default compose(withPermissions(permissions))(EmployeePage)
