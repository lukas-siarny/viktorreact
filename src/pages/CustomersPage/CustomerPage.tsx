import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { get, map } from 'lodash'
import { compose } from 'redux'
import { initialize, submit, isPristine } from 'redux-form'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'
import CustomerForm from './components/CustomerForm'

// types
import { IBreadcrumbs, IComputedMatch, ICustomerForm, SalonSubPageProps } from '../../types/interfaces'

// reducers
import { getCustomer } from '../../reducers/customers/customerActions'
import { RootState } from '../../reducers'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { FORM, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { deleteReq, patchReq } from '../../utils/request'
import { history } from '../../utils/history'
import { Paths } from '../../types/api'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

type Props = SalonSubPageProps & {
	computedMatch: IComputedMatch<{
		customerID: string
	}>
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const CustomerPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { parentPath } = props
	const { customerID } = props.computedMatch.params
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const isFormPristine = useSelector(isPristine(FORM.CUSTOMER))
	const customer = useSelector((state: RootState) => state.customers.customer)

	const isLoading = customer?.isLoading || isRemoving

	const [backUrl] = useBackUrl(parentPath + t('paths:customers'))

	const fetchCustomerData = async () => {
		const { data } = await dispatch(getCustomer(customerID))
		if (!data?.customer?.id) {
			history.push('/404')
		}
	}

	useEffect(() => {
		fetchCustomerData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, customerID])

	useEffect(() => {
		dispatch(
			initialize(FORM.CUSTOMER, {
				...customer.data?.customer,
				zipCode: customer.data?.customer.address.zipCode,
				city: customer.data?.customer.address.city,
				street: customer.data?.customer.address.street,
				streetNumber: customer.data?.customer.address.streetNumber,
				countryCode: customer.data?.customer.address.countryCode,
				salonID: customer.data?.customer.salon.id,
				gallery: map(customer?.data?.customer?.galleryImages, (image) => ({ url: image?.resizedImages?.thumbnail, uid: image?.id })),
				avatar: customer?.data?.customer?.profileImage
					? [{ url: customer?.data?.customer?.profileImage?.resizedImages?.thumbnail, uid: customer?.data?.customer?.profileImage?.id }]
					: null
			})
		)
	}, [dispatch, customer])

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov'),
				link: backUrl
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
					note: data.note,
					street: data.street,
					streetNumber: data.streetNumber,
					zipCode: data.zipCode,
					phone: data.phone,
					phonePrefixCountryCode: data.phonePrefixCountryCode,
					galleryImageIDs:
						((data?.gallery || []).map((image: any) => image?.id ?? image?.uid) as Paths.PatchApiB2BAdminCustomersCustomerId.RequestBody['galleryImageIDs']) || null,
					profileImageID: data?.avatar?.[0]?.id || null
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
			history.push(parentPath + t('paths:customers'))
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:customers')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body small mt-2'>
					<CustomerForm onSubmit={updateCustomer} />
					<div className={'content-footer pt-0'}>
						<Row className={'justify-between gap-2'}>
							<DeleteButton
								permissions={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CUSTOMER_DELETE]}
								className={'mt-2-5 w-52 xl:w-60'}
								onConfirm={deleteCustomer}
								entityName={t('loc:zákazníka')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
							<Permissions
								allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CUSTOMER_UPDATE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular mt-2-5 w-52 xl:w-60'}
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
			</Spin>
		</>
	)
}

export default compose(withPermissions(permissions))(CustomerPage)
