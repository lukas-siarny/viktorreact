import React, { useEffect } from 'react'
import { Modal } from 'antd'
import { reset, initialize } from 'redux-form'
import { useDispatch } from 'react-redux'

// components
import OpenHoursNoteForm from './OpenHoursNoteForm'

// utils
import { patchReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM } from '../../utils/enums'
import { Paths } from '../../types/api'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon-2.svg'

// schema
import { IOpenHoursNoteForm } from '../../schemas/openHoursNote'

type Props = {
	visible?: boolean
	onClose?: () => void
	title?: string
	salonID: string
	openingHoursNote?: Paths.GetApiB2BAdminSalonsSalonId.Responses.$200['salon']['openingHoursNote']
}

const OpenHoursNoteModal = (props: Props) => {
	const { visible, onClose = () => {}, title, salonID, openingHoursNote } = props
	const dispatch = useDispatch()

	useEffect(() => {
		if (!visible) return // init form only if the modal is opened

		let initData: any

		if (openingHoursNote) {
			initData = {
				openingHoursNote: openingHoursNote.note
			}
		}
		dispatch(initialize(FORM.OPEN_HOURS_NOTE, initData || {}))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible])

	const hideModal = () => {
		dispatch(reset(FORM.OPEN_HOURS_NOTE))
		onClose()
	}

	const handleSubmit = async (values: IOpenHoursNoteForm) => {
		try {
			const reqData = {
				openingHoursNote: {
					note: values?.openingHoursNote
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
		<Modal key={`${visible}`} title={title} open={visible} onCancel={hideModal} footer={null} closeIcon={<CloseIcon />}>
			<OpenHoursNoteForm onSubmit={handleSubmit} />
		</Modal>
	)
}

export default OpenHoursNoteModal
