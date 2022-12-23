/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { NOTINO_DASHBOARD, SALONS_ANNUAL_STATS, SALONS_MONTH_STATS } from './dashboardTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'
import { normalizeQueryParams } from '../../utils/helper'

export type IDashboardActions = IResetStore | IGetNotinoDashboard | IGetSalonsAnnualStats | IGetSalonsMonthstats

interface IGetNotinoDashboard {
	type: NOTINO_DASHBOARD
	payload: INotinoDashboardPayload
}

export type INotinoDashboard = Paths.GetApiB2BAdminNotinoDashboard.Responses.$200['counts']

export interface INotinoDashboardPayload {
	data: INotinoDashboard | null
}

interface IGetSalonsAnnualStats {
	type: SALONS_ANNUAL_STATS
	payload: ISalonsTimeStatsPayload
}

interface IGetSalonsMonthstats {
	type: SALONS_MONTH_STATS
	payload: ISalonsTimeStatsPayload
}

export type ISalonsTimeStats = Paths.GetApiB2BAdminNotinoDashboardSalonDevelopmentTimeStats.Responses.$200

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
