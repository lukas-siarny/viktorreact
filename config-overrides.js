/*eslint-disable*/

const { override, fixBabelImports, addLessLoader, addWebpackPlugin } = require('customize-cra');
const AntdDayjsWebpackPlugin  = require('antd-dayjs-webpack-plugin')

module.exports = override(
	// rewireReactHotLoader,
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}),
	addLessLoader({
		lessOptions: {
			javascriptEnabled: true,
			modifyVars: {
				'@primary-color': '#2563EB', // blue-600
				'@link-color': '#2563EB', // blue-600
				'@text-color': '#4B5563', // cool-gray-700
				'@heading-color': '#3F3F46', // cool-gray-900
				'@text-color-secondary': '#52525B', // cool-gray-600
				'@disabled-color': '#9CA3AF', // cool-gray-100
				'@success-color': '#16A34A', // green-600
				'@warning-color': '#D97706', // amber-600
				'@error-color': '#DC2626' // red-600
			}
		}
	}),
	// antd components dayjs
	addWebpackPlugin(new AntdDayjsWebpackPlugin())
)
