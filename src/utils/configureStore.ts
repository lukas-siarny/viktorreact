import { createStore, compose, applyMiddleware, Reducer } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore } from 'redux-persist'

const loggerFilter = (getState: any, action: any) => {
	if (action.type.startsWith('persist')) {
		return false
	}
	if (action.type === '@@redux-form/REGISTER_FIELD') {
		return false
	}
	return action.type !== '@@redux-form/UNREGISTER_FIELD'
}

const configureStoreProd = (rootReducer: Reducer) => {
	const middlewares = [
		// Add other middleware on this line...
		thunk
	]

	const store = createStore(rootReducer, compose(applyMiddleware(...middlewares)))
	const persistor = persistStore(store)
	return { store, persistor }
}

const configureStoreDev = (rootReducer: Reducer) => {
	const logger = createLogger({
		collapsed: true,
		duration: true,
		predicate: loggerFilter
	})

	const middlewares = [thunk, logger]
	// eslint-disable-next-line no-underscore-dangle
	const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // add support for Redux dev tools
	const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))
	const persistor = persistStore(store)

	return {
		store,
		persistor
	}
}

const configureStore = (rootReducer: Reducer) => (process.env.NODE_ENV === 'production' ? configureStoreProd(rootReducer) : configureStoreDev(rootReducer))

export default configureStore
