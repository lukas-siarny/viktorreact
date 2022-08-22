import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { ISalonPayloadData, selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { getCosmetics } from '../../reducers/cosmetics/cosmeticsActions'
import { getSalonLanguages } from '../../reducers/languages/languagesActions'

// types
import { CategoriesPatch, IBreadcrumbs, INoteForm, INoteModal, ISalonForm, OpeningHours, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, getReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { checkPermissions, withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode, formatDateByLocale, formatLongQueryString } from '../../utils/helper'
import { createSameOpeningHours, getDayTimeRanges, initOpeningHours, orderDaysInWeek } from '../../components/OpeningHours/OpeninhHoursUtils'
import { getIsInitialPublishedVersionSameAsDraft, getIsPublishedVersionSameAsDraft, initEmptySalonFormData, initSalonFormData, SalonInitType } from './components/salonUtils'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import { ReactComponent as EyeoffIcon } from '../../assets/icons/eyeoff-24.svg'
import { ReactComponent as CheckIcon } from '../../assets/icons/check-icon.svg'
import { ReactComponent as CloseCricleIcon } from '../../assets/icons/close-circle-icon-24.svg'

// hooks
import useBackUrl from '../../hooks/useBackUrl'
import { getBasicSalon, getSuggestedSalons } from '../../reducers/salons/salonsActions'
import SalonSuggestionsModal from './components/SalonSuggestionsModal'
import { getCurrentUser } from '../../reducers/users/userActions'

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
	const [suggestionsModalVisible, setSuggestionsModalVisible] = useState(false)

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)
	const isFormPristine = useSelector(isPristine(FORM.SALON))
	const basicSalon = useSelector((state: RootState) => state.salons.basicSalon)

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend
	const salonExists = !!salonID && salonID === salon.data?.id
	const deletedSalon = !!(salon?.data?.deletedAt && salon?.data?.deletedAt !== null) && salonExists

	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	const isLoading = salon.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving || isSendingConfRequest || basicSalon.isLoading
	const hasSalonPublishedVersion = !!salon.data?.publishedSalonData
	const pendingPublication = salon.data && pendingStates.includes(salon.data.state)
	const isPublishedVersionSameAsDraft = getIsPublishedVersionSameAsDraft(formValues as ISalonForm)

	// check permissions for submit in case of create or update salon
	const submitPermissions = salonExists ? [SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE] : permissions
	const deletePermissions = [...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_DELETE]
	const declinedSalon = salon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED || salon.data?.state === SALON_STATES.PUBLISHED_DECLINED

	const isAdmin = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]), [authUser])
	const isPartner = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.PARTNER]), [authUser])

	const [backUrl] = useBackUrl(t('paths:salons'))

	const isNewSalon = salonID === NEW_SALON_ID

	// show salons searchbox with basic salon suggestions instead of text field for name input
	const showBasicSalonsSearchBox = isNewSalon && isPartner

	useEffect(() => {
		if (isNewSalon) {
			return
		}
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
	}, [sameOpenHoursOverWeekFormValue, openOverWeekendFormValue, isNewSalon])

	useEffect(() => {
		dispatch(getSalonLanguages())
		dispatch(getCosmetics())
	}, [dispatch])

	useEffect(() => {
		if (salonID === NEW_SALON_ID && isPartner) {
			;(async () => {
				const { data } = await dispatch(getSuggestedSalons())
				if ((data?.salons?.length || 0) > 0) {
					setSuggestionsModalVisible(true)
				}
			})()
		}
	}, [salonID, dispatch, isPartner])

	const updateOnlyOpeningHours = useRef(false)

	const initData = async (salonData: ISalonPayloadData | null) => {
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
			dispatch(initialize(FORM.SALON, initSalonFormData(salonData, phonePrefixCountryCode)))
		} else if (!salon?.isLoading) {
			// init data for new "creating process" salon
			dispatch(initialize(FORM.SALON, initEmptySalonFormData(phonePrefixCountryCode), showBasicSalonsSearchBox))
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
				name: data.salonNameFromSelect ? data.nameSelect?.label : data.name,
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
				companyContactPerson: {
					...data.companyContactPerson,
					phonePrefixCountryCode: data.companyContactPerson?.phone ? data.companyContactPerson.phonePrefixCountryCode : undefined
				},
				companyInfo: data.companyInfo,
				cosmeticIDs: data.cosmeticIDs,
				languageIDs: data.languageIDs,
				payByCash: true
			}

			if (salonExists) {
				// update existing salon
				await patchReq('/api/b2b/admin/salons/{salonID}', { salonID }, salonData as any)
				dispatch(selectSalon(salonID))
			} else {
				// create new salon
				const result = await postReq('/api/b2b/admin/salons/', undefined, salonData as any)

				// save categories in case of salon data were loaded from basic salon data and has categories assigned
				if (showBasicSalonsSearchBox) {
					if (data?.categoryIDs && !isEmpty(data?.categoryIDs) && data.categoryIDs.length < 100) {
						await patchReq(
							'/api/b2b/admin/salons/{salonID}/categories',
							{ salonID: result.data.salon.id },
							{
								categoryIDs: data?.categoryIDs as unknown as CategoriesPatch['categoryIDs']
							}
						)
					}
				}

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

	const searchSalons = useCallback(async (search: string, page: number) => {
		try {
			const { data } = await getReq('/api/b2b/admin/salons/basic', {
				search: formatLongQueryString(search),
				page
			})

			const selectOptions = data.salons.map((item) => ({
				key: item.id,
				value: item.id,
				label: item.name,
				className: 'noti-salon-search-option',
				extra: {
					salon: item
				}
			}))
			return { pagination: data.pagination, data: selectOptions }
		} catch (e) {
			return { pagination: null, data: [] }
		}
	}, [])

	const loadBasicSalon = useCallback(
		async (id: string) => {
			const { data } = await dispatch(getBasicSalon(id))
			dispatch(initialize(FORM.SALON, initSalonFormData(data?.salon as SalonInitType, phonePrefixCountryCode, true)))
		},
		[dispatch, phonePrefixCountryCode]
	)

	const clearSalonForm = useCallback(() => {
		dispatch(initialize(FORM.SALON, initEmptySalonFormData(phonePrefixCountryCode, true)))
	}, [dispatch, phonePrefixCountryCode])

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
			<div className='content-body mt-2'>
				<Spin spinning={isLoading}>
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
						showBasicSalonsSearchBox={showBasicSalonsSearchBox}
						loadBasicSalon={loadBasicSalon}
						clearSalonForm={clearSalonForm}
						searchSalons={searchSalons}
						noteModalControlButtons={
							salonExists && (
								<Row className={'flex justify-start w-full xl:w-1/2 mt-4'}>
									{salon?.data?.openingHoursNote ? (
										<>
											<div className='w-full'>
												<h4>{t('loc:Poznámka pre otváracie hodiny')}</h4>
												<p className='mb-2'>
													{formatDateByLocale(salon.data.openingHoursNote.validFrom as string, true)}
													{' - '}
													{formatDateByLocale(salon.data.openingHoursNote.validTo as string, true)}
												</p>
												<i className='block mb-2 text-base'>{salon.data.openingHoursNote.note}</i>
											</div>
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
				</Spin>
			</div>
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
			<SalonSuggestionsModal visible={suggestionsModalVisible} setVisible={setSuggestionsModalVisible} />
		</>
	)
}

export default compose(withPermissions(permissions))(SalonPage)
