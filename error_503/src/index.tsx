import React from 'react'
import { ConfigProvider } from 'antd'
import { render } from 'react-dom'

import EN from 'antd/locale/en_GB'

// styles
import './styles/main.css'
import './styles/global.sass'
import 'antd/dist/reset.css'

import App from './App'

const app = (
	<ConfigProvider locale={EN}>
		<App />
	</ConfigProvider>
)
render(app, document.getElementById('root'))
