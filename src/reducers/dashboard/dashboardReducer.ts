/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ILoadingAndFailure } from '../../types/interfaces'
import { NOTINO_DASHBOARD } from './dashboardTypes'
import { IDashboardActions, INotinoDashboardPayload } from './dashboardActions'

// eslint-disable-next-line import/prefer-default-export
export const initState = {
	notino: {
		data: null,
		isLoading: false,
		isFailure: false
	} as INotinoDashboardPayload & ILoadingAndFailure
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
		case RESET_STORE:
			return initState
		default:
			return state
	}
}
