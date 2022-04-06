import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { initialize, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { map } from 'lodash'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomerForm from './components/CustomerForm'

// types
import { IBreadcrumbs, ICustomerForm } from '../../types/interfaces'

// utils
import { withPermissions } from '../../utils/Permissions'
import { ENUMERATIONS_KEYS, FORM, LANGUAGE, PERMISSION } from '../../utils/enums'
import { postReq } from '../../utils/request'
import { history } from '../../utils/history'
import { getPrefixCountryCode } from '../../utils/helper'

// reducers
import { RootState } from '../../reducers'

const CreateCustomerPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)

	const countriesPhonePrefix = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov'),
				link: t('paths:customers')
			},
			{
				name: t('loc:Vytvorenie zákazníka')
			}
		]
	}

	const fetchData = async () => {
		const phonePrefixCountryCode = getPrefixCountryCode(
			map(countriesPhonePrefix?.data, (item) => item.code),
			LANGUAGE.SK.toUpperCase()
		)
		dispatch(initialize(FORM.CUSTOMER, { phonePrefixCountryCode }))
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const createCustomer = async (data: ICustomerForm) => {
		try {
			setSubmitting(true)
			await postReq('/api/b2b/admin/customers/', null, {
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
			})
			history.push(t('paths:customers'))
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
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:customers')} />
			</Row>
			<div className='content-body small'>
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
							disabled={submitting}
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

export default compose(withPermissions([PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.CUSTOMER_EDIT, PERMISSION.PARTNER]))(CreateCustomerPage)
