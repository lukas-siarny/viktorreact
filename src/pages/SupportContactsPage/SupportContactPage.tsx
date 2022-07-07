import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { change, initialize, isPristine, submit } from 'redux-form'
import { get, isEmpty, map, unionBy } from 'lodash'
import { compose } from 'redux'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SupportContactForm from './components/SupportContactForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'
import { scrollToTopFn } from '../../components/ScrollToTop'

// enums
import { DAY, ENUMERATIONS_KEYS, FORM, MONDAY_TO_FRIDAY, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'
import { getSupportContact, ISupportContactPayload } from '../../reducers/supportContacts/supportContactsActions'

// types
import { IBreadcrumbs, ILoadingAndFailure, OpeningHours, ISupportContactForm, IComputedMatch } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'
import { checkSameOpeningHours, checkWeekend, createSameOpeningHours, getDayTimeRanges, initOpeningHours, orderDaysInWeek } from '../../components/OpeningHours/OpeninhHoursUtils'

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
	const [visible, setVisible] = useState<boolean>(false)

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	// TODO: remove any when BE is done
	const supportContact = useSelector((state: RootState) => state.supportContacts.supportContact) as any
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

	const updateOnlyOpeningHours = useRef(false)
	// TODO: remove any when BE is done
	const fetchData = async (supportContactData: any /* supportContactData: ISupportContactPayload & ILoadingAndFailure */) => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))
		const defaultContactPerson = {
			phonePrefixCountryCode
		}

		if (updateOnlyOpeningHours.current) {
			if (supportContact?.isLoading) return
			dispatch(
				change(FORM.SUPPORT_CONTACT, 'openingHoursNote', {
					note: supportContactData.data?.openingHoursNote?.note,
					noteFrom: supportContactData.data?.openingHoursNote?.validFrom,
					noteTo: supportContactData.data?.openingHoursNote?.validTo
				})
			)
			updateOnlyOpeningHours.current = false
		} else if (!isEmpty(supportContactData.data)) {
			// init data for existing supportContact
			const openOverWeekend: boolean = checkWeekend(supportContactData.data?.openingHours)
			const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(supportContactData.data?.openingHours)
			const openingHours: OpeningHours = initOpeningHours(supportContactData.data?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(
				orderDaysInWeek
			) as OpeningHours

			dispatch(
				initialize(FORM.SUPPORT_CONTACT, {
					...supportContactData.data,
					openOverWeekend,
					sameOpenHoursOverWeek,
					openingHours,
					note: supportContactData.data?.openingHoursNote?.note,
					noteFrom: supportContactData.data?.openingHoursNote?.validFrom,
					noteTo: supportContactData.data?.openingHoursNote?.validTo,
					latitude: supportContactData.data?.address?.latitude,
					longitude: supportContactData.data?.address?.longitude,
					city: supportContactData.data?.address?.city,
					street: supportContactData.data?.address?.street,
					zipCode: supportContactData.data?.address?.zipCode,
					country: supportContactData.data?.address?.countryCode,
					streetNumber: supportContactData.data?.address?.streetNumber
				})
			)
		} else if (!supportContact?.isLoading) {
			// init data for new "creating process" supportContact
			dispatch(
				initialize(FORM.SUPPORT_CONTACT, {
					openOverWeekend: false,
					sameOpenHoursOverWeek: true,
					openingHours: initOpeningHours(supportContactData.data?.openingHours, true, false),
					payByCard: false,
					phonePrefixCountryCode,
					isInvoiceAddressSame: true,
					companyContactPerson: defaultContactPerson
				})
			)
		}
	}

	// init forms
	useEffect(() => {
		fetchData(supportContact)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supportContact])

	const handleSubmit = async (data: ISupportContactForm) => {
		try {
			setSubmitting(true)
			const openingHours: OpeningHours = createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			const supportContactData: SupportContactPatch = {
				openingHours: openingHours || [],
				city: data.city,
				countryCode: data.country,
				latitude: data.latitude,
				longitude: data.longitude,
				street: data.street,
				zipCode: data.zipCode,
				phonePrefixCountryCode: data.phonePrefixCountryCode,
				phone: data.phone,
				email: data.email
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
				name: t('loc:Detail kontaktu'),
				titleName: get(supportContact, 'data.supportContact.country.name') || ''
		  }
		: {
				name: t('loc:Vytvoriť kontakt'),
				link: t('paths:support-contacts/create')
		  }

	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam kontaktných informácií'),
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

	const onOpenHoursNoteModalClose = () => {
		updateOnlyOpeningHours.current = true
		setVisible(false)
		dispatch(supportContact(supportContactID))
	}

	const supportContactExists = supportContactID > 0

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body small mt-2'>
					<SupportContactForm onSubmit={handleSubmit} openNoteModal={() => setVisible(true)} supportContactID={supportContactID} disabledForm={deletedSupportContact} />
					{supportContactExists && (
						<OpenHoursNoteModal
							visible={visible}
							salonID={supportContact?.data?.id || 0}
							openingHoursNote={supportContact?.data?.openingHoursNote}
							onClose={onOpenHoursNoteModalClose}
						/>
					)}

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
										disabled={submitting || deletedSupportContact || isFormPristine}
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
