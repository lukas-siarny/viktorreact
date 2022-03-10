import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { PersistGate } from 'redux-persist/es/integration/react'
import { QueryParamProvider, ExtendedStringifyOptions, transformSearchStringJsonSafe } from 'use-query-params'
import { Spin, ConfigProvider } from 'antd'
import { Locale } from 'antd/lib/locale-provider'
import dayjs from 'dayjs'

import 'antd/dist/antd.css'

import Routes from './routes/Routes'

import rootReducer from './reducers'

// utils

import configureStore from './utils/configureStore'
import i18n from './utils/i18n'
import { history } from './utils/history'
import { LOCALES, LANGUAGE, DEFAULT_LANGUAGE } from './utils/enums'

const queryStringifyOptions: ExtendedStringifyOptions = {
	transformSearchString: transformSearchStringJsonSafe
}

const { store, persistor } = configureStore(rootReducer)

const App = () => {
	const [antdLocale, setAntdLocale] = useState<Locale | undefined>(undefined)

	useEffect(() => {
		i18n.on('languageChanged', (language) => {
			const locale = LOCALES[language as LANGUAGE] || LOCALES[DEFAULT_LANGUAGE]
			setAntdLocale(locale.antD)
			dayjs.locale(locale.ISO_639)
		})
	}, [])

	return (
		<Suspense
			fallback={
				<div className={'suspense-loading-spinner'}>
					<Spin size='large' />
				</div>
			}
		>
			<I18nextProvider i18n={i18n}>
				<PersistGate
					loading={
						<div className={'suspense-loading-spinner'}>
							<Spin size='large' />
						</div>
					}
					persistor={persistor}
				>
					<ConfigProvider locale={antdLocale}>
						<Provider store={store}>
							<Router history={history}>
								<QueryParamProvider ReactRouterRoute={Route} stringifyOptions={queryStringifyOptions}>
									<Routes />
								</QueryParamProvider>
							</Router>
						</Provider>
					</ConfigProvider>
				</PersistGate>
			</I18nextProvider>
		</Suspense>
	)
}
export default App
