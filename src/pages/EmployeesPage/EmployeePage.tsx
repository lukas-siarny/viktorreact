import React, { useEffect, useMemo, useState, useCallback } from 'react'
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
import {
	IBreadcrumbs,
	IComputedMatch,
	IEditEmployeeRoleForm,
	IEmployeeForm,
	IInviteEmployeeForm,
	ILoadingAndFailure,
	ISelectOptionItem,
	SalonSubPageProps
} from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { DELETE_BUTTON_ID, FORM, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'
import { decodePrice, encodePrice, filterSalonRolesByPermission, formFieldID, hasAuthUserPermissionToEditRole } from '../../utils/helper'

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

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{ employeeID: string }>
}

type PriceAndDurationData = {
	durationFrom?: number
	durationTo?: number
	priceFrom?: number | null
	priceTo?: number | null
}

export type ServiceData = {
	id?: string
	name?: string
	category?: string
	variableDuration?: boolean
	variablePrice?: boolean
	priceAndDurationData?: PriceAndDurationData
	hasCategoryParameter?: boolean
	categoryParameter?: {
		name?: string
		valueType?: 'ENUM' | 'TIME'
		unitType?: 'MINUTES'
		values?: {
			id: string
			categoryParameterValueID: string
			value?: string
			priceAndDurationData?: PriceAndDurationData
			variableDuration?: boolean
			variablePrice?: boolean
		}[]
	}
}

type ServiceType = NonNullable<
	NonNullable<Paths.GetApiB2BV1Services.Responses.$200['groupedServicesByCategory'][0]['category']>['children'][0]['category']
>['children'][0]['service']

export type ServicePriceAndDurationData = ServiceType['rangePriceAndDurationData']
export type ServiceCategoryParameter = ServiceType['serviceCategoryParameter']

export type EmployeePatchBody = Paths.PatchApiB2BAdminEmployeesEmployeeId.RequestBody

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

// TODO - for change duration and price in employee detail
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
			const hasCategoryParameter = !!categoryParameter?.values?.length
			let newServiceData: ServiceData = {
				id: serviceData?.key as string,
				name: serviceData?.label,
				category: serviceData?.extra?.firstCategory,
				priceAndDurationData: {
					durationFrom: priceAndDuration?.durationFrom,
					durationTo: priceAndDuration.durationTo,
					priceFrom: decodePrice(priceAndDuration?.priceFrom),
					priceTo: priceAndDuration?.priceTo && priceAndDuration.priceFrom ? decodePrice(priceAndDuration?.priceTo) : undefined
				},
				variableDuration: false,
				variablePrice: false,
				hasCategoryParameter
			}
			if (priceAndDuration.durationFrom && priceAndDuration?.durationTo) {
				newServiceData = {
					...newServiceData,
					variableDuration: true
				}
			}
			if (priceAndDuration?.priceFrom && priceAndDuration?.priceTo) {
				newServiceData = {
					...newServiceData,
					variablePrice: true
				}
			}
			if (hasCategoryParameter) {
				newServiceData = {
					...newServiceData,
					categoryParameter: {
						name: categoryParameter?.name,
						valueType: categoryParameter?.valueType,
						unitType: categoryParameter?.unitType,
						values: categoryParameter?.values.map((value) => {
							const paramaterPriceDuration = value?.priceAndDurationData
							return {
								id: value.id,
								categoryParameterValueID: value?.categoryParameterValueID,
								value: value.value,
								priceAndDurationData: {
									durationFrom: paramaterPriceDuration?.durationFrom,
									durationTo: paramaterPriceDuration.durationTo,
									priceFrom: decodePrice(paramaterPriceDuration?.priceFrom),
									priceTo: paramaterPriceDuration?.priceTo && paramaterPriceDuration.priceFrom ? decodePrice(paramaterPriceDuration?.priceTo) : undefined,
									variableDuration: paramaterPriceDuration?.durationFrom && paramaterPriceDuration?.durationTo,
									variablePrice: paramaterPriceDuration?.priceFrom && paramaterPriceDuration?.priceTo
								}
							}
						})
					}
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

type ServiceRootCategory = Paths.GetApiB2BAdminEmployeesEmployeeId.Responses.$200['employee']['categories']

const parseServices = (employeeCategories?: ServiceRootCategory, salonServices?: ISelectOptionItem[]): ServiceData[] => {
	const result: ServiceData[] = []
	if (employeeCategories) {
		employeeCategories?.forEach((firstCategory) =>
			firstCategory?.children.forEach((secondCategory) => {
				secondCategory?.children.forEach((service) => {
					const salonServiceData = salonServices?.find((option) => option?.key === service.id)
					let formServiceData: ServiceData = {
						id: service?.id,
						name: service?.category?.name,
						category: firstCategory?.name
					}
					// const salonCategoryParameter = salonServiceData?.extra?.serviceCategoryParameter as ServiceCategoryParameter
					// ak ma employee nieco nastavene, tak prepiseme salonove hodnoty jeho hodnotami
					if (service?.hasOverriddenPricesAndDurationData) {
						const employeePriceAndDuration = service?.priceAndDurationData
						formServiceData = {
							...formServiceData,
							priceAndDurationData: {
								durationFrom: employeePriceAndDuration?.durationFrom,
								durationTo: employeePriceAndDuration?.durationTo,
								priceFrom: decodePrice(employeePriceAndDuration?.priceFrom),
								priceTo: employeePriceAndDuration?.priceTo && employeePriceAndDuration.priceFrom ? decodePrice(employeePriceAndDuration?.priceTo) : undefined
							},
							variableDuration: !!(employeePriceAndDuration.durationFrom && employeePriceAndDuration?.durationTo),
							variablePrice: !!(employeePriceAndDuration?.priceFrom && employeePriceAndDuration?.priceTo)
						}
					} else {
						const salonPriceAndDuration = salonServiceData?.extra?.rangePriceAndDurationData as ServicePriceAndDurationData
						formServiceData = {
							...formServiceData,
							priceAndDurationData: {
								durationFrom: salonPriceAndDuration?.durationFrom,
								durationTo: salonPriceAndDuration?.durationTo,
								priceFrom: decodePrice(salonPriceAndDuration?.priceFrom),
								priceTo: salonPriceAndDuration?.priceTo && salonPriceAndDuration.priceFrom ? decodePrice(salonPriceAndDuration?.priceTo) : undefined
							},
							variableDuration: !!(salonPriceAndDuration.durationFrom && salonPriceAndDuration?.durationTo),
							variablePrice: !!(salonPriceAndDuration?.priceFrom && salonPriceAndDuration?.priceTo)
						}
					}
					result.push(formServiceData)
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

	const formValues = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE]?.values)

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
				serviceIDs: data?.services?.map((service: ServiceData) => service.id)
			}

			if (data?.phonePrefixCountryCode && data?.phone) {
				reqBody = {
					...reqBody,
					phonePrefixCountryCode: data?.phonePrefixCountryCode,
					phone: data?.phone
				}
			}
			// const serviceData = parseServicesForCreateAndUpdate(data?.services)

			// await patchReq('/api/b2b/admin/employees/{employeeID}/services/{serviceID}', { employeeID, serviceID }, serviceData)
			await patchReq('/api/b2b/admin/employees/{employeeID}', { employeeID }, reqBody)
			history.push(backUrl)
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
					<EmployeeForm addService={() => addService(services, form, dispatch)} salonID={salonID} onSubmit={updateEmployee} />
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
		</>
	)
}

export default compose(withPermissions(permissions))(EmployeePage)
