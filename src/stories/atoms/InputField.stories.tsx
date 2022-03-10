/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Form } from 'antd'
import { ComponentStory } from '@storybook/react'
import InputField from '../../atoms/InputField'

export default {
	title: 'Fields/Input',
	component: InputField,
	decorators: [withDesign],
	args: {
		input: {
			form: undefined,
			error: null,
			onBlur: () => {},
			onChange: () => {}
		} as any,
		placeholder: 'Placeholder',
		meta: { touched: false },
		size: 'large'
	}
}

const Template: ComponentStory<typeof InputField> = (args) => (
	<Form layout='vertical'>
		<InputField {...args} />
	</Form>
)

// stories
export const InputFieldWithLabel = Template.bind({})
export const InputFieldRequired = Template.bind({})
export const InputFieldError = Template.bind({})
export const InputFieldWithoutLabel = Template.bind({})
export const InputFieldFilled = Template.bind({})

// arguments
InputFieldWithLabel.args = {
	label: 'Label'
}

InputFieldRequired.args = {
	label: 'Label',
	required: true
}

InputFieldFilled.args = {
	input: {
		value: 'Filled text'
	} as any
}

InputFieldError.args = {
	label: 'Label',
	meta: {
		error: 'Error message',
		touched: true
	} as any
}

// parameters
InputFieldWithLabel.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=68%3A2693'
	}
}

InputFieldWithoutLabel.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=68%3A2662'
	}
}

InputFieldFilled.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=68%3A2662'
	}
}
