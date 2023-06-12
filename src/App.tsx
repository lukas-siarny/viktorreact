import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Spin, ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { Locale } from 'antd/lib/locale'
import dayjs from 'dayjs'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'antd/dist/reset.css'
import rootReducer from './reducers'

// utils
import configureStore from './utils/configureStore'
import i18n from './utils/i18n'
import { LANGUAGE, DEFAULT_LANGUAGE, ANTD_THEME_VARIABLES_OVERRIDE } from './utils/enums'

// components
import ScrollToTop from './components/ScrollToTop'
import { LOCALES } from './components/LanguagePicker'
import AppRoutes from './routes/AppRoutes'
import ErrorBoundary from './components/ErrorBoundary'

const { store, persistor } = configureStore(rootReducer)

const App = () => {
	const [antdLocale, setAntdLocale] = useState<Locale | undefined>(undefined)
	// You can do this:
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route
				path={'*'}
				errorElement={<ErrorBoundary />}
				element={
					<ScrollToTop>
						<AppRoutes />
					</ScrollToTop>
				}
			/>
		)
	)
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
						{/* eslint-disable-next-line no-underscore-dangle */}
						<GoogleOAuthProvider clientId={window.__RUNTIME_CONFIG__.REACT_APP_GOOGLE_OAUTH_CLIENT_ID} onScriptLoadError={() => console.error('GoogleOAuth error')}>
							<Provider store={store}>
								<StyleProvider hashPriority={'low'}>
									<RouterProvider router={router} />
								</StyleProvider>
							</Provider>
						</GoogleOAuthProvider>
					</ConfigProvider>
				</PersistGate>
			</I18nextProvider>
		</Suspense>
	)
}
export default App
