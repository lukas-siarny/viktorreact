import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { Button } from 'antd'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory } from '@storybook/react'
import { ReactComponent as SearchIcon } from '../../assets/icons/search-icon.svg'

export default {
	title: 'Fields/Button',
	component: Button,
	decorators: [withDesign],
	args: {
		size: 'large',
		className: 'noti-btn m-regular'
	}
}

const Template: ComponentStory<typeof Button> = (args) => <Button {...args}>Button</Button>
const TemplateEmpty: ComponentStory<typeof Button> = (args) => <Button {...args} />

// stories
export const ButtonPrimary = Template.bind({})
export const ButtonSecondary = Template.bind({})
export const ButtonPrimaryDisabled = Template.bind({})
export const ButtonSecondaryDisabled = Template.bind({})
export const ButtonPrimaryDanger = Template.bind({})
export const ButtonSecondaryDanger = Template.bind({})
export const ButtonPrimaryLoading = Template.bind({})
export const ButtonPrimaryIcon = Template.bind({})
export const ButtonPrimaryIconOnly = TemplateEmpty.bind({})

// arguments
ButtonPrimary.args = {
	type: 'primary'
}

ButtonSecondary.args = {
	type: 'default'
}

ButtonPrimaryDisabled.args = {
	type: 'primary',
	disabled: true
}

ButtonSecondaryDisabled.args = {
	type: 'default',
	disabled: true
}

ButtonPrimaryDanger.args = {
	type: 'primary',
	danger: true
}

ButtonSecondaryDanger.args = {
	type: 'default',
	danger: true
}

ButtonPrimaryLoading.args = {
	type: 'primary',
	loading: true
}

ButtonPrimaryIcon.args = {
	type: 'primary',
	icon: <SearchIcon />
}

ButtonPrimaryIconOnly.args = {
	type: 'primary',
	icon: <SearchIcon />
}

// parameters
ButtonPrimary.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A1868'
	}
}

ButtonSecondary.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A2354'
	}
}

ButtonPrimaryDisabled.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A1868'
	}
}
ButtonSecondaryDisabled.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A2354'
	}
}

ButtonPrimaryDanger.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A1868'
	}
}

ButtonSecondaryDanger.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A2354'
	}
}

ButtonPrimaryLoading.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A1868'
	}
}

ButtonPrimaryIcon.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A1868'
	}
}
ButtonPrimaryIconOnly.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=90%3A1868'
	}
}
