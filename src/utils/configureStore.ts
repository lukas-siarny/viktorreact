/* eslint-disable import/no-cycle */
import { createStore, compose, applyMiddleware, Reducer } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { persistStore } from 'redux-persist'

import i18next from 'i18next'
import { IMAGE_UPLOADING_PROP, MSG_TYPE, NOTIFICATION_TYPE, HANDLE_CALENDAR_ACTIONS, HANDLE_CALENDAR_FORMS, CALENDAR_INIT_TIME } from './enums'
// eslint-disable-next-line import/no-cycle
import showNotifications from './tsxHelpers'
import { addOrUpdateEvent } from '../reducers/virtualEvent/virtualEventActions'

const RELEVANT_CALENDAR_ACTIONS = Object.keys(HANDLE_CALENDAR_ACTIONS)

/**
 * OnSubmit validate if IMAGE_UPLOADING_PROP is true -> indicates uploading
 * During upload will be submit action deniedw
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

/**
 * Middleware pre spracovanie form akcii HANDLE_CALENDAR_ACTIONS relevantnych pre kalendarove formulare.
 */
const handleCalendarFormsChanges = (store: any) => (next: any) => (action: any) => {
	next(action)

	// check ci sa jedna o relevantny Calendar form (Reservation, Shift, Break, TimeOff)
	if (HANDLE_CALENDAR_FORMS.includes(action?.meta?.form)) {
		// eslint-disable-next-line no-restricted-syntax
		for (const actionType of RELEVANT_CALENDAR_ACTIONS) {
			// check ci sa vykonala relevantna akcia (INIT, CHANGE)
			if (action.type.endsWith(actionType)) {
				// NOTE: 600ms je cas, kym zacne existovat instancia CalendarAPI, aby vedela zobrazit data, ked sa inituje form
				setTimeout(() => store.dispatch(addOrUpdateEvent(actionType, action.meta.form)), CALENDAR_INIT_TIME)
				break
			}
		}
	}
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
		preventSubmitFormDuringUpload,
		handleCalendarFormsChanges
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

	const middlewares = [thunk, logger, preventSubmitFormDuringUpload, handleCalendarFormsChanges]

	const composeEnhancers =
		typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
					trace: true,
					traceLimit: 25
			  })
			: compose

	const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)))
	const persistor = persistStore(store)

	return {
		store,
		persistor
	}
}

const configureStore = (rootReducer: Reducer) => (process.env.NODE_ENV === 'production' ? configureStoreProd(rootReducer) : configureStoreDev(rootReducer))

export default configureStore
