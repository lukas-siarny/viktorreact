import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { Button, Row } from 'antd'
import { get } from 'lodash'
import { initialize, isPristine, submit } from 'redux-form'
import cx from 'classnames'

// components
import { notInitialized } from 'react-redux/es/utils/useSyncExternalStore'
import EmployeeForm from './components/EmployeeForm'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'
import { getEmployee } from '../../reducers/employees/employeesActions'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, PERMISSION } from '../../utils/enums'
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'
import { history } from '../../utils/history'

type Props = {
	computedMatch: IComputedMatch<{ employeeID: number }>
}

const editPermissions: PERMISSION[] = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.EMPLOYEE_EDIT, PERMISSION.PARTNER]

const EmployeePage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { employeeID } = props.computedMatch.params
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const employee = useSelector((state: RootState) => state.employees.employee)
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))

	const showDeleteBtn = !!employee?.data?.employee?.id

	useEffect(() => {
		dispatch(getEmployee(employeeID))
	}, [employeeID])

	useEffect(() => {
		if (employee.data?.employee) {
			dispatch(initialize(FORM.EMPLOYEE, { ...employee.data?.employee }))
		}
	}, [employee.data])

	const updateEmployee = async (data: any) => {
		try {
			setSubmitting(true)
			await patchReq(
				'/api/b2b/admin/employees/{employeeID}',
				{ employeeID },
				{
					firstName: data?.firstName,
					lastName: data?.lastName
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
				<EmployeeForm onSubmit={updateEmployee} />
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
											dispatch(submit(FORM.USER_ACCOUNT))
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
