import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal, Row, Spin, Tooltip } from 'antd'
import { destroy, initialize, isPristine, reset, submit } from 'redux-form'
import { compose } from 'redux'
import cx from 'classnames'
import { useNavigate } from 'react-router-dom'

// components
import DeleteButton from '../../components/DeleteButton'
import Breadcrumbs from '../../components/Breadcrumbs'
import SalonForm from './components/forms/SalonForm'
import OpenHoursNoteModal from '../../components/OpeningHours/OpenHoursNoteModal'
import { scrollToTopFn } from '../../components/ScrollToTop'
import NoteForm from './components/forms/NoteForm'
import TabsComponent from '../../components/TabsComponent'
import SalonHistory from './components/SalonHistory'
import SalonApprovalModal from './components/modals/SalonApprovalModal'

// enums
import { DELETE_BUTTON_ID, FORM, NOTIFICATION_TYPE, PERMISSION, SALON_STATES, STRINGS, TAB_KEYS, SALON_CREATE_TYPE, SUBMIT_BUTTON_ID } from '../../utils/enums'

// reducers
import { RootState } from '../../reducers'
import { selectSalon } from '../../reducers/selectedSalon/selectedSalonActions'
import { getCurrentUser } from '../../reducers/users/userActions'

// types
import { IBreadcrumbs, INoteForm, INoteModal, INotinoUserForm, ISalonForm, SalonPageProps } from '../../types/interfaces'

// utils
import { deleteReq, patchReq } from '../../utils/request'
import Permissions, { withPermissions } from '../../utils/Permissions'
import { formFieldID, getAssignedUserLabel } from '../../utils/helper'
import { getSalonDataForSubmission, initSalonFormData } from './components/salonUtils'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-2.svg'
import { ReactComponent as EyeoffIcon } from '../../assets/icons/eyeoff-24.svg'
import { ReactComponent as CheckIcon } from '../../assets/icons/check-icon.svg'
import { ReactComponent as CloseCricleIcon } from '../../assets/icons/close-circle-icon-24.svg'
import { ReactComponent as EditIcon } from '../../assets/icons/edit-icon.svg'
import NotinoUserForm from './components/forms/NotinoUserForm'

// hooks
import useQueryParams, { BooleanParam } from '../../hooks/useQueryParams'

const permissions: PERMISSION[] = [PERMISSION.NOTINO, PERMISSION.PARTNER]

const pendingStates: string[] = [SALON_STATES.NOT_PUBLISHED_PENDING, SALON_STATES.PUBLISHED_PENDING]

interface SalonEditPageProps extends SalonPageProps {
	salonID: string
}

const SalonEditPage: FC<SalonEditPageProps> = (props) => {
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { salonID, isNotinoUser, backUrl, phonePrefixes, authUser, phonePrefixCountryCode } = props

	const [submitting, setSubmitting] = useState<boolean>(false)
	const [isSendingConfRequest, setIsSendingConfRequest] = useState<boolean>(false)
	const [isRemoving, setIsRemoving] = useState<boolean>(false)

	const [openingHoursModalVisble, setOpeningHoursModalVisble] = useState<boolean>(false)
	const [modalConfig, setModalConfig] = useState<INoteModal>({ title: '', fieldPlaceholderText: '', onSubmit: undefined, visible: false })
	const [approvalModalVisible, setApprovalModalVisible] = useState(false)
	const [visibleNotinoUserModal, setVisibleNotinoUserModal] = useState(false)

	const [tabKey, setTabKey] = useState<TAB_KEYS>(TAB_KEYS.SALON_DETAIL)

	const salon = useSelector((state: RootState) => state.selectedSalon.selectedSalon)
	const isFormPristine = useSelector(isPristine(FORM.SALON))

	const isDeletedSalon = !!salon?.data?.deletedAt && salon?.data?.deletedAt !== null
	const isSubmittingData = submitting || isRemoving || isSendingConfRequest

	const isLoading = salon.isLoading || phonePrefixes?.isLoading || authUser?.isLoading || isSubmittingData
	const isPendingPublication = (salon.data && pendingStates.includes(salon.data.state)) || false
	const isPublished = salon.data?.isPublished

	const declinedSalon = salon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED || salon.data?.state === SALON_STATES.PUBLISHED_DECLINED
	const hiddenSalon = salon.data?.state === SALON_STATES.NOT_PUBLISHED && salon.data?.publicationDeclineReason
	const isBasic = salon.data?.createType === SALON_CREATE_TYPE.BASIC

	const assignedUserLabel = getAssignedUserLabel(salon.data?.assignedUser)

	const [query, setQuery] = useQueryParams({
		history: BooleanParam(false)
	})

	const dontUpdateFormData = useRef(false)

	// load salon data
	useEffect(() => {
		dispatch(selectSalon(salonID))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch])

	// change tab based on query
	useEffect(() => {
		if (query.history) {
			setTabKey(TAB_KEYS.SALON_HISTORY)
		}
	}, [query.history])

	// init form
	useEffect(() => {
		if (!dontUpdateFormData.current) {
			dispatch(initialize(FORM.SALON, initSalonFormData(salon.data, phonePrefixCountryCode)))
			dontUpdateFormData.current = false
		}
	}, [salon.data, dispatch, phonePrefixCountryCode])

	const handleSubmit = async (data: ISalonForm) => {
		try {
			setSubmitting(true)
			await patchReq('/api/b2b/admin/salons/{salonID}', { salonID }, getSalonDataForSubmission(data) as any)
			dispatch(selectSalon(salonID))
		} catch (error: any) {
			// eslint-disable-next-line no-console
			console.error(error.message)
		} finally {
			setSubmitting(false)
			scrollToTopFn()
		}
	}

	const breadcrumbDetailItem = {
		name: tabKey === TAB_KEYS.SALON_DETAIL ? t('loc:Detail salónu') : t('loc:História salónu'),
		titleName: `${salon.data?.name ?? ''} | ID: ${salon.data?.id}`
	}

	// View
	const breadcrumbs: IBreadcrumbs = {
		items: isNotinoUser
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
			if (isNotinoUser) {
				navigate(backUrl as string)
			} else {
				// check if there are any other salons assigned to user and redircet user to first of them
				const { data } = await dispatch(getCurrentUser())
				const salonToRedirect = (data?.salons || [])[0]
				if (salonToRedirect) {
					navigate(`${t('paths:salons')}/${salonToRedirect.id}`)
				} else {
					// otherwise redirect user to dashboard
					await dispatch(selectSalon())
					navigate(t('paths:index'))
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

	const deleteAssignedUser = async () => {
		if (isRemoving) {
			return
		}

		setIsRemoving(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/assigned-user', { salonID }, { assignedUserID: null }, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			dispatch(destroy(FORM.NOTINO_USER))
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

		setIsSendingConfRequest(true)
		try {
			await patchReq('/api/b2b/admin/salons/{salonID}/request-publication', { salonID }, {})
			dispatch(selectSalon(salonID))
			setApprovalModalVisible(false)
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
		dontUpdateFormData.current = true
		setOpeningHoursModalVisble(false)
		dispatch(selectSalon(salonID))
	}

	const submitButton = (className = '') => (
		<Permissions
			allowed={[PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<Button
					id={formFieldID(FORM.SALON, SUBMIT_BUTTON_ID)}
					type={'primary'}
					icon={<EditIcon />}
					size={'middle'}
					className={cx('noti-btn m-regular w-full md:w-auto md:min-w-45 xl:min-w-60', className)}
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
					disabled={isLoading || isDeletedSalon || isFormPristine || (!isPublished && isPendingPublication && !isNotinoUser)}
					loading={submitting}
				>
					{t('loc:Uložiť')}
				</Button>
			)}
		/>
	)

	const deleteButton = (className = '') => (
		<DeleteButton
			permissions={[PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_DELETE]}
			className={cx('w-full md:w-auto md:min-w-45 xl:min-w-60', className)}
			onConfirm={deleteSalon}
			entityName={t('loc:salón')}
			type={'default'}
			getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
			disabled={isLoading || isDeletedSalon}
			id={formFieldID(FORM.SALON, DELETE_BUTTON_ID)}
		/>
	)

	const hideSalonButton = (className = '') => (
		<Permissions
			allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_UPDATE]}
			render={(hasPermission, { openForbiddenModal }) => (
				<Button
					id={formFieldID(FORM.SALON, 'hide-salon')}
					type={'dashed'}
					size={'middle'}
					icon={<EyeoffIcon color={'#000'} />}
					className={cx('noti-btn m-regular w-full md:w-auto md:min-w-45 xl:min-w-60', className)}
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
					disabled={isLoading || isDeletedSalon}
					loading={submitting}
				>
					{t('loc:Skryť salón')}
				</Button>
			)}
		/>
	)

	const requestApprovalButton = (className = '') => {
		const disabled = isLoading || isDeletedSalon || (!isFormPristine && !isPendingPublication && (!isPublished || isBasic))

		// Workaround for disabled button inside tooltip: https://github.com/react-component/tooltip/issues/18
		return (
			<Tooltip
				title={disabled ? t('loc:V sálone boli vykonané zmeny, ktoré nie sú uložené. Pred požiadaním o schválenie je potrebné zmeny najprv uložiť.') : null}
				getPopupContainer={() => document.getElementById('content-footer-container') || document.body}
			>
				<span className={cx('w-full md:w-auto', { 'cursor-not-allowed': disabled })}>
					<Button
						id={formFieldID(FORM.SALON, 'request-publication')}
						type={'dashed'}
						size={'middle'}
						className={cx('noti-btn m-regular w-full md:w-auto md:min-w-45 xl:min-w-60', className, {
							'pointer-events-none': disabled
						})}
						disabled={disabled}
						onClick={() => {
							dontUpdateFormData.current = true
							dispatch(selectSalon(salonID))
							setApprovalModalVisible(true)
						}}
						loading={submitting}
					>
						{t('loc:Požiadať o schválenie')}
					</Button>
				</span>
			</Tooltip>
		)
	}

	// render buttons on footer based on salon statuses
	const renderContentFooter = () => {
		if (isDeletedSalon) {
			return null
		}

		return (
			<div className={'content-footer'} id={'content-footer-container'}>
				{(() => {
					// order of cases is important to show correct buttons
					switch (true) {
						// pending approval
						case isPendingPublication:
							return (
								<Row className={'w-full gap-2'} justify={'space-between'}>
									{deleteButton('mt-2-5 w-52 xl:w-60')}
									{submitButton('mt-2-5 w-52 xl:w-60')}
								</Row>
							)
						// published and not pending
						case isPublished && !isPendingPublication && !isBasic:
							return (
								<Row className={'w-full gap-2 md:items-center flex-col md:flex-row md:justify-between md:flex-nowrap'}>
									<Row className={'gap-2 flex-row-reverse justify-end w-full'}>
										{/* if is admin show -> hide button */}
										{isNotinoUser && hideSalonButton('')}
										{deleteButton('')}
									</Row>
									{submitButton('')}
								</Row>
							)
						// default
						default:
							return (
								<Row className={'w-full gap-2 flex-col md:flex-nowrap md:flex-row'}>
									{deleteButton('')}
									<Row className={'gap-2 flex-1 md:justify-end w-full'}>
										{requestApprovalButton('')}
										{submitButton('')}
									</Row>
								</Row>
							)
					}
				})()}
			</div>
		)
	}

	const infoMessage = useMemo(() => {
		let message: string | null

		// order of cases is important to show correct message
		switch (true) {
			case isDeletedSalon:
				message = null
				break
			case isPendingPublication && !isNotinoUser:
				message = t('loc:Salón čaká na schválenie zmien. Údaje salónu, po túto dobu nie je možné editovať.')
				break
			case !isPendingPublication && !isFormPristine && (!isPublished || isBasic):
				message = t('loc:V sálone boli vykonané zmeny, ktoré nie sú uložené. Pred požiadaním o schválenie je potrebné zmeny najprv uložiť.')
				break
			case salon.data?.state === SALON_STATES.NOT_PUBLISHED || salon.data?.state === SALON_STATES.NOT_PUBLISHED_DECLINED:
				message = t('loc:Ak chcete salón publikovať, je potrebné požiadať o jeho schválenie.')
				break
			case !isPendingPublication && isPublished && isBasic:
				message = t('loc:V sálone sa nachádzajú nepublikované zmeny, ktoré je pred zverejnením potrebné schváliť administrátorom.')
				break
			default:
				message = null
		}

		if (message) {
			return <Alert message={message} showIcon type={'warning'} className={'noti-alert w-full'} />
		}

		return null
	}, [isPendingPublication, isFormPristine, isPublished, isDeletedSalon, t, salon.data?.state, isNotinoUser, isBasic])

	const declinedSalonMessage = useMemo(
		() =>
			declinedSalon ? (
				<Alert
					message={
						<>
							<strong className={'block'}>{`${t('loc:Salón bol zamietnutý z dôvodu')}:`}</strong>
							<p className={'whitespace-pre-wrap m-0'}>
								{salon?.data?.publicationDeclineReason ? `"${salon?.data?.publicationDeclineReason}"` : t('loc:Bez udania dôvodu.')}
							</p>
						</>
					}
					showIcon
					type={'error'}
					className={'noti-alert mb-4'}
				/>
			) : undefined,
		[t, salon?.data?.publicationDeclineReason, declinedSalon]
	)

	const hiddenSalonMessage = useMemo(
		() =>
			hiddenSalon ? (
				<Alert
					message={
						<>
							<strong className={'block'}>{`${t('loc:Salón bol skrytý z dôvodu')}:`}</strong>
							<p className={'whitespace-pre-wrap m-0'}>{`"${salon?.data?.publicationDeclineReason}"`}</p>
						</>
					}
					showIcon
					type={'error'}
					className={'noti-alert mb-4'}
				/>
			) : undefined,
		[t, salon?.data?.publicationDeclineReason, hiddenSalon]
	)

	const renderContentHeaderPartner = () => infoMessage && <div className={'content-header z-10'}>{infoMessage}</div>

	const renderContentHeaderAdmin = () =>
		(infoMessage || isPendingPublication) && (
			<div className={cx('content-header flex-col gap-2', { warning: isPendingPublication })}>
				{isPendingPublication && (
					<Permissions
						allowed={[PERMISSION.SALON_PUBLICATION_RESOLVE]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Row justify={'space-between'} className={'w-full'}>
								<Button
									id={formFieldID(FORM.SALON, 'decline-salon')}
									type={'primary'}
									icon={<CloseCricleIcon />}
									size={'middle'}
									className={'ant-btn-dangerous noti-btn m-regular hover:shadow-none w-44 xl:w-56'}
									onClick={(e) => {
										if (hasPermission) {
											setModalConfig({
												title: t('loc:Dôvod zamietnutia'),
												fieldPlaceholderText: t('loc:Sem napíšte dôvod zamietnutia'),
												visible: true,
												onSubmit: resolveConfirmationRequest
											})
										} else {
											e.preventDefault()
											openForbiddenModal()
										}
									}}
									disabled={submitting}
									loading={submitting}
								>
									{t('loc:Zamietnuť')}
								</Button>
								<Button
									id={formFieldID(FORM.SALON, 'accept-salon')}
									type={'primary'}
									icon={<CheckIcon />}
									size={'middle'}
									className={'noti-btn m-regular w-44 xl:w-56'}
									onClick={(e) => {
										if (hasPermission) {
											resolveConfirmationRequest()
										} else {
											e.preventDefault()
											openForbiddenModal()
										}
									}}
									disabled={submitting}
									loading={submitting}
								>
									{t('loc:Potvrdiť')}
								</Button>
							</Row>
						)}
					/>
				)}
				{infoMessage}
			</div>
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

	const approvalButtonDisabled = !salon?.data?.hasAllRequiredSalonApprovalData || isDeletedSalon || isSubmittingData || salon?.isLoading || isPendingPublication

	const getApprovalButtonTooltipMessage = () => {
		if (!salon?.data?.hasAllRequiredSalonApprovalData && !isPendingPublication) {
			return t('loc:Žiadosť o scvhálenie nie je možné odoslať, pretože nie sú vyplnené všetky potrebné údaje zo zoznamu nižšie.')
		}
		if (isPendingPublication) {
			return t('loc:Žiadosť o schválenie už bola odoslaná. Počkajte prosím na jej vybavenie.')
		}
		return null
	}
	const onSubmitNotinoUser = async (values?: INotinoUserForm) => {
		try {
			// fallback for allowClear true if user removed assigned user send null value
			await patchReq('/api/b2b/admin/salons/{salonID}/assigned-user', { salonID }, { assignedUserID: (values?.assignedUser?.key as string) || null })
			setVisibleNotinoUserModal(false)
			await dispatch(selectSalon(salonID))
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e)
		}
	}

	const salonForm = (
		<>
			<div className='content-body'>
				<Spin spinning={isLoading}>
					{isNotinoUser ? renderContentHeaderAdmin() : renderContentHeaderPartner()}
					{declinedSalonMessage}
					{hiddenSalonMessage}
					<SalonForm
						onSubmit={handleSubmit}
						// edit mode is turned off if salon is in approval process and user is not admin or is deleted 'read mode' only
						disabledForm={isDeletedSalon || (isPendingPublication && !isNotinoUser)}
						deletedSalon={isDeletedSalon}
						notinoUserModalControlButtons={
							isNotinoUser && (
								<Row className={'flex justify-start w-full gap-2 pb-4'}>
									{salon?.data?.assignedUser?.id ? (
										<>
											<div className='w-full'>
												<h4>{t('loc:Priradený Notino používateľ')}</h4>
												<i className='block text-base'>{assignedUserLabel}</i>
											</div>
											<Button
												type={'primary'}
												size={'middle'}
												className={'noti-btn m-regular'}
												onClick={() => {
													setVisibleNotinoUserModal(true)
													dispatch(
														initialize(FORM.NOTINO_USER, {
															assignedUser: { key: salon.data?.assignedUser?.id, value: salon.data?.assignedUser?.id, label: assignedUserLabel }
														})
													)
												}}
												disabled={isDeletedSalon || isPendingPublication}
											>
												{STRINGS(t).edit(t('loc:notino používateľa'))}
											</Button>
											<DeleteButton onConfirm={deleteAssignedUser} entityName={t('loc:notino používateľa')} disabled={isDeletedSalon} />
										</>
									) : (
										<Button
											type={'primary'}
											size={'middle'}
											className={'noti-btn m-regular'}
											onClick={() => setVisibleNotinoUserModal(true)}
											disabled={isDeletedSalon || isPendingPublication}
										>
											{STRINGS(t).addRecord(t('loc:notino používateľa'))}
										</Button>
									)}
								</Row>
							)
						}
						noteModalControlButtons={
							<Row className={'flex justify-start w-full mt-4 gap-2'}>
								{salon?.data?.openingHoursNote ? (
									<>
										<div className='w-full'>
											<h4>{t('loc:Poznámka pre otváracie hodiny')}</h4>
											<i className='block mb-2 text-base'>{salon.data.openingHoursNote.note}</i>
										</div>
										<Button
											type={'primary'}
											size={'middle'}
											className={'noti-btn m-regular mt-2'}
											onClick={() => setOpeningHoursModalVisble(true)}
											disabled={isDeletedSalon || (isPendingPublication && !isNotinoUser)}
										>
											{STRINGS(t).edit(t('loc:poznámku'))}
										</Button>
										<DeleteButton className={'mt-2'} onConfirm={deleteOpenHoursNote} entityName={t('loc:poznámku')} disabled={isDeletedSalon} />
									</>
								) : (
									<Button
										type={'primary'}
										size={'middle'}
										className={'noti-btn m-regular mt-2'}
										onClick={() => setOpeningHoursModalVisble(true)}
										disabled={isDeletedSalon || (isPendingPublication && !isNotinoUser)}
									>
										{STRINGS(t).addRecord(t('loc:poznámku'))}
									</Button>
								)}
							</Row>
						}
					/>
					{renderContentFooter()}
				</Spin>
			</div>
			<OpenHoursNoteModal
				title={t('loc:Poznámka pre otváracie hodiny')}
				visible={openingHoursModalVisble}
				salonID={salonID}
				openingHoursNote={salon?.data?.openingHoursNote}
				onClose={onOpenHoursNoteModalClose}
			/>
			<Modal
				key={`${modalConfig.visible}`}
				title={modalConfig.title}
				open={modalConfig.visible}
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
			<Modal
				title={t('loc:Priradiť Notino používateľa')}
				open={visibleNotinoUserModal}
				onCancel={() => setVisibleNotinoUserModal(false)}
				footer={null}
				closeIcon={<CloseIcon />}
			>
				<NotinoUserForm onSubmit={onSubmitNotinoUser} />
			</Modal>
			<SalonApprovalModal
				visible={approvalModalVisible}
				onCancel={() => setApprovalModalVisible(false)}
				parentPath={`${t('paths:salons')}/${salonID}`}
				submitButton={
					<Permissions
						allowed={[PERMISSION.NOTINO, PERMISSION.PARTNER_ADMIN, PERMISSION.SALON_UPDATE]}
						render={(hasPermission, { openForbiddenModal }) => (
							<Tooltip title={getApprovalButtonTooltipMessage()} getPopupContainer={() => document.querySelector('#noti-approval-modal-content') as HTMLElement}>
								<span className={cx({ 'cursor-not-allowed': approvalButtonDisabled })}>
									<Button
										id={formFieldID(FORM.SALON, 'request-publication-modal')}
										type={'primary'}
										block
										size={'large'}
										className={cx('noti-btn m-regular', {
											'pointer-events-none': approvalButtonDisabled
										})}
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
								</span>
							</Tooltip>
						)}
					/>
				}
			/>
		</>
	)

	return (
		<>
			<Row>
				<Breadcrumbs breadcrumbs={breadcrumbs} backButtonPath={t('paths:index')} />
			</Row>
			{isNotinoUser && !isDeletedSalon ? (
				<TabsComponent
					className={'box-tab'}
					activeKey={tabKey}
					onChange={onTabChange}
					items={[
						{
							key: TAB_KEYS.SALON_DETAIL,
							label: <>{t('loc:Detail salónu')}</>,
							children: salonForm
						},
						{
							key: TAB_KEYS.SALON_HISTORY,
							label: <>{t('loc:História salónu')}</>,
							children: (
								<div className='content-body'>
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

export default compose(withPermissions(permissions))(SalonEditPage)
