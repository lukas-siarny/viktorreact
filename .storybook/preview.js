import 'antd/dist/antd.css'
// import '../src/styles/main.css'
import '../src/styles/global.sass'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
	default: 'light',
	values: [
		{
			name: 'dark',
			value: '#252525',
		},
		{
			name: 'light',
			value: '#F9FAFB',
		},
	],
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  customizeAntdTheme: {
    modifyVars: {
	  'primary-color': '#000000', // black
	  'link-color': '#E11D48', // pink-600
	  'text-color': '#404040', // true-gray-700
	  'heading-color': '#3F3F46', // cool-gray-900
	  'text-color-secondary': '#BFBFBF', // notino-gray
	  'disabled-color': '#9CA3AF', // cool-gray-100
	  'success-color': '#16A34A', // green-600
	  'warning-color': '#D97706', // amber-600
	  'error-color': '#DC2626' // red-600
    },
  },
}
