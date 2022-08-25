/* eslint-disable import/no-cycle */
import { IResetStore } from '../generalTypes'

// types
import { NOTINO_DASHBOARD, PARTNER_DASHBOARD } from './dashboardTypes'
import { Paths } from '../../types/api'
import { ThunkResult } from '../index'

// utils
import { getReq } from '../../utils/request'

export type IDashboardActions = IResetStore | IGetNotinoDashboard | IGetPartnerDashboard

interface IGetNotinoDashboard {
	type: NOTINO_DASHBOARD
	payload: INotinoDashboardPayload
}

// TODO in [M1.1]
interface IGetPartnerDashboard {
	type: PARTNER_DASHBOARD
	payload: unknown
}

export type INotinoDashboard = Paths.GetApiB2BAdminNotinoDashboard.Responses.$200['counts']

export interface INotinoDashboardPayload {
	data: INotinoDashboard | null
}

export const getNotinoDashboard = (): ThunkResult<Promise<INotinoDashboardPayload>> => async (dispatch) => {
	let payload = {} as INotinoDashboardPayload

	try {
		dispatch({ type: NOTINO_DASHBOARD.NOTINO_DASHBOARD_LOAD_START })

		const { data } = await getReq('/api/b2b/admin/notino-dashboard/', null)
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
