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

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'
import { ISalonPayloadData, selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { getCategories } from '../../reducers/categories/categoriesActions'

// types
import { IBreadcrumbs, INoteForm, INoteModal, ISalonForm, OpeningHours, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { DAY, ENUMERATIONS_KEYS, FORM, MONDAY_TO_FRIDAY, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION, SALON_STATES } from '../../utils/enums'
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { checkPermissions, withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'
import { checkSameOpeningHours, checkWeekend, createSameOpeningHours, getDayTimeRanges, initOpeningHours, orderDaysInWeek } from '../../components/OpeningHours/OpeninhHoursUtils'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import { ReactComponent as EyeoffIcon } from '../../assets/icons/eyeoff-24.svg'
import { ReactComponent as CheckIcon } from '../../assets/icons/check-icon.svg'
import { ReactComponent as CloseCricleIcon } from '../../assets/icons/close-circle-icon-24.svg'

type SalonPatch = Paths.PatchApiB2BAdminSalonsSalonId.RequestBody

const permissions: PERMISSION[] = [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN, PERMISSION.PARTNER]

const pendingStates: string[] = [SALON_STATES.NOT_PUBLISHED_PENDING, SALON_STATES.PUBLISHED_PENDING]

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
	const salonExists = salonID > 0
	const deletedSalon = !!(salon?.data?.deletedAt && salon?.data?.deletedAt !== null) && salonExists

	const isLoading = salon.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving || isSendingConfRequest
	const hasSalonPublishedVersion = !!salon.data?.publishedSalonData
	const pendingPublication = salon.data && pendingStates.includes(salon.data.state)

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

	useEffect(() => {
		dispatch(getCategories())
	}, [dispatch])

	const updateOnlyOpeningHours = useRef(false)

	const initData = async (salonData: ISalonPayloadData | null) => {
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
		} else if (!isEmpty(salonData) && salonID > 0) {
			// init data for existing salon
			const openOverWeekend: boolean = checkWeekend(salonData?.openingHours)
			const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(salonData?.openingHours)
			const openingHours: OpeningHours = initOpeningHours(salonData?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			let initialData: any = {
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
					: null,
				categoryIDs: map(salonData?.categories, (categorie) => ({ label: categorie.name, value: categorie.id }))
			}

			if (salonData?.publishedSalonData) {
				initialData = {
					...initialData,
					publishedSalonData: {
						...salonData.publishedSalonData,
						gallery: map(salonData.publishedSalonData?.images, (image) => ({ url: image?.resizedImages?.thumbnail, uid: image?.id }))
					}
				}
			}

			dispatch(initialize(FORM.SALON, initialData))
		} else if (!salon?.isLoading) {
			// init data for new "creating process" salon
			dispatch(
				initialize(FORM.SALON, {
					openOverWeekend: false,
					sameOpenHoursOverWeek: true,
					openingHours: initOpeningHours(undefined, true, false),
					payByCard: false,
					phonePrefixCountryCode,
					companyContactPerson: defaultContactPerson
				})
			)
		}
	}

	// init forms
	useEffect(() => {
		initData(salon.data)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salon])

	const handleSubmit = async (data: ISalonForm) => {
		try {
			setSubmitting(true)
			const openingHours: OpeningHours = createSameOpeningHours(data.openingHours, data.sameOpenHoursOverWeek, data.openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			const salonData: SalonPatch = {
				imageIDs: (data.gallery || []).map((image) => image?.id ?? image?.uid) as Paths.PatchApiB2BAdminSalonsSalonId.RequestBody['imageIDs'],
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
				companyInfo: data.companyInfo,
				categoryIDs: data.categoryIDs.map((category) => get(category, 'value', category)) as [number, ...number[]]
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

	const breadcrumbDetailItem =
		salonID > 0
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

	const submitButton = (className = '') => (
		<Permissions
			allowed={submitPermissions}
			render={(hasPermission, { openForbiddenModal }) => (
				<Button
					type={'primary'}
					block
					size={'middle'}
					className={cx('noti-btn m-regular', className)}
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
	)

	const deleteButton = (className = '') => (
		<DeleteButton
			permissions={deletePermissions}
			className={className}
			onConfirm={deleteSalon}
			entityName={t('loc:salón')}
			type={'default'}
			getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
			disabled={deletedSalon}
		/>
	)

	const hideSalonButton = (className = '') => (
		<Permissions
			allowed={[SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<Button
					type={'dashed'}
					size={'middle'}
					icon={<EyeoffIcon />}
					className={cx('noti-btn m-regular', className)}
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
	)

	const requestApprovalButton = (className = '') => (
		<Permissions
			allowed={[...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) =>
				salonExists &&
				!pendingPublication && (
					<Button
						type={'dashed'}
						block
						size={'middle'}
						className={cx('noti-btn m-regular', className)}
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
	)

	const renderContentFooter = () => {
		switch (true) {
			// create salon page
			case !salonExists:
				return (
					<Row className={'w-full'} justify={'center'}>
						{submitButton('w-1/3')}
					</Row>
				)
			// has published version
			case hasSalonPublishedVersion && !pendingPublication:
				return (
					<Row className={'w-full gap-2'} wrap={false}>
						<Row className={'w-1/2 gap-2'} wrap={false}>
							{deleteButton('w-1/2 xl:w-1/3')}
							{hideSalonButton('w-1/2 xl:w-1/3')}
						</Row>
						<Row className={'w-1/2 gap-2'} justify={'end'} wrap={false}>
							{requestApprovalButton('w-1/2 xl:w-1/3')}
							{submitButton('w-1/2 xl:w-1/3')}
						</Row>
					</Row>
				)
			case hasSalonPublishedVersion && pendingPublication:
				return (
					<Row className={'w-full gap-2'} wrap={false} justify={'space-between'}>
						<Row className={'w-2/3 lg:w-1/2 xl:w-1/3 gap-2'} wrap={false}>
							{deleteButton('w-1/2')}
							{hideSalonButton('w-1/2')}
						</Row>
						{submitButton('w-1/3 lg:w-1/4')}
					</Row>
				)
			// doesn't have published version
			case !hasSalonPublishedVersion && !pendingPublication:
				return (
					<Row className={'w-full gap-2'} wrap={false} justify={'space-between'}>
						{deleteButton('w-1/3 lg:w-1/4')}
						<Row className={'w-2/3 lg:w-1/2 xl:w-1/3 gap-2'} wrap={false}>
							{requestApprovalButton('w-1/2')}
							{submitButton('w-1/2')}
						</Row>
					</Row>
				)
			case !hasSalonPublishedVersion && pendingPublication:
				return (
					<Row className={'w-full gap-2'} justify={'space-between'} wrap={false}>
						{deleteButton('w-1/2 lg:w-1/3 xl:w-1/4')}
						{submitButton('w-1/2 lg:w-1/3 xl:w-1/4')}
					</Row>
				)
			default:
				return null
		}
	}

	const renderContentHeader = () =>
		pendingPublication &&
		salonExists && (
			<div className={'content-header warning'}>
				<Permissions
					allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]}
					render={(hasPermission, { openForbiddenModal }) => (
						<Row justify={'space-between'} className={'w-full'}>
							<Button
								type={'primary'}
								icon={<CloseCricleIcon />}
								size={'middle'}
								className={'ant-btn-dangerous noti-btn m-regular hover:shadow-none w-44 xl:w-56'}
								onClick={() =>
									hasPermission
										? setModalConfig({
												title: t('loc:Dôvod zamietnutia'),
												fieldPlaceholderText: t('loc:Sem napíšte dôvod zamietnutia'),
												visible: true,
												onSubmit: resolveConfirmationRequest
										  })
										: openForbiddenModal()
								}
								disabled={submitting}
								loading={submitting}
							>
								{t('loc:Zamietnuť')}
							</Button>
							<Button
								type={'primary'}
								icon={<CheckIcon />}
								size={'middle'}
								className={'noti-btn m-regular w-44 xl:w-56'}
								onClick={() => (hasPermission ? resolveConfirmationRequest() : openForbiddenModal())}
								disabled={submitting}
								loading={submitting}
							>
								{t('loc:Potvrdiť')}
							</Button>
						</Row>
					)}
				/>
			</div>
		)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body mt-2'>
					{renderContentHeader()}
					<SalonForm onSubmit={handleSubmit} openNoteModal={() => setVisible(true)} salonID={salonID} disabledForm={deletedSalon} />
					{salonExists && (
						<OpenHoursNoteModal visible={visible} salonID={salon?.data?.id || 0} openingHoursNote={salon?.data?.openingHoursNote} onClose={onOpenHoursNoteModalClose} />
					)}
					<div className={'content-footer'}>{renderContentFooter()}</div>
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
