import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Form } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory } from '@storybook/react'
import InputField from '../../atoms/InputField'

export default {
	title: 'Fields/InputField',
	component: InputField,
	decorators: [withDesign],
	args: {
		input: {
			form: undefined,
			error: null,
			touched: false,
			onBlur: () => {},
			onChange: () => {}
		} as any,
		placeholder: 'Placeholder',
		meta: {},
		size: 'large'
	}
}

const Template: ComponentStory<typeof InputField> = (args) => (
	<Form layout='vertical'>
		<InputField {...args} />
	</Form>
)

export const InputFieldWithLabel = Template.bind({})
export const InputFieldWithoutLabel = Template.bind({})
export const InputFieldFilled = Template.bind({})

InputFieldWithLabel.args = {
	label: 'Label'
}

InputFieldFilled.args = {
	input: {
		value: 'Filled text'
	} as any
}

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
