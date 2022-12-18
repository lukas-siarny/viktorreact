import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Action, compose, Dispatch } from 'redux'
import { Button, Modal, notification, Row, Spin } from 'antd'
import { get, forEach, isNil } from 'lodash'
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
import {
	EmployeeServiceData,
	IBreadcrumbs,
	IComputedMatch,
	IEditEmployeeRoleForm,
	IEmployeeForm,
	IEmployeeServiceEditForm,
	IInviteEmployeeForm,
	ILoadingAndFailure,
	ISelectOptionItem,
	SalonSubPageProps,
	ServiceCategoryParameter,
	ServicePriceAndDurationData,
	ServiceRootCategory
} from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { DELETE_BUTTON_ID, FORM, PARAMETER_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'
import {
	arePriceAndDurationDataEmpty,
	decodePrice,
	encodePrice,
	filterSalonRolesByPermission,
	formFieldID,
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
import EmployeeServiceEditForm from './components/EmployeeServiceEditForm'

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{ employeeID: string }>
}

export type EmployeePatchBody = Paths.PatchApiB2BAdminEmployeesEmployeeId.RequestBody

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

export const addService = (servaddServiceices: IServicesPayload & ILoadingAndFailure, form: any, dispatch: Dispatch<Action>) => {
	const selectedServiceIDs = form?.values?.service
	const updatedServices: any[] = []
	// go through selected services
	forEach(selectedServiceIDs, (serviceId) => {
		const serviceData = servaddServiceices?.options?.find((option) => option.key === serviceId)
		const priceAndDuration = serviceData?.extra?.rangePriceAndDurationData as ServicePriceAndDurationData
		const categoryParameter = serviceData?.extra?.serviceCategoryParameter as ServiceCategoryParameter

		if (form?.values?.services?.find((service: any) => service?.id === serviceId)) {
			notification.warning({
				message: i18next.t('loc:Upozornenie'),
				description: i18next.t('loc:Služba {{ label }} je už priradená!', { label: serviceData?.label })
			})
		} else if (serviceData) {
			const useCategoryParameter = !!categoryParameter?.values?.length
			const salonPriceAndDurationData = getServicePriceAndDurationData(
				priceAndDuration?.durationFrom,
				priceAndDuration.durationTo,
				priceAndDuration?.priceFrom,
				priceAndDuration?.priceTo
			)

			let newServiceData: EmployeeServiceData = {
				id: serviceData?.key as string,
				name: serviceData?.label,
				category: serviceData?.extra?.firstCategory,
				hasOverriddenPricesAndDurationData: false,
				useCategoryParameter,
				// ulozime si aj original data, aby sme potom vedei porovnat, ci ich ma uzivatel pretazene alebo nie
				salonPriceAndDurationData,
				// vygeneruje objekt so vsetkymi potrebnymi parametrami, ktore budu mat ale hodnotu null
				// redux-form tak potom vyhodnoti isPristine spravne
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
							// vygeneruje objekt so vsetkymi potrebnymi parametrami, ktore budu mat ale hodnotu null
							// redux-form tak potom vyhodnoti isPristine spravne
							employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined),
							// ulozime si aj original data, aby sme potom vedei porovnat, ci ich ma uzivatel pretazene alebo nie
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

const parseServices = (employeeCategories?: ServiceRootCategory, salonServices?: ISelectOptionItem[]): EmployeeServiceData[] => {
	const result: EmployeeServiceData[] = []
	if (employeeCategories) {
		employeeCategories?.forEach((firstCategory) =>
			firstCategory?.children.forEach((secondCategory) => {
				secondCategory?.children.forEach((employeeService) => {
					const salonServiceData = salonServices?.find((option) => option?.key === employeeService.id)
					const salonPriceAndDuration = salonServiceData?.extra?.rangePriceAndDurationData as ServicePriceAndDurationData
					const categoryParameter = salonServiceData?.extra?.serviceCategoryParameter as ServiceCategoryParameter
					const useCategoryParameter = !!categoryParameter?.values?.length

					const salonPriceAndDurationData = getServicePriceAndDurationData(
						salonPriceAndDuration?.durationFrom,
						salonPriceAndDuration?.durationTo,
						salonPriceAndDuration?.priceFrom,
						salonPriceAndDuration?.priceTo
					)

					let formServiceData: EmployeeServiceData = {
						id: employeeService?.id,
						name: employeeService?.category?.name,
						category: firstCategory?.name,
						salonPriceAndDurationData,
						// vygeneruje objekt so vsetkymi potrebnymi parametrami, ktore budu mat ale hodnotu null
						// redux-form tak potom vyhodnoti isPristine spravne
						employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined),
						useCategoryParameter,
						hasOverriddenPricesAndDurationData: false
					}
					// ak ma employee nieco nastavene, tak vyinicialuzujeme jeho hodnoty
					if (employeeService?.hasOverriddenPricesAndDurationData) {
						const employeePriceAndDuration = employeeService?.priceAndDurationData
						const employeeFormPriceAndDurationData = getServicePriceAndDurationData(
							employeePriceAndDuration?.durationFrom,
							employeePriceAndDuration?.durationTo,
							employeePriceAndDuration?.priceFrom,
							employeePriceAndDuration?.priceTo
						)
						formServiceData = {
							...formServiceData,
							hasOverriddenPricesAndDurationData: true,
							employeePriceAndDurationData: employeeFormPriceAndDurationData
						}
					}

					if (useCategoryParameter) {
						formServiceData = {
							...formServiceData,
							serviceCategoryParameterType: categoryParameter?.valueType as PARAMETER_TYPE,
							serviceCategoryParameterName: categoryParameter?.name,
							serviceCategoryParameterId: categoryParameter.id,
							hasOverriddenPricesAndDurationData: false,
							// todo: treba dorobit, ak ma zamestnanec prepisany parameter, tak vyinicalizovat jeho hodnoty miesto sluzby
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
									// ulozime si aj original data pre zobrazovanie povodnych dat a porovnavanie s pretazenymi datami
									salonPriceAndDurationData: parameterSalonPriceAndDurationData,
									// vygeneruje objekt so vsetkymi potrebnymi parametrami, ktore budu mat ale hodnotu null
									// redux-form tak potom vyhodnoti isPristine spravne
									employeePriceAndDurationData: getServicePriceAndDurationData(undefined, undefined, undefined, undefined)
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

type ServicePatchBody = Paths.PatchApiB2BAdminEmployeesEmployeeIdServicesServiceId.RequestBody

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
	const { salonID, parentPath } = props
	const { employeeID } = props.computedMatch.params
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

	const filteredSalonRolesByPermission = useMemo(
		() => filterSalonRolesByPermission(salonID, currentAuthUser?.data, salonRoles?.data || undefined),
		[salonID, currentAuthUser?.data, salonRoles?.data]
	)

	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE]?.values) as IEmployeeForm
	const editServiceformValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE_SERVICE_EDIT]?.values) as IEmployeeServiceEditForm

	const isEmployeeExists = !!employee?.data?.employee?.id

	const isLoading = employee.isLoading || services.isLoading || currentAuthUser.isLoading || isRemoving

	const [backUrl] = useBackUrl(parentPath + t('paths:employees'))

	const fetchEmployeeAndServicesData = useCallback(async () => {
		const { data: employeesData } = await dispatch(getEmployee(employeeID))
		const { options } = await dispatch(getServices({ salonID }))

		if (!employeesData?.employee?.id) {
			history.push('/404')
		}

		if (employeesData?.employee) {
			dispatch(
				initialize(FORM.EMPLOYEE, {
					...employeesData.employee,
					avatar: employeesData.employee?.image
						? [
								{
									url: employeesData.employee?.image?.original,
									thumbUrl: employeesData.employee?.image?.resizedImages?.thumbnail,
									uid: employeesData.employee?.image?.id
								}
						  ]
						: [],
					services: parseServices(employeesData?.employee?.categories, options),
					salonID: { label: employeesData.employee?.salon?.name, value: employeesData.employee?.salon?.id },
					roleID: employeesData.employee?.role?.id
				})
			)
		}
	}, [dispatch, employeeID, salonID])

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
				serviceIDs: data?.services?.map((service: EmployeeServiceData) => service.id)
			}

			if (data?.phonePrefixCountryCode && data?.phone) {
				reqBody = {
					...reqBody,
					phonePrefixCountryCode: data?.phonePrefixCountryCode,
					phone: data?.phone
				}
			}

			await patchReq('/api/b2b/admin/employees/{employeeID}', { employeeID }, reqBody)
			fetchEmployeeAndServicesData()
			// history.push(backUrl)
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
			history.push(backUrl)
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
			history.push(backUrl)
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

	const employeeServiceIds = getEmployeeServiceIds(employee?.data?.employee?.categories)

	const editEmployeeService = async (values: IEmployeeServiceEditForm, _dispatch?: Dispatch<any>, customProps?: any) => {
		const serviceID = values.id
		const { resetUserServiceData = false } = customProps || {}

		if (serviceID) {
			try {
				setUpdatingSerivce(true)
				let employeePatchServiceData: ServicePatchBody = {}

				if (resetUserServiceData) {
					employeePatchServiceData = {
						priceAndDurationData: null,
						serviceCategoryParameterValues: null
					}
				} else if (values?.useCategoryParameter) {
					const areAllParameterValuesEmpty = !values?.serviceCategoryParameter?.some(
						(parameterValue) => !arePriceAndDurationDataEmpty(parameterValue.employeePriceAndDurationData)
					)

					if (areAllParameterValuesEmpty) {
						employeePatchServiceData = {
							...employeePatchServiceData,
							serviceCategoryParameterValues: null
						}
					} else if ((values?.serviceCategoryParameter?.length || 0) <= 100) {
						const serviceCategoryParameterValues: ServicePatchBody['serviceCategoryParameterValues'] = []
						values?.serviceCategoryParameter?.forEach((parameterValue) => {
							serviceCategoryParameterValues.push({
								id: parameterValue.id,
								priceAndDurationData: {
									durationFrom: parameterValue.employeePriceAndDurationData?.durationFrom,
									durationTo: parameterValue.employeePriceAndDurationData?.variableDuration ? parameterValue.employeePriceAndDurationData?.durationTo : undefined,
									priceFrom: encodePrice(parameterValue.employeePriceAndDurationData?.priceFrom as number),
									priceTo:
										parameterValue.employeePriceAndDurationData?.variablePrice && !isNil(parameterValue.employeePriceAndDurationData?.priceTo)
											? encodePrice(parameterValue.employeePriceAndDurationData?.priceTo)
											: undefined
								}
							})
						})
						employeePatchServiceData = {
							...employeePatchServiceData,
							serviceCategoryParameterValues
						}
					}
				} else {
					const priceAndDurationData = values?.employeePriceAndDurationData
					if (arePriceAndDurationDataEmpty(priceAndDurationData)) {
						employeePatchServiceData = {
							...employeePatchServiceData,
							priceAndDurationData: null
						}
					} else if (!isNil(priceAndDurationData?.priceFrom)) {
						employeePatchServiceData = {
							...employeePatchServiceData,
							priceAndDurationData: {
								durationFrom: priceAndDurationData?.durationFrom,
								durationTo: priceAndDurationData?.variableDuration ? priceAndDurationData?.durationTo : undefined,
								priceFrom: encodePrice(priceAndDurationData?.priceFrom as number),
								priceTo: priceAndDurationData?.variablePrice && !isNil(priceAndDurationData?.priceTo) ? encodePrice(priceAndDurationData?.priceTo) : undefined
							}
						}
					}
				}

				if (!employeeServiceIds?.includes(serviceID)) {
					await updateEmployee(formValues)
				}

				await patchReq('/api/b2b/admin/employees/{employeeID}/services/{serviceID}', { employeeID, serviceID }, employeePatchServiceData)
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
						addService={() => addService(services, form, dispatch)}
						salonID={salonID}
						isEdit
						onSubmit={updateEmployee}
						setVisibleServiceEditModal={setVisibleServiceEditModal}
					/>
					<div className={'content-footer'}>
						<div
							className={cx('flex flex-col gap-2 lg:flex-row flex-wrap', {
								'lg:justify-between': isEmployeeExists,
								'lg:justify-center': !isEmployeeExists
							})}
						>
							{isEmployeeExists ? (
								<DeleteButton
									permissions={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_DELETE]}
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
										allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_CREATE]}
										render={(hasPermission, { openForbiddenModal }) => (
											<Button
												type={'dashed'}
												size={'middle'}
												className={'noti-btn m-regular w-full lg:w-auto xl:min-w-40'}
												htmlType={'button'}
												icon={<EmployeesIcon />}
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
				</Spin>
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
				<InviteForm onSubmit={inviteEmployee} salonRolesOptions={filteredSalonRolesByPermission} />
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
			<Modal
				title={t('loc:Upraviť službu zamestnancovi')}
				className={'edit-employee-service-modal'}
				width={600}
				visible={visibleServiceEditModal}
				onCancel={() => setVisibleServiceEditModal(false)}
				footer={null}
			>
				<EmployeeServiceEditForm
					onSubmit={editEmployeeService}
					loading={updatingService}
					onResetData={() => editEmployeeService(editServiceformValues, undefined, { resetUserServiceData: true })}
				/>
			</Modal>
		</>
	)
}

export default compose(withPermissions(permissions))(EmployeePage)
