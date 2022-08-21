import React from 'react'
import { ConfigProvider } from 'antd'
import { createRoot } from 'react-dom/client'

import EN from 'antd/es/locale/en_GB'

// styles
import './styles/main.css'
import './styles/global.sass'
import 'antd/dist/antd.min.css'

import App from './App'

const root = createRoot(document.body.querySelector('#root') as HTMLElement)
root.render(
	<ConfigProvider locale={EN}>
		<App />
	</ConfigProvider>
)
