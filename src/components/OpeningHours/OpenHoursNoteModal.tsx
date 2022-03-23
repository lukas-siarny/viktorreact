import React, { FC, useState } from 'react'
import { Modal, Button } from 'antd'
import { useDispatch } from 'react-redux'
import { reset } from 'redux-form'

// components
import OpenHoursNoteForm from './OpenHoursNoteForm'

// utils
import { patchReq, postReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM } from '../../utils/enums'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

// interfaces
import { IOpenHoursNoteForm } from '../../types/interfaces'

type Props = {
	visible?: boolean
	onClose?: () => void
	title?: string
	salonID: number
}

const OpenHoursNoteModal = (props: Props) => {
	const { visible, onClose = () => {}, title, salonID } = props
	const dispatch = useDispatch()

	const hideModal = () => {
		dispatch(reset(FORM.OPEN_HOURS_NOTE))
		onClose()
	}

	const handleSubmit = async (values: IOpenHoursNoteForm) => {
		try {
			const reqData = {
				openingHoursNote: {
					note: values?.hoursNote?.note,
					validFrom: values?.hoursNote?.range?.dateFrom,
					validTo: values?.hoursNote?.range?.dateTo
				}
			}

			await patchReq('/api/b2b/admin/salons/{salonID}/open-hours-note', { salonID }, reqData, undefined, NOTIFICATION_TYPE.NOTIFICATION, true)
			hideModal()
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log(e)
		}
	}

	return (
		<Modal key={`${visible}`} title={title} visible={visible} onCancel={hideModal} footer={null} closeIcon={<CloseIcon />}>
			<OpenHoursNoteForm onSubmit={handleSubmit} />
		</Modal>
	)
}

export default OpenHoursNoteModal
