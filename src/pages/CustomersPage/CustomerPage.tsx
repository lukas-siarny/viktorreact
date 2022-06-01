import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { get } from 'lodash'
import { compose } from 'redux'
import { initialize, submit, isPristine } from 'redux-form'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'
import CustomerForm from './components/CustomerForm'

// types
import { IBreadcrumbs, IComputedMatch, ICustomerForm } from '../../types/interfaces'

// reducers
import { getCustomer } from '../../reducers/customers/customerActions'
import { RootState } from '../../reducers'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'
import { deleteReq, patchReq } from '../../utils/request'
import { history } from '../../utils/history'

type Props = {
	computedMatch: IComputedMatch<{ customerID: number }>
}

const CustomerPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { customerID } = props.computedMatch.params
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const isFormPristine = useSelector(isPristine(FORM.CUSTOMER))
	const customer = useSelector((state: RootState) => state.customers.customer)

	useEffect(() => {
		dispatch(getCustomer(customerID))
	}, [dispatch, customerID])

	useEffect(() => {
		dispatch(
			initialize(FORM.CUSTOMER, {
				...customer.data?.customer,
				zipCode: customer.data?.customer.address.zipCode,
				city: customer.data?.customer.address.city,
				street: customer.data?.customer.address.street,
				countryCode: customer.data?.customer.address.countryCode,
				salonID: customer.data?.customer.salon.id
			})
		)
	}, [dispatch, customer])

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov'),
				link: t('paths:customers')
			},
			{
				name: t('loc:Detail zákazníka'),
				titleName:
					get(customer, 'data.customer.firstName') && get(customer, 'data.customer.lastName')
						? `${get(customer, 'data.customer.firstName')} ${get(customer, 'data.customer.lastName')}`
						: `${get(customer, 'data.customer.email')}`
			}
		]
	}

	const updateCustomer = async (data: ICustomerForm) => {
		try {
			setSubmitting(true)
			await patchReq(
				'/api/b2b/admin/customers/{customerID}',
				{ customerID },
				{
					email: data.email,
					city: data.city,
					countryCode: data.countryCode,
					firstName: data.firstName,
					gender: data.gender,
					lastName: data.lastName,
					salonID: data.salonID,
					street: data.street,
					zipCode: data.zipCode,
					phone: data.phone,
					phonePrefixCountryCode: data.phonePrefixCountryCode
				}
			)
			dispatch(getCustomer(customerID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	const deleteCustomer = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/customers/{customerID}', { customerID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			history.push(t('paths:customers'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:customers')} />
			</Row>
			<div className='content-body small mt-2'>
				<CustomerForm onSubmit={updateCustomer} />
				<div className={'content-footer'}>
					<Row className={'justify-between'}>
						<DeleteButton
							permissions={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_EDIT, PERMISSION.PARTNER]}
							className={'w-1/3'}
							onConfirm={deleteCustomer}
							entityName={t('loc:zákazníka')}
							type={'default'}
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
						/>
						<Permissions
							allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_EDIT, PERMISSION.PARTNER]}
							render={(hasPermission, { openForbiddenModal }) => (
								<Button
									type={'primary'}
									block
									size={'middle'}
									className={'noti-btn m-regular mb-2 w-1/3'}
									htmlType={'submit'}
									onClick={(e) => {
										if (hasPermission) {
											dispatch(submit(FORM.CUSTOMER))
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

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_BROWSING, PERMISSION.PARTNER]))(CustomerPage)
