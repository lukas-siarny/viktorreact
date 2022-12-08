import React, { FC } from 'react'
import ConfirmModal from '../../../atoms/ConfirmModal'
import { ICalendarConfirmModal } from '../../../types/interfaces'
import { CALENDAR_CONFIRM_MODAL_TYPE } from '../../../utils/enums'

interface Props extends ICalendarConfirmModal {
	onClose: () => void
}

const CalendarConfirmModal: FC<Props> = (props) => {
	const { data, type, handleSubmitData } = props


	const getModalProps = () => {
		const props = {
			visible,
			onCancel: () => {
				if (data?.revertEvent) {
					// ak uzivatel zrusi vykonanie akcie, tak sa event v kalendari vrati na pôvodne miesto
					data?.revertEvent()
				}
				onClose()
			},
			onOk: () => {
				handleSubmitData(data, )
			}
		}

		switch (type) {
			case CALENDAR_CONFIRM_MODAL_TYPE:
				return {
					...props,
					title: 'confirm title'
				}
			default:
				return null
		}
	}

	return (
		<ConfirmModal
			title={confirmModal.title}
			visible={confirmModal.visible}
			onCancel={() => {
				if (confirmModal?.data?.revertEvent) {
					// ak uzivatel zrusi vykonanie akcie, tak sa event v kalendari vrati na pôvodne miesto
					confirmModal.data?.revertEvent()
				}
				clearConfirmationModal()
			}}
			onOk={() => {
				if (confirmModal.data) {
					processSubmitReservation(confirmModal.data, confirmModal.eventId)
				}
			}}
			loading={loadingData}
			disabled={loadingData}
			closeIcon={<CloseIcon />}
			destroyOnClose
		>
			{confirmModal.content}
		</ConfirmModal>
	)
}

export default CalendarConfirmModal
