/* eslint-disable import/no-cycle */
import { RESET_STORE } from '../generalTypes'
import { ISettingsActions } from './helperSettingsActions'
import { SET_IS_SIDER_COLLAPSED } from './helperSettingsTypes'

export const initState = {
	isSiderCollapsed: false
}

// eslint-disable-next-line default-param-last
export default (state = initState, action: ISettingsActions) => {
	switch (action.type) {
		case SET_IS_SIDER_COLLAPSED:
			return {
				...state,
				isSiderCollapsed: action.payload
			}

		case RESET_STORE:
			return initState
		default:
			return state
	}
}
