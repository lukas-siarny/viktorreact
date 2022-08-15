import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal, Row, Spin, Tooltip, notification } from 'antd'
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
import validateSalonFormForPublication from './components/validateSalonFormForPublication'

// enums
import { DAY, ENUMERATIONS_KEYS, FORM, MONDAY_TO_FRIDAY, NEW_SALON_ID, NOTIFICATION_TYPE, PERMISSION, SALON_PERMISSION, SALON_STATES, STRINGS } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { getCurrentUser } from '../../reducers/users/userActions'
import { ISalonPayloadData, selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { getCategories } from '../../reducers/categories/categoriesActions'
import { getCosmetics } from '../../reducers/cosmetics/cosmeticsActions'
import { getSalonLanguages } from '../../reducers/languages/languagesActions'

// types
import { IBreadcrumbs, INoteForm, INoteModal, ISalonForm, OpeningHours, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { checkPermissions, withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode } from '../../utils/helper'
import { checkSameOpeningHours, checkWeekend, createSameOpeningHours, getDayTimeRanges, initOpeningHours, orderDaysInWeek } from '../../components/OpeningHours/OpeninhHoursUtils'
import { getIsInitialPublishedVersionSameAsDraft, getIsPublishedVersionSameAsDraft } from './components/salonVersionsUtils'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import { ReactComponent as EyeoffIcon } from '../../assets/icons/eyeoff-24.svg'
import { ReactComponent as CheckIcon } from '../../assets/icons/check-icon.svg'
import { ReactComponent as CloseCricleIcon } from '../../assets/icons/close-circle-icon-24.svg'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

const getPhoneDefaultValue = (phonePrefixCountryCode: string) => [
	{
		phonePrefixCountryCode,
		phone: null
	}
]

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
	const salonExists = !!salonID && salonID === salon.data?.id
	const deletedSalon = !!(salon?.data?.deletedAt && salon?.data?.deletedAt !== null) && salonExists

	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	const isLoading = salon.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving || isSendingConfRequest
	const hasSalonPublishedVersion = !!salon.data?.publishedSalonData
	const pendingPublication = salon.data && pendingStates.includes(salon.data.state)
	const isPublishedVersionSameAsDraft = getIsPublishedVersionSameAsDraft(formValues as ISalonForm)

	// check permissions for submit in case of create or update salon
	const submitPermissions = salonExists ? [SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE] : permissions
	const deletePermissions = [...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_DELETE]
	const declinedSalon = salon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED || salon.data?.state === SALON_STATES.PUBLISHED_DECLINED

	const isAdmin = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]), [authUser])

	const [backUrl] = useBackUrl(t('paths:salons'))

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
		dispatch(getSalonLanguages())
		dispatch(getCosmetics())
	}, [dispatch])

	const updateOnlyOpeningHours = useRef(false)

	const initData = async (salonData: ISalonPayloadData | null) => {
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
		} else if (!isEmpty(salonData) && salonExists) {
			// init data for existing salon
			const openOverWeekend: boolean = checkWeekend(salonData?.openingHours)
			const sameOpenHoursOverWeek: boolean = checkSameOpeningHours(salonData?.openingHours)
			const openingHours: OpeningHours = initOpeningHours(salonData?.openingHours, sameOpenHoursOverWeek, openOverWeekend)?.sort(orderDaysInWeek) as OpeningHours
			// pre sprave zobrazenie informacnych hlasok a disabled stavov submit buttonov je potrebne dat pozor, aby isPristine fungovalo spravne = teda pri pridavani noveho fieldu je to potrebne vzdy skontrolovat
			// napr. ak pride z BE aboutUsFirst: undefined, potom prepisem hodnotu vo formulari a opat ju vymazem, tak do reduxu sa ta prazdna hodnota uz neulozi ako undeifned ale ako null
			// preto maju vsetky inicializacne hodnoty, pre textFieldy a textAreaFieldy fallback || null (pozri impementaciu tychto komponentov, preco sa to tam takto uklada)
			const initialData: ISalonForm = {
				id: salonData?.id || null,
				state: salonData?.state as SALON_STATES,
				name: salonData?.name || null,
				email: salonData?.email || null,
				payByCard: !!salonData?.payByCard,
				otherPaymentMethods: salonData?.otherPaymentMethods || null,
				aboutUsFirst: salonData?.aboutUsFirst || null,
				aboutUsSecond: salonData?.aboutUsSecond || null,
				openOverWeekend,
				sameOpenHoursOverWeek,
				openingHours,
				note: salonData?.openingHoursNote?.note || null,
				noteFrom: salonData?.openingHoursNote?.validFrom || null,
				noteTo: salonData?.openingHoursNote?.validTo || null,
				latitude: salonData?.address?.latitude ?? null,
				longitude: salonData?.address?.longitude ?? null,
				city: salonData?.address?.city || null,
				street: salonData?.address?.street || null,
				zipCode: salonData?.address?.zipCode || null,
				country: salonData?.address?.countryCode || null,
				streetNumber: salonData?.address?.streetNumber || null,
				locationNote: salonData?.locationNote || null,
				parkingNote: salonData?.parkingNote || null,
				companyContactPerson: {
					email: salonData?.companyContactPerson?.email || null,
					firstName: salonData?.companyContactPerson?.firstName || null,
					lastName: salonData?.companyContactPerson?.lastName || null,
					phonePrefixCountryCode: salonData?.companyContactPerson?.phonePrefixCountryCode || defaultContactPerson.phonePrefixCountryCode,
					phone: salonData?.companyContactPerson?.phone || null
				},
				companyInfo: {
					taxID: salonData?.companyInfo?.taxID || null,
					businessID: salonData?.companyInfo?.businessID || null,
					companyName: salonData?.companyInfo?.companyName || null,
					vatID: salonData?.companyInfo?.vatID || null
				},
				phones:
					salonData?.phones && !isEmpty(salonData?.phones)
						? salonData.phones.map((phone) => ({
								phonePrefixCountryCode: phone.phonePrefixCountryCode || null,
								phone: phone.phone || null
						  }))
						: getPhoneDefaultValue(phonePrefixCountryCode),
				gallery: map(salonData?.images, (image) => ({ thumbUrl: image?.resizedImages?.thumbnail, url: image?.original, uid: image?.id })),
				pricelists: map(salonData?.pricelists, (file) => ({ url: file?.original, uid: file?.id })),
				logo: salonData?.logo?.id
					? [
							{
								uid: salonData?.logo?.id,
								url: salonData?.logo?.original,
								thumbUrl: salonData.logo?.resizedImages?.thumbnail
							}
					  ]
					: null,
				languageIDs: map(salonData?.languages, (lng) => lng?.id).filter((lng) => lng !== undefined) as string[],
				cosmeticIDs: map(salonData?.cosmetics, (cosmetic) => cosmetic?.id).filter((cosmetic) => cosmetic !== undefined) as string[],
				address: !!salonData?.address || null,
				socialLinkWebPage: salonData?.socialLinkWebPage || null,
				socialLinkFB: salonData?.socialLinkFB || null,
				socialLinkInstagram: salonData?.socialLinkInstagram || null,
				socialLinkYoutube: salonData?.socialLinkYoutube || null,
				socialLinkTikTok: salonData?.socialLinkTikTok || null,
				socialLinkPinterest: salonData?.socialLinkPinterest || null,
				publishedSalonData: {
					name: salonData?.publishedSalonData?.name || null,
					aboutUsFirst: salonData?.publishedSalonData?.aboutUsFirst || null,
					aboutUsSecond: salonData?.publishedSalonData?.aboutUsSecond || null,
					email: salonData?.publishedSalonData?.email || null,
					address: {
						countryCode: salonData?.publishedSalonData?.address?.countryCode || null,
						zipCode: salonData?.publishedSalonData?.address?.zipCode || null,
						city: salonData?.publishedSalonData?.address?.city || null,
						street: salonData?.publishedSalonData?.address?.street || null,
						streetNumber: salonData?.publishedSalonData?.address?.streetNumber || null,
						latitude: salonData?.publishedSalonData?.address?.latitude ?? null,
						longitude: salonData?.publishedSalonData?.address?.longitude ?? null
					},
					locationNote: salonData?.publishedSalonData?.locationNote || null,
					gallery: map(salonData?.publishedSalonData?.images, (image) => ({ thumbUrl: image?.resizedImages?.thumbnail, url: image?.original, uid: image?.id })),
					logo: salonData?.publishedSalonData?.logo
						? [
								{
									uid: salonData.publishedSalonData.logo.id,
									url: salonData.publishedSalonData.logo.original,
									thumbUrl: salonData.publishedSalonData.logo?.resizedImages?.thumbnail
								}
						  ]
						: null,
					pricelists: map(salonData?.publishedSalonData?.pricelists, (file) => ({ url: file?.original, uid: file?.id })),
					phones:
						salonData?.publishedSalonData?.phones && !isEmpty(salonData?.publishedSalonData?.phones)
							? salonData.publishedSalonData.phones.map((phone) => ({
									phonePrefixCountryCode: phone.phonePrefixCountryCode || null,
									phone: phone.phone || null
							  }))
							: getPhoneDefaultValue(phonePrefixCountryCode)
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
					companyContactPerson: defaultContactPerson,
					phones: getPhoneDefaultValue(phonePrefixCountryCode)
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
			const phones = data.phones?.filter((phone) => phone?.phone)

			const salonData = {
				imageIDs: (data.gallery || []).map((image: any) => image?.id ?? image?.uid) as Paths.PatchApiB2BAdminSalonsSalonId.RequestBody['imageIDs'],
				logoID: map(data.logo, (image) => image?.id ?? image?.uid)[0] ?? null,
				name: data.name,
				openingHours: openingHours || [],
				aboutUsFirst: data.aboutUsFirst,
				aboutUsSecond: data.aboutUsSecond,
				city: data.city,
				countryCode: data.country,
				latitude: data.latitude,
				longitude: data.longitude,
				street: data.street,
				streetNumber: data.streetNumber,
				zipCode: data.zipCode,
				locationNote: data.locationNote,
				phones,
				email: data.email,
				socialLinkFB: data.socialLinkFB,
				socialLinkInstagram: data.socialLinkInstagram,
				socialLinkWebPage: data.socialLinkWebPage,
				socialLinkTikTok: data.socialLinkTikTok,
				socialLinkYoutube: data.socialLinkYoutube,
				socialLinkPinterest: data.socialLinkPinterest,
				parkingNote: data.parkingNote,
				payByCard: !!data.payByCard,
				otherPaymentMethods: data.otherPaymentMethods,
				companyContactPerson: data.companyContactPerson,
				companyInfo: data.companyInfo,
				cosmeticIDs: data.cosmeticIDs,
				languageIDs: data.languageIDs
			}

			if (salonExists) {
				// update existing salon
				await patchReq('/api/b2b/admin/salons/{salonID}', { salonID }, salonData as any)
				dispatch(selectSalon(salonID))
			} else {
				// create new salon
				const result = await postReq('/api/b2b/admin/salons/', undefined, salonData as any)
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

	const breadcrumbDetailItem = salonExists
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
						link: backUrl
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

	const deleteOpenHoursNote = async () => {
		if (isRemoving) {
			return
		}

		setIsRemoving(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/open-hours-note', { salonID }, { openingHoursNote: null }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(reset(FORM.OPEN_HOURS_NOTE))
			await dispatch(selectSalon(salonID))
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

		const errors = validateSalonFormForPublication(formValues as ISalonForm)
		if (!isEmpty(errors)) {
			notification.error({
				message: t('loc:Chybne vyplnený formulár'),
				description: (
					<>
						{t(`loc:Pre publikovanie salónu je potrebné mať vyplnené nasledujúce údaje`)}: {errors.join(', ')}
					</>
				)
			})
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

	const requestApprovalButton = (className = '') => {
		const approvalButtonDisabled = submitting || deletedSalon || !isFormPristine
		const approvalButtonInitiallyDisabled = isFormPristine && getIsInitialPublishedVersionSameAsDraft(salon)

		let tooltipMessage: string | null = null

		if (approvalButtonInitiallyDisabled) {
			tooltipMessage = t('loc:V salóne nie sú žiadne zmeny, ktoré by bolo potrebné schváliť.')
		} else if (approvalButtonDisabled) tooltipMessage = t('loc:Pred požiadaním o schválenie je potrebné zmeny najprv uložiť.')

		// Workaround for disabled button inside tooltip: https://github.com/react-component/tooltip/issues/18
		return (
			<Permissions
				allowed={[...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE]}
				render={(hasPermission, { openForbiddenModal }) =>
					salonExists &&
					!pendingPublication && (
						<Tooltip title={tooltipMessage}>
							<span className={cx({ 'cursor-not-allowed': approvalButtonDisabled || approvalButtonInitiallyDisabled })}>
								<Button
									type={'dashed'}
									block
									size={'middle'}
									className={cx('noti-btn m-regular', className, {
										'pointer-events-none': approvalButtonDisabled || approvalButtonInitiallyDisabled
									})}
									disabled={approvalButtonDisabled || approvalButtonInitiallyDisabled}
									onClick={(e) => {
										if (hasPermission) {
											sendConfirmationRequest()
										} else {
											e.preventDefault()
											openForbiddenModal()
										}
									}}
									loading={submitting}
								>
									{t('loc:Požiadať o schválenie')}
								</Button>
							</span>
						</Tooltip>
					)
				}
			/>
		)
	}

	const renderContentFooter = () => {
		switch (true) {
			// create salon page
			case !salonExists:
				return (
					<Row className={'w-full'} justify={'center'}>
						{submitButton('w-52 xl:w-60 mt-2-5')}
					</Row>
				)
			// has published version
			case hasSalonPublishedVersion && !pendingPublication:
				return (
					<Row className={'w-full gap-2 md:items-center flex-col md:flex-row md:justify-between md:flex-nowrap'}>
						<Row className={'gap-2 flex-row-reverse justify-end'}>
							{hideSalonButton('w-52 lg:w-60 mt-2-5')}
							{deleteButton('w-52 lg:w-60 mt-2-5')}
						</Row>
						<Row className={'gap-2 md:justify-end'}>
							{requestApprovalButton('w-52 lg:w-60 mt-2-5')}
							{submitButton('w-52 lg:w-60 mt-2-5')}
						</Row>
					</Row>
				)
			case hasSalonPublishedVersion && pendingPublication:
				return (
					<Row className={'w-full gap-2'}>
						<Row className={'gap-2 flex-1'}>
							{deleteButton('w-48 lg:w-60 mt-2-5')}
							{hideSalonButton('w-48 lg:w-60 mt-2-5')}
						</Row>
						{submitButton('w-48 lg:w-60 mt-2-5')}
					</Row>
				)
			// doesn't have published version
			case !hasSalonPublishedVersion && !pendingPublication:
				return (
					<Row className={'w-full gap-2 flex-col sm:flex-nowrap sm:flex-row'}>
						{deleteButton('w-48 lg:w-60 mt-2-5')}
						<Row className={'gap-2 flex-1 sm:justify-end'}>
							{requestApprovalButton('w-48 lg:w-60 mt-2-5')}
							{submitButton('w-48 lg:w-60 mt-2-5')}
						</Row>
					</Row>
				)
			case !hasSalonPublishedVersion && pendingPublication:
				return (
					<Row className={'w-full gap-2'} justify={'space-between'}>
						{deleteButton('mt-2-5 w-52 xl:w-60')}
						{submitButton('mt-2-5 w-52 xl:w-60')}
					</Row>
				)
			default:
				return null
		}
	}

	const renderContentHeader = () =>
		pendingPublication &&
		salonExists && (
			<Permissions allowed={[PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]}>
				<div className={'content-header warning'}>
					<Row justify={'space-between'} className={'w-full'}>
						<Button
							type={'primary'}
							icon={<CloseCricleIcon />}
							size={'middle'}
							className={'ant-btn-dangerous noti-btn m-regular hover:shadow-none w-44 xl:w-56'}
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
						<Button
							type={'primary'}
							icon={<CheckIcon />}
							size={'middle'}
							className={'noti-btn m-regular w-44 xl:w-56'}
							onClick={() => resolveConfirmationRequest()}
							disabled={submitting}
							loading={submitting}
						>
							{t('loc:Potvrdiť')}
						</Button>
					</Row>
				</div>
			</Permissions>
		)

	const infoMessage = useMemo(() => {
		let message: string | null

		// order of cases is important to show correct message
		switch (true) {
			case salonID === NEW_SALON_ID:
			case deletedSalon:
				message = null
				break
			case !isFormPristine && !pendingPublication:
				message = t('loc:V sálone boli vykonané zmeny, ktoré nie sú uložené. Pred požiadaním o schválenie je potrebné zmeny najprv uložiť.')
				break
			case salon.data?.state === SALON_STATES.NOT_PUBLISHED || salon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED:
				message = t('loc:Ak chcete salón publikovať, je potrebné požiadať o jeho schválenie.')
				break
			case !isPublishedVersionSameAsDraft?.isEqual && !pendingPublication:
				message = t('loc:V sálone sa nachádzajú nepublikované zmeny, ktoré je pred zverejnením potrebné schváliť administrátorom.')
				break
			case pendingPublication:
				message = t('loc:Salón čaká na schválenie zmien. Údaje, ktoré podliehajú schvaľovaniu, po túto dobu nie je možné editovať.')
				break
			default:
				message = null
		}

		if (message) {
			return <Alert message={message} showIcon type={'warning'} className={'noti-alert mb-4'} />
		}

		return null
	}, [pendingPublication, isFormPristine, isPublishedVersionSameAsDraft?.isEqual, deletedSalon, salonID, t, salon.data?.state])

	const declinedSalonMessage = useMemo(
		() => (
			<Alert
				message={
					<>
						<strong className={'block'}>{`${t('loc:Zmeny v salóne boli zamietnuté z dôvodu')}:`}</strong>
						<p className={'whitespace-pre-wrap m-0'}>
							{salon?.data?.publicationDeclineReason ? `"${salon?.data?.publicationDeclineReason}"` : t('loc:Bez udania dôvodu.')}
						</p>
					</>
				}
				showIcon
				type={'error'}
				className={'noti-alert mb-4'}
			/>
		),
		[t, salon?.data?.publicationDeclineReason]
	)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			<Spin spinning={isLoading}>
				<div className='content-body mt-2'>
					{renderContentHeader()}
					{declinedSalon && declinedSalonMessage}
					{infoMessage}
					<SalonForm
						onSubmit={handleSubmit}
						salonID={salonID}
						disabledForm={deletedSalon}
						deletedSalon={deletedSalon}
						pendingPublication={!!pendingPublication}
						isPublishedVersionSameAsDraft={isPublishedVersionSameAsDraft}
						noteModalControlButtons={
							salonExists && (
								<Row className={'flex justify-start w-full xl:w-1/2 mt-4'}>
									{salon?.data?.openingHoursNote ? (
										<>
											<Button
												type={'primary'}
												block
												size={'middle'}
												className={'noti-btn m-regular w-12/25 xl:w-1/3'}
												onClick={() => setVisible(true)}
												disabled={deletedSalon}
											>
												{STRINGS(t).edit(t('loc:poznámku'))}
											</Button>
											<DeleteButton
												className={'ml-2 w-12/25 xl:w-1/3'}
												getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
												onConfirm={deleteOpenHoursNote}
												entityName={t('loc:poznámku')}
												disabled={deletedSalon}
											/>
										</>
									) : (
										<Button
											type={'primary'}
											block
											size={'middle'}
											className={'noti-btn m-regular w-1/3'}
											onClick={() => setVisible(true)}
											disabled={deletedSalon}
										>
											{STRINGS(t).addRecord(t('loc:poznámku'))}
										</Button>
									)}
								</Row>
							)
						}
					/>
					{salonExists && <OpenHoursNoteModal visible={visible} salonID={salonID} openingHoursNote={salon?.data?.openingHoursNote} onClose={onOpenHoursNoteModalClose} />}
					<div className={'content-footer pt-0'}>{renderContentFooter()}</div>
				</div>
			</Spin>
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
		</>
	)
}

export default compose(withPermissions(permissions))(SalonPage)
