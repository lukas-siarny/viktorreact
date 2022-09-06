/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { LANGUAGES } from './languagesTypes'
import { ILanguagesPayload, ILanguagesActions } from './languagesActions'

export const initState = {
	languages: {
		data: null,
		enumerationsOptions: [],
		isLoading: false,
		isFailure: false
	} as ILanguagesPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ILanguagesActions) => {
	switch (action.type) {
		case LANGUAGES.LANGUAGES_LOAD_START:
			return {
				...state,
				languages: {
					...state.languages,
					isLoading: true
				}
			}
		case LANGUAGES.LANGUAGES_LOAD_FAIL:
			return {
				...state,
				languages: {
					...initState.languages,
					isFailure: true
				}
			}
		case LANGUAGES.LANGUAGES_LOAD_DONE:
			return {
				...state,
				languages: {
					...initState.languages,
					enumerationsOptions: action.payload.enumerationsOptions,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
