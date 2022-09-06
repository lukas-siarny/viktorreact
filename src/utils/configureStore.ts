import { createStore, compose, applyMiddleware, Reducer } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore } from 'redux-persist'

import i18next from 'i18next'
import { IMAGE_UPLOADING_PROP, MSG_TYPE, NOTIFICATION_TYPE } from './enums'
// eslint-disable-next-line import/no-cycle
import showNotifications from './tsxHelpers'

/**
 * OnSubmit validate if IMAGE_UPLOADING_PROP is true -> indicates uploading
 * During upload will be submit action denied
 * IMAGE_UPLOADING_PROP must be set outside e.g. ImgUploadField
 */
const preventSubmitFormDuringUpload = (store: any) => (next: any) => (action: any) => {
	if (action?.type === '@@redux-form/SUBMIT') {
		const { form } = store.getState()
		const submittedForm = form[action.meta.form]

		if (submittedForm) {
			const { values } = submittedForm

			if (values && values[IMAGE_UPLOADING_PROP]) {
				const error = i18next.t('loc:Prebieha nahrávanie')
				showNotifications([{ type: MSG_TYPE.ERROR, message: error }], NOTIFICATION_TYPE.NOTIFICATION)
				return
			}
		}
	}

	next(action)
}

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
		thunk,
		preventSubmitFormDuringUpload
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

	const middlewares = [thunk, logger, preventSubmitFormDuringUpload]
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
