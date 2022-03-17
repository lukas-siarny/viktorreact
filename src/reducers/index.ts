/* eslint-disable import/no-cycle */
import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import storageSession from 'redux-persist/es/storage/session'
import { reducer as formReducer } from 'redux-form'
import { ThunkAction } from 'redux-thunk'

// reducers
import userReducer from './users/userReducer'
import enumerationReducer from './enumerations/enumerationReducer'

export const REDUCER_KEYS = {
	FORMS: 'FORMS',
	USER: 'USER',
	ENUMERATIONS: 'ENUMERATIONS'
}

const rootReducer = combineReducers({
	user: persistReducer(
		{
			key: REDUCER_KEYS.USER,
			storage: storageSession
		},
		userReducer
	),
	form: persistReducer(
		{
			key: REDUCER_KEYS.FORMS,
			storage: storageSession
		},
		formReducer
	),
	enumerationsStore: persistReducer(
		{
			key: REDUCER_KEYS.ENUMERATIONS,
			storage: storageSession
		},
		enumerationReducer
	)
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
export type ThunkResult<R> = ThunkAction<R, RootState, undefined, any>
