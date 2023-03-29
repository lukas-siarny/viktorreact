/* eslint-disable import/no-cycle */
// types
import { ThunkResult } from '../index'
import { SMS_HISTORY, SMS_STATS, SMS_TIME_STATS } from './smsTypes'
import { IResetStore } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { getReq } from '../../utils/request'
import { IQueryParams, ISearchable } from '../../types/interfaces'
import { normalizeQueryParams } from '../../utils/helper'

export type ISmsActions = IResetStore | IGetSmsStats | IGetSmsTimeStats | IGetSmsHistory

interface IGetSmsStats {
	type: SMS_STATS
	payload: ISmsStatsPayload
}

interface IGetSmsTimeStats {
	type: SMS_TIME_STATS
	payload: ISmsTimeStatsPayload
}

interface IGetSmsHistory {
	type: SMS_HISTORY
	payload: ISmsHistoryPayload
}

export interface ISmsStatsPayload {
	data: Paths.GetApiB2BAdminSalonsSalonIdNotificationsSmsStats.Responses.$200 | null
}

export interface ISmsTimeStatsPayload {
	data: Paths.GetApiB2BAdminSalonsSalonIdNotificationsSmsTimeStats.Responses.$200 | null
}

export interface ISmsHistoryPayload extends ISearchable<Paths.GetApiB2BAdminSalonsSalonIdNotificationsSmsHistory.Responses.$200> {}

export interface IGetSmsHistoryQueryParams extends IQueryParams {
	salonID: string
	dateFrom: string
	dateTo: string
}

export const getSmsStats =
	(salonID: string): ThunkResult<Promise<ISmsStatsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISmsStatsPayload
		try {
			dispatch({ type: SMS_STATS.SMS_STATS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/notifications/sms/stats', { salonID })

			payload = {
				data
			}

			dispatch({ type: SMS_STATS.SMS_STATS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SMS_STATS.SMS_STATS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getSmsTimeStats =
	(salonID: string, year: number, month: number): ThunkResult<Promise<ISmsTimeStatsPayload>> =>
	async (dispatch) => {
		let payload = {} as ISmsTimeStatsPayload
		try {
			dispatch({ type: SMS_TIME_STATS.SMS_TIME_STATS_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/notifications/sms/time-stats', { salonID, year, month })

			payload = {
				data
			}

			dispatch({ type: SMS_TIME_STATS.SMS_TIME_STATS_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SMS_TIME_STATS.SMS_TIME_STATS_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
		return payload
	}

export const getSmsHistory =
	(queryParams: IGetSmsHistoryQueryParams): ThunkResult<Promise<ISmsHistoryPayload>> =>
	async (dispatch) => {
		let payload = {} as ISmsHistoryPayload
		try {
			dispatch({ type: SMS_HISTORY.SMS_HISTORY_LOAD_START })

			const { data } = await getReq('/api/b2b/admin/salons/{salonID}/notifications/sms/history', { ...normalizeQueryParams(queryParams) } as any)

			payload = {
				data
			}

			dispatch({ type: SMS_HISTORY.SMS_HISTORY_LOAD_DONE, payload })
		} catch (err) {
			dispatch({ type: SMS_HISTORY.SMS_HISTORY_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}

		return payload
	}
