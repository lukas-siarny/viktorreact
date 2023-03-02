import React, { useEffect, FC } from 'react'
import { compose } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { initialize } from 'redux-form'
import { useTranslation } from 'react-i18next'
import { Button, Col, Divider, Row, Spin } from 'antd'
import { useNavigate } from 'react-router'

// redux
import { RootState } from '../../reducers'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

// utils
import { ROW_GUTTER_X_DEFAULT, PERMISSION, FORM } from '../../utils/enums'
import { withPermissions } from '../../utils/Permissions'
import { patchReq } from '../../utils/request'

// types
import { IBreadcrumbs, IBillingForm, SalonSubPageProps } from '../../types/interfaces'
import Alert from '../../components/Dashboards/Alert'

// assets
import { ReactComponent as SettingIcon } from '../../assets/icons/setting.svg'
import { ReactComponent as UsageIcon } from '../../assets/icons/usage.svg'

// components
import Wallet from '../../components/Dashboards/Wallet'
import { formatPrice } from '../../utils/helper'
import SmsStats from '../../components/Dashboards/SmsStats'

const SmsCreditPage: FC<SalonSubPageProps> = (props) => {
	const { salonID, parentPath } = props

	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)

	useEffect(() => {
		if (salon.data) {
			const initData: IBillingForm = {
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
			<div className={'homepage-wrapper'}>
				<div className='w-11/12 xl:w-5/6 2xl:w-3/4 3xl:w-2/3 mx-auto mt-10'>
					<Spin spinning={salon?.isLoading}>
						<Alert
							className='mb-6'
							title={t('loc:Nastavte si SMS notifikácie')}
							subTitle={t('loc:Prejdite do nastavení rezervačného systému a nastavte si SMS notifikácie podľa vašich preferencií')}
							actionLabel={t('loc:Nastaviť SMS notifikácie')}
							icon={<SettingIcon />}
							onActionItemClick={() => navigate(`${parentPath}${t('paths:reservations-settings')}`)}
						/>
						<div className={'flex gap-4'}>
							<Wallet salonID={salonID} />
							<SmsStats salonID={salonID} />
						</div>
					</Spin>
				</div>
			</div>
		</>
	)
}

export default compose(withPermissions([PERMISSION.NOTINO, PERMISSION.PARTNER]))(SmsCreditPage)
