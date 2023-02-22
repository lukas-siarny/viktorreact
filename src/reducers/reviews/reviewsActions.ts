/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { IQueryParams, ISearchable } from '../../types/interfaces'
import { REVIEWS } from './reviewsTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'
import { REVIEW_VERIFICATION_STATUS } from '../../utils/enums'

export type IReviewsActions = IResetStore | IGetReviews

interface IGetReviews {
	type: REVIEWS
	payload: IReviewsPayload
}

export interface IGeReviewsQueryParams extends IQueryParams {
	verificationStatus?: REVIEW_VERIFICATION_STATUS | null
	deleted?: boolean
	salonCountryCode?: string | null
	toxicityScoreFrom?: number | null
	toxicityScoreTo?: number | null
}

export interface IUserPayload {
	data: Paths.GetApiB2BAdminUsersUserId.Responses.$200 | null
}

export interface IReviewsPayload extends ISearchable<Paths.GetApiB2BAdminReviews.Responses.$200> {}

export const getReviews =
	(queryParams: IGeReviewsQueryParams): ThunkResult<Promise<IReviewsPayload>> =>
	async (dispatch) => {
		let payload = {} as IReviewsPayload
		try {
			dispatch({ type: REVIEWS.REVIEWS_LOAD_START })
			const { data } = await getReq('/api/b2b/admin/reviews/', { ...normalizeQueryParams(queryParams) })

			payload = {
				data
			}

			dispatch({ type: REVIEWS.REVIEWS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: REVIEWS.REVIEWS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
