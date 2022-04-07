/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Modal, Button } from 'antd'
import { ComponentStory } from '@storybook/react'

export default {
	title: 'Antd/Modal',
	component: Modal,
	decorators: [withDesign],
	args: {}
}

const Template: ComponentStory<typeof Modal> = (args) => {
	const [showModal, setShowModal] = useState(false)
	return (
		<>
			<Button className='noti-btn m-regular' onClick={() => setShowModal(true)}>
				Open Modal
			</Button>
			<Modal {...args} visible={showModal} onOk={() => setShowModal(false)} onCancel={() => setShowModal(false)}>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
				<p>Some contents...</p>
			</Modal>
		</>
	)
}

// stories
export const ModalSimple = Template.bind({})

// arguments
ModalSimple.args = {
	title: 'Title'
}
