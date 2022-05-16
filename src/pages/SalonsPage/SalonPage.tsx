import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { change, initialize, submit } from 'redux-form'
import { get, isEmpty, map, unionBy } from 'lodash'
import { compose } from 'redux'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonForm from './components/SalonForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'

// enums
import { DAY, FORM, LANGUAGE, MONDAY_TO_FRIDAY, NOTIFICATION_TYPE, PERMISSION, ENUMERATIONS_KEYS } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { emptySalon, getSalon, ISalonPayload } from '../../reducers/salons/salonsActions'

// types
import { IBreadcrumbs, IComputedMatch, ILoadingAndFailure } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'

type Props = {
	computedMatch: IComputedMatch<{ salonID: number }>
}

const editPermissions: PERMISSION[] = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.SALON_EDIT, PERMISSION.PARTNER]
// TODO - check how to get nested interface
type OpeningHours = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours']
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

const SalonPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { computedMatch } = props
	const { salonID } = computedMatch.params
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const [visible, setVisible] = useState<boolean>(false)

	const salon = useSelector((state: RootState) => state.salons.salon)
	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)
	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend

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
			const openingHours: OpeningHours = initOpeningHours(salon.data?.salon?.openingHours, sameOpenHoursOverWeekFormValue, false)?.sort(orderDaysInWeek)
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

	useEffect(() => {
		if (salonID > 0) {
			// updating existing salon
			dispatch(getSalon(salonID))
		} else {
			// creating new salon clear salon store
			dispatch(emptySalon())
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salonID])

	const updateOnlyOpeningHours = useRef(false)
	const fetchData = async (salonData: ISalonPayload & ILoadingAndFailure) => {
		if (updateOnlyOpeningHours.current) {
			if (salon?.isLoading) return
			dispatch(
				change(FORM.SALON, 'openingHoursNote', {
					note: salonData.data?.salon?.openingHoursNote?.note,
					noteFrom: salonData.data?.salon?.openingHoursNote?.validFrom,
					noteTo: salonData.data?.salon?.openingHoursNote?.validTo
				})
			)
			updateOnlyOpeningHours.current = false
		} else if (!isEmpty(salonData.data)) {
			// init data for existing salon
			const openOverWeekend: boolean = checkWeekend(salonData.data?.salon?.openingHours)
			const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(salonData.data?.salon?.openingHours)
			const openingHours: OpeningHours = initOpeningHours(salonData.data?.salon?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			dispatch(
				initialize(FORM.SALON, {
					...salonData.data?.salon,
					openOverWeekend,
					sameOpenHoursOverWeek,
					openingHours,
					note: salonData.data?.salon?.openingHoursNote?.note,
					noteFrom: salonData.data?.salon?.openingHoursNote?.validFrom,
					noteTo: salonData.data?.salon?.openingHoursNote?.validTo,
					latitude: salonData.data?.salon?.address?.latitude,
					longitude: salonData.data?.salon?.address?.longitude,
					city: salonData.data?.salon?.address?.city,
					street: salonData.data?.salon?.address?.street,
					zipCode: salonData.data?.salon?.address?.zipCode,
					country: salonData.data?.salon?.address?.countryCode,
					gallery: map(salonData.data?.salon?.images, (image: any) => ({ url: image?.original, uid: image?.id })),
					logo: salonData.data?.salon?.logo?.id ? [{ url: salonData.data?.salon?.logo?.original, uid: salonData.data?.salon?.logo?.id }] : null,
					userID: { label: salonData.data?.salon?.user?.name || salonData.data?.salon?.user?.email, value: salonData.data?.salon?.user?.id }
				})
			)
		} else if (!salon?.isLoading) {
			const phonePrefixCountryCode = getPrefixCountryCode(
				map(phonePrefixes?.data, (item) => item.code),
				LANGUAGE.SK.toUpperCase()
			)
			// init data for new "creating process" salon
			dispatch(
				initialize(FORM.SALON, {
					openOverWeekend: false,
					sameOpenHoursOverWeek: true,
					openingHours: initOpeningHours(salonData.data?.salon?.openingHours, true, false),
					isVisible: true,
					payByCard: false,
					phonePrefixCountryCode
				})
			)
		}
	}

	// init forms
	useEffect(() => {
		fetchData(salon)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salon])

	const handleSubmit = async (data: any) => {
		try {
			setSubmitting(true)
			const openingHours: OpeningHours = createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			const salonData: SalonPatch = {
				imageIDs: map(data.gallery, (image) => image?.id ?? image?.uid),
				logoID: map(data.logo, (image) => image?.id ?? image?.uid)[0] ?? null,
				name: data.name,
				openingHours,
				aboutUsFirst: data.aboutUsFirst,
				aboutUsSecond: data.aboutUsSecond,
				...data.address,
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
				userID: data?.user?.id || data?.userID?.value || authUser?.data?.id
			}
			if (salonID > 0) {
				// update existing salon
				await patchReq('/api/b2b/admin/salons/{salonID}', { salonID: data?.id }, salonData)
				dispatch(getSalon(salonID))
			} else {
				// create new salon
				const result = await postReq('/api/b2b/admin/salons/', undefined, salonData)
				if (result?.data?.salon?.id) {
					history.push(t('paths:salons/{{salonID}}', { salonID: result?.data?.salon?.id }))
				}
			}
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
		}
	}

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: [
			{
				name: t('loc:Zoznam salónov'),
				link: t('paths:salons')
			},
			get(salon, 'data.salon.name')
				? {
						name: t('loc:Detail salónu'),
						titleName: get(salon, 'data.salon.name')
				  }
				: {
						name: t('loc:Vytvoriť salón'),
						link: t('paths:salons/create')
				  }
		]
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
			dispatch(getSalon(salonID))
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
			dispatch(getSalon(salonID))
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
		dispatch(getSalon(salonID))
	}

	const salonExists = salonID > 0

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:salons')} />
			</Row>
			<div className='content-body small'>
				<Permissions
					allowed={[PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN]}
					render={(hasPermission) => (
						<SalonForm
							isAdmin={hasPermission}
							onSubmit={handleSubmit}
							openNoteModal={() => setVisible(true)}
							changeSalonVisibility={changeVisibility}
							publishSalon={publishSalon}
							switchDisabled={submitting}
							salonID={salonID}
						/>
					)}
				/>
				{salonExists && (
					<OpenHoursNoteModal
						visible={visible}
						salonID={salon?.data?.salon?.id || 0}
						openingHoursNote={salon?.data?.salon?.openingHoursNote}
						onClose={onOpenHoursNoteModalClose}
					/>
				)}

				<div className={'content-footer'}>
					<Row className={`${salonExists ? 'justify-between' : 'justify-center'} w-full`}>
						{salonExists && (
							<DeleteButton
								permissions={editPermissions}
								className={'w-1/3'}
								onConfirm={deleteSalon}
								entityName={t('loc:salón')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						)}
						<Permissions
							allowed={editPermissions}
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
									disabled={submitting}
									loading={submitting}
								>
									{t('loc:Uložiť')}
								</Button>
							)}
						/>
					</Row>
				</div>
			</div>
		</>
	)
}

export default compose(withPermissions(editPermissions))(SalonPage)
