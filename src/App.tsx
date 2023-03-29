import React, { Suspense, useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { PersistGate } from 'redux-persist/es/integration/react'
import { Spin, ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import { Locale } from 'antd/lib/locale-provider'
import dayjs from 'dayjs'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import { PublicClientApplication, Configuration } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'

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

const { store, persistor } = configureStore(rootReducer)

const msalConfig: Configuration = {
	auth: {
		clientId: '5a15a7fb-6773-43a9-aaec-b8ecd91862fa',
		redirectUri: 'http://localhost:3000/ms-oauth2'
	}
}

const msalInstance = new PublicClientApplication(msalConfig)

const App = () => {
	const [antdLocale, setAntdLocale] = useState<Locale | undefined>(undefined)
	// You can do this:
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route
				path={'*'}
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
						<MsalProvider instance={msalInstance}>
							<GoogleOAuthProvider
								clientId={window.__RUNTIME_CONFIG__.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
								onScriptLoadError={() => console.error('GoogleOAuth error')}
								onScriptLoadSuccess={() => console.log('GoogleOAuth load success')}
							>
								<Provider store={store}>
									<StyleProvider hashPriority={'low'}>
										<RouterProvider router={router} />
									</StyleProvider>
								</Provider>
							</GoogleOAuthProvider>
						</MsalProvider>
					</ConfigProvider>
				</PersistGate>
			</I18nextProvider>
		</Suspense>
	)
}
export default App
