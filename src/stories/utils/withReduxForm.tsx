import React from 'react'
import { reduxForm, reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

export const STORYBOOK_FORM = 'withReduxForm'

const withReduxForm = (storyFunc: any) => {
	const reducers = { form: formReducer }
	const reducer = combineReducers(reducers)
	const store = createStore(reducer)
	const Test = reduxForm({ form: STORYBOOK_FORM })(storyFunc)
	return (
		<Provider store={store}>
			<Test />
		</Provider>
	)
}

export default withReduxForm
