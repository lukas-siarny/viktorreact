/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { NOTINO_DASHBOARD, RESERVATIONS_STATS, RS_STATS, SALONS_ANNUAL_STATS, SALONS_MONTH_STATS } from './dashboardTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

export type IDashboardActions = IResetStore | IGetNotinoDashboard | IGetSalonsAnnualStats | IGetSalonsMonthstats | IGetRsStats | IGetReservationsStats

interface IGetNotinoDashboard {
	type: NOTINO_DASHBOARD
	payload: INotinoDashboardPayload
}

interface IGetRsStats {
	type: RS_STATS
	payload: IRsStatsPayload
}

interface IGetReservationsStats {
	type: RESERVATIONS_STATS
	payload: IReservationStatsPayload
}

export type INotinoDashboard = Paths.GetApiB2BAdminNotinoDashboard.Responses.$200['counts']
export type ISalonsTimeStats = Paths.GetApiB2BAdminNotinoDashboardSalonDevelopmentTimeStats.Responses.$200
export type IRsStats = any // Paths.GetApiB2BAdminNotinoDashboardSalonRsTimeStats.Responses.$200
export type IReservationsStats = Paths.GetApiB2BAdminNotinoDashboardSalonReservationsTimeStats.Responses.$200

interface IGetRsStatsQueryParams {
	month?: number
	year: number
	countryCode?: string
}

interface IGetReservationsStatsQueryParams {
	month?: number
	year: number
	countryCode?: string
}

export interface INotinoDashboardPayload {
	data: INotinoDashboard | null
}

export interface IRsStatsPayload {
	data: IRsStats | null
}

export interface IReservationStatsPayload {
	data: IReservationsStats | null
}

interface IGetSalonsAnnualStats {
	type: SALONS_ANNUAL_STATS
	payload: ISalonsTimeStatsPayload
}

interface IGetSalonsMonthstats {
	type: SALONS_MONTH_STATS
	payload: ISalonsTimeStatsPayload
}

export interface ISalonsTimeStatsPayload {
	data: ISalonsTimeStats | null
}

export const getNotinoDashboard =
	(countryCode?: string): ThunkResult<Promise<INotinoDashboardPayload>> =>
	async (dispatch) => {
		let payload = {} as INotinoDashboardPayload

		try {
			dispatch({ type: NOTINO_DASHBOARD.NOTINO_DASHBOARD_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/notino-dashboard/', { ...normalizeQueryParams({ countryCode }) })
			payload = {
				data: data?.counts
			}

			dispatch({ type: NOTINO_DASHBOARD.NOTINO_DASHBOARD_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: NOTINO_DASHBOARD.NOTINO_DASHBOARD_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getRsStats =
	(queryParams: IGetRsStatsQueryParams): ThunkResult<Promise<IRsStatsPayload>> =>
	async (dispatch) => {
		let payload = {} as IRsStatsPayload

		try {
			dispatch({ type: RS_STATS.RS_STATS_LOAD_START })

			// const { data } = await getReq('/api/b2b/admin/notino-dashboard/salon-rs-time-stats', { ...normalizeQueryParams(queryParams) } as any)
			payload = {
				data: {}
			}

			dispatch({ type: RS_STATS.RS_STATS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: RS_STATS.RS_STATS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
export const getReservationStats =
	(queryParams: IGetReservationsStatsQueryParams): ThunkResult<Promise<IReservationStatsPayload>> =>
	async (dispatch) => {
		let payload = {} as IReservationStatsPayload

		try {
			dispatch({ type: RESERVATIONS_STATS.RESERVATIONS_STATS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/notino-dashboard/salon-reservations-time-stats', { ...normalizeQueryParams(queryParams) } as any)
			payload = {
				data
			}

			dispatch({ type: RESERVATIONS_STATS.RESERVATIONS_STATS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: RESERVATIONS_STATS.RESERVATIONS_STATS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
const getSalonTimeStats = async (year: number, countryCode?: string, month?: number): Promise<ISalonsTimeStatsPayload> => {
	const { data } = await getReq('/api/b2b/admin/notino-dashboard/salon-development-time-stats', { ...normalizeQueryParams({ year, month, countryCode }) } as any)
	return { data }
}

export const getSalonsAnnualStats =
	(year: number, countryCode?: string): ThunkResult<Promise<ISalonsTimeStatsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonsTimeStatsPayload

		try {
			dispatch({ type: SALONS_ANNUAL_STATS.SALONS_ANNUAL_STATS_LOAD_START })

			payload = await getSalonTimeStats(year, countryCode)

			dispatch({ type: SALONS_ANNUAL_STATS.SALONS_ANNUAL_STATS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SALONS_ANNUAL_STATS.SALONS_ANNUAL_STATS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}

export const getSalonsMonthStats =
	(year: number, month?: number, countryCode?: string): ThunkResult<Promise<ISalonsTimeStatsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISalonsTimeStatsPayload

		try {
			dispatch({ type: SALONS_MONTH_STATS.SALONS_MONTH_STATS_LOAD_START })

			payload = await getSalonTimeStats(year, countryCode, month)

			dispatch({ type: SALONS_MONTH_STATS.SALONS_MONTH_STATS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SALONS_MONTH_STATS.SALONS_MONTH_STATS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
