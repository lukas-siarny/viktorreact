import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { get, map } from 'lodash'
import { compose } from 'redux'
import { initialize, submit, isPristine } from 'redux-form'
import { useNavigate, useParams } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import DeleteButton from '../../components/DeleteButton'
import CustomerForm from './components/CustomerForm'

// types
import { IBreadcrumbs, SalonSubPageProps } from '../../types/interfaces'
import { ICustomerForm } from '../../schemas/customerSchema'

// reducers
import { getCustomer } from '../../reducers/customers/customerActions'
import { RootState } from '../../reducers'

// utils
import Permissions, { withPermissions } from '../../utils/Permissions'
import { DELETE_BUTTON_ID, FORM, NOTIFICATION_TYPE, PERMISSION, SUBMIT_BUTTON_ID } from '../../utils/enums'
import { deleteReq, patchReq } from '../../utils/request'
import { Paths } from '../../types/api'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import { formFieldID } from '../../utils/helper'

// assets
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'

type Props = SalonSubPageProps

const CustomerPage = (props: Props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { parentPath } = props
	const { customerID } = useParams<{ customerID?: string }>()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const isFormPristine = useSelector(isPristine(FORM.CUSTOMER))
	const customer = useSelector((state: RootState) => state.customers.customer)
	const navigate = useNavigate()

	const isLoading = customer?.isLoading || isRemoving

	const [backUrl] = useBackUrl(parentPath + t('paths:customers'))

	const fetchCustomerData = async () => {
		const { data } = await dispatch(getCustomer(customerID as string))
		if (!data?.customer?.id) {
			navigate('/404')
		}

		console.log('🚀 ~ file: CustomerPage.tsx:81 ~ fetchCustomerData ~ from API:', data?.customer)

		const initial = {
			...data?.customer,
			...data?.customer.address,
			// zipCode: data?.customer.address.zipCode,
			// city: data?.customer.address.city,
			// street: data?.customer.address.street,
			// streetNumber: data?.customer.address.streetNumber,
			// countryCode: data?.customer.address.countryCode,
			salonID: data?.customer.salon.id,
			gallery: map(data?.customer?.galleryImages, (image) => ({ url: image?.original, thumbnail: image?.resizedImages?.thumbnail, uid: image?.id })),
			avatar: data?.customer?.profileImage
				? [{ url: data?.customer?.profileImage?.original, thumbnail: data?.customer?.profileImage?.resizedImages?.thumbnail, uid: data?.customer?.profileImage?.id }]
				: null
		}

		console.log('🚀 ~ file: CustomerPage.tsx:59 ~ fetchCustomerData ~ initial:', initial)

		dispatch(initialize(FORM.CUSTOMER, initial))
	}

	useEffect(() => {
		fetchCustomerData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch, customerID])

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
				{ customerID: customerID as string },
				{
					email: data.email,
					city: data.city,
					countryCode: data.countryCode,
					firstName: data.firstName,
					gender: data.gender, // ?? undefined,
					lastName: data.lastName,
					note: data.note,
					street: data.street,
					streetNumber: data.streetNumber,
					zipCode: data.zipCode,
					phone: data.phone,
					phonePrefixCountryCode: data?.phonePrefixCountryCode,
					galleryImageIDs:
						((data?.gallery || []).map((image: any) => image?.id ?? image?.uid) as Paths.PatchApiB2BAdminCustomersCustomerId.RequestBody['galleryImageIDs']) || null,
					profileImageID: (data?.avatar?.[0]?.id ?? data?.avatar?.[0]?.uid) || null
				}
			)

			navigate(backUrl as string)
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
			await deleteReq('/api/b2b/admin/customers/{customerID}', { customerID: customerID as string }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			navigate(parentPath + t('paths:customers'))
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
				<div className='content-body small'>
					<CustomerForm onSubmit={updateCustomer} />
					<div className={'content-footer'}>
						<div className={'flex flex-col gap-2 md:flex-row md:justify-between'}>
							<DeleteButton
								permissions={[PERMISSION.PARTNER_ADMIN, PERMISSION.CUSTOMER_DELETE]}
								className={'w-full md:w-auto md:min-w-50 xl:min-w-60'}
								onConfirm={deleteCustomer}
								entityName={t('loc:zákazníka')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								id={formFieldID(FORM.CUSTOMER, DELETE_BUTTON_ID)}
							/>
							<Permissions
								allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.CUSTOMER_UPDATE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										id={formFieldID(FORM.CUSTOMER, SUBMIT_BUTTON_ID)}
										type={'primary'}
										size={'middle'}
										className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
										htmlType={'submit'}
										icon={<EditIcon />}
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
						</div>
					</div>
				</div>
			</Spin>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(CustomerPage)
