/*eslint-disable*/

const { override, fixBabelImports } = require('customize-cra');
const addLessLoader = require("customize-cra-less-loader");

module.exports = override(
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}),
	addLessLoader({
		lessLoaderOptions: {
			lessOptions: {
				javascriptEnabled: true,
				modifyVars: {
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
		}
	})
)

