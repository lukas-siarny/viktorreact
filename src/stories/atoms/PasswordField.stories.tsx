/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Form } from 'antd'
import { ComponentStory } from '@storybook/react'
import InputPasswordField from '../../atoms/InputPasswordField'

const inputDefaultProps = {
	form: undefined,
	error: null,
	onBlur: () => {},
	onChange: () => {}
}

export default {
	title: 'Fields/Password',
	component: InputPasswordField,
	decorators: [withDesign],
	args: {
		input: inputDefaultProps,
		meta: { touched: false },
		size: 'large'
	}
}

const Template: ComponentStory<typeof InputPasswordField> = (args) => (
	<Form layout='vertical'>
		<InputPasswordField {...args} />
	</Form>
)

// stories
export const WithLabel = Template.bind({})
export const Required = Template.bind({})
export const Error = Template.bind({})
export const Disabled = Template.bind({})

// arguments
WithLabel.args = {
	label: 'Label'
}

Required.args = {
	label: 'Label',
	required: true
}

Error.args = {
	label: 'Label',
	meta: {
		error: 'Error message',
		touched: true
	} as any
}

Disabled.args = {
	label: 'Label',
	disabled: true
}
