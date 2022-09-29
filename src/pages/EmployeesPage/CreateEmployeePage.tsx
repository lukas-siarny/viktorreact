import React, { useEffect, useMemo, useState } from 'react'
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
import { filterSalonRolesByPermission, getPrefixCountryCode } from '../../utils/helper'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import EmployeeForm from './components/EmployeeForm'
import { addService, parseServicesForCreateAndUpdate } from './EmployeePage'
import InviteForm from './components/InviteForm'

// types
import { IBreadcrumbs, IEmployeeForm, IInviteEmployeeForm, SalonSubPageProps } from '../../types/interfaces'

// reducers
import { getSalonRoles } from '../../reducers/roles/rolesActions'
import { RootState } from '../../reducers'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

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
	const currentAuthUser = useSelector((state: RootState) => state.user.authUser)
	const salonRoles = useSelector((state: RootState) => state.roles.salonRoles)

	const filteredSalonRolesByPermission = useMemo(
		() => filterSalonRolesByPermission(salonID, currentAuthUser?.data, salonRoles?.data || undefined),
		[salonID, currentAuthUser?.data, salonRoles?.data]
	)

	const isLoading = services?.isLoading || currentAuthUser?.isLoading || salonRoles?.isLoading

	const [backUrl] = useBackUrl(parentPath + t('paths:employees'))

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zamestnancov'),
				link: backUrl
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

	useEffect(() => {
		dispatch(getSalonRoles())
	}, [dispatch])

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

			await postReq('/api/b2b/admin/employees/', {}, reqBody)
			history.push(backUrl)
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
					salonID,
					roleID: formData?.roleID
				}
			)
			history.push(backUrl)
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
				<h2 className={'content-body-width-small'}>{t('loc:Poslať kolegovi pozvánku')}</h2>
				<div className='content-body small mt-2 mb-8 without-content-footer'>
					<InviteForm onSubmit={inviteEmployee} salonRolesOptions={filteredSalonRolesByPermission} />
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
							{t('loc:Pozvať do tímu')}
						</Button>
					</Row>
				</div>
				<div className='content-body-width-small'>
					<Divider className={'my-6'}>{t('loc:alebo')}</Divider>
				</div>
				<h2 className={'content-body-width-small'}>{t('loc:Vytvoriť profil kolegu')}</h2>
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
							{t('loc:Vytvoriť profil')}
						</Button>
					</Row>
				</div>
			</Spin>
		</>
	)
}

export default compose(withPermissions(permissions))(CreateEmployeePage)
