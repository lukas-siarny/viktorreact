import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { initialize, isPristine, submit } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { compose } from 'redux'
import { useNavigate } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import CustomerForm from './components/CustomerForm'

// types
import { IBreadcrumbs, ICustomerForm, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { withPermissions } from '../../utils/Permissions'
import { ENUMERATIONS_KEYS, FORM, PERMISSION, SALON_PERMISSION, STRINGS } from '../../utils/enums'
import { postReq } from '../../utils/request'

// reducers
import { RootState } from '../../reducers'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

// assets
import { ReactComponent as CreateIcon } from '../../assets/icons/plus-icon.svg'

const permissions = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.CUSTOMER_CREATE]

const CreateCustomerPage = (props: SalonSubPageProps) => {
	const [t] = useTranslation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { salonID, parentPath } = props
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const [submitting, setSubmitting] = useState<boolean>(false)
	const isFormPristine = useSelector(isPristine(FORM.CUSTOMER))
	const countriesPhonePrefix = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])

	const { isLoading } = countriesPhonePrefix

	const [backUrl] = useBackUrl(parentPath + t('paths:customers'))

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam zákazníkov'),
				link: backUrl
			},
			{
				name: t('loc:Vytvoriť zákazníka')
			}
		]
	}

	const fetchData = async () => {
		if (salon.data) {
			dispatch(initialize(FORM.CUSTOMER, { phonePrefixCountryCode: salon.data.companyContactPerson?.phonePrefixCountryCode || salon.data.address?.countryCode }))
		}
	}

	useEffect(() => {
		fetchData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const createCustomer = async (formData: ICustomerForm) => {
		try {
			setSubmitting(true)
			await postReq('/api/b2b/admin/customers/', null, {
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
				phonePrefixCountryCode: formData.phonePrefixCountryCode,
				note: formData.note,
				galleryImageIDs:
					((formData?.gallery || []).map((image: any) => image?.id ?? image?.uid) as Paths.PatchApiB2BAdminCustomersCustomerId.RequestBody['galleryImageIDs']) || null,
				profileImageID: (formData?.avatar?.[0]?.id ?? formData?.avatar?.[0]?.uid) || null
			})

			navigate(backUrl as string)
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
			<Spin spinning={isLoading}>
				<div className='content-body small'>
					<CustomerForm onSubmit={createCustomer} />
					<div className={'content-footer'}>
						<Row justify='center'>
							<Button
								type={'primary'}
								icon={<CreateIcon />}
								size={'middle'}
								className={'noti-btn m-regular w-full md:w-auto md:min-w-50 xl:min-w-60'}
								htmlType={'submit'}
								onClick={() => {
									dispatch(submit(FORM.CUSTOMER))
								}}
								disabled={submitting || isFormPristine}
								loading={submitting}
							>
								{STRINGS(t).createRecord(t('loc:zákazníka'))}
							</Button>
						</Row>
					</div>
				</div>
			</Spin>
		</>
	)
}

export default compose(withPermissions(permissions))(CreateCustomerPage)
