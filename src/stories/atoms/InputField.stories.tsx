/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Form } from 'antd'
import { ComponentStory } from '@storybook/react'
import InputField from '../../atoms/InputField'

const Icon = () => {
	return (
		<svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M4.00073 14.002C5.10544 14.002 6.00098 13.1064 6.00098 12.0017C6.00098 10.897 5.10544 10.0015 4.00073 10.0015C2.89603 10.0015 2.00049 10.897 2.00049 12.0017C2.00049 13.1064 2.89603 14.002 4.00073 14.002Z'
				stroke='#BFBFBF'
				strokeWidth='1.3335'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path
				d='M4.00073 6.00098C5.10544 6.00098 6.00098 5.10544 6.00098 4.00073C6.00098 2.89603 5.10544 2.00049 4.00073 2.00049C2.89603 2.00049 2.00049 2.89603 2.00049 4.00073C2.00049 5.10544 2.89603 6.00098 4.00073 6.00098Z'
				stroke='#BFBFBF'
				strokeWidth='1.3335'
				strokeLinecap='round'
				strokeLinejoin='round'
			/>
			<path d='M13.335 2.66699L5.41406 10.588' stroke='#BFBFBF' strokeWidth='1.3335' strokeLinecap='round' strokeLinejoin='round' />
			<path d='M9.64795 9.6543L13.3351 13.3347' stroke='#BFBFBF' strokeWidth='1.3335' strokeLinecap='round' strokeLinejoin='round' />
			<path d='M5.41406 5.41406L8.00105 8.00105' stroke='#BFBFBF' strokeWidth='1.3335' strokeLinecap='round' strokeLinejoin='round' />
		</svg>
	)
}

const inputDefaultProps = {
	form: undefined,
	error: null,
	onBlur: () => {},
	onChange: () => {}
}

export default {
	title: 'Fields/Input',
	component: InputField,
	decorators: [withDesign],
	args: {
		input: inputDefaultProps,
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
export const WithLabel = Template.bind({})
export const WithSuffixPrefix = Template.bind({})
export const Required = Template.bind({})
export const Error = Template.bind({})
export const WithoutLabel = Template.bind({})
export const Filled = Template.bind({})
export const Disabled = Template.bind({})

// arguments
WithLabel.args = {
	label: 'Label'
}

WithSuffixPrefix.args = {
	label: 'Label',
	suffix: <Icon />,
	prefix: <Icon />
}

Required.args = {
	label: 'Label',
	required: true
}

Filled.args = {
	input: {
		...inputDefaultProps,
		value: 'Filled text'
	} as any
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

// parameters
WithLabel.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=68%3A2693'
	}
}

WithoutLabel.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=68%3A2662'
	}
}

Filled.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=68%3A2662'
	}
}
