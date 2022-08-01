import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Row, Spin } from 'antd'
import { initialize, isPristine, isSubmitting, submit } from 'redux-form'
import { map, get } from 'lodash'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, SALON_PERMISSION, FORM, ENUMERATIONS_KEYS } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { history } from '../../utils/history'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import EmployeeForm from './components/EmployeeForm'
import { addService, parseServicesForCreateAndUpdate } from './EmployeePage'

// types
import { IBreadcrumbs, IEmployeeForm, IInviteEmployeeForm, SalonSubPageProps } from '../../types/interfaces'

// reducers
import { RootState } from '../../reducers'
import { getPrefixCountryCode } from '../../utils/helper'
import InviteForm from './components/InviteForm'

const permissions = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_CREATE]

const CreateEmployeePage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const { salonID, parentPath } = props
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const isInviteFromSubmitting = useSelector(isSubmitting(FORM.INVITE_EMPLOYEE))

	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))
	const isInviteFormPristine = useSelector(isPristine(FORM.INVITE_EMPLOYEE))
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE])
	const services = useSelector((state: RootState) => state.service.services)

	const { isLoading } = services

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zamestnancov'),
				link: parentPath + t('paths:employees')
			},
			{
				name: t('loc:Vytvoriť zamestnanca')
			}
		]
	}

	useEffect(() => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))
		dispatch(initialize(FORM.EMPLOYEE, { phonePrefixCountryCode }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salonID])

	const createEmployee = async (formData: IEmployeeForm) => {
		try {
			setSubmitting(true)
			let reqBody: any = {
				firstName: formData?.firstName,
				lastName: formData?.lastName,
				email: formData?.email,
				services: parseServicesForCreateAndUpdate(formData?.services),
				salonID,
				imageID: get(formData, 'avatar[0].id') || get(formData, 'avatar[0].uid')
			}

			if (formData?.phonePrefixCountryCode && formData?.phone) {
				reqBody = {
					...reqBody,
					phonePrefixCountryCode: formData?.phonePrefixCountryCode,
					phone: formData?.phone
				}
			}

			const { data } = await postReq('/api/b2b/admin/employees/', {}, reqBody)
			if (data?.employee?.id) {
				history.push(parentPath + t('paths:employees/{{employeeID}}', { employeeID: data?.employee?.id }))
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	const inviteEmployee = async (formData: IInviteEmployeeForm) => {
		try {
			await postReq(
				'/api/b2b/admin/employees/invite',
				{},
				{
					inviteEmail: formData?.email,
					employeeID: undefined,
					salonID,
					roleID: formData?.roleID
				}
			)
			history.push(parentPath + t('paths:employees'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		}
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:employees')} />
			</Row>
			<Spin spinning={isLoading}>
				<h2 className={'content-body-width-small'}>Poslať kolegovi pozvánku</h2>
				<div className='content-body small mt-2 mb-8 without-content-footer'>
					<InviteForm onSubmit={inviteEmployee} />
					<Row justify={'center'}>
						<Button
							onClick={() => {
								dispatch(submit(FORM.INVITE_EMPLOYEE))
							}}
							type={'primary'}
							size={'middle'}
							className={'noti-btn m-regular w-52 xl:w-60'}
							htmlType={'submit'}
							disabled={isInviteFromSubmitting || isInviteFormPristine}
							loading={isInviteFromSubmitting}
						>
							{t('loc:Pozvať do týmu')}
						</Button>
					</Row>
				</div>
				<div className='content-body-width-small'>
					<Divider className={'mt-10 mb-6'}>{'alebo'}</Divider>
				</div>
				<h2 className={'content-body-width-small'}>Vytrvoriť dočasný profil kolegu</h2>
				<div className='content-body small mt-2 without-content-footer'>
					<EmployeeForm addService={() => addService(services, form, dispatch)} salonID={salonID} onSubmit={createEmployee} />
					<Row justify={'center'}>
						<Button
							type={'primary'}
							size={'middle'}
							className={'noti-btn m-regular w-52 xl:w-60'}
							htmlType={'submit'}
							onClick={() => {
								dispatch(submit(FORM.EMPLOYEE))
							}}
							disabled={submitting || isFormPristine}
							loading={submitting}
						>
							{t('loc:Vytvoriť dočasný profil')}
						</Button>
					</Row>
				</div>
			</Spin>
		</>
	)
}

export default compose(withPermissions(permissions))(CreateEmployeePage)
