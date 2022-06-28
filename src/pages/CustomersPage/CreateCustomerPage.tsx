import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { initialize, isPristine, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { get, map } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomerForm from './components/CustomerForm'

// types
import { IBreadcrumbs, ICustomerForm, SalonSubPageProps } from '../../types/interfaces'

// utils
import { withPermissions } from '../../utils/Permissions'
import { ENUMERATIONS_KEYS, FORM, PERMISSION, SALON_PERMISSION } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { history } from '../../utils/history'
import { getPrefixCountryCode } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'

const permissions = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CUSTOMER_CREATE]

const CreateCustomerPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const [submitting, setSubmitting] = useState<boolean>(false)
	const isFormPristine = useSelector(isPristine(FORM.CUSTOMER))
	const countriesPhonePrefix = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov'),
				link: parentPath + t('paths:customers')
			},
			{
				name: t('loc:Vytvorenie zákazníka')
			}
		]
	}

	const fetchData = async () => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(countriesPhonePrefix?.data, (item) => item.code))
		dispatch(initialize(FORM.CUSTOMER, { phonePrefixCountryCode }))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const createCustomer = async (formData: ICustomerForm) => {
		try {
			setSubmitting(true)
			const { data } = await postReq('/api/b2b/admin/customers/', null, {
				email: formData.email,
				city: formData.city,
				countryCode: formData.countryCode,
				firstName: formData.firstName,
				gender: formData.gender,
				lastName: formData.lastName,
				salonID,
				street: formData.street,
				streetNumber: formData.streetNumber,
				zipCode: formData.zipCode,
				phone: formData.phone,
				phonePrefixCountryCode: formData.phonePrefixCountryCode
			})

			const customerID = get(data, 'cusomer.id', 0)
			history.push(parentPath + (customerID > 0 ? t('paths:customers/{{customerID}}', { customerID }) : t('paths:customers')))
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={parentPath + t('paths:customers')} />
			</Row>
			<div className='content-body small mt-2'>
				<CustomerForm onSubmit={createCustomer} />
				<div className={'content-footer'}>
					<Row justify='center'>
						<Button
							type={'primary'}
							block
							size={'middle'}
							className={'noti-btn m-regular mb-2 w-1/3'}
							htmlType={'submit'}
							onClick={() => {
								dispatch(submit(FORM.CUSTOMER))
							}}
							disabled={submitting || isFormPristine}
							loading={submitting}
						>
							{t('loc:Uložiť')}
						</Button>
					</Row>
				</div>
			</div>
		</>
	)
}

export default compose(withPermissions(permissions))(CreateCustomerPage)
