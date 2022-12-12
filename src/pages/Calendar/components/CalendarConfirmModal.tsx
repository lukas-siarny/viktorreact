import React, { FC, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initialize, submit } from 'redux-form'
import { useTranslation } from 'react-i18next'
import ConfirmModal, { IConfirmModal } from '../../../atoms/ConfirmModal'
import {
	ConfirmModalDataValues,
	IBulkConfirmForm,
	ICalendarEventForm,
	ICalendarReservationForm,
	ConfirmModalReservationData,
	ConfirmModalDeleteEventData,
	ConfirmModalEventnData,
	ConfirmModalUpdateReservationData
} from '../../../types/interfaces'
import {
	CALENDAR_DISABLED_NOTIFICATION_TYPE,
	CALENDAR_EVENT_TYPE,
	CONFIRM_BULK,
	CONFIRM_MODAL_DATA_TYPE,
	FORM,
	REQUEST_TYPE,
	RESERVATION_PAYMENT_METHOD,
	RESERVATION_STATE,
	STRINGS
} from '../../../utils/enums'
import ConfirmBulkForm from './forms/ConfirmBulkForm'
import { getConfirmModalText } from '../calendarHelpers'
import { RootState } from '../../../reducers'

// assets
import { ReactComponent as CloseIcon } from '../../../assets/icons/close-icon-2.svg'

export type ConfirmModalData = {
	/* reservation: { values: ICalendarReservationForm } | null
	event: { values: ICalendarEventForm } | null
	deleteEvent: {
		eventId: string
		calendarBulkEventID?: string
		eventType?: CALENDAR_EVENT_TYPE
	} | null
	updateReservation: {
		calendarEventID: string
		state: RESERVATION_STATE
		reason?: string
		paymentMethod?: RESERVATION_PAYMENT_METHOD
	} | null */
	dataType: CONFIRM_MODAL_DATA_TYPE
	dataValues: ConfirmModalDataValues
} | null

type Props = {
	data: ConfirmModalData
	handleSubmitReservation: (values: ICalendarReservationForm, eventId?: string) => void
	handleSubmitEvent: (values: ICalendarEventForm, calendarEventID?: string, calendarBulkEventID?: string) => void
	handleDeleteEvent: (calendarEventID: string, calendarBulkEventID?: string) => void
	handleUpdateReservationState: (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) => void
	loadingData?: boolean
	queryEventId?: string | null
}

const INIT_CONFIRM_MODAL_VALUES = {
	visible: false,
	onOk: undefined,
	onCancel: undefined,
	content: null,
	title: undefined
}

interface IConfirmModalState extends IConfirmModal {
	content: React.ReactNode
}

const CalendarConfirmModal: FC<Props> = (props) => {
	const { handleSubmitReservation, handleSubmitEvent, handleDeleteEvent, handleUpdateReservationState, loadingData, queryEventId, data } = props
	const { dataType, dataValues } = data || {}

	const [confirmModal, setConfirmModal] = useState<IConfirmModalState>(INIT_CONFIRM_MODAL_VALUES)
	const disabledNotifications = useSelector((state: RootState) => state.selectedSalon.selectedSalon.data?.settings?.disabledNotifications)

	const [t] = useTranslation()

	const clearConfirmModal = () => setConfirmModal(INIT_CONFIRM_MODAL_VALUES)

	const dispatch = useDispatch()

	const handleSubmitReservationWrapper = (values: ICalendarReservationForm) => {
		// wrapper ktory rozhoduje, ci je potrebne potvrdit event alebo rovno submitnut
		// NOTE: ak je eventID z values tak sa funkcia vola z drag and drop / resize ak ide z query tak je otvoreny detail cez URL / kliknutim na bunku
		const eventId = values?.eventId || queryEventId || undefined

		if (eventId) {
			setConfirmModal({
				visible: true,
				title: STRINGS(t).edit(t('loc:rezerváciu')),
				onOk: () => handleSubmitReservation(values, eventId),
				onCancel: () => {
					if (values.revertEvent) {
						values.revertEvent()
					}
				},
				content: getConfirmModalText(t('loc:Naozaj chcete upraviť rezerváciu?'), CALENDAR_DISABLED_NOTIFICATION_TYPE.RESERVATION_CHANGED, disabledNotifications)
			})
		} else {
			handleSubmitReservation(values, eventId)
		}
	}

	const handleSubmitEventWrapper = (values: ICalendarEventForm) => {
		// wrapper ktory rozhoduje, ci je potrebne potvrdit event alebo rovno submitnut
		// NOTE: ak je eventID z values tak sa funkcia vola z drag and drop / resize ak ide z query tak je otvoreny detail cez URL / kliknutim na bunku
		const eventId = values?.eventId || queryEventId || undefined

		if (values.calendarBulkEventID) {
			dispatch(initialize(FORM.CONFIRM_BULK_FORM, { actionType: CONFIRM_BULK.BULK }))

			const handleSubmitConfirmBulkForm = (bulkFormValues: IBulkConfirmForm) => {
				handleSubmitEvent(values, eventId, bulkFormValues.actionType === CONFIRM_BULK.BULK ? values.calendarBulkEventID : undefined)
			}

			setConfirmModal({
				visible: true,
				title: STRINGS(t).edit(t('loc:záznam')),
				onOk: () => dispatch(submit(FORM.CONFIRM_BULK_FORM)),
				onCancel: () => {
					if (values.revertEvent) {
						values.revertEvent()
					}
					clearConfirmModal()
				},
				content: <ConfirmBulkForm requestType={REQUEST_TYPE.PATCH} onSubmit={handleSubmitConfirmBulkForm} />
			})
		} else {
			handleSubmitEvent(values, eventId)
		}
	}

	const handleDeleteEventWrapper = (eventId: string, calendarBulkEventID?: string, eventType?: CALENDAR_EVENT_TYPE) => {
		// wrapper ktory rozhoduje, ci je potrebne potvrdit event alebo rovno submitnut
		// v tomto pripade zatial vyskoci vzdy konfirmacny modal
		let modalProps: IConfirmModalState = {} as IConfirmModalState

		if (calendarBulkEventID) {
			dispatch(initialize(FORM.CONFIRM_BULK_FORM, { actionType: CONFIRM_BULK.BULK }))

			const handleSubmitConfirmBulkForm = (bulkFormValues: IBulkConfirmForm) => {
				handleDeleteEvent(eventId, bulkFormValues.actionType === CONFIRM_BULK.BULK ? calendarBulkEventID : undefined)
			}

			modalProps = {
				...modalProps,
				content: <ConfirmBulkForm requestType={REQUEST_TYPE.DELETE} eventType={eventType} onSubmit={handleSubmitConfirmBulkForm} />,
				onOk: () => dispatch(submit(FORM.CONFIRM_BULK_FORM))
			}
		} else {
			const deleteMessage = STRINGS(t).areYouSureDelete(t('loc:záznam'))
			modalProps = {
				...modalProps,
				content:
					eventType === CALENDAR_EVENT_TYPE.RESERVATION
						? getConfirmModalText(deleteMessage, CALENDAR_DISABLED_NOTIFICATION_TYPE.RESERVATION_CANCELLED, disabledNotifications)
						: deleteMessage,
				onOk: () => handleDeleteEvent(eventId, calendarBulkEventID)
			}
		}

		setConfirmModal({
			visible: true,
			title: STRINGS(t).delete(t('loc:záznam')),
			onCancel: () => clearConfirmModal(),
			...modalProps
		})
	}

	const handleUpdateReservationStateWrapper = (calendarEventID: string, state: RESERVATION_STATE, reason?: string, paymentMethod?: RESERVATION_PAYMENT_METHOD) => {
		// wrapper ktory rozhoduje, ci je potrebne potvrdit event alebo rovno submitnut
		if (state === RESERVATION_STATE.DECLINED || state === RESERVATION_STATE.NOT_REALIZED || state === RESERVATION_STATE.CANCEL_BY_SALON) {
			let modalProps: IConfirmModalState = {} as IConfirmModalState

			switch (state) {
				case RESERVATION_STATE.DECLINED:
					modalProps = {
						...modalProps,
						title: STRINGS(t).decline(t('loc:rezerváciu')),
						content: getConfirmModalText(t('loc:Naozaj chcete zamietnuť rezerváciu?'), CALENDAR_DISABLED_NOTIFICATION_TYPE.RESERVATION_REJECTED, disabledNotifications)
					}
					break
				case RESERVATION_STATE.CANCEL_BY_SALON:
					modalProps = {
						...modalProps,
						title: STRINGS(t).cancel(t('loc:rezerváciu')),
						content: getConfirmModalText(t('loc:Naozaj chcete zrušiť rezerváciu?'), CALENDAR_DISABLED_NOTIFICATION_TYPE.RESERVATION_CANCELLED, disabledNotifications)
					}
					break
				case RESERVATION_STATE.NOT_REALIZED:
					modalProps = {
						...modalProps,
						title: t('loc:Nezrealizovaná'),
						content: t('loc:Naozaj chcete označiť rezerváciu za nezrealizovanú?')
					}
					break
				default:
					break
			}

			setConfirmModal({
				visible: true,
				onOk: () => handleUpdateReservationState(calendarEventID, state, reason, paymentMethod),
				onCancel: () => clearConfirmModal(),
				okText: t('loc:Áno'),
				cancelText: t('loc:Nie'),
				...modalProps
			})
		} else {
			handleUpdateReservationState(calendarEventID, state, reason, paymentMethod)
		}
	}

	useEffect(() => {
		if (!data) {
			setConfirmModal(INIT_CONFIRM_MODAL_VALUES)
		}
		switch (dataType) {
			case CONFIRM_MODAL_DATA_TYPE.RESERVATION:
				handleSubmitReservationWrapper((dataValues as ConfirmModalReservationData)?.values)
				return
			case CONFIRM_MODAL_DATA_TYPE.EVENT:
				handleSubmitEventWrapper((dataValues as ConfirmModalEventnData)?.values)
				return
			case CONFIRM_MODAL_DATA_TYPE.DELETE_EVENT: {
				const values = dataValues as ConfirmModalDeleteEventData
				handleDeleteEventWrapper(values?.eventId, values?.calendarBulkEventID, values?.eventType)
				return
			}
			case CONFIRM_MODAL_DATA_TYPE.UPDATE_RESERVATION_STATE: {
				const values = dataValues as ConfirmModalUpdateReservationData
				handleUpdateReservationStateWrapper(values?.calendarEventID, values?.state, values?.reason, values?.paymentMethod)
				// eslint-disable-next-line no-useless-return
				return
			}
			default:
				// eslint-disable-next-line no-useless-return
				return
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return (
		<ConfirmModal loading={loadingData} disabled={loadingData} closeIcon={<CloseIcon />} destroyOnClose zIndex={2000} {...confirmModal}>
			{confirmModal.content}
		</ConfirmModal>
	)
}

export default CalendarConfirmModal
