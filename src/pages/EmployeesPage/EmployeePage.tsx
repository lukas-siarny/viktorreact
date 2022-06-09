import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Button, notification, Row } from 'antd'
import { get } from 'lodash'
import { change, initialize, isPristine, submit } from 'redux-form'
import cx from 'classnames'
import i18next from 'i18next'

// components
import EmployeeForm from './components/EmployeeForm'
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'

// types
import { IBreadcrumbs, IComputedMatch, IEmployeeForm } from '../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION } from '../../utils/enums'
import { history } from '../../utils/history'

// reducers
import { RootState } from '../../reducers'
import { getEmployee } from '../../reducers/employees/employeesActions'
import { decodePrice, encodePrice } from '../../utils/helper'

type Props = {
	computedMatch: IComputedMatch<{ employeeID: number }>
}

const editPermissions: PERMISSION[] = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.EMPLOYEE_EDIT, PERMISSION.PARTNER]

export const parseServicesForCreateAndUpdate = (oldServices: any[]) => {
	return oldServices.map((service: any) => {
		return {
			id: service?.id,
			employeeData: {
				durationFrom: service?.salonData?.durationFrom,
				durationTo: service?.salonData?.durationTo,
				priceFrom: encodePrice(service?.salonData?.priceFrom),
				priceTo: service?.salonData?.priceFrom && service?.salonData?.priceTo ? encodePrice(service?.salonData?.priceTo) : undefined
			}
		}
	})
}

export const addService = (services: any, form: any, dispatch: any) => {
	const selectedServicesID = form?.values?.service
	if (form?.values?.services?.find((service: any) => service?.id === selectedServicesID)) {
		notification.warning({
			message: i18next.t('loc:Upozornenie'),
			description: i18next.t('Vybraná služba je už priradená!')
		})
	} else {
		const serviceData = services?.data?.services?.find((service: any) => service?.id === selectedServicesID)
		if (serviceData) {
			let newServiceData = {
				id: serviceData?.id,
				name: serviceData?.name,
				salonData: {
					durationFrom: serviceData?.durationFrom,
					durationTo: serviceData?.durationTo,
					priceFrom: decodePrice(serviceData?.priceFrom),
					priceTo: serviceData?.priceTo && serviceData?.priceFrom ? decodePrice(serviceData?.priceTo) : undefined
				},
				variableDuration: false,
				variablePrice: false
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
			let updatedServices = []
			if (form?.values?.services) {
				updatedServices = [...form.values.services, newServiceData]
			} else {
				updatedServices.push(newServiceData)
			}
			// update filed array services with new added service
			dispatch(change(FORM.EMPLOYEE, 'services', [...updatedServices]))
		}
	}
	// clear selected value
	dispatch(change(FORM.EMPLOYEE, 'service', null))
}

const EmployeePage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { employeeID } = props.computedMatch.params
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const employee = useSelector((state: RootState) => state.employees.employee)
	const services = useSelector((state: RootState) => state.service.services)
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE])
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))

	const showDeleteBtn = !!employee?.data?.employee?.id

	useEffect(() => {
		dispatch(getEmployee(employeeID))
	}, [employeeID])

	const checkAndParseServices = (ser: any[]) => {
		return ser.map((service) => {
			let updatedService = {
				id: service?.id,
				name: service?.name,
				variableDuration: false,
				variablePrice: false,
				salonData: {
					...service.employeeData,
					// decode and set price
					priceFrom: decodePrice(service?.employeeData.priceFrom),
					priceTo: decodePrice(service?.employeeData.priceTo)
				}
			}
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

	const rowClass = cx({
		'justify-between': showDeleteBtn,
		'justify-center': !showDeleteBtn
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
								permissions={editPermissions}
								className={'w-1/3'}
								onConfirm={deleteEmployee}
								entityName={t('loc:zamestnanca')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						) : undefined}
						<Permissions
							allowed={editPermissions}
							render={(hasPermission, { openForbiddenModal }) => (
								<Button
									type={'primary'}
									block
									size={'middle'}
									className={'noti-btn m-regular w-1/3'}
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
					</Row>
				</div>
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.EMPLOYEE_BROWSING, PERMISSION.PARTNER]))(EmployeePage)
