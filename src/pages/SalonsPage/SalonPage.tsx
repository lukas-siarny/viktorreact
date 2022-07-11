import React, { FC, useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row, Spin } from 'antd'
import { change, initialize, isPristine, submit } from 'redux-form'
import { get, isEmpty, map, unionBy } from 'lodash'
import { compose } from 'redux'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonForm from './components/SalonForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'
import { scrollToTopFn } from '../../components/ScrollToTop'

// enums
import { DAY, ENUMERATIONS_KEYS, FORM, MONDAY_TO_FRIDAY, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'
import { ISelectedSalonPayload, selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, SalonSubPageProps, ILoadingAndFailure, ISalonForm, OpeningHours } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { withPermissions, checkPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type TimeRanges = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours'][0]['timeRanges']
type SalonPatch = Paths.PatchApiB2BAdminSalonsSalonId.RequestBody

const week: OpeningHours = [
	{ day: DAY.MONDAY, timeRanges: [] as never },
	{ day: DAY.TUESDAY, timeRanges: [] as never },
	{ day: DAY.WEDNESDAY, timeRanges: [] as never },
	{ day: DAY.THURSDAY, timeRanges: [] as never },
	{ day: DAY.FRIDAY, timeRanges: [] as never }
]

const daysOrderMap: any = {
	[MONDAY_TO_FRIDAY]: 0,
	[DAY.MONDAY]: 1,
	[DAY.TUESDAY]: 2,
	[DAY.WEDNESDAY]: 3,
	[DAY.THURSDAY]: 4,
	[DAY.FRIDAY]: 5,
	[DAY.SATURDAY]: 6,
	[DAY.SUNDAY]: 7
}

const orderDaysInWeek = (a: any, b: any) => {
	return daysOrderMap[a?.day] - daysOrderMap[b?.day]
}

// create options for filed array based on length of week
const initOpeningHours = (openingHours: OpeningHours | undefined, sameOpenHoursOverWeek: boolean, openOverWeekend: boolean): OpeningHours => {
	let workWeek: OpeningHours = [...week]
	if (openOverWeekend) {
		// add weekend days
		workWeek = [...week, { day: DAY.SATURDAY, timeRanges: [] as never }, { day: DAY.SUNDAY, timeRanges: [] as never }]
		workWeek = unionBy(openingHours, workWeek, 'day') as OpeningHours
	} else {
		// remove weekend days
		workWeek = unionBy(
			openingHours?.filter((openingHour) => openingHour?.day !== DAY.SUNDAY && openingHour?.day !== DAY.SATURDAY),
			workWeek,
			'day'
		) as OpeningHours
	}
	if (sameOpenHoursOverWeek) {
		// filter all work days
		workWeek = workWeek?.filter(
			(openingHour) =>
				openingHour.day !== DAY.MONDAY &&
				openingHour.day !== DAY.TUESDAY &&
				openingHour.day !== DAY.WEDNESDAY &&
				openingHour.day !== DAY.THURSDAY &&
				openingHour.day !== DAY.FRIDAY
		) as OpeningHours
		// add monday to friday field
		workWeek?.splice(0, 0, {
			day: MONDAY_TO_FRIDAY as DAY,
			timeRanges: openingHours?.[0]?.timeRanges as any
		})
	}
	return workWeek
}

const checkWeekend = (openingHours: OpeningHours | undefined): boolean => {
	let result = false
	if (openingHours) {
		// eslint-disable-next-line consistent-return
		openingHours.forEach((openingHour) => {
			if (openingHour.day === DAY.SATURDAY || openingHour.day === DAY.SUNDAY) {
				result = true
			}
		})
	}
	return result
}

const getDayTimeRanges = (openingHours: OpeningHours, day?: DAY) => {
	let timeRanges: TimeRanges | [] = []
	if (openingHours) {
		// eslint-disable-next-line consistent-return,no-restricted-syntax
		for (const openingHour of openingHours) {
			if (day && openingHour.day === day) {
				timeRanges = openingHour.timeRanges
				break
			} else if (!isEmpty(openingHour.timeRanges) && !isEmpty(openingHour.timeRanges[0]) && isEmpty(day)) {
				timeRanges = openingHour.timeRanges
				break
			}
		}
	}
	return timeRanges
}

const equals = (ref: TimeRanges, comp: TimeRanges): boolean => JSON.stringify(ref) === JSON.stringify(comp)

const checkSameOpeningHours = (openingHours: OpeningHours | undefined): boolean => {
	if (openingHours) {
		const checks: boolean[] = []
		let referenceTimeRanges: TimeRanges
		openingHours.forEach((openingHour, index) => {
			if (openingHour?.day !== DAY.SUNDAY && openingHour?.day !== DAY.SATURDAY) {
				// take reference
				if (index === 0) {
					referenceTimeRanges = openingHour.timeRanges
				} else {
					checks.push(equals(referenceTimeRanges, openingHour.timeRanges))
				}
			}
		})
		if (!isEmpty(checks) && checks.every((value) => value)) {
			return true
		}
	}
	return false
}

const createSameOpeningHours = (openingHours: OpeningHours, sameOpenHoursOverWeek: boolean, openOverWeekend: boolean) => {
	if (sameOpenHoursOverWeek && openingHours) {
		const result: OpeningHours = [] as any
		week.forEach((day) => {
			result?.push({
				day: day?.day,
				timeRanges: openingHours?.[0]?.timeRanges || ([] as any)
			})
		})
		if (openOverWeekend) {
			// add weekend
			openingHours.forEach((openingHour) => {
				if (openingHour.day === DAY.SUNDAY || openingHour.day === DAY.SATURDAY) {
					result?.push({
						day: openingHour.day,
						timeRanges: openingHour.timeRanges
					})
				}
			})
		}
		return result?.filter((openingHour) => openingHour?.timeRanges?.length > 0)
	}
	return openingHours?.filter((openingHour) => openingHour?.timeRanges?.length > 0)
}

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const SalonPage: FC<SalonSubPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()

	const { salonID } = props

	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)
	const isFormPristine = useSelector(isPristine(FORM.SALON))

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend
	const deletedSalon = !!(salon?.data?.deletedAt && salon?.data?.deletedAt !== null)

	const isLoading = salon.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving

	// check permissions for submit in case of create or update salon
	const submitPermissions = salonID > 0 ? [SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE] : permissions

	const isAdmin = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]), [authUser])

	useEffect(() => {
		if (sameOpenHoursOverWeekFormValue) {
			if (openOverWeekendFormValue) {
				// set switch same open hours over week with weekend
				dispatch(
					change(FORM.SALON, 'openingHours', [
						{ day: MONDAY_TO_FRIDAY, timeRanges: getDayTimeRanges(formValues?.openingHours) },
						{ day: DAY.SATURDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SATURDAY) },
						{ day: DAY.SUNDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SUNDAY) }
					])
				)
			} else {
				// set switch same open hours over week without weekend
				dispatch(change(FORM.SALON, 'openingHours', [{ day: MONDAY_TO_FRIDAY, timeRanges: getDayTimeRanges(formValues?.openingHours) }]))
			}
		} else {
			// set to init values
			// in initOpeningHours function input openOverWeekend is set to false because also we need to get weekend time Ranges
			const openingHours: OpeningHours = initOpeningHours(salon.data?.openingHours, sameOpenHoursOverWeekFormValue, false)?.sort(orderDaysInWeek)
			if (openOverWeekendFormValue && openingHours) {
				const updatedOpeningHours = unionBy(
					[
						{ day: DAY.SATURDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SATURDAY) },
						{ day: DAY.SUNDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SUNDAY) }
					],
					openingHours,
					'day'
				)?.sort(orderDaysInWeek)
				dispatch(change(FORM.SALON, 'openingHours', updatedOpeningHours))
			} else {
				dispatch(change(FORM.SALON, 'openingHours', openingHours?.sort(orderDaysInWeek)))
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sameOpenHoursOverWeekFormValue, openOverWeekendFormValue])

	const updateOnlyOpeningHours = useRef(false)
	const fetchData = async (salonData: ISelectedSalonPayload & ILoadingAndFailure) => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))
		const defaultContactPerson = {
			phonePrefixCountryCode
		}

		if (updateOnlyOpeningHours.current) {
			if (salon?.isLoading) return
			dispatch(
				change(FORM.SALON, 'openingHoursNote', {
					note: salonData.data?.openingHoursNote?.note,
					noteFrom: salonData.data?.openingHoursNote?.validFrom,
					noteTo: salonData.data?.openingHoursNote?.validTo
				})
			)
			updateOnlyOpeningHours.current = false
		} else if (!isEmpty(salonData.data)) {
			// init data for existing salon
			const openOverWeekend: boolean = checkWeekend(salonData.data?.openingHours)
			const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(salonData.data?.openingHours)
			const openingHours: OpeningHours = initOpeningHours(salonData.data?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours

			dispatch(
				initialize(FORM.SALON, {
					...salonData.data,
					openOverWeekend,
					sameOpenHoursOverWeek,
					openingHours,
					note: salonData.data?.openingHoursNote?.note,
					noteFrom: salonData.data?.openingHoursNote?.validFrom,
					noteTo: salonData.data?.openingHoursNote?.validTo,
					latitude: salonData.data?.address?.latitude,
					longitude: salonData.data?.address?.longitude,
					city: salonData.data?.address?.city,
					street: salonData.data?.address?.street,
					zipCode: salonData.data?.address?.zipCode,
					country: salonData.data?.address?.countryCode,
					streetNumber: salonData.data?.address?.streetNumber,
					companyContactPerson: salonData.data?.companyContactPerson || defaultContactPerson,
					companyInfo: salonData.data?.companyInfo,
					gallery: map(salonData.data?.images, (image: any) => ({ url: image?.original, uid: image?.id })),
					logo: salonData.data?.logo?.id ? [{ url: salonData.data?.logo?.original, uid: salonData.data?.logo?.id }] : null
				})
			)
		} else if (!salon?.isLoading) {
			// init data for new "creating process" salon
			dispatch(
				initialize(FORM.SALON, {
					openOverWeekend: false,
					sameOpenHoursOverWeek: true,
					openingHours: initOpeningHours(salonData.data?.openingHours, true, false),
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
		fetchData(salon)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salon])

	const handleSubmit = async (data: ISalonForm) => {
		try {
			setSubmitting(true)
			const openingHours: OpeningHours = createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			const salonData: SalonPatch = {
				imageIDs: data.gallery.map((image) => image?.id ?? image?.uid) as Paths.PatchApiB2BAdminSalonsSalonId.RequestBody['imageIDs'],
				logoID: map(data.logo, (image) => image?.id ?? image?.uid)[0] ?? null,
				name: data.name,
				openingHours: openingHours || [],
				aboutUsFirst: data.aboutUsFirst,
				aboutUsSecond: data.aboutUsSecond,
				// ...data.address,
				city: data.city,
				countryCode: data.country,
				latitude: data.latitude,
				longitude: data.longitude,
				street: data.street,
				zipCode: data.zipCode,
				phonePrefixCountryCode: data.phonePrefixCountryCode,
				phone: data.phone,
				email: data.email,
				socialLinkFB: data.socialLinkFB,
				socialLinkInstagram: data.socialLinkInstagram,
				socialLinkWebPage: data.socialLinkWebPage,
				payByCard: data.payByCard,
				otherPaymentMethods: data.otherPaymentMethods,
				companyContactPerson: data.companyContactPerson,
				companyInfo: data.companyInfo
			}

			if (salonID > 0) {
				// update existing salon
				await patchReq('/api/b2b/admin/salons/{salonID}', { salonID }, salonData)
				dispatch(selectSalon(salonID))
			} else {
				// create new salon
				const result = await postReq('/api/b2b/admin/salons/', undefined, salonData)
				if (result?.data?.salon?.id) {
					// load new salon for current user
					await dispatch(getCurrentUser())
					// select new salon
					await dispatch(selectSalon(result.data.salon.id))
					history.push(t('paths:salons/{{salonID}}', { salonID: result.data.salon.id }))
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

	const breadcrumbDetailItem = get(salon, 'data.name')
		? {
				name: t('loc:Detail salónu'),
				titleName: get(salon, 'data.name')
		  }
		: {
				name: t('loc:Vytvoriť salón'),
				link: t('paths:salons/create')
		  }

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: isAdmin
			? [
					{
						name: t('loc:Zoznam salónov'),
						link: t('paths:salons')
					},
					breadcrumbDetailItem
			  ]
			: [breadcrumbDetailItem]
	}

	const deleteSalon = async () => {
		if (isRemoving) {
			return
		}
		try {
			setIsRemoving(true)
			await deleteReq('/api/b2b/admin/salons/{salonID}', { salonID }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			history.push(t('paths:salons'))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsRemoving(false)
		}
	}

	const publishSalon = async (published: boolean) => {
		if (submitting) {
			return
		}

		setSubmitting(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/publish', { salonID }, { publish: published })
			dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	const changeVisibility = async (isVisible: boolean) => {
		if (submitting) {
			return
		}

		setSubmitting(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/visible', { salonID }, { visible: isVisible })
			dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	const onOpenHoursNoteModalClose = () => {
		updateOnlyOpeningHours.current = true
		setVisible(false)
		dispatch(selectSalon(salonID))
	}
	const salonExists = salonID > 0

	console.log(salonID, salonExists)
	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body small mt-2'>
					<SalonForm
						onSubmit={handleSubmit}
						openNoteModal={() => {
							console.log('openNoteModal', visible)
							setVisible(true)
						}}
						changeSalonVisibility={changeVisibility}
						publishSalon={publishSalon}
						switchDisabled={submitting}
						salonID={salonID}
						disabledForm={deletedSalon}
					/>
					<div className={'content-footer'}>
						<Row className={`${salonExists ? 'justify-between' : 'justify-center'} w-full`}>
							{salonExists && (
								<DeleteButton
									permissions={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_DELETE]}
									className={'w-1/3'}
									onConfirm={deleteSalon}
									entityName={t('loc:salón')}
									type={'default'}
									getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
									disabled={deletedSalon}
								/>
							)}
							<Permissions
								allowed={submitPermissions}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular w-1/3'}
										htmlType={'submit'}
										onClick={(e) => {
											if (hasPermission) {
												dispatch(submit(FORM.SALON))
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={submitting || deletedSalon || isFormPristine}
										loading={submitting}
									>
										{t('loc:Uložiť')}
									</Button>
								)}
							/>
						</Row>
					</div>
				</div>
				{salonExists && <OpenHoursNoteModal visible={visible} salonID={salonID} openingHoursNote={salon.data?.openingHoursNote} onClose={onOpenHoursNoteModalClose} />}
			</Spin>
		</>
	)
}

export default compose(withPermissions(permissions))(SalonPage)
