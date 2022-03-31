import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Row } from 'antd'
import { change, initialize, submit } from 'redux-form'
import { get, isEmpty, unionBy, remove, map } from 'lodash'
import cx from 'classnames'
import { compose } from 'redux'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonForm from './components/SalonForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'

// enums
import { DAY, FORM, getTranslatedCountriesLabels, MONDAY_TO_FRIDAY, MSG_TYPE, NOTIFICATION_TYPE, PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { emptySalon, getSalon } from '../../reducers/salons/salonsActions'

// types
import { IBreadcrumbs, IComputedMatch } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq } from '../../utils/request'
import { history } from '../../utils/history'
import { checkPermissions, withPermissions } from '../../utils/Permissions'
import showNotifications from '../../utils/tsxHelpers'

type Props = {
	computedMatch: IComputedMatch<{ salonID: number }>
}

const editPermissions: PERMISSION[] = [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.PARTNER, PERMISSION.SALON_EDIT]
// TODO - check how to get nested interface
type IOpeningHours = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours']
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
type ITimeRanges = Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHours'][0]['timeRanges']

type SalonPatch = Paths.PatchApiB2BAdminSalonsSalonId.RequestBody

const week: IOpeningHours = [
	{ day: DAY.MONDAY, timeRanges: [] as never },
	{ day: DAY.TUESDAY, timeRanges: [] as never },
	{ day: DAY.WEDNESDAY, timeRanges: [] as never },
	{ day: DAY.THURSDAY, timeRanges: [] as never },
	{ day: DAY.FRIDAY, timeRanges: [] as never }
]

const SalonPage: FC<Props> = (props) => {
	const [t] = useTranslation()
	const { computedMatch } = props
	const { salonID } = computedMatch.params
	const dispatch = useDispatch()
	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const authUser = useSelector((state: RootState) => state.user.authUser)
	const authUserPermissions = authUser?.data?.uniqPermissions || []
	const [visible, setVisible] = useState<boolean>(false)

	const showDeleteBtn: boolean = checkPermissions(authUserPermissions, editPermissions)

	const salon = useSelector((state: RootState) => state.salons.salon)
	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)
	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend

	// create options for filed array based on length of week
	const initOpeningHours = (openingHours: IOpeningHours | undefined, sameOpenHoursOverWeek: boolean, openOverWeekend: boolean): IOpeningHours => {
		let workWeek: IOpeningHours = [...week]
		if (openOverWeekend) {
			// add weekend days
			workWeek = [...week, { day: DAY.SATURDAY, timeRanges: [] as never }, { day: DAY.SUNDAY, timeRanges: [] as never }]
			workWeek = unionBy(openingHours, workWeek, 'day') as IOpeningHours
		} else {
			// remove weekend days
			workWeek = unionBy(
				openingHours?.filter((openingHour) => openingHour?.day !== DAY.SUNDAY && openingHour?.day !== DAY.SATURDAY),
				workWeek,
				'day'
			) as IOpeningHours
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
			) as IOpeningHours
			// add monday to friday field
			workWeek?.splice(0, 0, {
				day: MONDAY_TO_FRIDAY as DAY,
				timeRanges: openingHours?.[0]?.timeRanges as any
			})
		}
		return workWeek
	}

	const checkWeekend = (openingHours: IOpeningHours | undefined): boolean => {
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

	const getDayTimeRanges = (openingHours: IOpeningHours, day?: DAY) => {
		let timeRanges: ITimeRanges | [] = []
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
			const openingHours: IOpeningHours = initOpeningHours(salon.data?.salon?.openingHours, sameOpenHoursOverWeekFormValue, false)
			if (openOverWeekendFormValue) {
				dispatch(
					change(FORM.SALON, 'openingHours', [
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						...openingHours,
						{ day: DAY.SATURDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SATURDAY) },
						{ day: DAY.SUNDAY, timeRanges: getDayTimeRanges(formValues?.openingHours, DAY.SUNDAY) }
					])
				)
			} else {
				dispatch(change(FORM.SALON, 'openingHours', openingHours))
			}
		}
	}, [dispatch, sameOpenHoursOverWeekFormValue])

	useEffect(() => {
		if (!isEmpty(formValues) && formValues?.openingHours && formValues?.openingHours.length > 0) {
			if (openOverWeekendFormValue) {
				// if check open over weekend add saturday and sunday
				dispatch(
					change(FORM.SALON, 'openingHours', [
						...formValues.openingHours,
						// check if weekend open hours exist
						{ day: DAY.SATURDAY, timeRanges: checkWeekend(salon.data?.salon?.openingHours) ? getDayTimeRanges(salon.data?.salon?.openingHours, DAY.SATURDAY) : [] },
						{ day: DAY.SUNDAY, timeRanges: checkWeekend(salon.data?.salon?.openingHours) ? getDayTimeRanges(salon.data?.salon?.openingHours, DAY.SUNDAY) : [] }
					])
				)
			} else {
				// remove weekend days from field array
				const newValues = remove(formValues.openingHours, (openingHour: any) => openingHour?.day !== DAY.SATURDAY && openingHour.day !== DAY.SUNDAY)
				dispatch(change(FORM.SALON, 'openingHours', newValues))
			}
		}
	}, [dispatch, openOverWeekendFormValue])

	useEffect(() => {
		if (salonID > 0) {
			// updating existing salon
			dispatch(getSalon(salonID))
		} else {
			// creating new salon clear salon store
			dispatch(emptySalon())
		}
	}, [dispatch, salonID])

	const equals = (ref: ITimeRanges, comp: ITimeRanges): boolean => JSON.stringify(ref) === JSON.stringify(comp)

	const checkSameOpeningHours = (openingHours: IOpeningHours | undefined): boolean => {
		if (openingHours) {
			const checks: boolean[] = []
			let referenceTimeRanges: ITimeRanges
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

	// init forms
	useEffect(() => {
		if (!isEmpty(salon.data)) {
			// init data for existing salon
			const openOverWeekend: boolean = checkWeekend(salon.data?.salon?.openingHours)
			const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(salon.data?.salon?.openingHours)
			const countriesLabels = getTranslatedCountriesLabels()
			dispatch(
				initialize(FORM.SALON, {
					...salon.data?.salon,
					openOverWeekend,
					sameOpenHoursOverWeek,
					openingHours: initOpeningHours(salon.data?.salon?.openingHours, sameOpenHoursOverWeek, openOverWeekend),
					note: salon.data?.salon?.openingHoursNote?.note,
					noteFrom: salon.data?.salon?.openingHoursNote?.validFrom,
					noteTo: salon.data?.salon?.openingHoursNote?.validTo,
					latitude: salon.data?.salon?.address?.latitude,
					longitude: salon.data?.salon?.address?.longitude,
					city: salon.data?.salon?.address?.city,
					street: salon.data?.salon?.address?.street,
					zip: salon.data?.salon?.address?.zipCode,
					country: countriesLabels?.[salon.data?.salon?.address?.countryCode || ''] || salon.data?.salon?.address?.countryCode,
					gallery: map(salon.data?.salon?.images, (image: any) => ({ url: image?.original, uid: image?.id })),
					logo: [{ url: salon.data?.salon?.logo?.original, uid: salon.data?.salon?.logo?.id }]
				})
			)
		} else {
			// init data for new "creating process" salon
			dispatch(
				initialize(FORM.SALON, {
					openOverWeekend: false,
					sameOpenHoursOverWeek: true,
					openingHours: initOpeningHours(salon.data?.salon?.openingHours, true, false),
					isVisible: true
				})
			)
		}
	}, [salon, dispatch])

	const createSameOpeningHours = (openingHours: IOpeningHours, sameOpenHoursOverWeek: boolean, openOverWeekend: boolean) => {
		if (sameOpenHoursOverWeek && openingHours) {
			const result: IOpeningHours = [] as any
			week.forEach((day) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				result.push({
					day: day?.day,
					timeRanges: openingHours?.[0]?.timeRanges || ([] as any)
				})
			})
			if (openOverWeekend) {
				// add weekend
				openingHours.forEach((openingHour) => {
					if (openingHour.day === DAY.SUNDAY || openingHour.day === DAY.SATURDAY) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						result.push({
							day: openingHour.day,
							timeRanges: openingHour.timeRanges
						})
					}
				})
			}
			return result
		}
		return openingHours
	}

	const handleSubmit = async (data: any) => {
		try {
			setSubmitting(true)
			const salonData: SalonPatch = {
				imageIDs: map(data.gallery, (image) => image.id ?? image.uid),
				logoID: map(data.logo, (image) => image.id ?? image.uid)[0],
				name: data.name,
				openingHours: createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend),
				aboutUsFirst: data.aboutUsFirst,
				aboutUsSecond: data.aboutUsSecond,
				...data.address,
				phonePrefixCountryCode: data.phonePrefixCountryCode,
				phone: data.phone,
				email: data.email,
				socialLinkFB: data.socialLinkFB,
				socialLinkInstagram: data.socialLinkInstagram,
				socialLinkWebPage: data.socialLinkWebPage,
				payByCard: data.payByCard,
				otherPaymentMethods: data.otherPaymentMethods,
				userID: data?.user.id
			}
			await patchReq('/api/b2b/admin/salons/{salonID}', { salonID: data?.id }, salonData)
			dispatch(getSalon(salonID))
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
			{
				name: t('loc:Detail salónu'),
				titleName: get(salon, 'data.salon.name')
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

	const hideClass = cx({
		hidden: !salonID
	})

	const rowClass = cx({
		'justify-between': showDeleteBtn,
		'justify-center': !showDeleteBtn
	})

	return (
		<>
			<Row className={hideClass}>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:salons')} />
			</Row>
			<div className='content-body medium'>
				<SalonForm onSubmit={handleSubmit} openNoteModal={() => setVisible(true)} />
				<OpenHoursNoteModal
					visible={visible}
					salonID={salon?.data?.salon?.id || 0}
					openingHoursNote={salon?.data?.salon?.openingHoursNote}
					onClose={() => setVisible(false)}
				/>
				<div className={'content-footer'}>
					<Row className={`${rowClass} w-full`}>
						{showDeleteBtn ? (
							<DeleteButton
								className={'w-1/3'}
								onConfirm={deleteSalon}
								entityName={t('loc:salón')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							/>
						) : undefined}
						<Button
							type={'primary'}
							block
							size={'middle'}
							className={'noti-btn m-regular w-1/3'}
							htmlType={'submit'}
							onClick={() => {
								if (checkPermissions(authUserPermissions, editPermissions)) {
									dispatch(submit(FORM.SALON))
								} else {
									showNotifications([{ type: MSG_TYPE.ERROR, message: t('loc:Pre túto akciu nemáte dostatočné oprávnenia!') }], NOTIFICATION_TYPE.NOTIFICATION)
								}
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

export default compose(withPermissions([...editPermissions, PERMISSION.SALON_BROWSING]))(SalonPage)
