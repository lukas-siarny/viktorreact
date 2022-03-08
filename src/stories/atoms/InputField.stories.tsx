import { withDesign } from 'storybook-addon-designs'
import { ComponentStory } from '@storybook/react'
import React from 'react'
import InputField from '../../atoms/InputField'
// import InputField from './InputField'
// import departureIcon from '../../assets/icons/departure-icon.svg'

export default {
	title: 'Fields/Input',
	component: InputField,
	decorators: [withDesign],
	args: {
		input: {
			form: undefined,
			error: null,
			touched: false
		} as any,
		style: {
			display: 'flex',
			flexDirection: 'column'
		},
		placeholder: 'Placeholder',
		meta: {}
	}
}

const Template: ComponentStory<typeof InputField> = (args) => <InputField {...args} />

export const InputFieldWithLabel = Template.bind({})
export const InputFieldWithoutLabel = Template.bind({})
// export const InputFieldWithPrefixIcon = Template.bind({})
// export const InputFieldFilled = Template.bind({})
// export const InputFieldFilledWithIcon = Template.bind({})

InputFieldWithLabel.args = {
	label: 'Label'
}

// InputFieldWithPrefixIcon.args = {
// 	customPrefixIconSrc: departureIcon
// }

// InputFieldFilled.args = {
// 	input: {
// 		value: 'Filled text'
// 	}
// }
// InputFieldFilledWithIcon.args = {
// 	input: {
// 		value: 'Filled text'
// 	},
// 	label: 'Label'
// 	// customPrefixIconSrc: departureIcon
// }
InputFieldWithLabel.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/JXXVzst0EN8l4rvlI6ZD88/Tiptravel-web?node-id=1711%3A30007'
	}
}

InputFieldWithoutLabel.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/JXXVzst0EN8l4rvlI6ZD88/Tiptravel-web?node-id=1711%3A29405'
	}
}
// InputFieldWithPrefixIcon.parameters = {
// 	design: {
// 		type: 'figma',
// 		url: 'https://www.figma.com/file/JXXVzst0EN8l4rvlI6ZD88/Tiptravel-web?node-id=1711%3A29413'
// 	}
// }
// InputFieldFilled.parameters = {
// 	design: {
// 		type: 'figma',
// 		url: 'https://www.figma.com/file/JXXVzst0EN8l4rvlI6ZD88/Tiptravel-web?node-id=1711%3A29410'
// 	}
// }
// InputFieldFilledWithIcon.parameters = {
// 	design: {
// 		type: 'figma',
// 		url: 'https://www.figma.com/file/JXXVzst0EN8l4rvlI6ZD88/Tiptravel-web?node-id=1711%3A29419'
// 	}
// }
