import React, { useEffect, useMemo, useState } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Divider, Row, Spin } from 'antd'
import { initialize, isPristine, isSubmitting, submit } from 'redux-form'
import { get } from 'lodash'
import { useNavigate } from 'react-router-dom'

// utils
import { withPermissions } from '../../utils/Permissions'
import { PERMISSION, FORM, SUBMIT_BUTTON_ID } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { filterSalonRolesByPermission, formFieldID } from '../../utils/helper'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import EmployeeForm from './components/EmployeeForm'
import InviteForm from './components/InviteForm'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'

// schema
import { IEmployeeForm, IInviteEmployeeForm } from '../../schemas/employee'

// reducers
import { getSalonRoles } from '../../reducers/roles/rolesActions'
import { RootState } from '../../reducers'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

// assets
import { ReactComponent as EmployeesIcon } from '../../assets/icons/employees.svg'
import { ReactComponent as CreateIcon } from '../../assets/icons/plus-icon.svg'

const CreateEmployeePage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const { salonID, parentPath } = props
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const isInviteFromSubmitting = useSelector(isSubmitting(FORM.INVITE_EMPLOYEE))
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))
	const isInviteFormPristine = useSelector(isPristine(FORM.INVITE_EMPLOYEE))
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
		if (salon.data) {
			dispatch(initialize(FORM.EMPLOYEE, { phonePrefixCountryCode: salon.data.companyContactPerson?.phonePrefixCountryCode || salon.data.address?.countryCode }))
		}
	}, [dispatch, salon.data])

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
			navigate(backUrl as string)
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
					inviteEmail: formData.email,
					salonID,
					roleID: formData.roleID
				}
			)
			navigate(backUrl as string)
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
				<div className='content-body small mb-8 without-content-footer'>
					<InviteForm onSubmit={inviteEmployee} salonRolesOptions={filteredSalonRolesByPermission} />
					<Row justify={'center'}>
						<Button
							onClick={() => {
								dispatch(submit(FORM.INVITE_EMPLOYEE))
							}}
							type={'primary'}
							size={'middle'}
							icon={<EmployeesIcon className='filter-invert max' />}
							className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60 mt-4'}
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
				<div className='content-body small without-content-footer'>
					<EmployeeForm salonID={salonID} onSubmit={createEmployee} />
					<Row justify={'center'}>
						<Button
							id={formFieldID(FORM.EMPLOYEE, SUBMIT_BUTTON_ID)}
							type={'primary'}
							size={'middle'}
							icon={<CreateIcon />}
							className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60 mt-4'}
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

export default compose(withPermissions([PERMISSION.PARTNER_ADMIN, PERMISSION.EMPLOYEE_CREATE]))(CreateEmployeePage)
