/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Form } from 'antd'
import { ComponentStory } from '@storybook/react'
import SwitchField from '../../atoms/SwitchField'

export default {
	title: 'Fields/Switch',
	component: SwitchField,
	decorators: [withDesign],
	args: {
		meta: { touched: false },
		input: {
			onChange: () => {}
		}
	}
}

const Template: ComponentStory<typeof SwitchField> = (args) => (
	<Form>
		<SwitchField {...args} />
	</Form>
)

// stories
export const SwitchDefault = Template.bind({})
export const SwitchDisabled = Template.bind({})
export const SwitchSmall = Template.bind({})
export const SwitchSmallDisabled = Template.bind({})

// arguments
SwitchDisabled.args = {
	disabled: true
}

SwitchSmall.args = {
	size: 'small',
	defaultChecked: true
}

SwitchSmallDisabled.args = {
	size: 'small',
	disabled: true
}
