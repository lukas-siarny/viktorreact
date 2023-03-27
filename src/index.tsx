import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
	integrations: [new TracingIntegrations.BrowserTracing()] as any,
	// eslint-disable-next-line no-underscore-dangle
	environment: window?.__RUNTIME_CONFIG__?.REACT_APP_SENTRY_ENV ? window.__RUNTIME_CONFIG__.REACT_APP_SENTRY_ENV : process.env.REACT_APP_SENTRY_ENV,
	// eslint-disable-next-line no-underscore-dangle
	dsn: window?.__RUNTIME_CONFIG__?.REACT_APP_SENTRY_DSN ? window.__RUNTIME_CONFIG__.REACT_APP_SENTRY_DSN : process.env.REACT_APP_SENTRY_DSN,
	tracesSampleRate: 0.05,
	beforeSend: (event, hint) => {
		const headers = event.request?.headers

		let ua: string = window.navigator.userAgent

		if (headers) {
			ua = headers['User-Agent']
			const uaRegex = /((?<info>.*?))(s|$)|(?<name>.*?)\/(?<version>.*?)(s|$)/
		}

		return event

		// const browserRegex = /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i;
		// const match = userAgent.match(browserRegex);

		// if (match && match.length >= 3) {
		//   const browserName = match[1].toLowerCase();
		//   const browserVersion = match[2];

		//   if (event.contexts) {
		// 	event.contexts.browser = {
		// 	  name: browserName,
		// 	  version: browserVersion,
		// 	};
		//   } else {
		// 	event.contexts = {
		// 	  browser: {
		// 		name: browserName,
		// 		version: browserVersion,
		// 	  },
		// 	};
		//   }

		// hint.captureContext
		// event.contexts?.os./
		// Sentry.getCurrentHub().getScope().
		// console.log('🚀 ~ file: index.tsx:53 ~ beforeSend ~ event, hint:', event, hint)
	}
})

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
	<StrictMode>
		<App />
	</StrictMode>
)
