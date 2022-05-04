/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Form } from 'antd'
import { ComponentStory } from '@storybook/react'
import InputMaskedField from '../../atoms/InputMaskedField'

const inputDefaultProps = {
	form: undefined,
	error: null,
	onBlur: () => {},
	onChange: () => {}
}

export default {
	title: 'Fields/Masked',
	component: InputMaskedField,
	decorators: [withDesign],
	args: {
		input: inputDefaultProps,
		meta: { touched: false },
		size: 'large'
	}
}

const Template: ComponentStory<typeof InputMaskedField> = (args) => (
	<Form layout='vertical'>
		<InputMaskedField {...args} />
	</Form>
)

// stories
export const WithLabel = Template.bind({})
export const Required = Template.bind({})
export const Error = Template.bind({})
export const Disabled = Template.bind({})

// arguments
WithLabel.args = {
	label: 'Label',
	mask: '99/99/9999'
}

Required.args = {
	label: 'Label',
	required: true,
	mask: '99/99/9999'
}

Error.args = {
	label: 'Label',
	meta: {
		error: 'Error message',
		touched: true
	} as any,
	mask: '99/99/9999'
}

Disabled.args = {
	label: 'Label',
	disabled: true,
	mask: '99/99/9999'
}
