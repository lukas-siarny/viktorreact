/* eslint-disable import/no-cycle */
import { ILoadingAndFailure } from '../../types/interfaces'
import { RESET_STORE } from '../generalTypes'
import { IReviewsActions, IReviewsPayload } from './reviewsActions'
import { REVIEWS } from './reviewsTypes'

export const initState = {
	reviews: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IReviewsPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IReviewsActions) => {
	switch (action.type) {
		// Auth User
		case REVIEWS.REVIEWS_LOAD_START:
			return {
				...state,
				reviews: {
					...state.reviews,
					isLoading: true
				}
			}
		case REVIEWS.REVIEWS_LOAD_FAIL:
			return {
				...state,
				reviews: {
					...initState.reviews,
					isFailure: true
				}
			}
		case REVIEWS.REVIEWS_LOAD_DONE:
			return {
				...state,
				reviews: {
					...initState.reviews,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
