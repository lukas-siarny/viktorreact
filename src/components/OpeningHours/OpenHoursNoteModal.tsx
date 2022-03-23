import React, { FC, useState } from 'react'
import { Modal, Button } from 'antd'

// components
import OpenHoursNoteForm from './OpenHoursNoteForm'

type Props = {
	visible?: boolean
	handleCancel?: () => void
	title?: string
}

const OpenHoursNoteModal = (props: Props) => {
	const { visible, handleCancel = () => {}, title } = props

	const handleOk = () => {
		handleCancel()
	}

	return (
		<Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel}>
			<OpenHoursNoteForm />
		</Modal>
	)
}

export default OpenHoursNoteModal
