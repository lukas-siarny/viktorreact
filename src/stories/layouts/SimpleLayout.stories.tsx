import React from 'react'
import { withDesign } from 'storybook-addon-designs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory } from '@storybook/react'
import SimpleLayout from '../../layouts/SimpleLayout'

export default {
	title: 'Layouts/SimpleLayout',
	component: SimpleLayout,
	decorators: [withDesign]
}

const Template: ComponentStory<typeof SimpleLayout> = (args) => (
	<div id='tailwind' style={{ margin: '-1rem' }}>
		<SimpleLayout {...args}>Some content</SimpleLayout>
	</div>
)

// stories
export const SimpleLayoutEmpty = Template.bind({})

// parameters
SimpleLayoutEmpty.parameters = {
	design: {
		type: 'figma',
		url: 'https://www.figma.com/file/HL0lsNm8yCHGGCkL1c3euX/Notino-B2B-Desktop-app?node-id=2%3A1287'
	}
}
