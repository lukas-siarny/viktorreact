import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Action, compose, Dispatch } from 'redux'
import { Button, Modal, notification, Row, Spin } from 'antd'
import { get, forEach } from 'lodash'
import { change, initialize, isPristine, isSubmitting, submit } from 'redux-form'
import cx from 'classnames'
import i18next from 'i18next'
import { useNavigate, useParams } from 'react-router-dom'

// components
import EmployeeForm from './components/EmployeeForm'
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'
import InviteForm from './components/InviteForm'
import EditRoleForm from './components/EditRoleForm'
import ServiceEditModal from './components/ServiceEditModal'

// types
import {
	EmployeeService,
	IBreadcrumbs,
	IEmployeePayload,
	ISelectOptionItem,
	SalonSubPageProps,
	ServiceCategoryParameter,
	ServicePriceAndDurationData,
	ServiceRootCategory
} from '../../types/interfaces'
import { Paths } from '../../types/api'

// schema
import { IEmployeeForm, IInviteEmployeeForm } from '../../schemas/employee'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { DELETE_BUTTON_ID, FORM, PARAMETER_TYPE, PERMISSION, SUBMIT_BUTTON_ID } from '../../utils/enums'
import {
	filterSalonRolesByPermission,
	formFieldID,
	getAssignedUserLabel,
	getEmployeeServiceDataForPatch,
	getServicePriceAndDurationData,
	hasAuthUserPermissionToEditRole
} from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'
import { getEmployee } from '../../reducers/employees/employeesActions'
import { getServices, IServicesPayload } from '../../reducers/services/serviceActions'
import { getSalonRoles } from '../../reducers/roles/rolesActions'
import { getCurrentUser } from '../../reducers/users/userActions'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'
import { ReactComponent as EmployeesIcon } from '../../assets/icons/employees.svg'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import { IEditRoleForm } from '../../schemas/role'

// schema
import { IEmployeeServiceEditForm } from '../../schemas/service'

type Props = SalonSubPageProps

type EmployeePatchBody = Paths.PatchApiB2BAdminEmployeesEmployeeId.RequestBody

const addService = (servicesOptions: IServicesPayload['options'], employee: IEmployeePayload['data'], form: any, dispatch: Dispatch<Action>) => {
	const selectedServiceIDs = form?.values?.service
	const updatedServices: any[] = []
	const employeeData = employee?.employee
	// go through selected services
	forEach(selectedServiceIDs, (serviceId) => {
		const serviceData = servicesOptions?.find((option) => option.key === serviceId)
		const priceAndDuration = serviceData?.extra?.rangePriceAndDurationData as ServicePriceAndDurationData
		const categoryParameter = serviceData?.extra?.serviceCategoryParameter as ServiceCategoryParameter

		if (form?.values?.services?.find((service: any) => service?.id === serviceId)) {
			notification.warning({
				message: i18next.t('loc:Upozornenie'),
				description: i18next.t('loc:Služba {{ label }} je už priradená!', { label: serviceData?.label })
			})
		} else if (serviceData && employeeData) {
			const useCategoryParameter = !!categoryParameter?.values?.length

			let newServiceData: IEmployeeServiceEditForm = {
				id: serviceData?.key as string,
				name: serviceData?.label,
				industry: serviceData?.extra?.firstCategory,
				category: serviceData?.extra?.secondCategory,
				hasOverriddenPricesAndDurationData: false,
				useCategoryParameter,
				employee: {
					id: employeeData.id,
					image: employeeData?.image.resizedImages.thumbnail,
					name: getAssignedUserLabel({ firstName: employeeData?.firstName, lastName: employeeData?.lastName, email: employeeData?.email, id: employeeData?.id }),
					email: employeeData?.email,
					inviteEmail: employeeData?.inviteEmail,
					hasActiveAccount: employeeData?.hasActiveAccount
				},
				salonPriceAndDurationData: getServicePriceAndDurationData(
					priceAndDuration?.durationFrom,
					priceAndDuration?.durationTo,
					priceAndDuration?.priceFrom,
					priceAndDuration?.priceTo
				),
				employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined)
			}
			if (useCategoryParameter) {
				newServiceData = {
					...newServiceData,
					serviceCategoryParameterType: categoryParameter?.valueType as PARAMETER_TYPE,
					serviceCategoryParameterName: categoryParameter?.name,
					serviceCategoryParameterId: categoryParameter.id,
					serviceCategoryParameter: categoryParameter?.values?.map((value) => {
						const paramaterPriceDuration = value?.priceAndDurationData
						const parameterSalonPriceAndDurationData = getServicePriceAndDurationData(
							paramaterPriceDuration?.durationFrom,
							paramaterPriceDuration.durationTo,
							paramaterPriceDuration?.priceFrom,
							paramaterPriceDuration?.priceTo
						)

						return {
							id: value?.id,
							name: value?.value,
							hasOverriddenPricesAndDurationData: false,
							employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined),
							salonPriceAndDurationData: parameterSalonPriceAndDurationData
						}
					})
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

const getCategoryById = (category: any, serviceCategoryID: string): EmployeeService | null => {
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

const parseServices = (employee?: IEmployeePayload['data'], salonServices?: ISelectOptionItem[]): IEmployeeServiceEditForm[] => {
	const result: IEmployeeServiceEditForm[] = []
	const employeeData = employee?.employee
	const employeeCategories = employeeData?.categories
	if (employeeCategories) {
		employeeCategories?.forEach((firstCategory) =>
			firstCategory?.children.forEach((secondCategory) => {
				secondCategory?.children.forEach((employeeService) => {
					const salonServiceData = salonServices?.find((option) => option?.key === employeeService.id)
					const salonPriceAndDuration = salonServiceData?.extra?.priceAndDurationData as ServicePriceAndDurationData
					const categoryParameter = salonServiceData?.extra?.serviceCategoryParameter as ServiceCategoryParameter
					const useCategoryParameter = salonServiceData?.extra?.useCategoryParameter

					let formServiceData: IEmployeeServiceEditForm = {
						id: employeeService?.id,
						name: employeeService?.category?.name,
						industry: firstCategory?.name,
						category: secondCategory?.name,
						employee: {
							id: employeeData.id,
							image: employeeData?.image.resizedImages.thumbnail,
							name: getAssignedUserLabel({ firstName: employeeData?.firstName, lastName: employeeData?.lastName, email: employeeData?.email, id: employeeData?.id }),
							email: employeeData?.email,
							inviteEmail: employeeData?.inviteEmail,
							hasActiveAccount: employeeData?.hasActiveAccount
						},
						salonPriceAndDurationData: getServicePriceAndDurationData(
							salonPriceAndDuration?.durationFrom,
							salonPriceAndDuration?.durationTo,
							salonPriceAndDuration?.priceFrom,
							salonPriceAndDuration?.priceTo
						),
						employeePriceAndDurationData: employeeService?.hasOverriddenPricesAndDurationData
							? getServicePriceAndDurationData(
									employeeService?.priceAndDurationData?.durationFrom,
									employeeService?.priceAndDurationData?.durationTo,
									employeeService?.priceAndDurationData?.priceFrom,
									employeeService?.priceAndDurationData?.priceTo
							  )
							: getServicePriceAndDurationData(undefined, undefined, undefined, undefined),
						useCategoryParameter,
						hasOverriddenPricesAndDurationData: employeeService?.hasOverriddenPricesAndDurationData
					}

					if (useCategoryParameter) {
						const employeeCategory = getCategoryById(
							{
								children: employee?.employee?.categories
							},
							salonServiceData?.extra?.categoryId
						)

						formServiceData = {
							...formServiceData,
							serviceCategoryParameterType: categoryParameter?.valueType as PARAMETER_TYPE,
							serviceCategoryParameterName: categoryParameter?.name,
							serviceCategoryParameterId: categoryParameter?.id,
							hasOverriddenPricesAndDurationData: !!employeeCategory?.serviceCategoryParameter?.values.length,
							serviceCategoryParameter: categoryParameter?.values?.map((value) => {
								const paramaterPriceDuration = value?.priceAndDurationData
								const employeeValue = employeeCategory?.serviceCategoryParameter?.values?.find((empVal) => empVal.id === value.id)
								const employeePriceAndDuration = employeeValue?.priceAndDurationData

								return {
									id: value?.id,
									name: value?.value,
									salonPriceAndDurationData: getServicePriceAndDurationData(
										paramaterPriceDuration?.durationFrom,
										paramaterPriceDuration.durationTo,
										paramaterPriceDuration?.priceFrom,
										paramaterPriceDuration?.priceTo
									),
									employeePriceAndDurationData: getServicePriceAndDurationData(
										employeePriceAndDuration?.durationFrom,
										employeePriceAndDuration?.durationTo,
										employeePriceAndDuration?.priceFrom,
										employeePriceAndDuration?.priceTo
									)
								}
							})
						}
					}
					result.push(formServiceData)
				})
			})
		)
	}
	return result
}

const getEmployeeServiceIds = (employeeCategories?: ServiceRootCategory) => {
	const result: string[] = []
	if (employeeCategories) {
		employeeCategories?.forEach((firstCategory) =>
			firstCategory?.children.forEach((secondCategory) => {
				secondCategory?.children.forEach((employeeService) => {
					result.push(employeeService.id)
				})
			})
		)
	}
	return result
}

const EmployeePage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { salonID, parentPath } = props
	const { employeeID } = useParams<{ employeeID?: string }>()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)
	const [visibleServiceEditModal, setVisibleServiceEditModal] = useState(false)
	const [updatingService, setUpdatingSerivce] = useState(false)

	const employee = useSelector((state: RootState) => state.employees.employee)
	const services = useSelector((state: RootState) => state.service.services)
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE])
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))
	const isInviteFromSubmitting = useSelector(isSubmitting(FORM.INVITE_EMPLOYEE))
	const currentAuthUser = useSelector((state: RootState) => state.user.authUser)
	const salonRoles = useSelector((state: RootState) => state.roles.salonRoles)
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	const filteredSalonRolesByPermission = useMemo(
		() => filterSalonRolesByPermission(salonID, currentAuthUser?.data, salonRoles?.data || undefined),
		[salonID, currentAuthUser?.data, salonRoles?.data]
	)

	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE]?.values) as IEmployeeForm

	const isEmployeeExists = !!employee?.data?.employee?.id

	const isLoading = submitting || employee.isLoading || services.isLoading || currentAuthUser.isLoading || isRemoving

	const [backUrl] = useBackUrl(parentPath + t('paths:employees'))

	const fetchEmployeeAndServicesData = useCallback(async () => {
		const { data: employeesData } = await dispatch(getEmployee(employeeID as string))
		if (!employeesData?.employee?.id) {
			navigate('/404')
		}

		const { options } = await dispatch(getServices({ salonID }))

		if (employeesData?.employee) {
			dispatch(
				initialize(FORM.EMPLOYEE, {
					firstName: employeesData.employee.firstName,
					lastName: employeesData.employee.lastName,
					email: employeesData.employee.email,
					phonePrefixCountryCode: employeesData.employee.phonePrefixCountryCode || salon?.data?.address?.countryCode,
					phone: employeesData.employee.phone,
					avatar: employeesData.employee?.image
						? [
								{
									url: employeesData.employee?.image?.original,
									thumbUrl: employeesData.employee?.image?.resizedImages?.thumbnail,
									uid: employeesData.employee?.image?.id
								}
						  ]
						: [],
					deletedAt: employeesData.employee.deletedAt,
					hasActiveAccount: employeesData.employee.hasActiveAccount,
					services: parseServices(employeesData, options),
					salonID: { label: employeesData.employee?.salon?.name, value: employeesData.employee?.salon?.id },
					roleID: employeesData.employee?.role?.id
				})
			)
		}
	}, [dispatch, employeeID, salonID, navigate, salon?.data?.address?.countryCode])

	useEffect(() => {
		fetchEmployeeAndServicesData()
	}, [fetchEmployeeAndServicesData])

	useEffect(() => {
		dispatch(getSalonRoles())
	}, [dispatch])

	useEffect(() => {
		dispatch(initialize(FORM.EDIT_EMPLOYEE_ROLE, { roleID: form?.values?.roleID }))
	}, [dispatch, form?.values?.roleID])

	const updateEmployee = async (data: IEmployeeForm) => {
		try {
			setSubmitting(true)

			let reqBody: EmployeePatchBody = {
				firstName: data?.firstName,
				lastName: data?.lastName,
				email: data?.email,
				imageID: get(data, 'avatar[0].id') || get(data, 'avatar[0].uid'),
				serviceIDs: data?.services?.map((service) => service.id) as any // TODO: zistit preco nejde type
			}

			if (data?.phonePrefixCountryCode && data?.phone) {
				reqBody = {
					...reqBody,
					phonePrefixCountryCode: data?.phonePrefixCountryCode,
					phone: data?.phone
				}
			}

			await patchReq('/api/b2b/admin/employees/{employeeID}', { employeeID: employeeID as string }, reqBody)
			fetchEmployeeAndServicesData()
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
			await deleteReq('/api/b2b/admin/employees/{employeeID}', { employeeID: employeeID as string })
			navigate(backUrl as string)
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
					inviteEmail: formData.email,
					employeeID,
					salonID,
					roleID: formData.roleID
				}
			)
			navigate(backUrl as string)
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setVisible(false)
		}
	}

	const editEmployeeRole = async (data: IEditRoleForm) => {
		try {
			setSubmitting(true)
			await patchReq(
				'/api/b2b/admin/employees/{employeeID}/role',
				{ employeeID: employeeID as string },
				{
					roleID: data.roleID
				}
			)
			dispatch(getEmployee(employeeID as string))
			dispatch(getCurrentUser())
			dispatch(initialize(FORM.EDIT_EMPLOYEE_ROLE, data))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
			setVisible(false)
		}
	}

	const editEmployeeService = async (values: IEmployeeServiceEditForm, _dispatch?: Dispatch<any>, customProps?: any) => {
		const serviceID = values.id
		const { resetUserServiceData = false } = customProps || {}

		if (serviceID) {
			try {
				setUpdatingSerivce(true)
				const employeePatchServiceData = getEmployeeServiceDataForPatch(values, resetUserServiceData)

				if (!getEmployeeServiceIds(employee?.data?.employee?.categories)?.includes(serviceID)) {
					await updateEmployee(formValues)
				}

				await patchReq('/api/b2b/admin/employees/{employeeID}/services/{serviceID}', { employeeID: employeeID as string, serviceID }, employeePatchServiceData)
				fetchEmployeeAndServicesData()
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error(e)
			} finally {
				setUpdatingSerivce(false)
				setVisibleServiceEditModal(false)
			}
		}
	}

	const isProfileInActive: boolean = form?.values?.hasActiveAccount === false
	const { hasPermission: hasPermissionToEdit, tooltip } = hasAuthUserPermissionToEditRole(salonID, currentAuthUser?.data, employee?.data, salonRoles?.data || undefined)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:employees')} />
			</Row>

			{formValues?.hasActiveAccount && (
				<div className='content-body small mb-8'>
					<Spin spinning={isLoading}>
						<EditRoleForm
							onSubmit={editEmployeeRole}
							salonRolesOptions={filteredSalonRolesByPermission}
							hasPermissionToEdit={hasPermissionToEdit}
							permissionTooltip={tooltip}
						/>
					</Spin>
				</div>
			)}
			<div className='content-body small'>
				<Spin spinning={isLoading}>
					<EmployeeForm
						addService={() => addService(services?.options, employee?.data, form, dispatch)}
						salonID={salonID}
						isEdit
						onSubmit={updateEmployee}
						setVisibleServiceEditModal={setVisibleServiceEditModal}
					/>
					{!formValues?.deletedAt && (
						<div className={'content-footer'}>
							<div
								className={cx('flex flex-col gap-2 lg:flex-row flex-wrap', {
									'lg:justify-between': isEmployeeExists,
									'lg:justify-center': !isEmployeeExists
								})}
							>
								{isEmployeeExists ? (
									<DeleteButton
										permissions={[PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_DELETE]}
										className={'w-full lg:w-auto lg:min-w-50 xl:min-w-60'}
										onConfirm={deleteEmployee}
										entityName={t('loc:zamestnanca')}
										type={'default'}
										getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
										id={formFieldID(FORM.EMPLOYEE, DELETE_BUTTON_ID)}
									/>
								) : undefined}
								<div className={'flex flex-col lg:flex-row gap-2'}>
									{isProfileInActive && (
										<Permissions
											allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_CREATE]}
											render={(hasPermission, { openForbiddenModal }) => (
												<Button
													id={'invite-employee-btn'}
													type={'dashed'}
													size={'middle'}
													className={'noti-btn m-regular w-full lg:w-auto xl:min-w-40'}
													htmlType={'button'}
													icon={<EmployeesIcon />}
													onClick={(e) => {
														if (hasPermission) {
															setVisible(true)
															dispatch(
																initialize(FORM.INVITE_EMPLOYEE, {
																	email: form?.values?.inviteEmail,
																	roleID: form?.values?.roleID
																})
															)
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
										allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_UPDATE]}
										render={(hasPermission, { openForbiddenModal }) => (
											<Button
												id={formFieldID(FORM.EMPLOYEE, SUBMIT_BUTTON_ID)}
												type={'primary'}
												icon={<EditIcon />}
												size={'middle'}
												className={`noti-btn m-regular w-full lg:w-auto ${isProfileInActive ? 'xl:min-w-40' : 'lg:min-w-50 xl:min-w-60'}`}
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
							</div>
						</div>
					)}
				</Spin>
			</div>
			<Modal
				className='rounded-fields'
				title={t('loc:Pozvať do tímu')}
				centered
				open={visible}
				footer={null}
				onCancel={() => setVisible(false)}
				closeIcon={<CloseIcon />}
				width={394}
			>
				<InviteForm onSubmit={inviteEmployee} salonRolesOptions={filteredSalonRolesByPermission} />
				<Button
					id={formFieldID(FORM.INVITE_EMPLOYEE, SUBMIT_BUTTON_ID)}
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
			<ServiceEditModal visible={visibleServiceEditModal} setVisible={setVisibleServiceEditModal} loading={updatingService} editEmployeeService={editEmployeeService} />
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(EmployeePage)
