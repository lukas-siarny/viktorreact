/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { COSMETICS } from './cosmeticsTypes'
import { ICosmeticsActions, ICosmeticsPayload } from './cosmeticsActions'

export const initState = {
	cosmetics: {
		data: undefined,
		enumerationsOptions: [],
		isLoading: false,
		isFailure: false
	} as ICosmeticsPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ICosmeticsActions) => {
	switch (action.type) {
		case COSMETICS.COSMETICS_LOAD_START:
			return {
				...state,
				cosmetics: {
					...state.cosmetics,
					isLoading: true
				}
			}
		case COSMETICS.COSMETICS_LOAD_FAIL:
			return {
				...state,
				cosmetics: {
					...initState.cosmetics,
					isFailure: true
				}
			}
		case COSMETICS.COSMETICS_LOAD_DONE:
			return {
				...state,
				cosmetics: {
					...initState.cosmetics,
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
