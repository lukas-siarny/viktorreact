import React, { useMemo } from 'react'
import { Modal } from 'antd'
import { reset } from 'redux-form'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

// components
import OpenHoursNoteForm from './OpenHoursNoteForm'

// utils
import { patchReq } from '../../utils/request'
import { NOTIFICATION_TYPE, FORM, PERMISSION, MSG_TYPE } from '../../utils/enums'
import { checkPermissions } from '../../utils/Permissions'
import showNotifications from '../../utils/tsxHelpers'

// assets
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg'

// interfaces
import { IOpenHoursNoteForm } from '../../types/interfaces'

// redux
import { RootState } from '../../reducers'

type Props = {
	visible?: boolean
	onClose?: () => void
	title?: string
	salonID: number
}

const OpenHoursNoteModal = (props: Props) => {
	const { visible, onClose = () => {}, title, salonID } = props
	const [t] = useTranslation()
	const dispatch = useDispatch()
	const authUserPermissions = useSelector((state: RootState) => state.user?.authUser?.data?.uniqPermissions || [])

	const isModalVisible = useMemo(() => {
		if (!visible) return false
		const hasPermission = checkPermissions(authUserPermissions, [PERMISSION.SUPER_ADMIN, PERMISSION.ADMIN, PERMISSION.PARTNER, PERMISSION.SALON_EDIT])
		if (hasPermission) return true

		showNotifications([{ type: MSG_TYPE.ERROR, message: t('loc:Pre túto akciu nemáte dostatočné oprávnenia.') }], NOTIFICATION_TYPE.NOTIFICATION)
		return false
	}, [visible, t, authUserPermissions])

	if (!isModalVisible && visible) onClose() // if OpenHoursNoteModal was opened but user does not have permission, "close" modal state in parent component

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
		<Modal key={`${isModalVisible}`} title={title} visible={isModalVisible} onCancel={hideModal} footer={null} closeIcon={<CloseIcon />}>
			<OpenHoursNoteForm onSubmit={handleSubmit} />
		</Modal>
	)
}

export default OpenHoursNoteModal
