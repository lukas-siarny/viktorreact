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
}
