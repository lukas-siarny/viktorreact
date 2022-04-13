/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { withDesign } from 'storybook-addon-designs'
import { ComponentStory } from '@storybook/react'
import PublicLayout from '../../layouts/PublicLayout'

export default {
	title: 'Layouts/SimpleLayout',
	component: PublicLayout,
	decorators: [withDesign]
}

const Template: ComponentStory<typeof PublicLayout> = (args) => (
	<div id='tailwind' style={{ margin: '-1rem' }}>
		<PublicLayout {...args}>Some content</PublicLayout>
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
