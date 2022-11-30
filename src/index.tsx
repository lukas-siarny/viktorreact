import React from 'react'
import { render } from 'react-dom'
import * as Sentry from '@sentry/react'
import { Integrations as TracingIntegrations } from '@sentry/tracing'

// dayjs
import dayjs from 'dayjs'
import utcPlugin from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import minMax from 'dayjs/plugin/minMax'
import relativeTime from 'dayjs/plugin/relativeTime'
import localeData from 'dayjs/plugin/localeData'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import updateLocale from 'dayjs/plugin/updateLocale'
import isToday from 'dayjs/plugin/isToday'

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
dayjs.extend(relativeTime)
dayjs.extend(localeData)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(updateLocale)
dayjs.extend(isToday)

Sentry.init({
	release: process.env.REACT_APP_VERSION,
	enabled: process.env.NODE_ENV !== 'development',
	dsn: 'https://43d96832642646f18b3166843778106c@sentry.goodrequest.dev/35',
	integrations: [new TracingIntegrations.BrowserTracing()] as any,
	tracesSampleRate: 0.05,
	environment: process.env.REACT_APP_HOST
})

const app = (
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
)
render(app, document.getElementById('root'))
