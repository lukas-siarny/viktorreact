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
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

// interfaces
import { IOpenHoursNoteForm } from '../../types/interfaces'

type Props = {
	visible?: boolean
	onClose?: () => void
	title?: string
	salonID: number
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
				hoursNote: {
					note: openingHoursNote?.note,
					range: {
						dateFrom: openingHoursNote?.validFrom,
						dateTo: openingHoursNote?.validTo
					}
				}
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
