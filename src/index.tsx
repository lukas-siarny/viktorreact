import React from 'react'
import { render } from 'react-dom'
import { ConfigProvider } from 'antd'
import * as Sentry from '@sentry/react'
import { Integrations as TracingIntegrations } from '@sentry/tracing'

// dayjs
import dayjs from 'dayjs'
import utcPlugin from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import minMax from 'dayjs/plugin/minMax'
// lokalizacia pre ConfigProvider -> ant
import SK from 'antd/es/locale/sk_SK'
// Lokalizcia pre antd-dayjs-webpack-plugin, ktory overridne Moment -> Dayjs format v komponentoch
import 'dayjs/locale/sk'

import App from './App'
// load theme styles with webpack
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// NOTE: lebo je v gitignore a az pri starte sa vytvori prvy krat a pipelina by padla
// eslint-disable-next-line import/no-unresolved
import './styles/main.css'
import './styles/global.sass'

import ErrorBoundary from './components/ErrorBoundary'

// dayjs extended plugins
dayjs.extend(isBetween)
dayjs.extend(utcPlugin)
dayjs.extend(timezonePlugin)
dayjs.extend(minMax)
dayjs.locale('sk')

Sentry.init({
	release: process.env.REACT_APP_VERSION,
	enabled: process.env.NODE_ENV !== 'development',
	dsn: 'https://defb4c2f76d24d739a3125980ca505ef@sentry.goodrequest.dev/4s',
	integrations: [new TracingIntegrations.BrowserTracing()] as any,
	tracesSampleRate: 0.05
})

const app = (
	<ConfigProvider locale={SK}>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</ConfigProvider>
)
render(app, document.getElementById('root'))
