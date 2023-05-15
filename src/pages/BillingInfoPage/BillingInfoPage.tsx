import React, { useEffect } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Col, Row, Spin } from 'antd'

// redux
import { RootState } from '../../reducers'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// components
import BillingInfoForm from './components/BillingInfoForm'
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'

// types
import { IBreadcrumbs } from '../../types/interfaces'
import { IBillingForm } from '../../schemas/billing'

const BillingInfoPage = () => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	useEffect(() => {
		if (salon.data) {
			const initData = {
				...salon.data.companyInvoiceAddress,
				...salon.data.companyInfo,
				...salon.data.companyContactPerson,
				phonePrefixCountryCode: salon.data.companyContactPerson?.phonePrefixCountryCode || salon.data.address?.countryCode
			}

			dispatch(initialize(FORM.SALON_BILLING_INFO, initData))
		}
	}, [dispatch, salon.data])

	const handleSubmit = async (formData: IBillingForm) => {
		if (salon.data?.id) {
			try {
				const body = {
					companyInvoiceAddress: {
						countryCode: formData.countryCode,
						zipCode: formData.zipCode,
						city: formData.city,
						street: formData.street,
						streetNumber: formData.streetNumber
					},
					companyContactPerson: {
						email: formData.email,
						firstName: formData.firstName,
						lastName: formData.lastName,
						phonePrefixCountryCode: formData.phonePrefixCountryCode,
						phone: formData.phone
					},
					companyInfo: {
						businessID: formData.businessID,
						taxID: formData.taxID,
						vatID: formData.vatID,
						companyName: formData.companyName
					}
				}

				const salonID = salon.data.id

				await patchReq('/api/b2b/admin/salons/{salonID}/invoice', { salonID }, body)
				await dispatch(selectSalon(salonID))
			} catch (error: any) {
				// eslint-disable-next-line no-console
				console.error(error.message)
			}
		}
	}

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Fakturačné údaje')
			}
		]
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Row gutter={ROW_GUTTER_X_DEFAULT}>
				<Col span={24}>
					<div className='content-body small'>
						<Spin spinning={salon?.isLoading}>
							<BillingInfoForm onSubmit={handleSubmit} />
						</Spin>
					</div>
				</Col>
			</Row>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(BillingInfoPage)
