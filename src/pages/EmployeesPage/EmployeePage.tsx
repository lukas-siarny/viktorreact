import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Action, compose, Dispatch } from 'redux'
import { Button, Modal, notification, Row, Spin } from 'antd'
import { get, forEach } from 'lodash'
import { change, initialize, isPristine, isSubmitting, submit } from 'redux-form'
import cx from 'classnames'
import i18next from 'i18next'

// components
import EmployeeForm from './components/EmployeeForm'
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'
import InviteForm from './components/InviteForm'
import EditRoleForm from './components/EditRoleForm'

// types
import { IBreadcrumbs, IComputedMatch, IEditEmployeeRoleForm, IEmployeeForm, IInviteEmployeeForm, ILoadingAndFailure, SalonSubPageProps } from '../../types/interfaces'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'
import { decodePrice, encodePrice } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getEmployee } from '../../reducers/employees/employeesActions'
import { IServicesPayload } from '../../reducers/services/serviceActions'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{ employeeID: number }>
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

export const parseServicesForCreateAndUpdate = (oldServices: any[]) => {
	return oldServices?.map((service: any) => {
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
				description: i18next.t(`Služba ${serviceData?.category.name} je už priradená!`)
			})
		} else if (serviceData) {
			let newServiceData = {
				id: serviceData?.id,
				name: serviceData?.category.name,
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

const EmployeePage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const { employeeID } = props.computedMatch.params
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)

	const employee = useSelector((state: RootState) => state.employees.employee)
	const services = useSelector((state: RootState) => state.service.services)
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE])
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))
	const isInviteFromSubmitting = useSelector(isSubmitting(FORM.INVITE_EMPLOYEE))

	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE]?.values)

	const emploeyeeExists = !!employee?.data?.employee?.id

	const isLoading = employee.isLoading || services.isLoading || isRemoving

	const [backUrl] = useBackUrl(parentPath + t('paths:employees'))

	const fetchEmployeeData = async () => {
		const { data } = await dispatch(getEmployee(employeeID))
		if (!data?.employee?.id) {
			history.push('/404')
		}
	}

	useEffect(() => {
		fetchEmployeeData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employeeID])

	useEffect(() => {
		if (employee.data?.employee) {
			const user = employee.data.employee.user
				? {
						fullName: `${
							employee.data.employee.user?.firstName || employee.data.employee.user?.lastName
								? `${employee.data.employee.user?.firstName} ${employee.data.employee.user?.lastName}`.trim()
								: '-'
						}`,
						email: employee.data.employee.user?.email,
						phonePrefixCountryCode: employee.data.employee.user?.phonePrefixCountryCode,
						phone: employee.data.employee.user?.phone,
						image: [
							{
								url: employee.data.employee.user?.image?.original,
								thumbUrl: employee.data.employee.user?.image?.resizedImages?.thumbnail,
								uid: employee.data.employee.user?.image?.id
							}
						]
				  }
				: undefined

			dispatch(
				initialize(FORM.EMPLOYEE, {
					...employee.data?.employee,
					avatar: employee.data?.employee?.image
						? [
								{
									url: employee.data?.employee?.image?.original,
									thumbUrl: employee.data?.employee?.image?.resizedImages?.thumbnail,
									uid: employee.data?.employee?.image?.id
								}
						  ]
						: [],
					services: checkAndParseServices(employee.data?.employee?.services),
					salonID: { label: employee.data?.employee?.salon?.name, value: employee.data?.employee?.salon?.id },
					roleID: employee.data?.employee?.role?.id,
					user
				})
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [employee.data])

	useEffect(() => {
		dispatch(initialize(FORM.EDIT_EMPLOYEE_ROLE, { roleID: form?.values?.roleID }))
	}, [dispatch, form?.values?.roleID])

	const updateEmployee = async (data: IEmployeeForm) => {
		try {
			setSubmitting(true)
			let reqBody: any = {
				firstName: data?.firstName,
				lastName: data?.lastName,
				email: data?.email,
				services: parseServicesForCreateAndUpdate(data?.services),
				imageID: get(data, 'avatar[0].id') || get(data, 'avatar[0].uid')
			}

			if (data?.phonePrefixCountryCode && data?.phone) {
				reqBody = {
					...reqBody,
					phonePrefixCountryCode: data?.phonePrefixCountryCode,
					phone: data?.phone
				}
			}

			await patchReq('/api/b2b/admin/employees/{employeeID}', { employeeID }, reqBody)
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
			history.push(parentPath + t('paths:employees'))
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
				link: backUrl
			},
			{
				name: t('loc:Detail zamestnanca'),
				titleName:
					get(employee.data?.employee, 'firstName') ||
					(get(employee.data?.employee, 'lastName') && `${get(employee.data?.employee, 'firstName')} ${get(employee.data?.employee, 'lastName')}`.trim())
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
					salonID,
					roleID: formData?.roleID
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

	const editEmployeeRole = async (data: IEditEmployeeRoleForm) => {
		try {
			setSubmitting(true)
			await patchReq(
				'/api/b2b/admin/employees/{employeeID}/role',
				{ employeeID },
				{
					roleID: data?.roleID
				}
			)
			dispatch(getEmployee(employeeID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
			setVisible(false)
		}
	}

	const isProfileInActive: boolean = form?.values?.hasActiveAccount === false

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:employees')} />
			</Row>
			<Spin spinning={isLoading}>
				{formValues?.hasActiveAccount && (
					<div className='content-body small mt-2 mb-8'>
						<EditRoleForm onSubmit={editEmployeeRole} />
					</div>
				)}
				<div className='content-body small mt-2 mb-8'>
					<EmployeeForm addService={() => addService(services, form, dispatch)} salonID={salonID} onSubmit={updateEmployee} />
					<div className={'content-footer pt-0'}>
						<Row
							className={cx({
								'justify-between': emploeyeeExists,
								'justify-center': !emploeyeeExists
							})}
						>
							{emploeyeeExists ? (
								<DeleteButton
									permissions={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_DELETE]}
									className={'mt-2-5 w-52 xl:w-60'}
									onConfirm={deleteEmployee}
									entityName={t('loc:zamestnanca')}
									type={'default'}
									getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								/>
							) : undefined}
							<div className={`flex flex-wrap`}>
								{isProfileInActive && (
									<Permissions
										allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_CREATE]}
										render={(hasPermission, { openForbiddenModal }) => (
											<Button
												type={'primary'}
												block
												size={'middle'}
												className={'noti-btn m-regular mt-2-5 w-40 mr-2'}
												htmlType={'submit'}
												onClick={(e) => {
													if (hasPermission) {
														setVisible(true)
														dispatch(initialize(FORM.INVITE_EMPLOYEE, { email: form?.values?.inviteEmail, roleID: form?.values?.roleID }))
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
										)}
									/>
								)}
								<Permissions
									allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_UPDATE]}
									render={(hasPermission, { openForbiddenModal }) => (
										<Button
											type={'primary'}
											block
											size={'middle'}
											className={`noti-btn m-regular w-40 mt-2-5`}
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
									)}
								/>
							</div>
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
								<Button
									className='noti-btn'
									onClick={() => {
										dispatch(submit(FORM.INVITE_EMPLOYEE))
									}}
									block
									size='large'
									type='primary'
									htmlType='submit'
									disabled={isInviteFromSubmitting}
									loading={isInviteFromSubmitting}
								>
									{t('loc:Odoslať email')}
								</Button>
							</Modal>
						</Row>
					</div>
				</div>
			</Spin>
		</>
	)
}

export default compose(withPermissions(permissions))(EmployeePage)
