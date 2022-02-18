import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { Router, Route } from 'react-router'
import { I18nextProvider } from 'react-i18next'
import { PersistGate } from 'redux-persist/es/integration/react'
import { QueryParamProvider, ExtendedStringifyOptions, transformSearchStringJsonSafe } from 'use-query-params'
import { Spin } from 'antd'

import 'antd/dist/antd.css'

import Routes from './routes/Routes'

import rootReducer from './reducers'

// utils

import configureStore from './utils/configureStore'
import i18n from './utils/i18n'
import { history } from './utils/history'

const queryStringifyOptions: ExtendedStringifyOptions = {
	transformSearchString: transformSearchStringJsonSafe
}

const { store, persistor } = configureStore(rootReducer)

const App = () => {
	return (
		<Suspense
			fallback={
				<div className={'suspense-loading-spinner'}>
					<Spin tip='Načítavam...' />
				</div>
			}
		>
			<I18nextProvider i18n={i18n}>
				<PersistGate
					loading={
						<div className={'suspense-loading-spinner'}>
							<Spin tip='Načítavam...' />
						</div>
					}
					persistor={persistor}
				>
					<Provider store={store}>
						<Router history={history}>
							<QueryParamProvider ReactRouterRoute={Route} stringifyOptions={queryStringifyOptions}>
								<Routes />
							</QueryParamProvider>
						</Router>
					</Provider>
				</PersistGate>
			</I18nextProvider>
		</Suspense>
	)
}
export default App
