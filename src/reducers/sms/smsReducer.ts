/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ISmsActions, ISmsStatsPayload, ISmsTimeStatsPayload, ISmsHistoryPayload } from './smsActions'
import { ILoadingAndFailure } from '../../types/interfaces'
import { SMS_HISTORY, SMS_STATS, SMS_TIME_STATS } from './smsTypes'

export const initState = {
	stats: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISmsStatsPayload & ILoadingAndFailure,
	timeStats: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISmsTimeStatsPayload & ILoadingAndFailure,
	history: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISmsHistoryPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISmsActions) => {
	switch (action.type) {
		// Stats
		case SMS_STATS.SMS_STATS_LOAD_START:
			return {
				...state,
				stats: {
					...state.stats,
					isLoading: true
				}
			}
		case SMS_STATS.SMS_STATS_LOAD_FAIL:
			return {
				...state,
				stats: {
					...initState.stats,
					isFailure: true
				}
			}
		case SMS_STATS.SMS_STATS_LOAD_DONE:
			return {
				...state,
				stats: {
					...initState.stats,
					data: action.payload.data
				}
			}
		// Time Stats
		case SMS_TIME_STATS.SMS_TIME_STATS_LOAD_START:
			return {
				...state,
				timeStats: {
					...state.timeStats,
					isLoading: true
				}
			}
		case SMS_TIME_STATS.SMS_TIME_STATS_LOAD_FAIL:
			return {
				...state,
				timeStats: {
					...initState.timeStats,
					isFailure: true
				}
			}
		case SMS_TIME_STATS.SMS_TIME_STATS_LOAD_DONE:
			return {
				...state,
				timeStats: {
					...initState.timeStats,
					data: action.payload.data
				}
			}
		// History
		case SMS_HISTORY.SMS_HISTORY_LOAD_START:
			return {
				...state,
				history: {
					...state.history,
					isLoading: true
				}
			}
		case SMS_HISTORY.SMS_HISTORY_LOAD_FAIL:
			return {
				...state,
				history: {
					...initState.history,
					isFailure: true
				}
			}
		case SMS_HISTORY.SMS_HISTORY_LOAD_DONE:
			return {
				...state,
				history: {
					...initState.history,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
