import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal, Row, Spin, notification } from 'antd'
import { change, initialize, isPristine, reset, submit } from 'redux-form'
import { get, isEmpty, map, unionBy } from 'lodash'
import { compose } from 'redux'
import { BooleanParam, useQueryParams } from 'use-query-params'
import cx from 'classnames'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonForm from './components/SalonForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'
import { scrollToTopFn } from '../../components/ScrollToTop'
import NoteForm from './components/NoteForm'
import validateSalonFormForPublication from './components/validateSalonFormForPublication'
import SalonSuggestionsModal from './components/SalonSuggestionsModal'
import TabsComponent from '../../components/TabsComponent'
import SalonHistory from './components/SalonHistory'
import SalonApprovalModal from './components/SalonApprovalModal'
import { createSameOpeningHours, getDayTimeRanges, initOpeningHours, orderDaysInWeek } from '../../components/OpeningHours/OpeninhHoursUtils'
import { initEmptySalonFormData, initSalonFormData, SalonInitType } from './components/salonUtils'

// enums
import {
	DAY,
	ENUMERATIONS_KEYS,
	FILTER_ENTITY,
	FORM,
	MONDAY_TO_FRIDAY,
	NEW_SALON_ID,
	NOTIFICATION_TYPE,
	PERMISSION,
	SALON_CREATE_TYPE,
	SALON_PERMISSION,
	SALON_STATES,
	STRINGS,
	TAB_KEYS
} from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { ISalonPayloadData, selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { getCosmetics } from '../../reducers/cosmetics/cosmeticsActions'
import { getSalonLanguages } from '../../reducers/languages/languagesActions'
import { getBasicSalon, getSuggestedSalons } from '../../reducers/salons/salonsActions'
import { getCurrentUser } from '../../reducers/users/userActions'

// types
import { CategoriesPatch, IBreadcrumbs, INoteForm, INoteModal, ISalonForm, OpeningHours, SalonSubPageProps } from '../../types/interfaces'
import { Paths } from '../../types/api'

// utils
import { deleteReq, patchReq, postReq } from '../../utils/request'
import { history } from '../../utils/history'
import Permissions, { checkPermissions, withPermissions } from '../../utils/Permissions'
import { getPrefixCountryCode, formatDateByLocale } from '../../utils/helper'
import searchWrapper from '../../utils/filters'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'
import { ReactComponent as EyeoffIcon } from '../../assets/icons/eyeoff-24.svg'
import { ReactComponent as CheckIcon } from '../../assets/icons/check-icon.svg'
import { ReactComponent as CloseCricleIcon } from '../../assets/icons/close-circle-icon-24.svg'

// hooks
import useBackUrl from '../../hooks/useBackUrl'

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
	const [tabKey, setTabKey] = useState<TAB_KEYS>(TAB_KEYS.SALON_DETAIL)
	const [modalConfig, setModalConfig] = useState<INoteModal>({ title: '', fieldPlaceholderText: '', onSubmit: undefined, visible: false })
	const [suggestionsModalVisible, setSuggestionsModalVisible] = useState(false)
	const [approvalModalVisible, setApprovalModalVisible] = useState(false)

	const authUser = useSelector((state: RootState) => state.user.authUser)
	const phonePrefixes = useSelector((state: RootState) => state.enumerationsStore?.[ENUMERATIONS_KEYS.COUNTRIES_PHONE_PREFIX])
	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const formValues = useSelector((state: RootState) => state.form?.[FORM.SALON]?.values)
	const isFormPristine = useSelector(isPristine(FORM.SALON))
	const basicSalon = useSelector((state: RootState) => state.salons.basicSalon)

	const sameOpenHoursOverWeekFormValue = formValues?.sameOpenHoursOverWeek
	const openOverWeekendFormValue = formValues?.openOverWeekend

	const phonePrefixCountryCode = getPrefixCountryCode(map(phonePrefixes?.data, (item) => item.code))

	// if salon have ID and is same as loaded
	const isSalonExists = !!salonID && salonID === salon.data?.id
	// if salon is deleted
	const isDeletedSalon = !!(salon?.data?.deletedAt && salon?.data?.deletedAt !== null) && !isSalonExists
	const isLoading = salon.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isRemoving || isSendingConfRequest || basicSalon.isLoading
	const isPendingPublication = (salon.data && pendingStates.includes(salon.data.state)) || false
	const isPublished = salon.data?.isPublished
	const isBasic = salon.data?.createType === SALON_CREATE_TYPE.BASIC

	// check permissions for submit in case of create or update salon
	const submitPermissions = isSalonExists ? [SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE] : permissions
	const deletePermissions = [...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_DELETE]
	const declinedSalon = salon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED || salon.data?.state === SALON_STATES.PUBLISHED_DECLINED

	const isAdmin = useMemo(() => checkPermissions(authUser.data?.uniqPermissions, [PERMISSION.NOTINO_SUPER_ADMIN, PERMISSION.NOTINO_ADMIN]), [authUser])

	const [backUrl] = useBackUrl(t('paths:salons'))

	const isNewSalon = salonID === NEW_SALON_ID

	// show salons searchbox with basic salon suggestions instead of text field for name input
	const showBasicSalonsSuggestions = isNewSalon && !isAdmin

	const [query, setQuery] = useQueryParams({
		history: BooleanParam
	})

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
		dispatch(getSalonLanguages())
		dispatch(getCosmetics())
	}, [dispatch])

	useEffect(() => {
		if (showBasicSalonsSuggestions) {
			;(async () => {
				const { data } = await dispatch(getSuggestedSalons())
				if ((data?.salons?.length || 0) > 0) {
					setSuggestionsModalVisible(true)
				}
			})()
		}
	}, [dispatch, showBasicSalonsSuggestions])

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
		} else if (!isEmpty(salonData) && isSalonExists) {
			dispatch(initialize(FORM.SALON, initSalonFormData(salonData, phonePrefixCountryCode, showBasicSalonsSuggestions)))
		} else if (!salon?.isLoading) {
			// init data for new "creating process" salon
			dispatch(initialize(FORM.SALON, initEmptySalonFormData(phonePrefixCountryCode, showBasicSalonsSuggestions)))
		}
	}

	// change tab based on query
	useEffect(() => {
		if (query.history) {
			setTabKey(TAB_KEYS.SALON_HISTORY)
		}
	}, [query.history])

	// init forms
	useEffect(() => {
		initData(salon.data)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [salon, showBasicSalonsSuggestions])

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
				payByCash: !!data.payByCash,
				otherPaymentMethods: data.otherPaymentMethods,
				// TODO - remove
				/* companyContactPerson: {
					...data.companyContactPerson,
					phonePrefixCountryCode: data.companyContactPerson?.phone ? data.companyContactPerson.phonePrefixCountryCode : undefined
				},
				companyInfo: data.companyInfo, */
				cosmeticIDs: data.cosmeticIDs,
				languageIDs: data.languageIDs
			}

			if (isSalonExists) {
				// update existing salon
				await patchReq('/api/b2b/admin/salons/{salonID}', { salonID }, salonData as any)
				dispatch(selectSalon(salonID))
			} else {
				// create new salon
				const result = await postReq('/api/b2b/admin/salons/', undefined, salonData as any)

				// save categories in case of salon data were loaded from basic salon data and has categories assigned
				if (showBasicSalonsSuggestions) {
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

	const breadcrumbDetailItem = isSalonExists
		? {
				name: tabKey === TAB_KEYS.SALON_DETAIL ? t('loc:Detail salónu') : t('loc:História salónu'),
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
			if (isAdmin) {
				history.push(t('paths:salons'))
			} else {
				// check if there are any other salons assigned to user and redircet user to first of them
				const { data } = await dispatch(getCurrentUser())
				const salonToRedirect = (data?.salons || [])[0]
				if (salonToRedirect) {
					history.push(`${t('paths:salons')}/${salonToRedirect.id}`)
				} else {
					// otherwise redirect user to dashboard
					await dispatch(selectSalon())
					history.push(t('paths:index'))
				}
			}
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

	const searchSalons = useCallback(
		async (search: string, page: number) => {
			return searchWrapper(dispatch, { page, search }, FILTER_ENTITY.BASIC_SALON)
		},
		[dispatch]
	)

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
					// if is salon pending approval and user is not Admin
					disabled={submitting || isDeletedSalon || isFormPristine || (!isPublished && isPendingPublication && !isAdmin)}
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
			disabled={isDeletedSalon}
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
					disabled={submitting || isDeletedSalon}
					loading={submitting}
				>
					{t('loc:Skryť salón')}
				</Button>
			)}
		/>
	)

	const requestApprovalButton = (className = '') => {
		return (
			<Button
				type={'dashed'}
				block
				size={'middle'}
				className={cx('noti-btn m-regular', className)}
				disabled={submitting || isDeletedSalon}
				onClick={() => setApprovalModalVisible(true)}
				loading={submitting}
			>
				{t('loc:Požiadať o schválenie')}
			</Button>
		)
	}

	// render buttons on footer based on salon statuses
	const renderContentFooter = () => {
		switch (true) {
			// for create salon page
			case !isSalonExists:
				return (
					<Row className={'w-full'} justify={'center'}>
						{submitButton('w-52 xl:w-60 mt-2-5')}
					</Row>
				)
			// published and not basic
			case isPublished && !isBasic:
				return (
					<Row className={'w-full gap-2 md:items-center flex-col md:flex-row md:justify-between md:flex-nowrap'}>
						<Row className={'gap-2 flex-row-reverse justify-end'}>
							{/* if is admin show hide button */}
							{isAdmin && hideSalonButton('w-52 lg:w-60 mt-2-5')}
							{deleteButton('w-52 lg:w-60 mt-2-5')}
						</Row>
						<Row className={'gap-2 md:justify-end'}>{submitButton('w-52 lg:w-60 mt-2-5')}</Row>
					</Row>
				)
			// unpublished or published and not pending publication
			case (!isPublished || isPublished) && !isPendingPublication:
				return (
					<Row className={'w-full gap-2 flex-col sm:flex-nowrap sm:flex-row'}>
						{deleteButton('w-48 lg:w-60 mt-2-5')}
						<Row className={'gap-2 flex-1 sm:justify-end'}>
							{requestApprovalButton('w-48 lg:w-60 mt-2-5')}
							{submitButton('w-48 lg:w-60 mt-2-5')}
						</Row>
					</Row>
				)
			// unpublished and pending approval
			case !isPublished && isPendingPublication:
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
		isPendingPublication &&
		isSalonExists && (
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
			case isDeletedSalon:
				message = null
				break
			case !isFormPristine && !isPendingPublication && !isPublished:
				message = t('loc:V sálone boli vykonané zmeny, ktoré nie sú uložené. Pred požiadaním o schválenie je potrebné zmeny najprv uložiť.')
				break
			case salon.data?.state === SALON_STATES.NOT_PUBLISHED || salon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED:
				message = t('loc:Ak chcete salón publikovať, je potrebné požiadať o jeho schválenie.')
				break
			case !isPublished && !isPendingPublication:
				message = t('loc:V sálone sa nachádzajú nepublikované zmeny, ktoré je pred zverejnením potrebné schváliť administrátorom.')
				break
			case isPendingPublication:
				message = t('loc:Salón čaká na schválenie zmien. Údaje salónu, po túto dobu nie je možné editovať.')
				break
			default:
				message = null
		}

		if (message) {
			return <Alert message={message} showIcon type={'warning'} className={'noti-alert mb-4'} />
		}

		return null
	}, [isPendingPublication, isFormPristine, isPublished, isDeletedSalon, salonID, t, salon.data?.state])

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

	const onTabChange = (selectedTabKey: string) => {
		// set query for history tab
		const newQuery = {
			...query,
			history: selectedTabKey === TAB_KEYS.SALON_HISTORY
		}
		setQuery(newQuery)
		setTabKey(selectedTabKey as TAB_KEYS)
	}

	const approvalButtonDisabled = !get(salon, 'hasAllRequiredSalonApprovalData') || isDeletedSalon || submitting || salon.isLoading

	const salonForm = (
		<>
			<div className='content-body mt-2'>
				<Spin spinning={isLoading}>
					{renderContentHeader()}
					{declinedSalon && declinedSalonMessage}
					{infoMessage}
					<SalonForm
						onSubmit={handleSubmit}
						// edit mode is turned off if salon is in approval process and user is not admin or is deleted 'read mode' only
						disabledForm={isDeletedSalon || (isPendingPublication && !isAdmin)}
						deletedSalon={isDeletedSalon}
						showBasicSalonsSuggestions={showBasicSalonsSuggestions}
						loadBasicSalon={loadBasicSalon}
						clearSalonForm={clearSalonForm}
						searchSalons={searchSalons}
						noteModalControlButtons={
							isSalonExists && (
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
												disabled={isDeletedSalon}
											>
												{STRINGS(t).edit(t('loc:poznámku'))}
											</Button>
											<DeleteButton
												className={'ml-2 w-12/25 xl:w-1/3'}
												getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
												onConfirm={deleteOpenHoursNote}
												entityName={t('loc:poznámku')}
												disabled={isDeletedSalon}
											/>
										</>
									) : (
										<Button
											type={'primary'}
											block
											size={'middle'}
											className={'noti-btn m-regular w-1/3'}
											onClick={() => setVisible(true)}
											disabled={isDeletedSalon}
										>
											{STRINGS(t).addRecord(t('loc:poznámku'))}
										</Button>
									)}
								</Row>
							)
						}
					/>
					{isSalonExists && (
						<OpenHoursNoteModal visible={visible} salonID={salonID} openingHoursNote={salon?.data?.openingHoursNote} onClose={onOpenHoursNoteModalClose} />
					)}
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
			{salonID && !isNewSalon && (
				<SalonApprovalModal
					visible={approvalModalVisible}
					onCancel={() => setApprovalModalVisible(false)}
					parentPath={`${t('paths:salons')}/${salonID}/`}
					submitButton={
						<Permissions
							allowed={[...permissions, SALON_PERMISSION.PARTNER_ADMIN, SALON_PERMISSION.SALON_UPDATE]}
							render={(hasPermission, { openForbiddenModal }) => (
								<Button
									type={'primary'}
									block
									size={'large'}
									className={'noti-btn m-regular'}
									disabled={approvalButtonDisabled}
									onClick={(e) => {
										if (hasPermission) {
											sendConfirmationRequest()
										} else {
											e.preventDefault()
											openForbiddenModal()
										}
									}}
								>
									{t('loc:Požiadať o schválenie')}
								</Button>
							)}
						/>
					}
				/>
			)}
		</>
	)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			{isAdmin && !isNewSalon ? (
				<TabsComponent
					className={'box-tab'}
					activeKey={tabKey}
					onChange={onTabChange}
					tabsContent={[
						{
							tabKey: TAB_KEYS.SALON_DETAIL,
							tab: <>{t('loc:Detail salónu')}</>,
							tabPaneContent: salonForm
						},
						{
							tabKey: TAB_KEYS.SALON_HISTORY,
							tab: <>{t('loc:História salónu')}</>,
							tabPaneContent: (
								<div className='content-body mt-2'>
									<SalonHistory salonID={salonID} tabKey={tabKey} />
								</div>
							)
						}
					]}
				/>
			) : (
				salonForm
			)}
		</>
	)
}

export default compose(withPermissions(permissions))(SalonPage)
