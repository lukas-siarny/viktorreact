import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Row, Spin } from 'antd'
import { initialize, isPristine, submit } from 'redux-form'
import { get, map } from 'lodash'
import { compose } from 'redux'
import cx from 'classnames'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SupportContactForm from './components/SupportContactForm'
import { scrollToTopFn } from '../../components/ScrollToTop'
import {
	checkSameOpeningHours,
	checkWeekend,
	createSameOpeningHours,
	initOpeningHours,
	orderDaysInWeek,
	useChangeOpeningHoursFormFields
} from '../../components/OpeningHours/OpeningHoursUtils'

// enums
import { ENUMERATIONS_KEYS, FORM, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// types
import { Paths } from '../../types/api'
import { IBreadcrumbs, OpeningHours, ISupportContactForm, IComputedMatch } from '../../types/interfaces'

// reducers
import { RootState } from '../../reducers'
import { getSupportContact, getSupportContacts } from '../../reducers/supportContacts/supportContactsActions'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

type SupportContactPatch = Paths.PatchApiB2BAdminEnumsSupportContactsSupportContactId.RequestBody

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]

type Props = {
	computedMatch: IComputedMatch<{
		supportContactID: string
	}>
}

const SupportContactPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { supportContactID } = props.computedMatch.params

	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const supportContact = useSelector((state: RootState) => state.supportContacts.supportContact)
	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts)
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES])

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SUPPORT_CONTACT]?.values)
	const isFormPristine = useSelector(isPristine(FORM.SUPPORT_CONTACT))

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend

	const isLoading = supportContact.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving

	const supportContactExists = !!supportContactID

	const [backUrl] = useBackUrl(t('paths:support-contacts'))

	useEffect(() => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

		const fetchData = async () => {
			const { data } = await dispatch(getSupportContact(supportContactID))

			if (!data?.supportContact?.id) {
				history.push('/404')
			}

			if (data) {
				// init data for existing supportContact
				const openOverWeekend: boolean = checkWeekend(data?.supportContact?.openingHours)
				const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(data?.supportContact?.openingHours)
				const openingHours: OpeningHours = initOpeningHours(data?.supportContact?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(
					orderDaysInWeek
				) as OpeningHours

				dispatch(
					initialize(FORM.SUPPORT_CONTACT, {
						...data?.supportContact,
						openOverWeekend,
						sameOpenHoursOverWeek,
						openingHours,
						city: data?.supportContact?.address?.city,
						street: data?.supportContact?.address?.street,
						zipCode: data?.supportContact?.address?.zipCode,
						countryCode: data?.supportContact?.address?.countryCode,
						streetNumber: data?.supportContact?.address?.streetNumber,
						emails: data?.supportContact?.emails?.map((email) => ({ email })),
						phones: data?.supportContact?.phones
					})
				)
			}
		}

		if (supportContactID) {
			fetchData()
		} else {
			// init data for new "creating process" supportContact
			dispatch(
				initialize(FORM.SUPPORT_CONTACT, {
					openOverWeekend: false,
					sameOpenHoursOverWeek: true,
					openingHours: initOpeningHours(undefined, true, false),
					emails: [{ email: '' }],
					phones: [
						{
							phonePrefixCountryCode,
							phone: ''
						}
					]
				})
			)
		}
	}, [dispatch, phonePrefixes.data, supportContactID])

	useEffect(() => {
		dispatch(getSupportContacts())
	}, [dispatch])

	useChangeOpeningHoursFormFields(FORM.SUPPORT_CONTACT, formValues?.openingHours, sameOpenHoursOverWeekFormValue, openOverWeekendFormValue)

	const handleSubmit = async (data: ISupportContactForm) => {
		try {
			setSubmitting(true)
			const openingHours: OpeningHours = createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			const phones = data.phones?.filter((phone) => phone?.phone)
			const emails = data.emails?.reduce((acc, email) => (email?.email ? [...acc, email.email] : acc), [] as string[])

			const supportContactData = {
				openingHours: openingHours || [],
				address: {
					city: data.city,
					countryCode: data.countryCode,
					street: data.street,
					streetNumber: data.streetNumber,
					zipCode: data.zipCode
				},
				countryCode: data.countryCode,
				note: data.note,
				phones,
				emails
			}

			if (supportContactExists) {
				// update existing supportContact
				await patchReq('/api/b2b/admin/enums/support-contacts/{supportContactID}', { supportContactID }, supportContactData as SupportContactPatch)
				dispatch(getSupportContact(supportContactID))
			} else {
				// create new supportContact
				const result = await postReq('/api/b2b/admin/enums/support-contacts/', undefined, supportContactData as SupportContactPatch)
				if (result?.data?.supportContact?.id) {
					// select new supportContact
					history.push(t('paths:support-contacts/{{supportContactID}}', { supportContactID: result.data.supportContact.id }))
				}
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
			scrollToTopFn()
		}
	}

	const breadcrumbDetailItem = get(supportContact, 'data.supportContact.id')
		? {
				name: t('loc:Detail podpory'),
				titleName: get(supportContact, 'data.supportContact.country.name') || ''
		  }
		: {
				name: t('loc:Vytvoriť podporu'),
				link: t('paths:support-contacts/create')
		  }

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam podporných centier'),
				link: backUrl
			},
			breadcrumbDetailItem
		]
	}

	const deleteSupportContact = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/enums/support-contacts/{supportContactID}', { supportContactID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			// clear redux
			dispatch(getSupportContact())
			history.push(t('paths:support-contacts'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const hasEveryCountrSupportContact = !countries?.data?.some((country) => !supportContacts?.data?.supportContacts?.find((contact: any) => contact.country.code === country.code))

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body small mt-2'>
					{!supportContactExists && hasEveryCountrSupportContact && (
						<Alert
							message={
								<>
									{t('loc:Ďalšiu podporu nie je možné vytvoriť. Pre každú krajinu môžete vytvoriť maximálne jednu.')}{' '}
									<Link to={t('paths:support-contacts') as any} className={'underline'}>
										{t('loc:Stále však môžete editovať existujúce')}
									</Link>
									{'.'}
								</>
							}
							showIcon
							type={'warning'}
							className={'noti-alert mb-4'}
						/>
					)}
					<SupportContactForm onSubmit={handleSubmit} supportContactID={supportContactID} disabledForm={!supportContactExists && hasEveryCountrSupportContact} />
					<div className={'content-footer pt-0'}>
						<Row className={cx({ 'justify-between': supportContactExists, 'justify-center': !supportContactExists }, 'w-full')}>
							{supportContactExists && (
								<DeleteButton
									permissions={permissions}
									className={'mt-2-5 w-52 xl:w-60'}
									onConfirm={deleteSupportContact}
									entityName={t('loc:podporu')}
									type={'default'}
									getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								/>
							)}
							<Permissions
								allowed={permissions}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular mt-2-5 w-52 xl:w-60'}
										htmlType={'submit'}
										onClick={(e) => {
											if (hasPermission) {
												dispatch(submit(FORM.SUPPORT_CONTACT))
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={(!supportContactExists && hasEveryCountrSupportContact) || submitting || isFormPristine}
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

export default compose(withPermissions(permissions))(SupportContactPage)
