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
				// Override AntD colors
				'@primary-color': '#000000', // black
				'@link-color': '#DC0069', // notino-pink
				'@text-color': '#404040', // true-gray-700
				'@heading-color': '#3F3F46', // cool-gray-900
				'@text-color-secondary': '#BFBFBF', // notino-gray
				'@disabled-color': '#9CA3AF', // cool-gray-100
				'@success-color': '#008700', // notino-success
				'@warning-color': '#D97706', // amber-600
				'@error-color': '#D21414' // notino-red
			}
		}
	}),
	// antd components dayjs
	addWebpackPlugin(new AntdDayjsWebpackPlugin())
)
