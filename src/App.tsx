import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { PersistGate } from 'redux-persist/es/integration/react'
import { QueryParamProvider, ExtendedStringifyOptions, transformSearchStringJsonSafe } from 'use-query-params'
import { Spin, ConfigProvider } from 'antd'
import { Locale } from 'antd/lib/locale-provider'
import { AliasToken } from 'antd/es/theme/internal'
import dayjs from 'dayjs'

// import 'antd/dist/antd.min.css'
import 'antd/dist/reset.css'

import Routes from './routes/Routes'

import rootReducer from './reducers'

// utils
import configureStore from './utils/configureStore'
import i18n from './utils/i18n'
import { history } from './utils/history'
import { LANGUAGE, DEFAULT_LANGUAGE } from './utils/enums'

// components
import ScrollToTop from './components/ScrollToTop'
import { LOCALES } from './components/LanguagePicker'

const queryStringifyOptions: ExtendedStringifyOptions = {
	transformSearchString: transformSearchStringJsonSafe
}

const { store, persistor } = configureStore(rootReducer)

const ANTD_THEME_VARIABLES_OVERRIDE: Partial<AliasToken> = {
	// Override AntD colors
	colorPrimary: '#000000', // black
	colorLink: '#DC0069', // notino-pink
	colorText: '#404040', // true-gray-700,
	colorTextHeading: '#3F3F46', // cool-gray-900
	colorTextSecondary: '#BFBFBF', // notino-gray
	colorTextDisabled: '#9CA3AF', // cool-gray-100,
	colorSuccess: '#008700', // notino-success
	colorWarning: '#D97706', // amber-600
	colorError: '#D21414', // notino-red
	borderRadius: 2
}

const App = () => {
	const [antdLocale, setAntdLocale] = useState<Locale | undefined>(undefined)

	useEffect(() => {
		i18n.on('languageChanged', (language) => {
			const locale = LOCALES[language as LANGUAGE] || LOCALES[DEFAULT_LANGUAGE]
			document.documentElement.setAttribute('lang', language)
			setAntdLocale(locale.antD)
			dayjs.locale(locale.ISO_639)
			dayjs.updateLocale(locale.ISO_639, {
				weekStart: 1
			})
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
					<ConfigProvider
						locale={antdLocale}
						theme={{
							token: ANTD_THEME_VARIABLES_OVERRIDE
						}}
					>
						<Provider store={store}>
							<Router history={history}>
								<QueryParamProvider ReactRouterRoute={Route} stringifyOptions={queryStringifyOptions}>
									<ScrollToTop>
										<Routes />
									</ScrollToTop>
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
