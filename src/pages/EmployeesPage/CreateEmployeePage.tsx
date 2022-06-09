import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row } from 'antd'
import { isPristine, submit } from 'redux-form'
import React, { useState } from 'react'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import EmployeeForm from './components/EmployeeForm'
import { addService } from './EmployeePage'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { history } from '../../utils/history'

// types
import { IBreadcrumbs, IEmployeeForm } from '../../types/interfaces'

// reducers
import { RootState } from '../../reducers'

const editPermissions: PERMISSION[] = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.EMPLOYEE_EDIT, PERMISSION.PARTNER]

const CreateEmployeePage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)

	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE])
	const services = useSelector((state: RootState) => state.service.services)

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zamestnancov'),
				link: t('paths:employees')
			},
			{
				name: t('loc:Vytvoriť zamestnanca')
			}
		]
	}

	const createEmployee = async (formData: IEmployeeForm) => {
		try {
			setSubmitting(true)
			const { data } = await postReq('/api/b2b/admin/employees/', {}, {
				firstName: formData?.firstName,
				lastName: formData?.lastName,
				email: formData?.email,
				phonePrefixCountryCode: formData?.phonePrefixCountryCode,
				phone: formData?.phone,
				services: formData?.services,
				imageID: formData?.imageID
			} as any)
			if (data?.employee?.id) {
				history.push(t('paths:employees/{{employeeID}}', { employeeID: data?.employee?.id }))
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:employees')} />
			</Row>
			<div className='content-body small mt-2'>
				<EmployeeForm addService={() => addService(services, form, dispatch)} salonID={form?.values?.salonID} onSubmit={createEmployee} />
				<div className={'content-footer'}>
					<Row className={'justify-center'}>
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

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.EMPLOYEE_BROWSING, PERMISSION.PARTNER]))(CreateEmployeePage)
