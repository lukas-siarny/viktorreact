import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button, Modal, Row, Spin } from 'antd'
import { change, initialize, isPristine, reset, submit } from 'redux-form'
import { get, isEmpty, map, unionBy } from 'lodash'
import { compose } from 'redux'
import cx from 'classnames'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonForm from './components/SalonForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'
import { scrollToTopFn } from '../../components/ScrollToTop'
import NoteForm from './components/NoteForm'

// enums
import { DAY, ENUMERATIONS_KEYS, FORM, MONDAY_TO_FRIDAY, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'
import { ISalonPayloadData, selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'

// types
import { IBreadcrumbs, INoteForm, INoteModal, ISalonForm, OpeningHours, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { checkPermissions, withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

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
	const [isSendingConfRequest, setIsSendingConfRequest] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)
	const [visible, setVisible] = useState<boolean>(false)
	const [modalConfig, setModalConfig] = useState<INoteModal>({ title: '', fieldPlaceholderText: '', onSubmit: undefined, visible: false })

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)
	const isFormPristine = useSelector(isPristine(FORM.SALON))

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend
	const deletedSalon = !!(salon?.data?.deletedAt && salon?.data?.deletedAt !== null)

	const isLoading = salon.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving || isSendingConfRequest
	const salonExists = salonID > 0
	// TODO - for development purpose
	const hasSalonPublishedVersion = !!salon.data?.publishedSalonData
	const pendingPublication = salon.data?.pendingPublication

	// check permissions for submit in case of create or update salon
	const submitPermissions = salonID > 0 ? [SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE] : permissions
	const deletePermissions = [...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_DELETE]

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
				dispatch(
					change(FORM.SALON, 'openingHours', [
						{
							day: MONDAY_TO_FRIDAY,
							timeRanges: getDayTimeRanges(formValues?.openingHours)
						}
					])
				)
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
	const fetchData = async (salonData: ISalonPayloadData | null) => {
		const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))
		const defaultContactPerson = {
			phonePrefixCountryCode
		}

		if (updateOnlyOpeningHours.current) {
			if (salon?.isLoading) return
			dispatch(
				change(FORM.SALON, 'openingHoursNote', {
					note: salonData?.openingHoursNote?.note,
					noteFrom: salonData?.openingHoursNote?.validFrom,
					noteTo: salonData?.openingHoursNote?.validTo
				})
			)
			updateOnlyOpeningHours.current = false
		} else if (!isEmpty(salonData)) {
			// init data for existing salon
			const openOverWeekend: boolean = checkWeekend(salonData?.openingHours)
			const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(salonData?.openingHours)
			const openingHours: OpeningHours = initOpeningHours(salonData?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			let initData: any = {
				...salonData,
				openOverWeekend,
				sameOpenHoursOverWeek,
				openingHours,
				note: salonData?.openingHoursNote?.note,
				noteFrom: salonData?.openingHoursNote?.validFrom,
				noteTo: salonData?.openingHoursNote?.validTo,
				latitude: salonData?.address?.latitude,
				longitude: salonData?.address?.longitude,
				city: salonData?.address?.city,
				street: salonData?.address?.street,
				zipCode: salonData?.address?.zipCode,
				country: salonData?.address?.countryCode,
				streetNumber: salonData?.address?.streetNumber,
				description: salonData?.address?.description,
				companyContactPerson: salonData?.companyContactPerson || defaultContactPerson,
				companyInfo: salonData?.companyInfo,
				gallery: map(salonData?.images, (image) => ({ url: image?.resizedImages?.thumbnail, uid: image?.id })),
				logo: salonData?.logo?.id
					? [
							{
								url: salonData?.logo?.original,
								uid: salonData?.logo?.id
							}
					  ]
					: null
			}

			if (salonData?.publishedSalonData) {
				initData = {
					...initData,
					publishedSalonData: {
						...salonData.publishedSalonData,
						gallery: map(salonData.publishedSalonData?.images, (image) => ({ url: image?.resizedImages?.thumbnail, uid: image?.id }))
					}
				}
			}

			dispatch(initialize(FORM.SALON, initData))
		} else if (!salon?.isLoading) {
			// init data for new "creating process" salon
			dispatch(
				initialize(FORM.SALON, {
					openOverWeekend: false,
					sameOpenHoursOverWeek: true,
					openingHours: initOpeningHours(salonData?.openingHours, true, false),
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
		fetchData(salon.data)
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
				description: data.description,
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

	const breadcrumbDetailItem = get(salon, 'data.salon.name')
		? {
				name: t('loc:Detail salónu'),
				titleName: get(salon, 'data.salon.name')
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

	const unPublishSalon = async (formData: INoteForm) => {
		if (submitting) {
			return
		}

		setSubmitting(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/unpublish', { salonID }, { reason: formData.note })
			dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setModalConfig({
				title: '',
				fieldPlaceholderText: '',
				visible: false,
				onSubmit: undefined
			})
			setSubmitting(false)
		}
	}

	const sendConfirmationRequest = async () => {
		if (isSendingConfRequest) {
			return
		}

		setIsSendingConfRequest(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/request-publication', { salonID }, {})
			dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setIsSendingConfRequest(false)
		}
	}

	const resolveConfirmationRequest = async (formData?: INoteForm) => {
		if (isSendingConfRequest) {
			return
		}

		setIsSendingConfRequest(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/resolve-publication', { salonID }, { approve: !formData?.note, reason: formData?.note || undefined })
			dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			// close modal with note
			if (formData) {
				// reset form
				dispatch(reset(FORM.NOTE))
				setModalConfig({
					...modalConfig,
					visible: false
				})
			}
			setIsSendingConfRequest(false)
		}
	}

	const onOpenHoursNoteModalClose = () => {
		updateOnlyOpeningHours.current = true
		setVisible(false)
		dispatch(selectSalon(salonID))
	}

	const renderContentFooter = () => {
		// render footers for flow edit existing salon with published version
		if (hasSalonPublishedVersion) {
			return (
				<div className={'content-footer'}>
					<div className={'w-full flex'}>
						<Row className={'flex justify-start w-1/2'}>
							<DeleteButton
								permissions={deletePermissions}
								className={'ml-2 w-1/3'}
								onConfirm={deleteSalon}
								entityName={t('loc:salón')}
								type={'default'}
								getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
								disabled={deletedSalon}
							/>
							<Permissions
								allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE]}
								render={(hasPermission, { openForbiddenModal }) => (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular ml-2 w-1/3'}
										onClick={(e) => {
											if (hasPermission) {
												setModalConfig({
													title: t('loc:Skrytie salónu'),
													fieldPlaceholderText: t('loc:Sem napíšte dôvod skrytia'),
													visible: true,
													onSubmit: unPublishSalon
												})
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={submitting || deletedSalon}
										loading={submitting}
									>
										{t('loc:Skryť salón')}
									</Button>
								)}
							/>
							<Permissions allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]}>
								{pendingPublication && (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'ant-btn-dangerous noti-btn m-regular ml-2 w-1/4'}
										onClick={() =>
											setModalConfig({
												title: t('loc:Dôvod zamietnutia'),
												fieldPlaceholderText: t('loc:Sem napíšte dôvod zamietnutia'),
												visible: true,
												onSubmit: resolveConfirmationRequest
											})
										}
										disabled={submitting}
										loading={submitting}
									>
										{t('loc:Zamietnuť')}
									</Button>
								)}
							</Permissions>
						</Row>
						<Row className={cx('flex justify-end w-1/2')}>
							<Permissions allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]}>
								{pendingPublication && (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular ml-2 w-1/3'}
										onClick={() => resolveConfirmationRequest()}
										disabled={submitting}
										loading={submitting}
									>
										{t('loc:Potvrdiť')}
									</Button>
								)}
							</Permissions>
							{!pendingPublication && (
								<Button
									type={'primary'}
									block
									size={'middle'}
									className={'noti-btn m-regular ml-2 w-1/3'}
									onClick={() => sendConfirmationRequest()}
									disabled={submitting || deletedSalon}
									loading={submitting}
								>
									{t('loc:Požiadať o schválenie')}
								</Button>
							)}
							<Button
								type={'primary'}
								block
								size={'middle'}
								className={'noti-btn m-regular ml-2 w-1/3'}
								htmlType={'submit'}
								onClick={() => dispatch(submit(FORM.SALON))}
								disabled={submitting || deletedSalon || isFormPristine}
								loading={submitting}
							>
								{t('loc:Uložiť')}
							</Button>
						</Row>
					</div>
				</div>
			)
		}
		// render footer for create new salon and salon without published version
		return (
			<div className={'content-footer'}>
				<Row className={cx('flex w-full', { 'justify-between': salonExists, 'justify-center': !salonExists })}>
					{salonExists && (
						<DeleteButton
							permissions={deletePermissions}
							className={'w-1/4'}
							onConfirm={deleteSalon}
							entityName={t('loc:salón')}
							type={'default'}
							getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
							disabled={deletedSalon}
						/>
					)}
					<Row className={cx('flex w-1/2', { 'justify-between': !pendingPublication, 'justify-center': !salonExists })}>
						<Permissions
							allowed={[...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE]}
							render={(hasPermission, { openForbiddenModal }) =>
								salonExists &&
								!pendingPublication && (
									<Button
										type={'primary'}
										block
										size={'middle'}
										className={'noti-btn m-regular w-12/25'}
										onClick={(e) => {
											if (hasPermission) {
												sendConfirmationRequest()
											} else {
												e.preventDefault()
												openForbiddenModal()
											}
										}}
										disabled={submitting || deletedSalon}
										loading={submitting}
									>
										{t('loc:Požiadať o schválenie')}
									</Button>
								)
							}
						/>
						<Permissions
							allowed={submitPermissions}
							render={(hasPermission, { openForbiddenModal }) => (
								<Button
									type={'primary'}
									block
									size={'middle'}
									className={cx('noti-btn m-regular', {
										'w-12/25': !pendingPublication,
										'w-1/3': pendingPublication
									})}
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
				</Row>
			</div>
		)
	}

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body mt-2'>
					<SalonForm onSubmit={handleSubmit} openNoteModal={() => setVisible(true)} salonID={salonID} disabledForm={deletedSalon} />
					{salonExists && (
						<OpenHoursNoteModal visible={visible} salonID={salon?.data?.id || 0} openingHoursNote={salon?.data?.openingHoursNote} onClose={onOpenHoursNoteModalClose} />
					)}
					{renderContentFooter()}
				</div>
			</Spin>
			<Permissions allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]}>
				<Modal
					key={`${modalConfig.visible}`}
					title={modalConfig.title}
					visible={modalConfig.visible}
					onCancel={() =>
						setModalConfig({
							title: '',
							fieldPlaceholderText: '',
							visible: false,
							onSubmit: undefined
						})
					}
					footer={null}
					closeIcon={<CloseIcon />}
				>
					<NoteForm onSubmit={modalConfig.onSubmit} fieldPlaceholderText={modalConfig.fieldPlaceholderText} />
				</Modal>
			</Permissions>
		</>
	)
}

export default compose(withPermissions(permissions))(SalonPage)
