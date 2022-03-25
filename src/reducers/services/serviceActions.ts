/* eslint-disable import/no-cycle */
import i18next from 'i18next'
import decode from 'jwt-decode'
import { get, map, flatten, uniq } from 'lodash'

// types
import { ThunkResult } from '../index'
import { ILoginForm, IJwtPayload, ICreatePasswordForm } from '../../types/interfaces'
import { AUTH_USER, USER, USERS, SERVICES } from './serviceTypes'
import { IResetStore, RESET_STORE } from '../generalTypes'
import { Paths } from '../../types/api'

// utils
import { setAccessToken, clearAccessToken, clearRefreshToken, isLoggedIn, hasRefreshToken, getRefreshToken, setRefreshToken, getAccessToken } from '../../utils/auth'
import { history } from '../../utils/history'
import { getReq, postReq, PostUrls, ICustomConfig } from '../../utils/request'
import { PERMISSION } from '../../utils/enums'

export type IUserActions = IResetStore | IGetServices

interface IGetServices {
	type: SERVICES
	payload: IServicesPayload
}

export interface IServicesPayload {
	data: Paths.GetApiB2BAdminServices.Responses.$200 | null
}

export const getServices =
	(page: number, limit?: any | undefined, order?: string | undefined, search?: string | undefined | null): ThunkResult<Promise<void>> =>
	async (dispatch) => {
		try {
			dispatch({ type: SERVICES.SERVICES_LOAD_START })
			const pageLimit = limit

			const data = await getReq(
				'/api/b2b/admin/services/',
				{}
				// { page: page || 1, limit: pageLimit, order, search }
			)

			dispatch({ type: SERVICES.SERVICES_LOAD_DONE, payload: data })
		} catch (err) {
			dispatch({ type: SERVICES.SERVICES_LOAD_FAIL })
			// eslint-disable-next-line no-console
			console.error(err)
		}
	}
