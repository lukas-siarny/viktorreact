import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Row, Spin } from 'antd'
import { change, initialize, isPristine, submit } from 'redux-form'
import { get, isEmpty, map, unionBy } from 'lodash'
import { compose } from 'redux'

// components
import { Link } from 'react-router-dom'
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SupportContactForm from './components/SupportContactForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'
import { scrollToTopFn } from '../../components/ScrollToTop'

// enums
import { DAY, DEFAULT_LANGUAGE, ENUMERATIONS_KEYS, FORM, MONDAY_TO_FRIDAY, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'
import { getSupportContact, getSupportContacts, ISupportContactPayload } from '../../reducers/supportContacts/supportContactsActions'

// types
import { IBreadcrumbs, ILoadingAndFailure, OpeningHours, ISupportContactForm, IComputedMatch } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'
import { checkSameOpeningHours, checkWeekend, createSameOpeningHours, getDayTimeRanges, initOpeningHours, orderDaysInWeek } from '../../components/OpeningHours/OpeninhHoursUtils'
import i18n from '../../utils/i18n'

// TODO: type
type SupportContactPatch = any

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]

type Props = {
	computedMatch: IComputedMatch<{
		supportContactID: number
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
	// TODO: remove any when BE is done
	const supportContact = useSelector((state: RootState) => state.supportContacts.supportContact) as any
	const supportContacts = useSelector((state: RootState) => state.supportContacts.supportContacts) as any
	const countries = useSelector((state: RootState) => state.enumerationsStore[ENUMERATIONS_KEYS.COUNTRIES_FILTER_OPTIONS])

	const formValues = useSelector((state: RootState) => state.form?.[FORM.SUPPORT_CONTACT]?.values)
	const isFormPristine = useSelector(isPristine(FORM.SUPPORT_CONTACT))

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend
	const deletedSupportContact = !!(supportContact?.data?.deletedAt && supportContact?.data?.deletedAt !== null)

	const isLoading = supportContact.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving

	useEffect(() => {
		if (sameOpenHoursOverWeekFormValue) {
			if (openOverWeekendFormValue) {
				// set switch same open hours over week with weekend
				dispatch(
					change(FORM.SUPPORT_CONTACT, 'openingHours', [
						{ day: MONDAY_TO_FRIDAY, timeRanges: getDayTimeRanges(formValues?.openingHours) },
						{ day: DAY.SATURDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SATURDAY) },
						{ day: DAY.SUNDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SUNDAY) }
					])
				)
			} else {
				// set switch same open hours over week without weekend
				dispatch(change(FORM.SUPPORT_CONTACT, 'openingHours', [{ day: MONDAY_TO_FRIDAY, timeRanges: getDayTimeRanges(formValues?.openingHours) }]))
			}
		} else {
			// set to init values
			// in initOpeningHours function input openOverWeekend is set to false because also we need to get weekend time Ranges
			const openingHours: OpeningHours = initOpeningHours(supportContact.data?.openingHours, sameOpenHoursOverWeekFormValue, false)?.sort(orderDaysInWeek)
			if (openOverWeekendFormValue && openingHours) {
				const updatedOpeningHours = unionBy(
					[
						{ day: DAY.SATURDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SATURDAY) },
						{ day: DAY.SUNDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SUNDAY) }
					],
					openingHours,
					'day'
				)?.sort(orderDaysInWeek)
				dispatch(change(FORM.SUPPORT_CONTACT, 'openingHours', updatedOpeningHours))
			} else {
				dispatch(change(FORM.SUPPORT_CONTACT, 'openingHours', openingHours?.sort(orderDaysInWeek)))
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sameOpenHoursOverWeekFormValue, openOverWeekendFormValue])

	useEffect(() => {
		dispatch(getSupportContact(supportContactID))
	}, [supportContactID, dispatch])

	// init forms
	useEffect(() => {
		// TODO: remove any when BE is done
		const initForm = async (supportContactData?: any /* supportContactData: ISupportContactPayload & ILoadingAndFailure */) => {
			const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))
			const defaultContactPerson = {
				phonePrefixCountryCode
			}

			if (supportContactData && !isEmpty(supportContactData) && supportContactID) {
				// init data for existing supportContact
				const openOverWeekend: boolean = checkWeekend(supportContactData.data?.supportContact?.openingHours)
				const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(supportContactData.data?.supportContact?.openingHours)
				const openingHours: OpeningHours = initOpeningHours(supportContactData.data?.supportContact?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(
					orderDaysInWeek
				) as OpeningHours

				dispatch(
					initialize(FORM.SUPPORT_CONTACT, {
						...supportContactData.data?.supportContact,
						openOverWeekend,
						sameOpenHoursOverWeek,
						openingHours,
						city: supportContactData.data?.supportContact?.address?.city,
						street: supportContactData.data?.supportContact?.address?.street,
						zipCode: supportContactData.data?.supportContact?.address?.zipCode,
						country: supportContactData.data?.supportContact?.address?.countryCode,
						streetNumber: supportContactData.data?.supportContact?.address?.streetNumber,
						emails: supportContactData.data?.supportContact?.emails?.map((email: string) => ({ email })),
						phones: supportContactData.data?.supportContact?.phones
					})
				)
			} else if (!supportContact?.isLoading) {
				// init data for new "creating process" supportContact
				dispatch(
					initialize(FORM.SUPPORT_CONTACT, {
						openOverWeekend: false,
						sameOpenHoursOverWeek: true,
						openingHours: initOpeningHours(supportContactData?.data?.supportContact?.openingHours, true, false),
						payByCard: false,
						phonePrefixCountryCode,
						isInvoiceAddressSame: true,
						companyContactPerson: defaultContactPerson,
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
		}

		initForm(supportContact)
	}, [supportContact, dispatch, phonePrefixes.data, supportContactID])

	useEffect(() => {
		dispatch(getSupportContacts())
	}, [dispatch])

	const handleSubmit = async (data: ISupportContactForm) => {
		try {
			setSubmitting(true)
			const openingHours: OpeningHours = createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			const supportContactData: SupportContactPatch = {
				openingHours: openingHours || [],
				city: data.city,
				countryCode: data.country,
				street: data.street,
				zipCode: data.zipCode,
				phones: data.phones?.filter((phone) => !phone || !phone.phone),
				emails: data.emails?.reduce((acc, email) => (email?.email ? [...acc, email.email] : acc), [] as string[])
			}

			if (supportContactID > 0) {
				// update existing supportContact
				// TODO: remove any when BE is done
				await patchReq('/api/b2b/admin/support-contacts/{supportContactID}' as any, { supportContactID }, supportContactData)
				dispatch(getSupportContact(supportContactID))
			} else {
				// create new supportContact
				// TODO: remove any when BE is done
				const result = await postReq('/api/b2b/admin/support-contacts/' as any, undefined, supportContactData)
				if (result?.data?.supportContact?.id) {
					// load new supportContact for current user
					// TODO: load current user ?
					await dispatch(getCurrentUser())
					// select new supportContact
					await dispatch(getSupportContact(result.data.supportContact.id))
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
				link: t('paths:support-contacts')
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
			// TODO: remove any when BE is done
			await deleteReq('/api/b2b/admin/support-contacts/{supportContactID}' as any, { supportContactID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			history.push(t('paths:support-contacts'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const supportContactExists = supportContactID > 0

	const hasEveryCountrSupportContact = supportContacts?.data?.supportContacts?.length === countries.data?.length

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
									{t('loc:Ďalšiu podporu nie je možné vytvoriť. Pre každú krajinu môžete vytvoriť maximálne jednu a pre všetky už existujú.')}{' '}
									<Link to={t('paths:support-contacts') as any} className={'underline'}>
										{t('loc:Stále však môžete editovať existujúce')}
									</Link>
								</>
							}
							showIcon
							type={'warning'}
							className={'mb-4'}
						/>
					)}
					<SupportContactForm
						onSubmit={handleSubmit}
						supportContactID={supportContactID}
						disabledForm={(!supportContactExists && hasEveryCountrSupportContact) || deletedSupportContact}
					/>
					<div className={'content-footer'}>
						<Row className={`${supportContactExists ? 'justify-between' : 'justify-center'} w-full`}>
							{supportContactExists && (
								<DeleteButton
									permissions={permissions}
									className={'w-1/3'}
									onConfirm={deleteSupportContact}
									entityName={t('loc:kontakt')}
									type={'default'}
									getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
									disabled={deletedSupportContact}
								/>
							)}
							<Permissions
								allowed={permissions}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular w-1/3'}
										htmlType={'submit'}
										onClick={(e) => {
											if (hasPermission) {
												dispatch(submit(FORM.SUPPORT_CONTACT))
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={(!supportContactExists && hasEveryCountrSupportContact) || submitting || deletedSupportContact || isFormPristine}
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
