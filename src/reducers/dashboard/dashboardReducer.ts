/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { NOTINO_DASHBOARD, RESERVATIONS_STATS, SALONS_ANNUAL_STATS, SALONS_MONTH_STATS } from './dashboardTypes'
import { IDashboardActions, INotinoDashboardPayload, IReservationStatsPayload, ISalonsTimeStatsPayload } from './dashboardActions'

// eslint-disable-next-line import/prefer-default-export
export const initState = {
	notino: {
		data: null,
		isLoading: false,
		isFailure: false
	} as INotinoDashboardPayload & ILoadingAndFailure,
	salonsAnnualStats: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISalonsTimeStatsPayload & ILoadingAndFailure,
	salonsMonthStats: {
		data: null,
		isLoading: false,
		isFailure: false
	} as ISalonsTimeStatsPayload & ILoadingAndFailure,
	reservationsStats: {
		data: null,
		isLoading: false,
		isFailure: false
	} as IReservationStatsPayload & ILoadingAndFailure
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: IDashboardActions) => {
	switch (action.type) {
		// Notino dashboard
		case NOTINO_DASHBOARD.NOTINO_DASHBOARD_LOAD_START:
			return {
				...state,
				notino: {
					...state.notino,
					isLoading: true
				}
			}
		case NOTINO_DASHBOARD.NOTINO_DASHBOARD_LOAD_FAIL:
			return {
				...state,
				notino: {
					...initState.notino,
					isFailure: true
				}
			}
		case NOTINO_DASHBOARD.NOTINO_DASHBOARD_LOAD_DONE:
			return {
				...state,
				notino: {
					...initState.notino,
					data: action.payload.data
				}
			}
		// salon stats per year
		case SALONS_ANNUAL_STATS.SALONS_ANNUAL_STATS_LOAD_START:
			return {
				...state,
				salonsAnnualStats: {
					...state.salonsAnnualStats,
					isLoading: true
				}
			}
		case SALONS_ANNUAL_STATS.SALONS_ANNUAL_STATS_LOAD_FAIL:
			return {
				...state,
				salonsAnnualStats: {
					...initState.salonsAnnualStats,
					isFailure: true
				}
			}
		case SALONS_ANNUAL_STATS.SALONS_ANNUAL_STATS_LOAD_DONE:
			return {
				...state,
				salonsAnnualStats: {
					...initState.salonsAnnualStats,
					data: action.payload.data
				}
			}
		// salons stats per month
		case SALONS_MONTH_STATS.SALONS_MONTH_STATS_LOAD_START:
			return {
				...state,
				salonsMonthStats: {
					...state.salonsMonthStats,
					isLoading: true
				}
			}
		case SALONS_MONTH_STATS.SALONS_MONTH_STATS_LOAD_FAIL:
			return {
				...state,
				salonsMonthStats: {
					...initState.salonsMonthStats,
					isFailure: true
				}
			}
		case SALONS_MONTH_STATS.SALONS_MONTH_STATS_LOAD_DONE:
			return {
				...state,
				salonsMonthStats: {
					...initState.salonsMonthStats,
					data: action.payload.data
				}
			}
		// Reservations stats
		case RESERVATIONS_STATS.RESERVATIONS_STATS_LOAD_START:
			return {
				...state,
				reservationsStats: {
					...state.reservationsStats,
					isLoading: true
				}
			}
		case RESERVATIONS_STATS.RESERVATIONS_STATS_LOAD_FAIL:
			return {
				...state,
				reservationsStats: {
					...initState.reservationsStats,
					isFailure: true
				}
			}
		case RESERVATIONS_STATS.RESERVATIONS_STATS_LOAD_DONE:
			return {
				...state,
				reservationsStats: {
					...initState.reservationsStats,
					data: action.payload.data
				}
			}
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
