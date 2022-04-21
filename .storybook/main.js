module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/preset-create-react-app',
		'storybook-addon-designs'
		// TODO check performance with this plugin enabled
		// "storybook-addon-customize-antd-theme"
	],
	framework: '@storybook/react'
}
