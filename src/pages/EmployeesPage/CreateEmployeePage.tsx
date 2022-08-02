import React, { useEffect, useState } from 'react'
import { compose } from 'redux'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Spin } from 'antd'
import { initialize, isPristine, submit } from 'redux-form'
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
import { IBreadcrumbs, IEmployeeForm, SalonSubPageProps } from '../../types/interfaces'

// reducers
import { RootState } from '../../reducers'
import { getPrefixCountryCode } from '../../utils/helper'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

const permissions = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.EMPLOYEE_CREATE]

const CreateEmployeePage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const { salonID, parentPath } = props
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)

	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const isFormPristine = useSelector(isPristine(FORM.EMPLOYEE))
	const form = useSelector((state: RootState) => state.form?.[FORM.EMPLOYEE])
	const services = useSelector((state: RootState) => state.service.services)

	const { isLoading } = services

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

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:employees')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body small mt-2'>
					<EmployeeForm addService={() => addService(services, form, dispatch)} salonID={salonID} onSubmit={createEmployee} />
					<div className={'content-footer'}>
						<Row className={'justify-center'}>
							<Button
								type={'primary'}
								block
								size={'middle'}
								className={'noti-btn m-regular w-52 xl:w-60'}
								htmlType={'submit'}
								onClick={() => {
									dispatch(submit(FORM.EMPLOYEE))
								}}
								disabled={submitting || isFormPristine}
								loading={submitting}
							>
								{t('loc:Uložiť')}
							</Button>
						</Row>
					</div>
				</div>
			</Spin>
		</>
	)
}

export default compose(withPermissions(permissions))(CreateEmployeePage)
